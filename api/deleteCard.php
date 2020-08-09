<?php

require_once "classes/card.php";

$cards = new Cards();
$id = $_GET['id'];

echo $cards->deleteCard($id);