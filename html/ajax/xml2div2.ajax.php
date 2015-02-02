<?php 

require_once('../config.php');

//$xml_text = $_REQUEST['xml_text'];

if ($xml_text=='')
{
	$xml_text = file_get_contents('../private/xml_text.xml');
}

$xml = simplexml_load_string($xml_text) or Die("NoXML");
$x_json = json_encode($xml);
$x_array = json_decode($x_json,TRUE);

echo $x_json;

?>