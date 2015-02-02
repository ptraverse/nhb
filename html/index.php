<?php

require_once('config.php');  
    
$urls = array(
	'/' => 						'WelcomeController',			//GET
	'/([a-z]+)'	=> 				'StaticPagesController',		//GET
);
    
try 
{
	glue::stick($urls);
}
catch (Exception $e)
{
	
	echo '<h1>'.$e->getCode().'!</h1>';	
	
	if ($development_server==TRUE) // deKLugE?
	{
		if (isset($e->xdebug_message))
		{
			echo '<table>'.$e->xdebug_message.'</table>';
		}
		echo '<hr>';
		echo '<pre>';
		var_dump($e);
		echo '</pre>';	
	}


}

?>
