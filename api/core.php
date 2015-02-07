<?php
class SimplePDO extends PDO{
    function quickQuery($query, $args = null){
        $result = $this->prepare($query);
        $result->execute($args);
        return $result;
    }
}
$CODES = array("ENTITY_CREATED" => 1,
    "ENTITY_UPDATED" => 2,
    "ENTITY_DELETED" => 3,
    "ENTITY_NOTFOUND" => -1,
    "ENTITY_INVALID" => 0,
    "ENTITY_FOUND" => -2,
    "SERVER_ERROR" => -13);
function uploadImage($filename, $folder, $ext, $tempPath, $CODES){
    $extensions = array("png", "jpg", "jpeg");
    if(!in_array($ext, $extensions)) exitMessage($CODES['ENTITY_INVALID']);
    $uploadPath = dirname(__FILE__)."/../images/".$folder."/".$filename.".".$ext;
    move_uploaded_file($tempPath, $uploadPath);
}
function uploadSong($filename, $ext, $tempPath, $CODES){
    $extensions = array("mp3");
    if(!in_array($ext, $extensions)) exitMessage($CODES['ENTITY_INVALID']);
    $uploadPath = dirname(__FILE__)."/../music/".$filename;
    move_uploaded_file($tempPath, $uploadPath);
}
function getMode(){return 0;}

function exitMessage($message){
    echo json_encode(array("message"=>$message));
    exit;
}
function from_binary(){
    return json_decode(file_get_contents("php://input"), true);
}
function hash_psswrd($unique, $password){
    $sofar = hash("sha512", $unique."98628658".$password);
    $iterations = 9999;
    while($iterations>0){
        $sofar = hash("sha512", $unique."98628658".$sofar);
        $iterations--;
    }
    return $sofar;
}

/**@version 0.0.1
 * @return String json-encoded, contains user or error
 * @param $dbh PDO*/
function authenticate_user(PDO $dbh){
    $bin = from_binary();
    if(isset($bin['user'])){
        $data = $bin['user'];
    }
    else if(isset($_COOKIE['user'])){
        if(get_magic_quotes_gpc())
            $data = json_decode(stripslashes($_COOKIE['user']), true);
        else $data = json_decode($_COOKIE['user'], true);
    }
    if(!isset($data['username']) || !isset($data['password'])){
        logout();
        return json_encode(array("error"=>"no_data"));
    }
    if(!isset($data['id'])){
        $username = $data['username'];
        $find_user = $dbh->prepare("select id from users where username=? limit 1");
        $find_user->execute(array($username));
        $user = $find_user->fetch(PDO::FETCH_ASSOC);
        if($find_user->rowCount()<1){
            logout();
            return json_encode(array("error"=>"wrong_data"));
        }
        unset($username);
        $id = $user['id'];
        $password = hash_psswrd($id, $data['password']); //h4x0rsk0 w chuj v2
    }
    else{
        $id = $data['id'];
        $password = $data['password'];
    }
    $sth = $dbh->prepare("select * from users where id=? and password=? limit 1");
    $sth->execute(array($id, $password));
    if($sth->rowCount()<1) return json_encode(array("error"=>"wrong_data"));
    $user = $sth->fetchAll(PDO::FETCH_ASSOC);
    $response = $user[0];
    if(getMode()==1)
        setcookie("user", json_encode($response), time()+3600*24*365.25, '/', ".wlodekkozlowski.pl", null, true); //todo
    else
        setcookie("user", json_encode($response), time()+3600*24*365.25, '/', null, null, true);
    return json_encode(array("user"=>$response));
}
function logout(){
    if(getMode()==1)
        setcookie("user", "", 1, '/', ".wlodekkozlowski.pl", null, true); //todo
    else
        setcookie("user", "", 1, '/', null, null, true);
}
function is_user($result){
    $res = json_decode($result, true);
    return isset($res['user']);
}
function requireUser($dbh){
    $result = authenticate_user($dbh);
    if(!is_user($result)){
        $res = json_decode($result, true);
        echo $res['error']; exit;
    }
    else return $result;
};

if(getMode()==1)
    header("Access-Control-Allow-Origin: http://wlodekkozlowski.pl");//todo
else
    header("Access-Control-Allow-Origin: http://localhost:63342");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

$dbname = getMode()==0?"wkoz":"";
$host = "localhost:3306";
$user = getMode()==0?"root":""; $pass = getMode()==0?"":"";
try{
    $dbh = new SimplePDO("mysql:host=$host;dbname=$dbname", $user, $pass);
    $dbh->query("SET NAMES utf8");
}
catch(PDOException $e){
    echo $e->getMessage();
}

function notAllSet($array){ foreach($array as $item) if(!isset($item)) return true; return false;}