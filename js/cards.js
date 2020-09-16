let cards;
let classes;
let rarities;
let gods;

fill();

function fill(filter = null, value = null)
{
    let url;
    if(filter == null && value == null)
        url = "https://api.lrojon.fr/cardmaker/card/get/all";
    else
        url = "https://api.lrojon.fr/cardmaker/card/filter/" + filter + "=" + value;

    console.log(url)
    let xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.responseType = "json";
    xhr.onreadystatechange = function(){
        if(xhr.readyState == 4)
        {
            if(xhr.status == 200)
            {
                cards = xhr.response
                getClasses();
                getRarity();
                getGod();   
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
    xhr.open('POST', 'https://127.0.0.1/cardmaker/card/set/one');
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
    xhr.send(JSON.stringify(card));
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
        job:            classes.find(elem => elem.id == document.querySelector("#classModify").value),
        effect:         document.querySelector("#effectModify").value,
        copy:           document.querySelector("#copyModify").value,
        stat:           stat,
        cost:           document.querySelector("#costModify").value,
        requirements:   str + "/" + dex + "/" + int,
        rarity:         rarities.find(elem => elem.id == document.querySelector("input[name='rarityModify']:checked").id.replace('modify-', '')),
        god:            {
                            id: 0,
                            name: "NoGod",
                            image: null,
                            title: null
                        }
    }

    console.log(JSON.stringify(card));

    let xhr = new XMLHttpRequest();
    xhr.open("POST", "https://api.lrojon.fr/cardmaker/card/set/one");
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
    xhr.send(JSON.stringify(card));
}

function deleteCard(id)
{
    let xhr = new XMLHttpRequest();
    xhr.open("GET", "https://api.lrojon.fr/cardmaker/card/delete/" + id);
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