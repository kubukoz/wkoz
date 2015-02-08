<?php
include '../../../api/core.php';
include '../images/file_remove.php';
requireUser($dbh);

if(!empty($_FILES))
    $data = $_POST;
else $data = from_binary();
if(!isset($data['form']))exitMessage("no_data");
$form = json_decode($data['form'], true);
if(@notAllSet(array($form['id'], $form['name']))|| strlen($form['name'])<1) exitMessage($CODES["ENTITY_INVALID"]);
$old = $dbh->quickQuery("select * from gallery where id=? limit 1", array($form['id']));
if($old->rowCount() < 1) exitMessage($CODES['ENTITY_NOTFOUND']);
$old = $old->fetch(PDO::FETCH_ASSOC);

if(!empty($_FILES)){
    $oldFilename = $old['image'];
    $folder = "gallery";
    removeImage($oldFilename);
    $filename = $old['id'];
    $ext = end(explode(".", $_FILES['file']['name']));
    $tempPath = $_FILES['file']['tmp_name'];
    uploadImage($filename, $folder, $ext, $tempPath, $CODES);
    $new_image = "images/".$folder."/".$filename.".".$ext;
}
else $new_image = $old['image'];

$sth = $dbh->quickQuery("update gallery set name=?, image=? where id=? limit 1", array($form['name'], $new_image, $form['id']));
if($sth->rowCount()>0 || !empty($_FILES)){
    echo json_encode(array("message"=>$CODES['ENTITY_UPDATED']));
}
else exitMessage($CODES['SERVER_ERROR']);