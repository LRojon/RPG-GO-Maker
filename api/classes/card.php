<?php

require_once "tools.php";
require_once "class.php";
require_once "rarity.php";

class Card
{
    public $id;
    public $name;
    public $class;
    public $effect;
    public $copy;
    public $stat;
    public $cost;
    public $requirements;
    public $rarity;
    public $god;

    public function __construct($id, $name, $class, $effect, $copy, $stat, $cost, $requirements, $rarity, $god)
    {
        $this->id = $id;
        $this->name = $name;
        $this->class = $class;
        $this->effect = $effect;
        $this->copy = $copy;
        $this->stat = $stat;
        $this->cost = $cost;
        $this->requirements = $requirements;
        $this->rarity = $rarity;
        $this->god = $god;
    }

    public static function getFromJSON($json)
    {
        $data = json_decode($json);

        return new Card($data->id, $data->name,$data->class,$data->effect,$data->copy,$data->stat,$data->cost,$data->requirements, $data->rarity, $data->god);
    }

    public function save($exist)
    {
        $dao = new DAO();

        if($exist == true)
        {
            $query = "UPDATE card SET `name`=:name, class=:class, effect=:effect, `copy`=:copy, stat=:stat, cost=:cost, requirements=:requirements, rarity=:rarity, god=:god WHERE id=:id";
            return $dao->bdd->prepare($query)->execute(array(
                ":id" => $this->id,
                ":name" => $this->name,
                ":class" => $this->class->id,
                ":effect" => $this->effect,
                ":copy" => $this->copy,
                ":stat" => $this->stat,
                ":cost" => $this->cost,
                ":requirements" => $this->requirements,
                ":rarity" => $this->rarity->id,
                ":god"=> $this->god->id,
            ));
        }
        else
        {
            $query = "INSERT INTO card(id, `name`,class,effect,`copy`,stat,cost,requirements,rarity) VALUES(:id, :name, :class, :effect, :copy, :stat, :cost, :requirements, :rarity, :god)";
            return $dao->bdd->prepare($query)->execute(array(
                ":id" => $this->id,
                ":name" => $this->name,
                ":class" => $this->class->id,
                ":effect" => $this->effect,
                ":copy" => $this->copy,
                ":stat" => $this->stat,
                ":cost" => $this->cost,
                ":requirements" => $this->requirements,
                ":rarity" => $this->rarity->id,
                ":god"=> $this->god->id,
            ));
        }
    }
}

class Cards
{
    private $array = array();

    public function __construct()
    {
        $rarities = new Rarities();
        $jobs = new Jobs();
        $gods = new Gods();

        $query = "SELECT * FROM card";

        $dao = new DAO();
        $res = $dao->query($query);

        while($card = $res->fetch())
        {
            $tmp = new Card($card['id'], $card['name'], $card['class'], $card['effect'], $card['copy'], $card['stat'], $card['cost'], $card['requirements'], $card['rarity'], $card['god']);
            array_push($this->array, $tmp);
        }

        for ($i=0; $i < count($this->array); $i++) 
        {
            if($jobs->getFirstById($this->array[$i]->class) != false)
                $this->array[$i]->class = $jobs->getFirstById($this->array[$i]->class);
            if($rarities->getFirstById($this->array[$i]->rarity) != false)
                $this->array[$i]->rarity = $rarities->getFirstById($this->array[$i]->rarity);
            if($gods->getFirstById($this->array[$i]->god) != false)
                $this->array[$i]->god = $gods->getFirstById($this->array[$i]->god);   
        }
    }

    public function getCardsJSON($sort=null, $data=null)
    {
        if($sort == null || $data == null)
        {
            return json_encode($this->array);
        }
        else
        {
            $tmp = array();
            switch($sort)
            {
                case "name":
                    foreach ($this->array as $value) {
                        if(strpos(strtolower($value->name), strtolower($data)) !== false)
                            array_push($tmp, $value);
                    }
                    break;
                case "class":
                    foreach ($this->array as $value) {
                        if($value->class->id == $data)
                            array_push($tmp, $value);
                    }
                    break;
                case "stat":
                    foreach ($this->array as $value) {
                        if($value->stat == strtoupper($data))
                            array_push($tmp, $value);
                    }
                    break;
                case "rarity":
                    foreach ($this->array as $value) {
                        if($value->rarity->id == $data)
                            array_push($tmp, $value);
                    }
                    break;
                case "god":
                    foreach ($this->array as  $value) {
                        if($value->god->id == $data)
                            array_push($tmp, $value);
                    }
            }
            usort($tmp, "sortByName");
            return json_encode($tmp);
        }
    }

    public function exist($card)
    {
        foreach ($this->array as $value) {
            if($value->id == $card->id)
                return true;
        }
        return false;
    }

    public function deleteCard($id)
    {
        $dao = new DAO();
        $query = "DELETE FROM card WHERE id=:id";
        return $dao->bdd->prepare($query)->execute(array ("id" => $id));
    }
}

function sortByName($a, $b)
{
    return strcmp($a->name, $b->name);
}

?>