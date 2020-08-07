
function display(cards)
{
    console.log(cards);
    let ctx = document.querySelector("#display")
    let tmp = ctx.innerHTML;
    ctx.innerHTML = "";
    
    cards.forEach(card => {
        ctx.innerHTML += getTemplate(card);
    });
    ctx.innerHTML += tmp;
}


function getTemplate(card)
{
    return  "<div class='col-3 mb-3'>" +
                    "<div class='mb-3 card h-100 " + getColorFromStat(card.stat) + "'>" +
                        "<div class='card-header'><div class='row'><div class='col-10'><h5 class='card-title'>"+card.name+"</h5><h6 class='card-subtitle text-muted'>"+card.class+"</h6></div><div class='col-2' style='text-align:right'><span class='badge badge-secondary'>"+card.cost+"</span></div></div></div>" +
                        "<div class='card-body'>"+card.effect+"</div>" +
                        "<div class='card-footer'><div class='row'><div class='col-6'>" + prerequis(card.requirements) + "</div><div class='col-6' style='text-align:center'>"+card.copy+" exemplaire</div></div></div>" +
                "</div>" +
            "</div>"
}

function getColorFromStat(stat)
{
    return (stat == "FOR" ? "border-danger" : (stat == "DEX" ? "border-success" : (stat == "INT" ? "border-primary" : "border-light")));
}

function prerequis(str)
{
    let ret = str.split('/');
    return "<span class='badge badge-danger'>" + ret[0] + "</span> <span class='badge badge-success'>" + ret[1] + "</span> <span class='badge badge-primary'>" + ret[2] + "</span>"
}

function getClasses()
{
    let xhr = new XMLHttpRequest();
    xhr.open("GET", "http://card.alwaysdata.net/api/getClasses.php");
    xhr.responseType = "json";
    xhr.onreadystatechange = function()
    {
        if(xhr.readyState == 4)
        {
            if(xhr.status == 200)
            {
                setClasses(xhr.response)
            }
        }
    }
    xhr.send();
}

function setClasses(classes)
{
    let ctx = document.querySelector("#class");

    classes.forEach(elem => {
        ctx.innerHTML += "<option value='" + elem.id + "'>" + elem.name + "</option>"
    })
}

function sendCard()
{
    let str = document.querySelector("#for").value;
    let dex = document.querySelector("#dex").value;
    let int = document.querySelector("#int").value;

    let max = Math.max(str, dex, int);
    let stat;
    if(max == str && max == dex && max == int)
        stat = "ALL"
    else if(max == str)
        stat = "FOR"
    else if(max == dex)
        stat = "DEX"
    else if(max == int)
        stat == "INT"

    let card = {
        name: document.querySelector("#name").value,
        class: document.querySelector("#class").value,
        cost: document.querySelector("#cost").value,
        effect: document.querySelector("#effect").value,
        stat: stat,
        requirements: str + "/" + dex + "/" + int,
        copy: document.querySelector("#copy").value,
    }

    console.log(card);
}