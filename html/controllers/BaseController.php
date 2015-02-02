<?php

class BaseController
{
	public $twig; 
	public $em;
	public $session;
	
	public function __construct()
	{
		global $twig, $em, $session;
		$this->twig = $twig;
		$this->twig->addGlobal("session", $session);
		$this->em = $em;
		$this->session = $session;
	}
	
}