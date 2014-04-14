select playlist:&nbsp;

<select onchange="changePlaylist(this);">

<?php
$dirExist = 0;
$DirectoryToScan2 = '../../../' . $_GET['mp3Player-folder'];

$results = scandir($DirectoryToScan2);

foreach ($results as $result) 
{
    
	if ($result === '.' or $result === '..') continue;

	if (is_dir($DirectoryToScan2. '/' . $result)) 
	{
		if($result == $_GET['mp3dir'])
		{
			echo '<option selected="selected" value="' . $result . '">' . $result . '</option>';
            $dirExist = 1;
		}
        
		else 
		{	
			echo '<option  value="' . $result . '">' . $result . '</option>';
        }
	}
}

if($dirExist ==0)
{	
	echo '<option selected="selected" value="      ">    </option>';
}


?>


</select>
 