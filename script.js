var apiKey = "6484e3d5491d7a652c7ff822583704cc"
var cityList = $("#city-list");
var cities = [];
var cityName ;
var weatherSearch = "https://api.openweathermap.org/data/2.5/weather?q="+cityName+ "&appid=" + apiKey

function dayFormat (date){
var date = new Date ();
var month = date.getMonth()+1;
var day = date.getDay();
// var outputDay = date.getFullYear() + '/' + (month<10 ? '0' : '') + month + '/' + (day<110 ? '0' : '')
var outputDay = date.getFullYear() + '/' + (month<10 ? '0' : '') + month + '/' + (day<10 ? '0' : '') + day;
return outputDay;
}
init();

function init(){
var storedCities = JSON.parse(localStorage.getItem("cities))"));
    if (storedCities !== null){
        cities = storedCities;
    }
renderCities();

}


function storeCities(){
localStorage.setItem("cities", JSON.stringify(cities));
}

function renderCities() {
cityList.empty();

for (var i = 0; i < cities.length; i++) {
  var city = cities[i];
  
  var li = $("<li>").text(city);
  li.attr("id","listC");
  li.attr("data-city", city);
  li.attr("class", "list-group-item");
  cityList.prepend(li);
}

if (!city){
    return
} 
else{
    getResponseWeather(city)
};
}   
$("#add-city").on("click", function(event){
  event.preventDefault();
var city = $("#city-input").val().trim();

if (city === "") {
    return;
}

cities.push(city);

storeCities();
renderCities();
});

function getResponseWeather(cityName){
var weatherSearch = "https://api.openweathermap.org/data/2.5/weather?q=" +cityName+ "&appid=" + apiKey; 


$("#today-weather").empty();
$.ajax({
  url: weatherSearch,
  method: "GET"
}).then(function(response) {
    

  cityTitle = $("<h3>").text(response.name + " "+ dayFormat());
  $("#today-weather").append(cityTitle);
  var temperatureToNum = parseInt((response.main.temp)* 9/5 - 459);
  var cityTemperature = $("<p>").text("Temperature: "+ temperatureToNum + " °F");
  $("#today-weather").append(cityTemperature);
  var cityHumidity = $("<p>").text("Humidity: "+ response.main.humidity + " %");
  $("#today-weather").append(cityHumidity);
  var cityWindSpeed = $("<p>").text("Wind Speed: "+ response.wind.speed + " MPH");
  $("#today-weather").append(cityWindSpeed);
  var CoordLon = response.coord.lon;
  var CoordLat = response.coord.lat;


    var weatherSearch2 = "https://api.openweathermap.org/data/2.5/uvi?appid="+ apiKey+ "&lat=" + CoordLat +"&lon=" + CoordLon;
    $.ajax({
        url: weatherSearch2,
        method: "GET"
    }).then(function(responseuv) {
        var cityUV = $("<span>").text(responseuv.value);
        var cityUVp = $("<p>").text("UV Index: ");
        cityUVp.append(cityUV);
        $("#today-weather").append(cityUVp);
        console.log(typeof responseuv.value);
        if(responseuv.value > 0 && responseuv.value <=2){
            cityUV.attr("class","green")
        }
        else if (responseuv.value > 2 && responseuv.value <= 5){
            cityUV.attr("class","yellow")
        }
        else if (responseuv.value >5 && responseuv.value <= 7){
            cityUV.attr("class","orange")
        }
        else if (responseuv.value >7 && responseuv.value <= 10){
            cityUV.attr("class","red")
        }
        else{
            cityUV.attr("class","purple")
        }
    });

    
    var weatherSearch3 = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&appid=" + apiKey;
        $.ajax({
        url: weatherSearch3,
        method: "GET"
    }).then(function(responseFiveDay) { 
        $("#boxes").empty();
        console.log(responseFiveDay);
        for(var i=0, j=0; j<=5; i=i+6){
            var read_date = responseFiveDay.list[i].dt;
            if(responseFiveDay.list[i].dt != responseFiveDay.list[i+1].dt){
                var fiveDayDiv = $("<div>");
                fiveDayDiv.attr("class","col-3 m-2 bg-primary")
                var d = new Date(0);
                d.setUTCSeconds(read_date);
                var date = d;
                console.log(date);
                var month = date.getMonth()+1;
                var day = date.getDate();
                var dayOutput = date.getFullYear() + '/' + (month<10 ? '0' : '') + month + '/' + (day<10 ? '0' : '') + day;
                var fiveDayh4 = $("<h6>").text(dayOutput);
                var imgTag = $("<img>");
                var skyConditions = responseFiveDay.list[i].weather[0].main;
                if(skyConditions==="Clouds"){
                    imgTag.attr("src", "https://icons.iconarchive.com/icons/large-icons/large-weather/64/partly-cloudy-day-icon.png")
                } else if(skyConditions==="Clear"){
                    imgTag.attr("src", "https://icons.iconarchive.com/icons/icons-land/weather/64/Sunny-icon.png")
                }else if(skyConditions==="Rain"){
                    imgTag.attr("src", "https://icons.iconarchive.com/icons/large-icons/large-weather/64/rain-icon.png")
                }else if(skyConditions==="Snow"){
                    imgTag.attr("src", "https://icons.iconarchive.com/icons/large-icons/large-weather/64/sleet-icon.png")
                }else if(skyConditions==="Thunderstorm"){
                    imgTag.attr("src", "https://icons.iconarchive.com/icons/large-icons/large-weather/64/thunder-icon.png")
                }

                var pTemperatureK = responseFiveDay.list[i].main.temp;
                console.log(skyConditions);
                var temperatureToNum = parseInt((pTemperatureK)* 9/5 - 459);
                var pTemperature = $("<p>").text("Temperature: "+ temperatureToNum + " °F");
                var pHumidity = $("<p>").text("Humidity: "+ responseFiveDay.list[i].main.humidity + " %");
                fiveDayDiv.append(fiveDayh4);
                fiveDayDiv.append(imgTag);
                fiveDayDiv.append(pTemperature);
                fiveDayDiv.append(pHumidity);
                $("#boxes").append(fiveDayDiv);
                console.log(responseFiveDay);
                j++;
            }
    }
  });
 });
}

$(document).on("click", "#listC", function() {
var thisCity = $(this).attr("data-city");
getResponseWeather(thisCity);
});
