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
    let searchHistory = JSON.parse(localStorage.getItem("search")) || [];
    console.log(searchHistory);


    const APIKey = "894f693d596b9da3794a39bff8c376ca";

    //     fetch('https://api.openweathermap.org/geo/1.0/direct?q=Charlotte&limit=1&appid=894f693d596b9da3794a39bff8c376ca')
    //         .then(function (response) {
    //             return response.json();
    //         })
    //         .then(function (data) {
    //             console.log(data[0].lat, data[0].lon);
    //             getWeatherData(data[0].lat, data[0].lon);
    //         });
    // }

    // function getWeatherData(lat, lon) {
    //     fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=894f693d596b9da3794a39bff8c376ca&units=imperial`)
    //         .then(function (response) {
    //             return response.json();
    //         })
    //         .then(function (data) {
    //             console.log();
    //             console.log(data);
    //         });
    function receiveWeather(cityName) {
        let queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + APIKey + "&units=imperial";
        axios.get(queryURL)  
        .then(function(response){
            
            const rDate = new Date(response.data.dt*1000);
            const day = rDate.getDate();
            const month = rDate.getMonth();
            const year = rDate.getFullYear();
            nameEl.innerHTML = response.data.name + " (" + month + "/" + day + "/" + year + ") ";
            let weatherPic = response.data.weather[0].icon;
            rPicEl.setAttribute("src","https://openweathermap.org/img/wn/" + weatherPic + "@2x.png");
            rPicEl.setAttribute("alt",response.data.weather[0].description);
            rTempEl.innerHTML = "Temperature: " + response.data.min.temp;
            rHumEl.innerHTML = "Humidity: " + response.data.main.humidity;
            rWindEl.innerHTML = "Wind Speed: " + response.data.wind.speed; 
            
            let lat = response.data.coord.lat;
            let lon = response.data.coord.lon;
            let UVQueryURL = "https://api.openweathermap.org/data/2.5/uvi/forecast?lat=" + lat + "&lon=" + lon +"&appid=" + APIKey + "&cnt=1";
            axios.get(UVQueryURL)
            .then(function (response) {
                let UVIndex = document.createElement("span");

                if (response.data[0].value < 4 ) {
                    UVIndex.setAttribute("class", "badge badge-success");
                }
                else if (response.data[0].value < 8 ) {
                    UVIndex.setAttribute("class", "badge badge-warning");
                }
                else {
                    UVIndex.setAttribute("class", "badge badge-danger");
                }
            })
        }) 
    }
}
    init();