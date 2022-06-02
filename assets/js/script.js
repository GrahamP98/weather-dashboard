function init() {
    //const are constants so they dont change, var are variables so they do change and are declared globally, let limits the scope to a block statement or expression that its used with.
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


    const APIKey = "894f693d596b9da3794a39bff8c376ca";

    function receiveWeather(cityName) {
        let queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + APIKey; //+ "&units=imperial";
        axios.get(queryURL)  
        .then(function(response){

            rweatherEl.classList.remove("d-none")
            var Kityname = response.data.name;
            const rDate = new Date(response.data.dt*1000);
            const day = rDate.getDate();
            const month = rDate.getMonth();
            const year = rDate.getFullYear();
            nameEl.innerHTML = response.data.name + " (" + month + "/" + day + "/" + year + ") ";
            let weatherPic = response.data.weather[0].icon;
            rPicEl.setAttribute("src","https://openweathermap.org/img/wn/" + weatherPic + "@2x.png");
            rPicEl.setAttribute("alt",response.data.weather[0].description);
            rTempEl.innerHTML = "Temperature: " + k2f(response.data.main.temp) + " &#176F";
            rHumEl.innerHTML = "Humidity: " + response.data.main.humidity + "%";
            rWindEl.innerHTML = "Wind Speed: " + response.data.wind.speed + " MPH"; 
            
            let lat = response.data.coord.lat;
            let lon = response.data.coord.lon;
            let UVQueryURL = "https://api.openweathermap.org/data/2.5/uvi/forecast?lat=" + lat + "&lon=" + lon +"&appid=" + APIKey + "&cnt=1";
            axios.get(UVQueryURL)
            .then(function (response) {
                let UVIndex = document.createElement("span");

                title.innerHTML = Kityname;

                if (response.data[0].value < 4 ) {
                    UVIndex.setAttribute("class", "badge badge-success");
                }
                else if (response.data[0].value < 8 ) {
                    UVIndex.setAttribute("class", "badge badge-warning");
                }
                else {
                    UVIndex.setAttribute("class", "badge badge-danger");
                }
                UVIndex.innerHTML = response.data[0].value;
                rUVEl.innerHTML ="UV Index: ";
                rUVEl.append(UVIndex);
            });

            let cityID = response.data.id;
            let forecastQueryURL = "https://api.openweathermap.org/data/2.5/forecast?id=" + cityID + "&appid=" +APIKey;
            axios.get(forecastQueryURL)
            .then(function (response) {
                fiveEl.classList.remove("d-none");

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

                    const forecastWeatherEl = document.createElement("img");
                    forecastWeatherEl.setAttribute("src", "https://openweathermap.org/img/wn/" + response.data.list[forecastIndex].weather[0].icon + "@2x.png");
                    forecastWeatherEl.setAttribute("alt", response.data.list[forecastIndex].weather[0].description);
                    forecastEl[i].append(forecastWeatherEl);
                    const forecastTempEl = document.createElement("p");
                    forecastTempEl.innerHTML = "Temp: " + k2f(response.data.list[forecastIndex].main.temp) + " &#176";
                    forecastEl[i].append(forecastDateEl);
                    const forecastHumidityEl = document.createElement("p");
                    forecastHumidityEl.innerHTML = "Humidity: " + response.data.list[forecastIndex].main.humidity + "%";
                    forecastEl[i].append(forecastHumidityEl);
                }
            })
        });
    }

    searchEl.addEventListener("click", function () {
        const searchTerm = cityEl.value;
        receiveWeather(searchTerm);
        searchHistory.push(searchTerm);
        localStorage.setItem("search", JSON.stringify(searchHistory));
        loadSearchHistory();
    })

    clearEl.addEventListener("click", function () {
        localStorage.clear();
        searchHistory = [];
        loadSearchHistory();
    })

    function k2f(K) {
        return Math.floor((K - 273.15) * 1.8 + 32);
    }

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

    loadSearchHistory();
    if (searchHistory.length > 0) {
        receiveWeather(searchHistory[searchHistory.length - 1]);
    }

}
    
    init();