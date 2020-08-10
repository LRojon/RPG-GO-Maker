<?php

require_once "tools.php";

class Rarity
{
    public $id;
    public $name;
    public $color;

    public function __construct($id, $name, $color)
    {
        $this->id = $id;
        $this->name = $name;
        $this->color = $color;
    }

    public static function getFromJSON($json)
    {
        $data = json_decode($json);

        return new Rarity($data->id, $data->name, $data->color);
    }
}

class Rarities
{
    private $array = array();

    public function __construct()
    {
        $query = "SELECT * FROM rarity";

        $dao = new DAO();
        $res = $dao->query($query);

        while($data = $res->fetch(PDO::FETCH_ASSOC))
        {
            array_push($this->array, new Rarity($data['id'], $data['name'], $data['color']));
        }
    }

    public function getFirstById($id)
    {
        foreach ($this->array as $value) {
            if($id == $value->id)
                return $value;
        }
        return false;
    }

    public function getRarityJSON()
    {
        return json_encode($this->array);
    }
}