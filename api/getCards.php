<?php

require_once "classes/card.php";

$cards = new Cards();

echo json_encode($cards->array);