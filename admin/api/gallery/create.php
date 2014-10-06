<?php
include '../../../api/core.php';

requireUser($dbh);

$data = from_binary();
if(!isset($data['form']))exitMessage("no_data");
$form = $data['form'];
if(@notAllSet(array($form['name'])) || strlen($form['name'])<1) exitMessage($CODES["ENTITY_INVALID"]);

$maxordr = $dbh->quickQuery("select max(ordr) from gallery")->fetch(PDO::FETCH_NUM);
$newordr = $maxordr[0];
$newordr = $newordr+1;
$sth = $dbh->quickQuery("insert into gallery values(0,?,0,?)", array($form['name'], $newordr));
if($sth->rowCount()<1) exitMessage($CODES['SERVER_ERROR']);

echo json_encode(array("content"=>$dbh->quickQuery("select * from gallery order by id desc limit 1")->fetch(PDO::FETCH_ASSOC), "message"=>$CODES['ENTITY_CREATED']));