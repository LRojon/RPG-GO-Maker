<?php

class DAO
{
    public $bdd;

    public function __construct()
    {
        $cnx = "mysql:host=mysql-card.alwaysdata.net;dbname=card_data;charset=utf8";
        $username = "card";
        $password = "580B12baa2*";

        try {
            $this->bdd = new PDO($cnx, $username, $password);
        } catch (Exception $e) {
            die('Erreur : ' . $e->getMessage());
        }
    }

    public function query($query)
    {
        if($this->bdd != null)
            return $this->bdd->query($query);
        else
            die("Error DAO::bdd is null");
    }
}