<?php
include '../../../api/core.php';

requireUser($dbh);
echo json_encode(array(
    "content"=>$dbh->quickQuery(
            "select id, username, name from users")->fetchAll(PDO::FETCH_ASSOC)
));