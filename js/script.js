let form = document.querySelector('#display').innerHTML;

document.querySelector("#classSearch").onchange = function ()
{
    let ctx = document.querySelector("#classSearch");
    
    if(ctx.value != "-1")
        fill("class", ctx.value);
    else
        fill();
}

document.querySelector("#statSearch").onchange = function ()
{
    let ctx = document.querySelector("#statSearch");
    
    if(ctx.value != "-1")
        fill("stat", ctx.value);
    else
        fill();
}

document.querySelector("#raritySearch").onchange = function ()
{
    let ctx = document.querySelector("#raritySearch");
    
    if(ctx.value != "-1")
        fill("rarity", ctx.value);
    else
        fill();
}

document.querySelector("#nameSearch").onchange = function ()
{
    let ctx = document.querySelector("#nameSearch");

    if(ctx.value != "")
        fill("name", ctx.value);
    else
        fill();
}

document.querySelectorAll("a[id$='Sort'").forEach(ctx => {
    ctx.onclick = function ()
    {
        cards.sort(sortByName);
        if(ctx.name == "class")
        {
            cards.sort((a,b) => {
                if (a[ctx.name].name == b[ctx.name].name) 
                {
                    return 0;
                }
                return (a[ctx.name].name < b[ctx.name].name) ? -1 : 1;
            });
        }
        else if(ctx.name == "rarity")
        {
            cards.sort((a,b) => {
                if (a[ctx.name].id == b[ctx.name].id) 
                {
                    return 0;
                }
                return (a[ctx.name].id < b[ctx.name].id) ? -1 : 1;
            });
        }
        else if(ctx.name == "stat")
        {
            cards.sort(sortByStat);
        }
        else
        {
            cards.sort((a,b) => {
                if (a[ctx.name] == b[ctx.name]) 
                {
                    return 0;
                }
                return (a[ctx.name] < b[ctx.name]) ? -1 : 1;
            });
        }
        
        display(cards);
    }
})

//------------------------------------------------------------- Function ---------------------------------------------------------------

function display(cards)
{
    let ctx = document.querySelector('#display');
    ctx.innerHTML = "";
    
    cards.forEach(card => {
        ctx.innerHTML += getTemplate(card);
    });
    ctx.innerHTML += form;

    //console.log(document.querySelector("#card-" + Math.floor(cards.length / 4)).height)
    //document.querySelector("#plus").style.height = document.querySelector("#card-" + Math.floor(cards.length / 4)).style.height;

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
    return "<span class='badge' style='background-color: #" + rarity.color + "; color: #000000'>" + rarity.name + "</span>";
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
    xhr.open("GET", "https://api.lrojon.fr/cardmaker/class/get/all");
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
    xhr.open("GET", "https://api.lrojon.fr/cardmaker/rarity/get/all");
    //xhr.responseType = "json";
    xhr.onreadystatechange = function()
    {
        if(xhr.readyState == 4)
        {
            if(xhr.status == 200)
            {
                rarities = JSON.parse(xhr.responseText);

                //let ctx = document.querySelector("#rarity");
                let ctx2 = document.querySelector("#rarityModify");
                let ctx3 = document.querySelector("#raritySearch");

                let str = str2 = "";
                let str3 = "<option value='-1'>Rareté</option>"
                rarities.forEach(elem => {
                    //str += "<input type='radio' name='rarity' id='" + elem.id + "'><label for='" + elem.id + "' class='mr-1' style='background-color: #" + elem.color + "'></label>";
                    str2 += "<input type='radio' name='rarityModify' id='modify-" + elem.id + "'><label for='modify-" + elem.id + "' class='mr-1' style='background-color: #" + elem.color + "'></label>";
                    str3 += "<option value='" + elem.id + "'>" + elem.name + "</option>"
                })
                //ctx.innerHTML = str;
                ctx2.innerHTML = str2;
                ctx3.innerHTML = str3;
                //document.querySelector("input[name='rarity']").checked = true;
            }
        }
    }
    xhr.send();
}

function getGod()
{
    let xhr = new XMLHttpRequest();
    xhr.open("GET", "https://api.lrojon.fr/cardmaker/god/get/all");
    xhr.responseType = "json";
    xhr.onreadystatechange = function()
    {
        if(xhr.readyState == 4)
        {
            if(xhr.status == 200)
            {
                gods = xhr.response;
                let ctx = document.querySelector("#godModify");

                gods.forEach(elem => {
                    ctx.innerHTML += "<option value='" + elem.id + "'>" + elem.name + "</option>"
                })
            }
        }
    }
    xhr.send();
}

function setClasses()
{
    //let ctx = document.querySelector("#class");
    let ctx2 = document.querySelector("#classModify");
    let ctx3 = document.querySelector("#classSearch");

    classes.forEach(elem => {
        //ctx.innerHTML += "<option value='" + elem.id + "'>" + elem.name + "</option>"
        ctx2.innerHTML += "<option value='" + elem.id + "'>" + elem.name + "</option>"
        ctx3.innerHTML += "<option value='" + elem.id + "'>" + elem.name + "</option>"
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
    document.querySelector("#classModify").value = card.class.id;
    document.querySelector("#effectModify").value = card.effect;
    document.querySelector("#copyModify").value = card.copy;
    document.querySelector("#forModify").value = str;
    document.querySelector("#dexModify").value = dex;
    document.querySelector("#intModify").value = int;
    document.querySelector("input[name='rarityModify'][id='modify-" + card.rarity.id + "']").checked = true;
    $("#modifyModal").modal('toggle');
}

function addCard()
{

    let modal = document.querySelector("#cardModal");
    modal.classList.remove("border-dark", "border-danger", "border-success", "border-primary");
    modal.classList.add("border-dark");

    document.querySelector("#idModify").value = parseInt(cards[cards.length - 1].id) + 1;
    document.querySelector("#nameModify").value = "";
    document.querySelector("#costModify").value = 0;
    document.querySelector("#classModify").value = 1;
    document.querySelector("#effectModify").value = "";
    document.querySelector("#copyModify").value = 3;
    document.querySelector("#forModify").value = 0;
    document.querySelector("#dexModify").value = 0;
    document.querySelector("#intModify").value = 0;
    document.querySelector("input[name='rarityModify'][id='modify-1']").checked = true;
    $("#modifyModal").modal('toggle');
}

function sortByName(a, b)
{
    if (a.name == b.name) 
    {
        return 0;
    }
    return (a.name < b.name) ? -1 : 1;
}

function sortByStat(a, b)
{
    if(a.stat == b.stat)
    {
        return 0;
    }
    else if (a.stat == "ALL")
    {
        return -1;
    }
    else if (b.stat == "ALL")
    {
        return 1;
    }
    else if (a.stat == "INT")
    {
        return 1;
    }
    else if (b.stat == "INT")
    {
        return -1;
    }
    else if (a.stat=="FOR" && b.stat=="DEX")
    {
        return -1;
    }
    else if (a.stat=="DEX" && b.stat=="FOR")
    {
        return 1;
    }
}