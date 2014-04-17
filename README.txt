AJAX MP3 Player
Version up to 1.0 By Joseph Moore
Newer versions by Kornel Misiejuk


This is an AJAX MP3 player that uses PHP to read a folder of files on your server and builds an HTML5 audio player in Javascript. 

What's new:
- subdirectories as plalists.
- equalizer and fft analyzer from GraphicalFilterEditor -> https://github.com/carlosrafaelgn/GraphicalFilterEditor
- Better borwsers (like Desktop Fx and chrome) is using AudioContext, worse (but still html5 like Android) is using simple audio .

Demo:
     http://mp3player.lenrock.org/
     music in example is CC (http://theslip.nin.com/ and http://music.hungrylucy.com/album/pulse-of-the-earth)


-- Original INSTRUCTIONS up to version 1.00 ------

1.) Copy plugin folder "mp3player" to the root folder of your site's HTML. 

2.) Insert jQuery library, jQuery ui, the plugin JS, and the plugin CSS files into the head of the html page. You can copy and paste this code:

<link rel="stylesheet" href="mp3player/player/css/styles.css" type="text/css" media="all" />
<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.5.1/jquery.min.js"></script> 
<script src="http://ajax.googleapis.com/ajax/libs/jqueryui/1.8/jquery-ui.min.js"></script>
<script type="text/javascript" src="mp3player/player/mp3playerplugin.js"></script> 

The styles.css file included with the plugin will preserve any styles you may have set for tables, and the div you insert into the markup. If you'd like to use our included black and white theme, just add the file "blackandwhite.css" from the same folder the "styles.css" comes in. You can also use this format to create your own look.

3.) Add an empty <div> to your markup wherever it is you want the player to appear

<div id="mp3Player" data-folder="mp3player/music"></div>

The id MUST be "mp3Player", and the data-folder attribute must be set. This tells the app where to look for your music files. By default, I set it to the music folder included in the plugin. You can set it to any folder you want, but the path must start from the root folder of your HTML (the same location as the "mp3player" folder you copied in step 1.)

4.) Choose the folder where the music for the player will live. You can use an existing folder or use our default location, included with the plugin.

5.) Choose which parts of the ID3 tags you want the player to display. Choices are :

Title
Artist
Album
Genre
Length
Track
Year

Then, open the mp3playerplugin.js file, and edit the variable "tags". If you want it to appear, make sure the key inside the "tags" variable reads "true". If you want that tag to be hidden, make sure it is false.

NOTES

HTML5 Source Exposed

This player uses HTML5 as its basis. That means that the source audio file will be exposed to anyone who knows a bit about HTML. Granted, most people probably wouldn't blther trying to do that, but there will always be those who will. At the moment, HTML5 audio doesn't support any kind of streaming or encryption (that I know of) so there's not much I can do. If HTML5 does support obfuscation of the source audio, I will make sure to include that option in a future release.

OGG/MP3 for Universal Support

At the moment, the state of HTML5 audio is kind of fractured. In order to get universal playback across all browsers, you have to have two versions of every song, one as an MP3 and one as an OGG audio file. In my opinion, it's way too much to ask someone who has an existing library in one format to transfer all the songs and then host double the files just because browsermakers are having a pissing match over standards.

In order to make this player as compatible as possible without putting an extra task on the webmasters that want to use it, I decided to use MP3s as the default standard, since more people's existing libraries will already be in this format instead of OGG. What will happen is this: if the visitor's browser is capable of playing MP3s, the player will only load MP3s and ignore the OGGs. If there are no MP3s in the folder (as you might have in an OGG only playlist), the player assumes you may have OGG files, and a message will display directing the user to try a OGG Compatible browser. If the visitor's browser is not capable of playing MP3s, the player will only load OGG files. If there are no OGGs for the player and you use an OGG only compatible browser, you will get a similar message to before, directing you to try an MP3 capable browser.

The long and short of it is this, feel free to duplicate all your audio files for both formats. That way, anyone using any HTML5 compatible browser will be able to hear your content, and they will only load the files their browser is capable of hearing. But if you don't, those with incompatible browsers will be directed to use the correct browser. Everybody wins.

No Flash Fallback

I said before "any HTML5 compatible browser", which mean that there is no fallback right now for IE8 and below. While HTML5 audio allows you to put a flash fallback inside the audio tags, I didn't do that. I didn't start this project to program Flash. That being said, if anyone out there want to add a flash component to this plugin as the fallback, please fell free. I just don't want to have to be that person.
