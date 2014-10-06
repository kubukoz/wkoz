<?php
include '../../api/core.php';
logout();
echo json_encode(array("message"=>"logged_out"));