<?php

require_once "classes/card.php";

if(isset($_GET['sort']))
{
    $sort = $_GET['sort'];
    $data= $_GET['data'];
    
    $cards = new Cards();
    
    echo $cards->getCardsJSON($sort, $data);
}
else
{
    $cards = new Cards();
    
    echo $cards->getCardsJSON();
}