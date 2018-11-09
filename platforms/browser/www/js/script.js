document.addEventListener('deviceready',onDeviceReady, false);
var watchID = null;
var arrLocations = [];
const DISTANCE = 100;
const TIMEOUT = 300000;
const INTERVAL = 5000;
var locationFunction;

function addDebug(msg) {
  document.getElementById("debugging").innerHTML += msg + '<br>';
}

function onDeviceReady() {
    console.log("Device Ready");
    addDebug("this is where the debugging data will go");
}

//get the current location of the device
function startRecording(){
  addDebug("Recording started");
  //Get the current location
  locationFunction = setInterval(startLocationRecording, INTERVAL);
}

function startLocationRecording(){
    watchID = navigator.geolocation.getCurrentPosition(onSuccess, onError, {timeout:TIMEOUT, enableHighAccuracy:true});
}

function stopRecording(){

  //Get the current location
  if(watchID !== null){
    navigator.geolocation.clearWatch(watchID);
    clearInterval(locationFunction);
  }
  addDebug("Recording stopped");
  addDebug("Total time is " + arrLocations[0].Time);
}

function onSuccess(position){

  let longitude = position.coords.longitude ;
  let latitude = position.coords.latitude;
  let time = position.timestamp;
  addPoint({Longitude:longitude,Latitude:latitude});
}

function addPoint(newLocation) {

  let exists = false;
  //check if point already exists
  arrLocations.forEach(function (arrItem, index) {
    if(distance(newLocation, arrItem.Location) < DISTANCE && !exists) {
      // if it exists update time
      addDebug("Adding point less than distance");
      arrLocations[index].Time += INTERVAL / 1000;
      exists = true;
      addDebug("Time updated");
    }
  });

  //if not add the location with new time
  if(!exists) {
    addDebug("Adding new point");
    arrLocations.push({Location:newLocation,Time:INTERVAL/1000});
  }
}

function distance(p1 , p2){
  //addDebug("Point 1 = " + p1.Longitude + " " + p2.Latitude);
  //  addDebug("Point 2 = " + p2.Longitude + " " + p2.Latitude);
  let d = getDistanceFromLatLonInKm(p1.Latitude,p1.Longitude,p2.Latitude,p2.Longitude);
  addDebug("Distance Calculated = " + d);
    return d;
}

function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1);
  var a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ;
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI/180)
}


function onError(){
  addDebug("Error getting the location");
}

//see if the location is within 50 meters of the last locations

//if yes, add to the current time of the location

// if not create a new location and start a new time
