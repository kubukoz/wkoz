<?php
include '../../../api/core.php';
requireUser($dbh);

$data = from_binary();
if(!isset($data['form']))exitMessage("no_data");
$form = json_decode($data['form'], true);
if(@notAllSet(array($form['id'], $data['change']))) exitMessage($CODES["ENTITY_INVALID"]);
$old = $dbh->quickQuery("select * from gallery where id=? limit 1", array($form['id']));
if($old->rowCount() < 1) exitMessage($CODES['ENTITY_NOTFOUND']);
$oldordr = $old->fetch(PDO::FETCH_ASSOC);
$oldordr = $oldordr['ordr'];

$sth = $dbh->quickQuery("update gallery set ordr=ordr+? where ordr=? limit 1", array(-$data['change'], $oldordr+$data['change']));
if($sth->rowCount()>0){
    $sth = $dbh->quickQuery("update gallery set ordr=ordr+? where id=? limit 1", array($data['change'], $form['id']));
    echo json_encode(array("message"=>$CODES['ENTITY_UPDATED']));
}
else exitMessage($CODES['SERVER_ERROR']);