var locationInputEl = document.querySelector("#location-input");
var locationSearchEl = document.querySelector("#location-search");
var savedLocationEl = document.querySelector("#saved-locations");
var clearSaveEl = document.querySelector("#clear-btn");
var savedLocationButton = document.querySelector("#location-btn");
var currentTemp = document.querySelector("#current-temp");
var currentWindSpeed = document.querySelector("#current-wind-speed");
var currentHumidity = document.querySelector("#current-humidity");
var currentUvii = document.querySelector("#current-uvi");
var currentWeather = document.querySelector("#current-weather");
var locationHeader = document.querySelector("#location-header");
var locationHeaderText = "";
var uviContainer = document.querySelector("#uvi-container")
var currentIcon = document.querySelector("#current-icon");
var today = moment().format("MM/DD/YYYY");
var forcastContainer = document.querySelector("#five-day-forcast");

var inputSubmitHandler = function (event) {
    event.preventDefault();

    var location = locationInputEl.value.trim();

    locationHeaderText = location;

    if (location === "") {

        alert("Please Enter a Location")
        return
    } else {
        getCoordinates(location);
        getSavedLocations(location)
        locationInputEl.value = "";
    }
}

var getCoordinates = function (location) {
    var geoUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + location + "&appid=e4ce337903ea46db19af420b2a3172c2";

    fetch(geoUrl).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                var longitude = data.coord.lon;
                var lattitude = data.coord.lat;

                getWeather(longitude, lattitude, location);
            })
        } else {
            alert("Error: " + response.statusText);
        }
    })
        .catch(function (error) {
            alert("Unable to get coordinates!")
        })
};

var getSavedLocations = function (location) {
    var storage = JSON.parse(localStorage.getItem("saved-location"));

    if (storage === null) {
        storage = [];
    }
    storage.push(location)
    localStorage.setItem('saved-location', JSON.stringify(storage))
    showSavedLocations()
};

var showSavedLocations = function () {
    savedLocationEl.textContent = ''
    var storage = JSON.parse(localStorage.getItem("saved-location"));

    if (storage === null) {
        savedLocationEl.textContent = 'No Search History'
    } else {
        savedLocationEl.textContent = ''
        for (var i = 0; i < storage.length; i++) {
            var savedLocationBtn = document.createElement("button");
            savedLocationBtn.classList = "btn btn-lg btn-secondary col-12 text-light rounded my-1"
            savedLocationBtn.textContent = storage[i];
            savedLocationBtn.id = "location-btn";
    
            savedLocationEl.appendChild(savedLocationBtn);
        };
    }

};

var clearLocal = function (e) {
    e.preventDefault()
    localStorage.clear();
    showSavedLocations()
};

var locationBtn = function (event) {
    var location = event.target.textContent.trim();
    locationHeaderText = location;
    getCoordinates(location);
}

var getWeather = function (lattitude, longitude) {
    var weatherUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + longitude + "&lon=" + lattitude + "&units=imperial&appid=b4244de90737a4373c50c23818932a79"

    fetch(weatherUrl).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                currentWeather(data);
                fiveDay(data);
            })
        } else {
            alert("Error: " + response.statusText);
        }
    })
        .catch(function (error) {
            alert("Cannot Connect to Open Weather Server!")
        });
};

var currentWeather = function (data) {
    var currentTemp = data.current.temp;
    var currentWind = data.current.wind_speed;
    var currentHumidity = data.current.humidity;
    var currentUvi = data.current.uvi;
    var icon = data.current.weather[0].icon;

    currentWeather.classList = "col-12  border border-2 border-dark my-3 justify-content-center"
    currentTemp.textContent = "Temp: " + currentTemp + " °F";
    currentWindSpeed.textContent = "Wind: " + currentWind + " MPH";
    currentHumidity.textContent = "Humidity: " + currentHumidity + "%";
    currentUvii.textContent = "Uv Index: ";
    uviContainer.textContent = currentUvi;
    uviContainer.classList = "text-light fw-bold rounded d-flex justify-content-center align-items-center px-2 m-2";
    locationHeader.textContent = locationHeaderText + "  (" + today + ")";
    currentIcon.setAttribute("src", "http://openweathermap.org/img/wn/" + icon + ".png");

    if (currentUvi < 3) {
        uviContainer.classList.add("bg-success");
    } else if (currentUvi >= 3 && currentUvi < 6) {
        uviContainer.classList.add("bg-warning");
    } else {
        uvContainer.classList.add("bg-danger");
    }
}

var fiveDay = function (data) {
    while (forcastContainer.firstChild) {
        var div = document.querySelector("#day-weather");
        forcastContainer.removeChild(div);
    };

    var fiveDayHeader = document.querySelector("#five-day-forcast-content");
    fiveDayHeader.textContent = "5-Day Forecast:"


    for (var i = 1; i < 6; i++) {
        var forcastTemp = data.daily[i].temp.day;
        var forcastWind = data.daily[i].wind_speed;
        var forcastHumidity = data.daily[i].humidity;
        var forcastIcon = data.daily[i].weather[0].icon;
        var forecastDate = data.daily[i].dt;
        var dayContainer = document.createElement("div");
        dayContainer.id = "day-weather"

        forcastContainer.appendChild(dayContainer);

        var daysDate = moment.unix(forecastDate).format("MM/DD/YY");

        dayContainer.classList = "text-white bg-primary col-lg-2 col-md-2 col-sm-8 py-2 px-2 my-1 mx-1 flex-fill"

        var dateHeader = document.createElement("h5");
        dateHeader.classList = "fw-bold fs-md-6";
        dateHeader.textContent = daysDate;
        dayContainer.appendChild(dateHeader);

        var dailyIcon = document.createElement("img");
        dailyIcon.setAttribute("src", "http://openweathermap.org/img/wn/" + forcastIcon + ".png");
        dayContainer.appendChild(dailyIcon);

        var dailyTemp = document.createElement("h6");
        dailyTemp.textContent = "Temp: " + forcastTemp + " °F";
        dayContainer.appendChild(dailyTemp);

        var dailyWind = document.createElement("h6");
        dailyWind.textContent = "Wind: " + forcastWind + " MPH";
        dayContainer.appendChild(dailyWind);

        var dailyHumidity = document.createElement("h6");
        dailyHumidity.textContent = "Humidity: " + forcastHumidity + "%"
        dayContainer.appendChild(dailyHumidity);
    }
};

locationSearchEl.addEventListener('submit', inputSubmitHandler)
clearSaveEl.addEventListener('click', clearLocal)
savedLocationEl.addEventListener('click', locationBtn);
showSavedLocations();