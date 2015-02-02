<?php

class StaticPagesController extends BaseController
{
	public function __construct()
	{
		parent::__construct();
	}
	
	public function GET($matches)
	{			
		if (isset($matches[1]))
		{
			if (in_array($matches[1],array("help","contact","welcome")))
			{
				echo $this->twig->render($matches[1].'.html.twig', array()); //make sure templates/welcome.html.twig exists
			}			
			else
			{
				throw new Exception("Static Page '$matches[1]' Not Yet Implemented","404");
			}			
		}
		else
		{
			throw new Exception("Static Page Not Specified","400");
		}
	}
}