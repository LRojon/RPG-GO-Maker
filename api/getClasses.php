<?php

require_once "classes/class.php";

$jobs = new Jobs();

echo $jobs->getClassesJSON();