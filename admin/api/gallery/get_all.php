<?php
include '../../../api/core.php';

requireUser($dbh);
echo json_encode(array(
    "content"=>$dbh->quickQuery(
            "select * from gallery order by ordr desc")->fetchAll(PDO::FETCH_ASSOC)
));