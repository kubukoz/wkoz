<?php
include '../../../api/core.php';

requireUser($dbh);
if(empty($_FILES)) exitMessage("no_files");
$tempPath = $_FILES['file']['tmp_name'];

$bin = $_POST;
$filename = $bin['filename'];
$folder = $bin['folder'];
$ext = end(explode(".", $_FILES['file']['name']));

uploadSong($filename, $ext, $tempPath, $CODES);

$img = $dbh->prepare("update songs set filename=? where id=? limit 1");
$img->execute(array("music/".$filename.".".$ext,$bin['filename']));

exitMessage("file_uploaded");