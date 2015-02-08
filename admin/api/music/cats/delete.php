<?php
include '../../../../api/core.php';
requireUser($dbh);

include '../../images/file_remove.php';

$data = from_binary();
if(!isset($data['form']))exitMessage("no_data");
$form = $data['form'];
if(@notAllSet(array($form['id']))) exitMessage($CODES["ENTITY_INVALID"]);
$x = $dbh->quickQuery("select * from music_cats where id=? limit 1", array($form['id']));
if($x->rowCount() < 1) exitMessage($CODES['ENTITY_NOTFOUND']);
$cat = $x->fetch(PDO::FETCH_ASSOC);

$songs = $dbh->quickQuery("select * from songs where cat_id=? order by ordr asc", array($cat['id']))->fetchAll(PDO::FETCH_ASSOC);
foreach($songs as $song){
    removeFile($song['filename']);
}
$order = $cat['ordr'];
$dbh->quickQuery("delete from music_cats where id=? limit 1", array($form['id']));
$dbh->quickQuery("delete from songs where cat_id=?", array($form['id']));
$sth = $dbh->quickQuery("update music_cats set ordr=ordr-1 where ordr>?", array($order));
echo json_encode(array("message"=>$CODES['ENTITY_DELETED']));