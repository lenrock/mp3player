
// Begin variables



    // These attributes determine which ID3 tags you include in the player, true for present, false for absent
    var tags = {
        artist: true,
        title: true,
        album: false,
        length: true,
        track: false,
        genre: false,
        year: false
    }

    function getUrlVars() {
        var vars = {};
        var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
            vars[key] = value;
        });
        return vars;
    }

    var mp3player = $('#mp3Player');
    var musicFolder = mp3player.attr('data-folder');
    var url;
    var url_scandir;
    var playlist;
    var player;
    var currentSong = 0;
    var mp3dir = getUrlVars()["mp3dir"];
    //graphic analyzer

    var equlizer_mode, analyzer_mode, contextEnable, audioContext, source, graphicEqualizer, splitter, analyzer, analyzerType, merger;



    function changePlaylist(sender) {
        mp3dir = sender.options[sender.selectedIndex].value;
        document.title = "Playlist: " + mp3dir;

        initUrl();
        loadheader();
        loadPlaylist();
    }


    function Playlist(table) {
        console.log('New playlist created');
        this.table = table;
        this.rows = table.find('tbody tr');
        var songs = [];

        for (i = 0; i < this.rows.length; i++) {
            var song = new Song(this.rows[i]);
            songs.push(song);
        }

        this.songs = songs;
    }


    function Song(row) {
        console.log('New song created');
        this.file = $(row).attr('data-file');
        this.title = $(row).find('td.title').text();
        this.album = $(row).find('td.album').text();
        this.artist = $(row).find('td.artist').text();
        this.songLength = $(row).find('td.length').text();
    }

    function Player(playlist) {
        console.log('New player created');
        this.totalSongs = playlist ? playlist.rows.length : 0;
        this.currentSong = 0;
        this.object = $('#mp3Player-player');
        this.played = false;
        this.disabled = true;
        this.loadSong = function (index) {
            $('#mp3Player-progress').removeClass('loaded');

            this.disabled = true;
            currentSong = index;
            $('.mp3controls').addClass('disabled');
            var src = musicFolder + '/' + playlist.songs[currentSong].file;
            $('#mp3Player-mp3').attr('src', src).appendTo(player.object);
            this.object[0].load();

            //rest of load is in evet loadedmetadata
        }
        this.playSong = function () {
            
           
            startSource();
            updateAnalyzer();
            
            this.object[0].play();
        };
        this.pauseSong = function () {
            
            stopSource(); 
            this.object[0].pause();
        };
        this.nextSong = function () {
            if (currentSong != (this.totalSongs - 1)) {
                ++currentSong;
                this.loadSong(currentSong);
            }
        };
        this.prevSong = function () {
            if (currentSong != 0) {
                --currentSong;
                this.loadSong(currentSong);
            }
        };
    }

    // End class definitions
    // Begin functions

    function resetOrder() {
        var table = playlist.table;
        var status = player.disabled;
        playlist = new Playlist(table);
        player = new Player(playlist);
        player.disabled = status;
        playlist.rows.each(function () {
            if ($(this).hasClass('current')) {
                currentSong = $(this).index();
            }
        });
        checkFirstLast();
    }

    function checkFirstLast() {
        // first song, and more than 1 song total
        if (currentSong == 0 && $(playlist.rows[currentSong]).index() < (player.totalSongs - 1)) {
            $('#mp3Player-prev').addClass('disabled');
            $('#mp3Player-next').removeClass('disabled');
            // first song, only one song
        } else if (currentSong == 0 && $(playlist.rows[currentSong]).index() == (player.totalSongs - 1)) {
            $('#mp3Player-prev').addClass('disabled');
            $('#mp3Player-next').addClass('disabled');
            // last song
        } else if (currentSong == (player.totalSongs - 1)) {
            $('#mp3Player-prev').removeClass('disabled');
            $('#mp3Player-next').addClass('disabled');
            // any other song that's not first or last
        } else {
            $('#mp3Player-prev').removeClass('disabled');
            $('#mp3Player-next').removeClass('disabled');
        }
    }

    function formatTime(s) {
        var h = Math.floor(s / 3600);
        s = s % 3600;
        var m = Math.floor(s / 60);
        s = Math.floor(s % 60);
        // pad the minute and second strings to two digits 
        if (s.toString().length < 2) s = "0" + s;
        if (m.toString().length < 2) m = "0" + m;

        var time = h + ":" + m + ":" + s;
        return time;
    }

    function testMp3() {
        var a = document.createElement('audio');
        return !!(a.canPlayType && a.canPlayType('audio/mpeg;').replace(/no/, ''));
    }

    function initUrl() {
        var tagsUrl = '';

        if (testMp3()) {
            url = 'mp3player/player/php/getsongs.php?mp3Player-folder=' + musicFolder + '&mp3Player-audioType=mp3&mp3dir=' + mp3dir;
        } else {
            url = 'mp3player/player/php/getoggs.php?mp3Player-folder=' + musicFolder + '&mp3Player-audioType=ogg&mp3dir=' + mp3dir;
        }

        url_scandir = 'mp3player/player/php/getselect.php?mp3Player-folder=' + musicFolder + '&mp3dir=' + mp3dir;

        for (tag in tags) {
            tagsUrl += '&mp3Player-';
            tagsUrl += tag;
            tagsUrl += '=';
            tagsUrl += tags[tag];
        }

        url += tagsUrl;
        url_scandir += tagsUrl;
    }

    function initGlobal() {
        var current = $('#mp3Player-currentTime');
        var remaining = $('#mp3Player-remainingTime');
        var volumeslider = $('#mp3Player-volume');
        var progress = $('#mp3Player-progress');
        var minvolume = $('#mp3Player-min-volume');
        var maxvolume = $('#mp3Player-max-volume');
        var prev = $('#mp3Player-prev');
        var next = $('#mp3Player-next');
        var play = $('#mp3Player-play');
        var pause = $('#mp3Player-pause');
     
    

        // create volume slider
        volumeslider.slider({
            min: 0,
            max: 1,
            step: .1,
            value: 1,
            change: function (e, ui) {
                // on slide, update audio volume value
                player.object[0].volume = ui.value;
            }
        });

        // create progress slider						   
        progress.slider({
            min: 0,
            max: 100,
            step: .1,
            value: 0,
            slide: function (e, ui) {
                // on slide, update current time to slider position
                player.object[0].currentTime = (ui.value / 100) * (player.object[0].duration);
            }
        });

        // define events on controls
        play.click(function () {
            if (player.disabled == false) {
                play.addClass('display-off');
                pause.removeClass('display-off');
                player.playSong();
            }
            if (player.played == false) {
                player.played = true;
                player.loadSong(0);
            }
        });

        pause.click(function () {
            if (player.disabled == false) {
                pause.addClass('display-off');
                play.removeClass('display-off');
                player.pauseSong();
            }
        });

        next.click(function () {
            if (player.disabled == false) {
                player.nextSong();
            }
        });

        prev.click(function () {
            if (player.disabled == false) {
                player.prevSong();
            }
        });

        minvolume.click(function () {
            if (player.disabled == false) {
                player.object[0].volume = 0;
                volumeslider.slider('option', 'value', '0');
            }
        });

        maxvolume.click(function () {
            if (player.disabled == false) {
                player.object[0].volume = 1;
                volumeslider.slider('option', 'value', '1');
            }
        });

        $('#mp3Player').on('mousewheel DOMMouseScroll', function (e) {
            var o = e.originalEvent;
            var delta = o && (o.wheelDelta || (o.detail && -o.detail));

            if (delta) {
                e.preventDefault();

                var step = $('#mp3Player-volume').slider("option", "step");
                step *= delta < 0 ? -1 : 1;
                $('#mp3Player-volume').slider("value", $('#mp3Player-volume').slider("value") + step);
            }
        });

        // go to next song on end of song
        player.object[0].addEventListener("ended", function () {
            player.nextSong();
        }, true);

        // update time/slider
        player.object[0].addEventListener("timeupdate", function () {
            s = player.object[0].currentTime;
            d = Math.ceil(player.object[0].duration);
            var n = (d - s);
            if (s === 0) {
                current.html("-:--:--");
                remaining.html("-:--:--");
            } else {
                current.html(formatTime(s));
                remaining.html('-' + formatTime(n));
                progress.slider('option', 'value', (Math.floor(((s / d) * 1000)) / 10));
            }

        }, true);

        // loadcomplete
        player.object[0].addEventListener("loadedmetadata", function () {
            playlist.rows.removeClass('current');
            $(playlist.rows[currentSong]).addClass('current');
            checkFirstLast();
            $('#mp3Player-play').removeClass('disabled').addClass('display-off');
            $('#mp3Player-pause').removeClass('disabled').removeClass('display-off');
            $('#mp3Player-progress').addClass('loaded');
            player.disabled = false;
            player.playSong();
        }, true);
    }

    function loadPlaylist() {
        $.ajax({
            url: url,
            success: function (data) {
                $('#mp3player-table-holder').html(data);
                playlist = new Playlist($('#mp3Player-table'));

                //update player object
                var status = null;
                if (player != null)
                    status = player.disabled;
                player = new Player(playlist);
                if (status != null)
                    player.disabled = status;

                //update sortable on playlist
                $("#mp3Player-table").tablesorter();
                $("#mp3Player-table").bind("sortEnd", function () {
                    resetOrder();
                });

                // set clickable on songs
                playlist.rows.each(function () {
                    $(this).click(function () {
                        if ($(this).hasClass('no-mp3s') == false) {
                            if (player.disabled == false) {
                                player.loadSong($(this).index());
                            } else if (player.disabled == true && player.played == false) {
                                player.loadSong($(this).index());
                            }
                        }
                    });
                });
            }
        });

        $('#mp3player-table-holder').html('<span id="mp3Player-loading">Loading...</span>');
    }

    function loadheader() {
        $.ajax({
            url: url_scandir,
            success: function (data) {
                $('#header').html(data);
            }
        });
    }

    jQuery(document).ready(function ($) {
        mp3player = $('#mp3Player');
        musicFolder = mp3player.attr('data-folder');
        player = new Player(null);
        initGlobal();
        document.title = "Playlist: " + mp3dir;

        initUrl();

        loadheader();
        loadPlaylist();



        //graphic analyzer


        audioContext = (window.AudioContext ? new AudioContext() : (window.webkitAudioContext ? new webkitAudioContext() : null));


        if (audioContext) {
            $("#mp3player-audiocontext-options").show();
            graphicEqualizer = new GraphicalFilterEditorControl(1024, 44100, audioContext);
            analyzerType = null;
            analyzer = null;
            splitter = audioContext.createChannelSplitter();
            merger = audioContext.createChannelMerger();

            updateEqualizer();
            updateAnalyzer();

            document.getElementById("mp3player-analizer").addEventListener("change", updateAnalyzer);
            document.getElementById("mp3player-equalizer").addEventListener("change", updateEqualizer);
        }
        else {
            $("#mp3player-audiocontext-options").hide();
        }


    });



    function cleanUpAnalyzer() {
        if(audioContext)
        {
            if (analyzer) {
                analyzer.stop();
                analyzer.destroyControl();
            }
            splitter.disconnect(0);
            splitter.disconnect(1);
            if (analyzer) {
                analyzer.analyzerL.disconnect(0);
                analyzer.analyzerR.disconnect(0);
                analyzerType = null;
                analyzer = null;
            }
            merger.disconnect(0);
            return true;
        }
        return false;
    }

    function startSource() {
        if(audioContext)
        {
            console.log('startSource AudioContext Mode');
            source = audioContext.createMediaElementSource($('#mp3Player-player')[0]);
            graphicEqualizer.changeAudioContext(audioContext);
            source.connect(graphicEqualizer.filter.convolver, 0, 0);
       
            return true;
        }
        return false;
    }

    function stopSource() {
        if(audioContext)
        {
            console.log('stopSource AudioContext Mode');
            //enableButtons(true);
            if (source) {
                //source.stop(0);
                source.disconnect(0);
                source = null;
            }
            graphicEqualizer.filter.convolver.disconnect(0);
            //Free all created URL's only at safe moments!
            //freeObjURLs();
            return cleanUpAnalyzer();
        }
        return false;
    }

    function updateAnalyzer() {
        analyzer_mode = document.getElementById("mp3player-analizer").checked ? true : false;
        if(!source || !audioContext) return false;

        if (analyzer_mode) {

            graphicEqualizer.filter.convolver.disconnect(0); 
            

            if (!analyzer) {
                analyzer = new Analyzer(audioContext, graphicEqualizer.filter);
                analyzer.createControl(document.getElementById("analyzerPlaceholder"));
            }

            graphicEqualizer.filter.convolver.connect(splitter, 0, 0);
            splitter.connect(analyzer.analyzerL, 0, 0);
            splitter.connect(analyzer.analyzerR, 1, 0);

            analyzer.analyzerL.connect(merger, 0, 0);
            analyzer.analyzerR.connect(merger, 0, 1);

            merger.connect(audioContext.destination, 0, 0);
            return analyzer.start();
        }
        else {
                graphicEqualizer.filter.convolver.connect(audioContext.destination, 0, 0);
                return cleanUpAnalyzer();
        }
    }
    

    function updateEqualizer() {
        equlizer_mode = document.getElementById("mp3player-equalizer").checked ? true : false;

        if (equlizer_mode) {
            graphicEqualizer.createControl(document.getElementById("equalizerPlaceholder"));

        }
        else {
            graphicEqualizer.destroyControl(document.getElementById("equalizerPlaceholder"));
        }
    }