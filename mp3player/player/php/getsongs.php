<?php

require_once('getid3/getid3.php');

$DirectoryToScan = '../../../' . $_GET['mp3Player-folder'] . '/' . $_GET['mp3dir'];
$audioType = $_GET['mp3Player-audioType'];

$artist = $_GET['mp3Player-artist'];
$album = $_GET['mp3Player-album'];
$title = $_GET['mp3Player-title'];
$track = $_GET['mp3Player-track'];
$length = $_GET['mp3Player-length'];
$genre = $_GET['mp3Player-genre'];
$year = $_GET['mp3Player-year'];

$totalCols = 0;

$dirExist = 0;


$DirectoryToScan2 = '../../../' . $_GET['mp3Player-folder'];
$results = scandir($DirectoryToScan2);

foreach ($results as $result) {
    if (is_dir($DirectoryToScan2. '/' . $result)) {
        if($result == $_GET['mp3dir'])
        {
            $dirExist = 1;
        }
    }
}
 

?>


<table class="sortable" id="mp3Player-table">

	<colgroup>
	<?php if($title == 'true'){ $totalCols++; ?>
		<col class="title" />
	<?php } ?>
	<?php if($artist == 'true'){ $totalCols++; ?>
		<col class="artist" />
	<?php } ?>
	<?php if($album == 'true'){ $totalCols++; ?>
		<col class="album" />
	<?php } ?>
	<?php if($length == 'true'){ $totalCols++; ?>
		<col class="play-time" />
	<?php } ?>
	<?php if($track == 'true'){ $totalCols++; ?>
		<col class="track" />
	<?php } ?>
	<?php if($genre == 'true'){ $totalCols++; ?>
		<col class="genre" />
	<?php } ?>
	<?php if($year == 'true'){ $totalCols++; ?>
		<col class="year" />
	<?php } ?>
	</colgroup>
	<thead>
		<tr class="heading">
			<?php if($title == 'true'){ ?>
				<th>Title</th>
			<?php } ?>
			<?php if($artist == 'true'){ ?>
				<th>Artist</th>
			<?php } ?>
			<?php if($album == 'true'){ ?>
				<th>Album</th>
			<?php } ?>
			<?php if($length == 'true'){ ?>
				<th>Length</th>
			<?php } ?>
			<?php if($track == 'true'){ ?>
				<th>Track</th>
			<?php } ?>
			<?php if($genre == 'true'){ ?>
				<th>Genre</th>
			<?php } ?>
			<?php if($year == 'true'){ ?>
				<th>Year</th>
			<?php } ?>
		</tr>
	</thead>
	<tbody>
<?php
	if($dirExist ==1)
{
       
	$getID3 = new getID3;
	
	$files = scandir($DirectoryToScan);
	$totalAudio = 0;
	foreach($files as $file){
		$pos = strrpos($file, '.') + 1;
		$ext = strtolower(substr($file, $pos));
		
		if(($file !="." && $file != "..") && $ext==$audioType){
			$totalAudio++;
			$FullFileName = realpath($DirectoryToScan.'/'.$file);
			
			if (is_file($FullFileName)) {
				set_time_limit(30);
				$ThisFileInfo = $getID3->analyze($FullFileName);
				getid3_lib::CopyTagsToComments($ThisFileInfo);
				echo '<tr data-file="'.$_GET['mp3dir'].'/'.$file.'">';
				if($title == 'true'){
					if($audioType == "mp3"){
						if($ThisFileInfo['comments_html']['title']){
							echo '<td class="title">'.$ThisFileInfo['comments_html']['title'][(count($ThisFileInfo['comments_html']['title'])-1)].'</td>';
						} else {
							echo '<td class="title">'.$file.'</td>';
						}
					} else {
						echo '<td class="title">'.$file.'</td>';
					}
				}
				if($artist == 'true'){
					if($ThisFileInfo['comments_html']['artist']){
						echo '<td class="artist">'.$ThisFileInfo['comments_html']['artist'][(count($ThisFileInfo['comments_html']['artist'])-1)].'</td>';
					} else {
						echo '<td class="artist">Unknown Artist</td>';
					}
				}
				if($album == 'true'){	
					if($ThisFileInfo['comments_html']['album']){
						echo '<td class="album">'.$ThisFileInfo['comments_html']['album'][(count($ThisFileInfo['comments_html']['album'])-1)].'</td>';
					} else {
						echo '<td class="album">Unknown Album</td>';
					}
				}
				if($length == 'true'){
					echo '<td class="length">'.$ThisFileInfo['playtime_string'].'</td>';
				}
				if($track == 'true'){
					if($ThisFileInfo['comments_html']['track']){
						echo '<td class="track">'.$ThisFileInfo['comments_html']['track'][(count($ThisFileInfo['comments_html']['track'])-1)].'</td>';
					} else {
						echo '<td class="track"></td>';
					}
				}
				if($genre == 'true'){				
					if($ThisFileInfo['comments_html']['genre']){
						echo '<td class="genre">'.$ThisFileInfo['comments_html']['genre'][(count($ThisFileInfo['comments_html']['genre'])-1)].'</td>';
					} else {
						echo '<td class="genre"></td>';
					}
				}
				if($year == 'true'){				
					if($ThisFileInfo['comments_html']['year']){
						echo '<td class="year">'.$ThisFileInfo['comments_html']['year'][(count($ThisFileInfo['comments_html']['year'])-1)].'</td>';
					} else {
						echo '<td class="year"></td>';
					}
				}
				echo '</tr>';
			}
			
		}
	}

}
	
	if($totalAudio == 0){

			echo '<tr class="no-mp3s"><td colspan="' . $totalCols . '">Brak plikow, lub katalogu lub przegladarka nie obsluguje tego trybu</td></tr>';

	}
	
    	
?>
	</tbody>
</table>
