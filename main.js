let apiKey = "b3623eee1cf0f48a911914a0c6b74c8c";

function searchCity() {
    let city = document.getElementById("cityInput").value;
    if (city) {
        fetchWeather(city);
    }
}

function getCurrentLocation() {
    navigator.geolocation.getCurrentPosition(function(position) {
        let lat = position.coords.latitude;
        let lon = position.coords.longitude;
        let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
        fetch(url)
            .then(res => res.json())
            .then(data => {
                fetchWeather(data.name);
            });
    });
}

function fetchWeather(city) {
    let currentURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    let forecastURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    fetch(currentURL)
        .then(res => res.json())
        .then(data => {
            let date = new Date().toISOString().split("T")[0];
            let icon = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
            let html = `
        <div>
          <h3>${data.name} (${date})</h3>
          <p>Temperature: ${data.main.temp}°C</p>
          <p>Wind: ${data.wind.speed} M/S</p>
          <p>Humidity: ${data.main.humidity}%</p>
        </div>
        <div>
          <img src="${icon}" alt="${data.weather[0].description}">
          <p>${data.weather[0].description}</p>
        </div>
      `;
            document.getElementById("weatherInfo").innerHTML = html;
        });

    fetch(forecastURL)
        .then(res => res.json())
        .then(data => {
            displayForecast(data);
        });
}

function displayForecast(data) {
    let forecastHTML = "";
    for (let i = 0; i < data.list.length; i += 8) {
        let day = data.list[i];
        let date = day.dt_txt.split(" ")[0];
        let temp = day.main.temp;
        let wind = day.wind.speed;
        let humidity = day.main.humidity;
        let icon = `https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`;

        forecastHTML += `
      <div class="forecast-card">
        <h4>(${date})</h4>
        <img src="${icon}" alt="${day.weather[0].description}" width="50">
        <p>Temp: ${temp}°C</p>
        <p>Wind: ${wind} M/S</p>
        <p>Humidity: ${humidity}%</p>
      </div>
    `;
    }
    document.getElementById("forecast").innerHTML = forecastHTML;
}
