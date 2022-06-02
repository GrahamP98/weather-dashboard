function init() {
    // const are constants so they dont change, var are variables so they do change and these are declared globally, let limits the scope to a block statement or expression that its used with.
    const cityEl = document.getElementById("city");
    const searchEl = document.getElementById("search");
    const clearEl = document.getElementById("clear-history");
    const nameEl = document.getElementById("city-name");
    const rPicEl = document.getElementById("R-pic");
    const rTempEl = document.getElementById("temperature");
    const rUVEl = document.getElementById("UV-index");
    const rHumEl = document.getElementById("humidity");
    const rWindEl = document.getElementById("wind-speed");
    const histEl = document.getElementById("history");
    var rweatherEl = document.getElementById("today-weather");
    var fiveEl = document.getElementById("fiveday");
    var title = document.getElementById("title");
    let searchHistory = JSON.parse(localStorage.getItem("search")) || [];

    // api key given by openweathermap.org
    const APIKey = "894f693d596b9da3794a39bff8c376ca";

    // leverages the one call api from openweathermap.org and moment.js to input the current cooresponding data 
    function receiveWeather(cityName) {
        let queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + APIKey + "&units=imperial";
        axios.get(queryURL)
            .then(function (response) {
                console.log(receiveWeather);

                rweatherEl.classList.remove("d-none")

                // displays current weather
                var Kityname = response.data.name;
                const rDate = new Date(response.data.dt * 1000);
                const day = rDate.getDate();
                const month = rDate.getMonth();
                const year = rDate.getFullYear();
                nameEl.innerHTML = response.data.name + " (" + month + "/" + day + "/" + year + ") ";
                let weatherPic = response.data.weather[0].icon;
                rPicEl.setAttribute("src", "https://openweathermap.org/img/wn/" + weatherPic + "@2x.png");
                rPicEl.setAttribute("alt", response.data.weather[0].description);
                rTempEl.innerHTML = "Temperature: " + response.data.main.temp + " &#176F";
                rHumEl.innerHTML = "Humidity: " + response.data.main.humidity + "%";
                rWindEl.innerHTML = "Wind Speed: " + response.data.wind.speed + " MPH";

                // get request for UV index
                let lat = response.data.coord.lat;
                let lon = response.data.coord.lon;
                let UVQueryURL = "https://api.openweathermap.org/data/2.5/uvi/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + APIKey + "&cnt=1";
                axios.get(UVQueryURL)
                    .then(function (response) {
                        let UVIndex = document.createElement("span");

                        title.innerHTML = Kityname;

                        if (response.data[0].value < 4) {
                            UVIndex.setAttribute("class", "badge badge-success");
                        }
                        else if (response.data[0].value < 8) {
                            UVIndex.setAttribute("class", "badge badge-warning");
                        }
                        else {
                            UVIndex.setAttribute("class", "badge badge-danger");
                        }
                        UVIndex.innerHTML = response.data[0].value;
                        rUVEl.innerHTML = "UV Index: ";
                        rUVEl.append(UVIndex);
                    });

                // Gets 5 day forecast for the selected city
                let cityID = response.data.id;
                let forecastQueryURL = "https://api.openweathermap.org/data/2.5/forecast?id=" + cityID + "&appid=" + APIKey + "&units=imperial";
                axios.get(forecastQueryURL)
                    .then(function (response) {
                        fiveEl.classList.remove("d-none");

                        // displays forecast for next 5 days
                        const forecastEl = document.querySelectorAll(".forecast");
                        for (i = 0; i < forecastEl.length; i++) {
                            forecastEl[i].innerHTML = "";
                            const forecastIndex = i * 8 + 4;
                            const forecastDate = new Date(response.data.list[forecastIndex].dt * 1000);
                            const forecastDay = forecastDate.getDate();
                            const forecastMonth = forecastDate.getMonth();
                            const forecastYear = forecastDate.getFullYear();
                            const forecastDateEl = document.createElement("p");
                            forecastDateEl.setAttribute("class", "mt-3 mb-0 forecast-date");
                            forecastDateEl.innerHTML = forecastMonth + "/" + forecastDay + "/" + forecastYear;
                            forecastEl[i].append(forecastDateEl);
                            // ! //
                            // let lat = response.data.coord.lat;
                            // let lon = response.data.coord.lon;
                            // let UVQueryURL = "https://api.openweathermap.org/data/2.5/uvi/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + APIKey + "&cnt=1";
                            // ! //
                            //determines image for current weather
                            const forecastWeatherEl = document.createElement("img");
                            forecastWeatherEl.setAttribute("src", "https://openweathermap.org/img/wn/" + response.data.list[forecastIndex].weather[0].icon + "@2x.png");
                            forecastWeatherEl.setAttribute("alt", response.data.list[forecastIndex].weather[0].description);
                            forecastEl[i].append(forecastWeatherEl);
                            const forecastTempEl = document.createElement("p");
                            forecastTempEl.innerHTML = "Temp: " + response.data.list[forecastIndex].main.temp + "&#176F";
                            forecastEl[i].append(forecastTempEl);
                            const forecastHumidityEl = document.createElement("p");
                            forecastHumidityEl.innerHTML = "Humidity: " + response.data.list[forecastIndex].main.humidity + "%";
                            forecastEl[i].append(forecastHumidityEl);
                            const forecastWindspeedEl = document.createElement("p");
                            forecastWindspeedEl.innerHTML = "Wind Speed: " + response.data.list[forecastIndex].wind.speed + " MPH";
                            forecastEl[i].append(forecastWindspeedEl);
                            // ! //
                            // const forecastUVIndexEl = document.createElement("p");
                            // forecastUVIndexEl.innerHTML = "UV Index: " + response.data[forecastIndex].value;
                            // forecastEl[i].append(forecastUVIndexEl);
                            // ! //
                        }
                    })
            });
    }

    //LISTENS FOR CLICK ON search button, saves the search to local storage as a string.
    searchEl.addEventListener("click", function () {
        const searchTerm = cityEl.value;
        receiveWeather(searchTerm);
        searchHistory.push(searchTerm);
        localStorage.setItem("search", JSON.stringify(searchHistory));
        loadSearchHistory();
    })
    //listens for click on clear button, clears saved data.
    clearEl.addEventListener("click", function () {
        localStorage.clear();
        searchHistory = [];
        loadSearchHistory();
    })
    //keeps search history even when page is refreshed
    function loadSearchHistory() {
        histEl.innerHTML = "";
        for (let i = 0; i < searchHistory.length; i++) {
            const histElItem = document.createElement("input");
            histElItem.setAttribute("type", "text");
            histElItem.setAttribute("readonly", true);
            histElItem.setAttribute("class", "form-control d-block");
            histElItem.setAttribute("value", searchHistory[i]);
            histElItem.addEventListener("click", function () {
                receiveWeather(histElItem.value);
            })
            histEl.append(histElItem);
        }
    }
    //runs loadsearchhistory function if there is more than 0 as its length("searches")
    loadSearchHistory();
    if (searchHistory.length > 0) {
        receiveWeather(searchHistory[searchHistory.length - 1]);
    }

}

init();