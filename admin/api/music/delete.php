<?php
include '../../../api/core.php';
requireUser($dbh);

include '../images/file_remove.php';

$data = from_binary();
if(!isset($data['form']))exitMessage("no_data");
$form = $data['form'];
if(@notAllSet(array($form['id']))) exitMessage($CODES["ENTITY_INVALID"]);
$x = $dbh->quickQuery("select * from songs where id=? limit 1", array($form['id']));
if($x->rowCount() < 1) exitMessage($CODES['ENTITY_NOTFOUND']);
$song = $x->fetch(PDO::FETCH_ASSOC);
if(!removeFile($song['filename'])) exitMessage($CODES['ENTITY_NOTFOUND']);
$order = $song['ordr'];
$cat_id = $song['cat_id'];
$dbh->quickQuery("delete from songs where id=? limit 1", array($form['id']));
$sth = $dbh->quickQuery("update songs set ordr=ordr-1 where ordr>? and cat_id=?", array($order, $cat_id));
echo json_encode(array("message"=>$CODES['ENTITY_DELETED']));