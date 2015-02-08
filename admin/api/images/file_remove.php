<?php
function removeFile($name){
    $path = $_SERVER['DOCUMENT_ROOT']."/".$name;
    if(realpath($path)){
        unlink($path);
        return true;
    }
    return false;
}