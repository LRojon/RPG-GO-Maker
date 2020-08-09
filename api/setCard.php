<?php

require_once "classes/card.php";

$data = $_GET['data'];

$cards = new Cards();
$card = Card::getFromJSON($data);

echo $card->save($cards->exist($card));