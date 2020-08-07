<?php

require_once "tools.php";

class Card
{
    public $name;
    public $class;
    public $effect;
    public $copy;
    public $stat;
    public $cost;
    public $requirements;

    public function __construct($name, $class, $effect, $copy, $stat, $cost, $requirements)
    {
        $this->name = $name;
        $this->class = $class;
        $this->effect = $effect;
        $this->copy = $copy;
        $this->stat = $stat;
        $this->cost = $cost;
        $this->requirements = $requirements;
    }
}

class Cards
{

    public $array = array();

    public function __construct()
    {
        $query = "SELECT c.`name`,l.`name` class,c.`effect`,c.`copy`,c.`stat`,c.`cost`,c.`requirements` FROM `card` AS c JOIN class AS l ON c.class = l.id";

        $dao = new DAO();
        $res = $dao->query($query);

        while($card = $res->fetch())
        {
            $tmp = new Card($card['name'], $card['class'], $card['effect'], $card['copy'], $card['stat'], $card['cost'], $card['requirements']);
            array_push($this->array, $tmp);
        }
    }

}

?>