<?php
include '../../../api/core.php';

requireUser($dbh);

$data = from_binary();
if(!isset($data['form']))exitMessage("no_data");
$form = $data['form'];
if(@notAllSet(array($form['username'], $form['name'], $form['password'])) || strlen($form['username'])<1 || strlen($form['password'])<4) exitMessage($CODES["ENTITY_INVALID"]);
$usr = $dbh->quickQuery("select * from users where username=? limit 1", array($form['username']));
if($usr->rowCount() > 0) exitMessage($CODES['ENTITY_FOUND']);

$sth = $dbh->quickQuery("insert into users values(0,?,?,?)", array($form['username'], "", $form['name']));
$user = $dbh->quickQuery("select * from users where username=? limit 1", array($form['username']))->fetch(PDO::FETCH_ASSOC);
$id = $user['id'];

$password = hash_psswrd($id, $form['password']);
if($dbh->quickQuery("update users set password=? where id=?", array($password, $id))->rowCount()>0){
    $user['password'] = $password;
    echo json_encode(array("content"=>$user, "message"=>$CODES['ENTITY_CREATED']));
}
else exitMessage($CODES['SERVER_ERROR']);