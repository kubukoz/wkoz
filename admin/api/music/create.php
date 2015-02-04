<?php
include '../../../api/core.php';

requireUser($dbh);

$data = from_binary();
if(!isset($data['form']))exitMessage("no_data");
$form = $data['form'];
if(@notAllSet(array($form['name'], $form['category'])) || strlen($form['name'])<1) exitMessage($CODES["ENTITY_INVALID"]);
$maxordr = $dbh->quickQuery("select max(ordr) from songs where cat_id=?", array($form['category']))->fetch(PDO::FETCH_NUM);
$newordr = $maxordr[0];
$newordr = $newordr+1;
//todo ciekawe czy działa
$sth = $dbh->quickQuery("insert into songs values(0,?,0,?,?)", array($form['name'], $newordr, $form['category']));
if($sth->rowCount()<1) exitMessage($CODES['SERVER_ERROR']);

echo json_encode(array("message"=>$CODES['ENTITY_CREATED']));
