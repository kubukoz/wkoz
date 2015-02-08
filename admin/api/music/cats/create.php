<?php
include '../../../../api/core.php';

requireUser($dbh);

$data = from_binary();
if(!isset($data['form']))exitMessage("no_data");
$form = $data['form'];
if(@!isset($form['name'])) $form['name'] = "";
$ordr_req = $dbh->quickQuery("select max(ordr) from music_cats");
$ordr_req = $ordr_req->fetch(PDO::FETCH_NUM);
$ordr = $ordr_req[0]+1;
$sth = $dbh->quickQuery("insert into music_cats values(0,?,?)", array($form['name'], $ordr));
if($sth->rowCount()<1) exitMessage($ordr_req);

echo json_encode(array("message"=>$CODES['ENTITY_CREATED']));