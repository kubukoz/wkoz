<?php
include '../../../../api/core.php';

requireUser($dbh);

$data = from_binary();
if(!isset($data['form']))exitMessage("no_data");
$form = $data['form'];
if(@notAllSet(array($form['id'], $form['name']))) exitMessage($CODES["ENTITY_INVALID"]);
if($dbh->quickQuery("select * from music_cats where id=? limit 1", array($form['id']))->rowCount() < 1) exitMessage($CODES['ENTITY_NOTFOUND']);

$sth = $dbh->quickQuery("update music_cats set name=? where id=? limit 1", array($form['name'], $form['id']));
echo json_encode(array("message"=>$CODES['ENTITY_UPDATED']));