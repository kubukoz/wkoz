<?php
include 'core.php';

$sth = $dbh->quickQuery("select * from gallery order by ordr desc");
$sth->execute();
$gallery = $sth->fetchAll(PDO::FETCH_ASSOC);
echo json_encode(array("gallery"=>$gallery));
/*$sth2 = $dbh->quickQuery("select * from music_cats");
$sth2->execute();
$music_cats = $sth->fetchAll(PDO::FETCH_ASSOC);*/