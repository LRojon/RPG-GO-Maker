<?php

require_once "classes/card.php";

$cards = new Cards();

echo $cards->getCardsJSON();