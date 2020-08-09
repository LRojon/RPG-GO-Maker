<?php

require_once "tools.php";

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

    public function __construct($id, $name, $class, $effect, $copy, $stat, $cost, $requirements, $rarity)
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
    }

    public static function getFromJSON($json)
    {
        $data = json_decode($json);

        return new Card($data->id, $data->name,$data->class,$data->effect,$data->copy,$data->stat,$data->cost,$data->requirements, $data->rarity);
        
        /*$this->name = ;
        $this->class = $data['class'];
        $this->effect = $data['effect'];
        $this->copy = $data['copy'];
        $this->stat = $data['stat'];
        $this->cost = $data['cost'];
        $this->requirements = $data['requirements'];*/
    }

    public function save($exist)
    {
        $dao = new DAO();

        if($exist == true)
        {
            $query = "UPDATE card SET `name`=:name, class=:class, effect=:effect, `copy`=:copy, stat=:stat, cost=:cost, requirements=:requirements WHERE id=:id";
            return $dao->bdd->prepare($query)->execute((array)$this);
        }
        else
        {
            $query = "INSERT INTO card(id, `name`,class,effect,`copy`,stat,cost,requirements) VALUES(:id, :name, :class, :effect, :copy, :stat, :cost, :requirements)";
            return $dao->bdd->prepare($query)->execute((array)$this);
        }
    }
}

class Cards
{

    private $array = array();

    public function __construct()
    {
        $query = "SELECT c.`id`, c.`name`,l.`name` class,c.`effect`,c.`copy`,c.`stat`,c.`cost`,c.`requirements` FROM `card` AS c JOIN class AS l ON c.class = l.id";

        $dao = new DAO();
        $res = $dao->query($query);

        while($card = $res->fetch())
        {
            $tmp = new Card($card['id'], $card['name'], $card['class'], $card['effect'], $card['copy'], $card['stat'], $card['cost'], $card['requirements']);
            array_push($this->array, $tmp);
        }
    }

    public function getCardsJSON()
    {
        return json_encode($this->array);
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

?>