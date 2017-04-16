// Weather Extension by DynamicRemo https://github.com/DynamicRemo/.

var temp;
var tempScale;
var loc;
var icon;
var humidity;
var wind;
var APPID = "410bb4c7de22ca030abef4143a4f6069";
var changeCandF = 1;

document.addEventListener('DOMContentLoaded', function() {

    temp = document.getElementById("temperature");
    tempScale = document.getElementById("temperatureScale");
    loc = document.getElementById("location");
    icon = document.getElementById("icon");
    humidity = document.getElementById("humidity");
    wind = document.getElementById("wind");

    if(navigator.geolocation){
        fetchLonLat();
    } else {
        alert("Your current Location is required!");
    }

    var temperatureScale = document.getElementById('temperatureScale');
    temperatureScale.addEventListener('click', function() {
        changeTemperatureScale();
    });
});

/**
 * Get the user's current Location (Latitude, Longitude) fetched via HTML5 Geolocation API.
 * Called when the Extension icon is clicked or toggle between the Units
 */
function fetchLonLat(){
    var showPosition = function(position){
        document.getElementById("lonlat").innerHTML = position.coords.latitude.toFixed(5) + ", " + position.coords.longitude.toFixed(5);
        updateByGeo(position.coords.latitude, position.coords.longitude);
    }
    navigator.geolocation.getCurrentPosition(showPosition);
}

/**
 * Url creation for API Call
 * @param latitude and longitude of user's location.
 */
function updateByGeo(lat, lon){
    var url = "http://api.openweathermap.org/data/2.5/weather?" +
    "lat=" + lat +
    "&lon=" + lon +
    "&APPID=" + APPID;
    console.log("Url: " + url);
    sendRequest(url);    
}

/**
 * Makes XML Http Request to the API.
 * @param url based on user's location.
 */
function sendRequest(url){
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if(xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            var data = JSON.parse(xmlhttp.responseText);
            console.log(xmlhttp.responseText);

            var weather = {};
            weather.code = data.weather[0].icon;
            weather.humidity = data.main.humidity;
            weather.wind = (data.wind.speed*60*60/1000).toFixed(2); // its in meter/sec so the convertion is to kilometer/hour and limit to two decimal places
            weather.location = data.name;
            weather.temp = changeCandF ? K2C(data.main.temp) : K2F(data.main.temp); 
            update(weather);
        }
    };

    xmlhttp.open("GET", url, true);
    xmlhttp.send();    
}

/**
 * Updates the UI.
 * @param weather Object, containing all the data fetched via API.
 */
function update(weather) {
    console.log("Weather");    
    console.log(weather);    

    icon.src = "http://openweathermap.org/img/w/" + weather.code + ".png"
    humidity.innerHTML = weather.humidity;
    wind.innerHTML = weather.wind;
    loc.innerHTML = weather.location;
    temp.innerHTML = weather.temp + "&deg;" + (changeCandF ? 'C' : 'F');
    tempScale.innerHTML = changeCandF ? 'F' : 'C';
}

/**
 * Toggle between the unit, Celcius and Fahrenheit.
 */
function changeTemperatureScale(){
    fetchLonLat();
    changeCandF = changeCandF ? 0 : 1;
}

/**
 * Converts Kelvint to Fahrenheit.
 * @param temperature kelvin, its the default data/unit fetched via API.
 */
function K2F(k){
    return Math.round(k*(9/5)-459.67);
}

/**
 * Converts Kelvint to Celcius.
 * @param temperature kelvin, its the default data/unit fetched via API.
 */function K2C(k){
    return Math.round(k - 273.15);
}
