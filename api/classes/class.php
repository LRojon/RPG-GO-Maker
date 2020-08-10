<?php

require_once "tools.php";

class Job
{
    public $id;
    public $name;

    public function __construct($id, $name)
    {
        $this->id = $id;
        $this->name = $name;
    }

    public static function getFromJSON($json)
    {
        $data = json_decode($json);

        return new Job($data->id, $data->name);
    }
}

class Jobs
{
    private $array = array();

    public function __construct()
    {
        $query = "SELECT * FROM class";

        $dao = new DAO();
        $res = $dao->query($query);

        while($data = $res->fetch(PDO::FETCH_ASSOC))
        {
            array_push($this->array, new Job($data['id'], $data['name']));
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

    public function getClassesJSON()
    {
        return json_encode($this->array);
    }
}