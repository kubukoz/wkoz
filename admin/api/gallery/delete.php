<?php
include '../../../api/core.php';
requireUser($dbh);

include '../images/file_remove.php';

$data = from_binary();
if(!isset($data['form']))exitMessage("no_data");
$form = $data['form'];
if(@notAllSet(array($form['id']))) exitMessage($CODES["ENTITY_INVALID"]);
$x = $dbh->quickQuery("select * from gallery where id=? limit 1", array($form['id']));
if($x->rowCount() < 1) exitMessage($CODES['ENTITY_NOTFOUND']);
$image = $x->fetch(PDO::FETCH_ASSOC);
removeFile($image['image']);
$order = $image['ordr'];
$dbh->quickQuery("delete from gallery where id=? limit 1", array($form['id']));
$dbh->quickQuery("update gallery set ordr=ordr-1 where ordr>?", array($order));
echo json_encode(array("message"=>$CODES['ENTITY_DELETED']));