<?php

require 'vendor/autoload.php';

/*********************************************
 * Logging
*********************************************/

use Monolog\Logger;
use Monolog\Handler\StreamHandler;

// create a log channel
$debug = new Logger('debug');
$debug->pushHandler(new StreamHandler('log/debug.log', Logger::DEBUG));

/* e.g, add records to the log */
// $debug->addDebug($_SERVER['REQUEST_URI'],array('foo'=>'bar','baz'=>'123asdf'));


/*********************************************
 * Routing
*********************************************/
require_once('glue.php');



/*********************************************
 * Twig Templates
*********************************************/
if ($_SERVER['DOCUMENT_ROOT']>'') //CROCK!@!@#
{
	$loader = new Twig_Loader_Filesystem($_SERVER['DOCUMENT_ROOT']."/templates");
}
else
{
	$loader = new Twig_Loader_Filesystem("templates");
}
$twig = new Twig_Environment($loader);


/*********************************************
 * Development Settings
*********************************************/
$development_server = FALSE;
if (file_exists($_SERVER['DOCUMENT_ROOT'].'/private/config_override.php'))
{
	require_once($_SERVER['DOCUMENT_ROOT'].'/private/config_override.php');
}