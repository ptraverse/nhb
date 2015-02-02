<?php

class WelcomeController extends BaseController
{
	
	public function GET() 
	{		
			echo $this->twig->render('welcome.html.twig');
	}
}