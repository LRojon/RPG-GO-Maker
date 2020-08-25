<?php

require_once "tools.php";

class God
{
    public $id;
    public $name;
    public $title;
    public $image;

    public function __construct($id,$name,$title,$image)
    {
        $this->id = $id;
        $this->name = $name;
        $this->title = $title;
        $this->image = $image;
    }
}

class Gods
{
    public $array = array();

    public function __construct()
    {
        $dao = new DAO();

        $query = "SELECT * FROM god";

        $res = $dao->query($query);

        while ($god = $res->fetch()) {
            array_push($this->array, new god($god['id'], $god['name'], $god['title'], $god['image']));
        }
    }

    public function getFirstById($id)
    {
        foreach ($this->array as $god) {
            if($god->id == $id)
            {
                return $god;
            }
        }

        return false;
    }

    public function getJSON()
    {
        return json_encode($this->array);
    }
}