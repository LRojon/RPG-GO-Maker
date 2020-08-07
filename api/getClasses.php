<?php

require_once "classes/tools.php";

class Data
{
    public $id;
    public $name;

    public function __construct($id, $name)
    {
        $this->id = $id;
        $this->name = $name;
    }
}

$query = "SELECT * FROM class";

$dao = new DAO();
$res = $dao->query($query);

$arr = array();

while($data = $res->fetch(PDO::FETCH_ASSOC))
{
    array_push($arr, new Data($data['id'], $data['name']));
}

echo json_encode($arr);