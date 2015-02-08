<?php
include '../../../api/core.php';
include '../images/file_remove.php';

requireUser($dbh);
$bin = $_POST;
if(empty($bin)) $bin = from_binary();

$oldname_res = $dbh->quickQuery("select * from songs where id=?", array($bin['id']))->fetch(PDO::FETCH_ASSOC);
$oldname = $oldname_res["filename"];

if(!empty($_FILES)){
    $tempPath = $_FILES['file']['tmp_name'];
    $filename = $bin['filename'];
    $ext = end(explode(".", $_FILES['file']['name']));
    removeFile($oldname);
    uploadSong($filename, $ext, $tempPath, $CODES);
    $filename = "music/".$filename;
}
else{
    $filename = $oldname;
}
$file = $dbh->quickQuery("update songs set filename=?, name=? where id=? limit 1", array($filename, $bin['name'], $bin['id']));


exitMessage("file_uploaded");