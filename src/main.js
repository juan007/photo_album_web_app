//TO DO
//make responsive
//images wait load feature
//fix disabled next previous when pressing 1st thumbnail and then last thumbnail and viceversa
//fix when I press thumbnails and press next it stays on loading overlay
//fix when I comment it stays on loading overlay
//control number of characterss - validation change border  


// importing the sass stylesheet for bundling
import "./../sass/styles.scss";

//import the method from Tollkit to get JSONData
import { sendJSONData, getJSONData } from "./Toolkit";

// importing spinner.js
import { Spinner } from "spin.js";

// API URLS
let RETREIVE_SCRIPT = "https://www.seanmorrow.ca/_lessons/albumRetrieve.php?id=w0458041&count=8";
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


//space to output comments
let output;

//space to output thumbnails
let thumbnailOutput;

//declare other elements
let photo;
let photo_title;
let photo_caption;
let photo_number;

// construct Spinner object
let loadingOverlay;
let spinner = new Spinner({ color: '#FFFFFF', lines: 12 }).spin(document.querySelector(".loading-overlay"));

//---------------------------------------------private methods
function loadImage(position)
{

    position -= 1;
    if (position == 0)
    {
        btnPrevious.disabled = true;
        btnPrevious.style.backgroundColor = "gray";
    } else if ((position+1) == imgCount)
    {
        btnNext.disabled = true;
        btnNext.style.backgroundColor = "gray";
    }
    
    photo.src = "images/" + json.photos[position].source;
    photo_title.innerHTML = json.photos[position].title;
    photo_caption.innerHTML = json.photos[position].caption;
    photo_number.innerHTML = "Photo " + current_photo + " of " + imgCount;
    
    
    // clear out the target div 
    output.innerHTML = ""; 
    
    for (let mycomment of json.photos[position].comments)
    {
    
        console.log(mycomment);
        // clone the comment template 
        let commentTemplate = document.getElementById("commentTemplate"); 
        let commentNode = commentTemplate.cloneNode(true); 

        //object destructing to get all the property values
        let {comment,author} = mycomment;
        //load comments
        commentNode.querySelectorAll("div")[0].innerHTML = `<br>Submitted by: ${author}<br>`;
        commentNode.querySelectorAll("div")[1].innerHTML = `>${comment}`; 

        // make orderNode visible now that it is populated 
        commentNode.style.display = "block"; 
        // append the orderNode to the #output div 
        output.appendChild(commentNode);
    }
}

//function that loads all the thumbnails in the output
function loadThumbnails()
{
    // clear out the target div 
    thumbnailOutput.innerHTML = ""; 

    let counter = 1;
    for (let photo of json.photos)
    {
        // clone the comment template 
        let thumbnailTemplate = document.getElementById("thumbnailTemplate"); 
        let thumbnailNode = thumbnailTemplate.cloneNode(true); 
        //object destructing to get all the property values
        let {id,title,caption,source,comments} = photo;
        
        //load photo
        thumbnailNode.querySelectorAll("img")[0].src = `images/mini_${source}`;
        
        //add id so that event handler nows what photo to call
        thumbnailNode.querySelectorAll("img")[0].id = counter;
        
        //add event lisner to each photo
        thumbnailNode.addEventListener("click",onClickThumbnail);
        // make orderNode visible now that it is populated 
        thumbnailNode.style.display = "block"; 
        // append the orderNode to the #output div 
        thumbnailOutput.appendChild(thumbnailNode);
        counter += 1;
    }
   
}

function toggleOverlay() {
    loadingOverlay.style.display = ((loadingOverlay.style.display == "block") ? "none" : "block");
}

function toggleJump() 
{
    document.querySelector(".thumbnail-content").style.display = ((document.querySelector(".thumbnail-content").style.display == "block") ? "none" : "block");
}

function toggleComment() 
{
    document.querySelector(".form").style.display = ((document.querySelector(".form").style.display == "block") ? "none" : "block");
}


//-------------------------------------------------Event Handlers
//when tunmbnail

function onClickThumbnail(e)
{
    
    
    current_photo = e.target.id;
    if(current_photo != imgCount && current_photo!=1)
    {
        btnPrevious.disabled = false;
        btnNext.disabled = false;
        
        btnPrevious.style.backgroundColor = "#76abd8";
        btnNext.style.backgroundColor = "#76abd8";
    }


    
    loadImage(current_photo);
}


//when next button is clicked
function onNext(e)
{
        toggleOverlay();
        current_photo +=1;
        //call function from toolkit to retreive JSON data
        getJSONData(RETREIVE_SCRIPT,onResponse, onError);

        btnPrevious.disabled = false;
        btnPrevious.style.backgroundColor = "#76abd8";
}

//when previous button is clicked
function onPrevious(e)
{
    toggleOverlay();
    current_photo -=1;
    
    //call function from toolkit to retreive JSON data
    getJSONData(RETREIVE_SCRIPT,onResponse, onError);
    
    btnNext.disabled = false;
    btnNext.style.backgroundColor = "#76abd8";
    
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
    toggleOverlay();
    document.querySelector("#txtAuthor").value = "";
    document.querySelector("#txtComment").value = "";

    //call function from toolkit to retreive JSON data
    getJSONData(RETREIVE_SCRIPT,onResponse, onError);
}
   
function onSubmitError() 
{
       console.log("Error an issue occurrred with AJAX data transmission")
}

function onResponse(result)
{
    
    json = result;
    imgCount = json.photos.length;

    //if there are phots
    if(imgCount > 0)
    {
        //load first photo
        loadImage(current_photo);
        photo_number.innerHTML = "Photo " + current_photo + " of " + imgCount;

        //output thumbnails
        loadThumbnails();

        toggleOverlay();
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
    loadingOverlay = document.querySelector(".loading-overlay");

    toggleOverlay();

    //outputs for templates
    output = document.querySelector(".content__comments");
    thumbnailOutput = document.querySelector(".thumbnail-content__thumbnails");
    //call function from toolkit to retreive JSON data
    getJSONData(RETREIVE_SCRIPT,onResponse, onError);

    //output thumbnails
    //loadThumbnails();
    
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

    //Jump - Comment
    let btnJump = document.getElementById("btnJump");
    btnJump.addEventListener("click",toggleJump);
    let btnComment = document.getElementById("btnComment");
    btnComment.addEventListener("click",toggleComment);

}

main();