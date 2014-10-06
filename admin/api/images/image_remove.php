<?php
function removeImage($name){
    $path = dirname(__FILE__)."/../../../".$name;
    if(realpath($path))
        unlink($path);
}