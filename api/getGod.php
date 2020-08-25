<?php

require_once "classes/god.php";

$gods = new Gods();

echo $gods->getJSON();