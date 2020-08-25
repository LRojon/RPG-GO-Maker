let cards;
let classes;
let rarities;

fill();

function fill(filter = null, value = null)
{
    let url;
    if(filter == null && value == null)
        url = "http://card.lrojon.fr/api/getCards.php";
    else
        url = "http://card.lrojon.fr/api/getCards.php?sort=" + filter + "&data=" + value;
    
        console.log(url);

    let xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.responseType = "json";
    xhr.onreadystatechange = function(){
        if(xhr.readyState == 4)
        {
            if(xhr.status == 200)
            {
                cards = xhr.response;
                getClasses();
                getRarity();
                display(xhr.response);
            }
        }
    }
    xhr.send();
}

function sendCard()
{

    let str = document.querySelector("#for").value;
    let dex = document.querySelector("#dex").value;
    let int = document.querySelector("#int").value;

    let max = Math.max(str, dex, int);
    let stat;
    if(max == str && max == dex && max == int)
        stat = "ALL";
    else if(max == str)
        stat = "FOR";
    else if(max == dex)
        stat = "DEX";
    else if(max == int)
        stat = "INT";
    
    let card = {
        id:             parseInt(cards[cards.length - 1].id) + 1,
        name:           document.querySelector("#name").value ,
        class:          classes.find(elem => elem.id == document.querySelector("#class").value),
        cost:           document.querySelector("#cost").value,
        effect:         document.querySelector("#effect").value ,
        stat:           stat ,
        requirements:   str + '/' + dex + '/' + int ,
        copy:           document.querySelector("#copy").value,
        rarity:         rarities.find(elem => elem.id == document.querySelector("input[name='rarity']:checked").id)
    }
    console.log(card)

    let xhr = new XMLHttpRequest();
    xhr.open('GET', 'http://card.lrojon.fr/api/setCard.php?data=' + JSON.stringify(card));
    xhr.onreadystatechange = function(){
        if(xhr.readyState == 4)
        {
            if(xhr.status == 200)
            {
                fill();
            }
            else
            {
                $('#failModal').modal('toggle');
                setTimeout(() => {
                    $('#failModal').modal('toggle');
                }, 2000);
            }
        }
    }
    xhr.send();
}

function modifyCard()
{
    let str = document.querySelector("#forModify").value;
    let dex = document.querySelector("#dexModify").value;
    let int = document.querySelector("#intModify").value;
    
    let max = Math.max(str, dex, int);
    let stat;
    if(max == str && max == dex && max == int)
        stat = "ALL"
    else if(max == str)
        stat = "FOR"
    else if(max == dex)
        stat = "DEX"
    else if(max == int)
        stat = "INT"

    let card = {
        id:             document.querySelector("#idModify").value,
        name:           document.querySelector("#nameModify").value,
        cost:           document.querySelector("#costModify").value,
        copy:           document.querySelector("#copyModify").value,
        effect:         document.querySelector("#effectModify").value,
        effect:         document.querySelector("#effectModify").value,
        class:          classes.find(elem => elem.id == document.querySelector("#classModify").value),
        stat:           stat,
        requirements:   str + "/" + dex + "/" + int,
        rarity:         rarities.find(elem => elem.id == document.querySelector("input[name='rarityModify']:checked").id.replace('modify-', '')),
    }

    let xhr = new XMLHttpRequest();
    xhr.open("GET", "http://card.lrojon.fr/api/setCard.php?data=" + JSON.stringify(card));
    xhr.onreadystatechange = function(){
        if(xhr.readyState == 4)
        {
            if(xhr.status == 200)
            {
                fill();
                $("#modifyModal").modal('toggle');
            }
        }
    }
    xhr.send();
}

function deleteCard(id)
{
    let xhr = new XMLHttpRequest();
    xhr.open("GET", "http://card.lrojon.fr/api/deleteCard.php?id=" + id);
    xhr.onreadystatechange = function() {
        if(xhr.readyState == 4)
        {
            if(xhr.status == 200)
            {
                fill();
            }
        }
    }
    xhr.send();
}