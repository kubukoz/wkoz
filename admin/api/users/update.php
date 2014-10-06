<?php
include '../../../api/core.php';

requireUser($dbh);

$data = from_binary();
if(!isset($data['form']))exitMessage("no_data");
$form = $data['form'];
if(@notAllSet(array($form['id'], $form['username'], $form['name'])) || strlen($form['username'])<1 || strlen($form['password'])<4) exitMessage($CODES["ENTITY_INVALID"]);
$usr = $dbh->quickQuery("select * from users where id=? limit 1", array($form['id']));
if($usr->rowCount() < 1) exitMessage($CODES['ENTITY_NOTFOUND']);

$sth = $dbh->quickQuery("update users set username=?, name=?, password=? where id=? limit 1", array($form['username'], $form['name'], hash_psswrd($form['id'], $form['password']), $form['id']));
if($sth->rowCount()>0){
    echo json_encode(array("content"=>$dbh->quickQuery("select * from users where id=?", array($form['id']))->fetch(PDO::FETCH_ASSOC), "message"=>$CODES['ENTITY_UPDATED']));
}
else exitMessage($CODES['SERVER_ERROR']);