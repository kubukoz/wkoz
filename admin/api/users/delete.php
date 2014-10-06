<?php
include '../../../api/core.php';

requireUser($dbh);

$data = from_binary();
if(!isset($data['form']))exitMessage("no_data");
$form = $data['form'];
if(@notAllSet(array($form['id']))) exitMessage($CODES["ENTITY_INVALID"]);
if($dbh->quickQuery("select * from users where id=? limit 1", array($form['id']))->rowCount() < 1) exitMessage($CODES['ENTITY_NOTFOUND']);
$dbh->quickQuery("delete from users where id=? limit 1", array($form['id']));
echo json_encode(array("message"=>$CODES['ENTITY_DELETED']));
