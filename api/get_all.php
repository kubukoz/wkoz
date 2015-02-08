<?php
include 'core.php';

$cats = $dbh->quickQuery(
    "select * from music_cats order by ordr asc")->fetchAll(PDO::FETCH_ASSOC);
$cats_m = array();
foreach ($cats as $cat){
    $songs = $dbh->quickQuery("select * from songs where cat_id=? order by ordr asc", array($cat['id']))->fetchAll(PDO::FETCH_ASSOC);
    $cat['songs'] = $songs;
    $cats_m[] = $cat;
}

$sth = $dbh->quickQuery("select * from gallery order by ordr desc");
$sth->execute();
$gallery = $sth->fetchAll(PDO::FETCH_ASSOC);
echo json_encode(array("music"=>$cats_m, "gallery"=>$gallery));