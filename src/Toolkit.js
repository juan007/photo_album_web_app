// randomly generates a number between the range of low and high
function getRandom(low = 1, high = 10) {
    let randomNumber;
    // calculate random number
    randomNumber = Math.round(Math.random() * (high - low)) + low;
    // returning value
    return randomNumber;
}

function addKey(functionToCall, myCode = "Enter") {
    document.addEventListener("keydown", (e) => {
        // is the key released the specified key?
        if (e.code === myCode) {
            // pressing the enter key will force some browsers to refresh
            // this command stops the event from going further
            e.preventDefault();
            // call provided callback to do everything else that needs to be done
            functionToCall();
            // this also helps the event from propagating in some browsers
            return false;
        }
    });
}

function getXMLData(retrieveScript, success, failure) {
    // send out AJAX request
    let xhr = new XMLHttpRequest();
    xhr.addEventListener("load", (e) => {
        // has the response been received successfully?
        if (xhr.status == 200) {
            // data retrieved - call success method and pass along XML object response
            success(xhr.responseXML);
        } else {
            failure();
        }
    });
    xhr.addEventListener("error", (e) => {
        failure();
    });
    xhr.open("GET", retrieveScript, true);
    xhr.send();
}

function sendJSONData(sendScript, sendString, success, failure) {
    // send out AJAX request
    let xhr = new XMLHttpRequest();
    xhr.addEventListener("load", (e) => {
        // has the response been received successfully?
        if (xhr.status == 200) {
            // data retrieved - call success method and pass along received text
            success(xhr.responseText);
        } else {
            failure();
        }
    });
    xhr.addEventListener("error", (e) => {
        failure();
    });
    xhr.open("POST", sendScript, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(sendString);
}

//APPROACH I
/*
function getJSONData(retrieveScript, success, failure) {
    // send out AJAX request
    let xhr = new XMLHttpRequest();
    xhr.addEventListener("load", (e) => {
        // has the response been received successfully?
        if (xhr.status == 200) {
            // data retrieved - call success method and pass along the JSON data
            //Takes the response as a string
            success(JSON.parse(xhr.responseText));
        } else {
            failure();
        }
    });
    xhr.addEventListener("error", (e) => {
        failure();
    });
    xhr.open("GET", retrieveScript, true);
    xhr.send();
}
*/

function getJSONData(retrieveScript, success, failure) {
    //function that returns the promise object
    //has an event method (then()) that will run anonymous function when promise is fulfilled, this function 
    //has a parameter of the response, it represents the response but it is not the data
    //the then has a promise that has default function catch
    /*//APPROACH 1
    fetch(retrieveScript)
        .then(function(response){
            console.log(response);
            //json method inside response
            //this is asynchronous so app can do another things
            //it triggers the new then and passes on the jsonData
            return response.json();
        }).then(function(jsonData){
            success(jsonData);
        })
        .catch(function(){
            failure();
        }); */
        
        fetch(retrieveScript)
            .then(response => response.json())
            .then(jsonData => success(jsonData))
            .catch((error) => {
                console.log(error);
                failure();
            });

}

export { getRandom, addKey, getXMLData, sendJSONData, getJSONData };