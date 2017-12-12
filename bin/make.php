<?php

header("Access-Control-Allow-Origin: *");

//echo '{"code":"1"}';

//$RecvInfo = @$FILE;




$json = file_get_contents('php://input');
$obj = json_decode($json);

//$RecvInfo = json_decode($_POST);
//print($RecvInfo->sketch_code);
//touch("a.txt");

file_put_contents('test.ino', $obj->sketch_code);



touch("Makefile");

file_put_contents("Makefile","include /usr/share/arduino/Arduino.mk");


system("make");

// $fp = fopen("a.txt", "w");


// fwrite($fp, $RecvInfo->sketch_code);

// fclose($fp);

/**/




?>