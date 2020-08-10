let form = document.querySelector('#display').innerHTML;

function display(cards)
{
    let ctx = document.querySelector('#display');
    ctx.innerHTML = "";
    
    getRarity();
    cards.forEach(card => {
        ctx.innerHTML += getTemplate(card);
    });
    ctx.innerHTML += form;
    getClasses();

    document.querySelectorAll("[id^='card-'] > div").forEach(div => {
        div.onclick = function() {
            openModal(div.parentElement.id.replace('card-',''));
        }
    })
    document.querySelectorAll("[id^='card-']").forEach(div => {
        div.onmouseover = function() {
            document.querySelector('#close-' + div.id.replace('card-', '')).style.display = "block";
        }
        div.onmouseout = function() {
            document.querySelector('#close-' + div.id.replace('card-', '')).style.display = "none";
        }
    })
    
    document.querySelectorAll("[id^='close-']").forEach(btn => {
        btn.onclick = function() {
            deleteCard(btn.id.replace('close-', ''));
        }
    })
}


function getTemplate(card)
{
    return  "<div class='col-lg-3 col-sm-6 mb-3'>" +
                    "<div id='card-" + card.id + "' class='mb-3 card h-100 " + getColorFromStat(card.stat) + "'>" +
                    '<button onclick="test()" id="close-' + card.id + '" class="bg-danger close" style="display: none;">X</button>' +
                        "<div class='card-header'><div class='row'><div class='col-10'><h5 class='card-title'>"+card.name+"</h5><h6 class='card-subtitle text-muted'>"+card.class.name+" - " + getDisplayRarity(card.rarity) + "</h6></div><div class='col-2' style='text-align:right'><span class='badge badge-secondary'>"+card.cost+"</span></div></div></div>" +
                        "<div class='card-body'>"+card.effect+"</div>" +
                        "<div class='card-footer'><div class='row'><div class='col-6'>" + prerequis(card.requirements) + "</div><div class='col-6' style='text-align:center'>"+card.copy+" exemplaire</div></div></div>" +
                "</div>" +
            "</div>"
}

function getDisplayRarity(rarity)
{
    return "<span class='badge' style='background-color: #" + rarity.color + "'>" + rarity.name + "</span>";
}

function getColorFromStat(stat)
{
    return (stat == "FOR" ? "border-danger" : (stat == "DEX" ? "border-success" : (stat == "INT" ? "border-primary" : "border-dark")));
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
                classes = xhr.response;
                setClasses(xhr.response)
            }
        }
    }
    xhr.send();
}

function getRarity()
{
    let xhr = new XMLHttpRequest();
    xhr.open("GET", "http://card.alwaysdata.net/api/getRarity.php");
    //xhr.responseType = "json";
    xhr.onreadystatechange = function()
    {
        if(xhr.readyState == 4)
        {
            if(xhr.status == 200)
            {
                rarities = JSON.parse(xhr.responseText);

                let ctx = document.querySelector("#rarity");
                let ctx2 = document.querySelector("#rarityModify");
                rarities.forEach(elem => {
                    console.log(ctx.innerHTML)
                    ctx.innerHTML += "<option value='" + elem.id + "' style='background-color: #"+ elem.color +"></option>";
                })
                ctx2.innerHTML = ctx.innerHTML;
            }
        }
    }
    xhr.send();
}
console.log("change-")

function setClasses()
{
    let ctx = document.querySelector("#class");
    let ctx2 = document.querySelector("#classModify");

    classes.forEach(elem => {
        ctx.innerHTML += "<option value='" + elem.id + "'>" + elem.name + "</option>"
        ctx2.innerHTML += "<option value='" + elem.id + "'>" + elem.name + "</option>"
    })
}

function openModal(id)
{
    let card = cards.find(elem => elem.id == id);

    let split = card.requirements.split('/');
    let str = split[0];
    let dex = split[1];
    let int = split[2];

    let modal = document.querySelector("#cardModal");
    modal.classList.remove("border-dark", "border-danger", "border-success", "border-primary");
    switch(card.stat)
    {
        case "FOR":
            modal.classList.add("border-danger");
            break;
        case "DEX":
            modal.classList.add("border-success");
            break;
        case "INT":
            modal.classList.add("border-primary");
            break;
        default:
            modal.classList.add("border-dark");
            break;
    }

    document.querySelector("#idModify").value = card.id;
    document.querySelector("#nameModify").value = card.name;
    document.querySelector("#costModify").value = card.cost;
    document.querySelector("#classModify").value = classes.find(elem => elem.name == card.class).id;
    document.querySelector("#effectModify").value = card.effect;
    document.querySelector("#copyModify").value = card.copy;
    document.querySelector("#forModify").value = str;
    document.querySelector("#dexModify").value = dex;
    document.querySelector("#intModify").value = int;
    document.querySelector("#rarityModify").value = card.rarity.id;
    $("#modifyModal").modal('toggle');
}