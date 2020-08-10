<?php

require_once "classes/rarity.php";

$rarities = new Rarities();

echo $rarities->getRarityJSON();