fill();
getClasses();

function fill()
{
    let xhr = new XMLHttpRequest();
    xhr.open("GET", "http://card.alwaysdata.net/api/getCards.php");
    xhr.responseType = "json";
    xhr.onreadystatechange = function(){
        console.log(xhr.readyState);
        if(xhr.readyState == 4)
        {
            if(xhr.status == 200)
            {
                console.log(xhr.response)
                display(xhr.response);
            }
        }
    }
    xhr.send();
}