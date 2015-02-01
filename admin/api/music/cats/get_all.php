<?php
include '../../../../api/core.php';

requireUser($dbh);
$cats = $dbh->quickQuery(
    "select * from music_cats order by ordr asc")->fetchAll(PDO::FETCH_ASSOC);
$cats_m = array();
foreach ($cats as $cat){
    $songs = $dbh->quickQuery("select * from songs where cat_id=? order by ordr asc", array($cat['id']))->fetchAll(PDO::FETCH_ASSOC);
    $cat['songs'] = $songs;
    $cats_m[] = $cat;
}

echo json_encode(array(
    "content"=>$cats_m
));