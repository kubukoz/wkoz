<?php
include '../../../api/core.php';

requireUser($dbh);
if(empty($_FILES)){
    $dbh->quickQuery("delete from songs where id=? limit 1", array($_POST['id']));
    exitMessage("no_files");
}
$tempPath = $_FILES['file']['tmp_name'];

$bin = $_POST;
$filename = $bin['filename'];
$ext = end(explode(".", $_FILES['file']['name']));

uploadSong($filename, $ext, $tempPath, $CODES);

$file = $dbh->quickQuery("update songs set filename=? where id=? limit 1", array("music/".$filename, $bin['id']));

exitMessage("file_uploaded");