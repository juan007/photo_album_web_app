// importing the sass stylesheet for bundling
import "./../sass/styles.scss";

//import the method from Tollkit to get JSONData
import { sendJSONData, getJSONData } from "./Toolkit";

// API URLS
let RETREIVE_SCRIPT = "https://www.seanmorrow.ca/_lessons/albumRetrieve.php?id=w0458041&count=5";
let SUBMIT_SCRIPT = "https://www.seanmorrow.ca/_lessons/albumAddComment.php?id=w0458041";

//Variable that saves current photo id
let current_photo = 1;

//valriable that saves all the json data
let json;

//variable that saves the number of images retreived
let imgCount;

//declare buttons
let btnPrevious;
let btnNext;
let btnJump;
let btnComment;

//declare other elements
let photo;
let photo_title;
let photo_caption;
let photo_number;
//private methods
function loadImage(position)
{
    position -= 1;
    console.log("position-" + position + " count" + imgCount );
    if (position == 0)
    {
        btnPrevious.disabled = true;
    } else if ((position+1) == imgCount)
    {
        btnNext.disabled = true;
    }
    
    photo.src = "images/" + json.photos[position].source;
    photo_title.innerHTML = json.photos[position].title;
    photo_caption.innerHTML = json.photos[position].caption;
    photo_number.innerHTML = "Photo " + current_photo + " of " + imgCount;
}

//-------------------------------------------------Event Handlers
//when next button is clicked
function onNext(e)
{
        current_photo +=1;
        loadImage(current_photo);
        btnPrevious.disabled = false;
}

//when previous button is clicked
function onPrevious(e)
{
    current_photo -=1;
    loadImage(current_photo);
    btnNext.disabled = false;
}

function onSubmit(e)
{
    //package data as JSON
    let sendJSON = 
    {
        "photoId": json.photos[current_photo-1].id,
        "author": document.getElementById("txtAuthor").value,
        "comment": document.getElementById("txtComment").value
    };

    //serelization.-convert the JSON object to a string 
    let sendString = JSON.stringify(sendJSON);
    //send the JSON data to the WEb API
    sendJSONData(SUBMIT_SCRIPT,sendString, onSubmitResponse, onSubmitError);

}

function onCancel(e)
{
    console.log("OnCancel");
    document.querySelector("#txtAuthor").value = "";
    document.querySelector("#txtComment").value = "";
}

function onSubmitResponse(responseText) 
{
    document.querySelector("#txtAuthor").value = "";
    document.querySelector("#txtComment").value = "";
}
   
function onSubmitError() 
{
       console.log("Error an issue occurrred with AJAX data transmission")
}

function onResponse(result)
{
    
    json = result;
    console.log("My Json:" + json);
    imgCount = json.photos.length;

    
    //if there are phots
    if(imgCount > 0)
    {
        //load first photo
        loadImage(current_photo);
        photo_number.innerHTML = "Photo " + current_photo + " of " + imgCount;
    }
    else
    {
        console.log("NO IMAGES RETREIVED");
    }
    
    console.log(result);
}
function onError()
{
    console.log("*** Error has occured during AJAX data transmissionsssss");
}

// ----------------------------------------------- main method
function main() 
{
    //call function from toolkit to retreive JSON data
    getJSONData(RETREIVE_SCRIPT,onResponse, onError);
    
    //NEXT
    btnNext = document.querySelector("#btnNext");
    btnNext.addEventListener("click",onNext);

    //PREVIOUS
    btnPrevious = document.querySelector("#btnPrevious");
    btnPrevious.addEventListener("click",onPrevious);

    //elements
    photo = document.querySelector(".imgcontainer__img");
    photo_title = document.querySelector(".imginfo__title");
    photo_caption = document.querySelector(".imginfo__caption");
    photo_number = document.querySelector(".nav__photonumber");

    //OK - CANCEL
    let btnOK = document.querySelector("#btnSubmit");
    btnOK.addEventListener("click",onSubmit);
    
    let btnCancel = document.querySelector("#btnCancel");
    btnCancel.addEventListener("click", onCancel);
}

main();