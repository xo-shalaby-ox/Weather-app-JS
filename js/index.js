// Declaration
var api_key = "cade970721194a86a33221650240112";
var searchInput = document.getElementById("input-search");
var searchIcon = document.getElementById("search-icon");
var locationBtn = document.getElementById("locationBtn");
var months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec",];
var daysOfWeek = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","SaturDay",];
var CurrentWeatherCard = document.getElementById("weather-card");
var highlightsData = document.getElementById("highlights-air");
var aqiList = ["Good", "Fair","Moderate", "Poor", "very Poor"];
var sunDetails = document.getElementById("sun-details");
var humiditySpan = document.getElementById("humidity");
var pressureSpan = document.getElementById("pressure");
var visibilitySpan = document.getElementById("visibility");
var feelsLikeSpan = document.getElementById("feels_like");
var hourlyForecastCard = document.getElementById("hourly-forecast");
var windForecastDirection = document.getElementById("wind-forecast");
const targetHours = [1, 3, 6, 9, 12, 15, 18, 21];
var loader = document.getElementById("loader");



// NavBar
var lis = document.querySelectorAll(".nav-item .nav-link");
lis.forEach((li) => {
  li.addEventListener("click", function () {
    lis.forEach((li) => {
      li.classList.remove("active");
    });
    li.classList.add("active");
  });
});

// Functions ...>

function formatDate(date) {
    const days = date.getDate();
    const month = months[date.getMonth()];
    return `${days} ${month}`;
}

function getDayOfWeek(dateString) {
    const date = new Date(dateString + "2024");
    return daysOfWeek[date.getDay()];
}

function getWeatherDetails(name, lat, lon, country){
    const weatherUrl = `https://api.weatherapi.com/v1/current.json?key=${api_key}&q=${lat},${lon}`;
    const forecastUrl = `http://api.weatherapi.com/v1/forecast.json?key=${api_key}&q=${lat},${lon}&days=7`;

    fetch(weatherUrl)
    .then(res => res.json())
    .then(data => {
        var date = new Date();
            CurrentWeatherCard.innerHTML = `
                <div
                    class="current-weather w-100 d-flex justify-content-between align-items-center"
                >
                    <div class="weather-data text-white p-2">
                        <span class="fw-semibold fs-5 position-relative"
                            >Now</span
                        >
                            <h2><span>${data.current.temp_c} &deg;C</span></h2>
                            <p>${data.current.condition.text}</p>
                    </div>
                    <div class="weather-icon">
                        <img
                            src="${data.current.condition.icon}"
                            class="w-100"
                            alt="weatherIcon"
                        />
                    </div>
                    </div>
                    <div class="card-footer text-white p-2">
                        <div
                            class="weather-calendar d-flex justify-content-start align-items-start column-gap-3"
                        >
                            <i class="fa-solid fa-calendar-days"></i>
                            <span>${daysOfWeek[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]}, ${date.getFullYear()}</span>
                        </div>
                        <div
                            class="weather-location d-flex justify-content-start align-items-start column-gap-3 mt-2"
                        >
                            <i class="fa-solid fa-location-dot"></i>
                            <span>${name}, ${country}</span>
                    </div>
                </div>
        
                `;
    })
    .catch(() => {
        alert(`Error to fetch current weather`)
    });

    
function getWindDirection(degrees) {
    return degrees; 
}
    fetch(forecastUrl)
    .then(res =>{
        if (!res.ok) {
                    throw new Error("Failed to fetch weather data");
                }
                return res.json();
    })
    .then(data => {
        console.log(data);
        let hourlyForecast = data.forecast.forecastday[0].hour;
        hourlyForecastCard.innerHTML = ``;
        windForecastDirection.innerHTML = ``;
        targetHours.forEach(targetHour => {

            let hrForecast = hourlyForecast.find(forecast => {
                let hrForecastDate = new Date(forecast.time);
                let hour = hrForecastDate.getHours();
                return hour === targetHour; 
            });

            if (hrForecast) {
                let hrForecastDate = new Date(hrForecast.time);
                let hr = hrForecastDate.getHours();
                let a = "PM";
                if (hr < 12) a = "AM";
                if (hr == 12) hr = 12;
                if (hr > 12) hr = hr - 12;

                let windSpeed = hrForecast.wind_kph;
                let windDirectionDegrees = hrForecast.wind_degree;
                let rotationAngle = getWindDirection(windDirectionDegrees);

                windForecastDirection.innerHTML += `
                <li class="slider-item rounded-4 p-2">
                        <div class="slider-card text-center">
                            <span>${hr} ${a}</span>
                            <div class="weather-icon">
                                <!-- Rotating the image based on the wind direction -->
                                <img
                                    src="./images/direction.png"
                                    width="48"
                                    height="48"
                                    alt="wind direction"
                                    style="transform: rotate(${rotationAngle}deg);" />
                            </div>
                            <span>${windSpeed} Km/h</span>
                        </div>
                    </li>
                `;
                hourlyForecastCard.innerHTML += `
                    <li class="slider-item rounded-4 p-2">
                        <div class="slider-card text-center">
                            <span>${hr} ${a}</span>
                            <div class="weather-icon">
                                <img
                                    src="${hrForecast.condition.icon}"
                                    width="48"
                                    height="48"
                                    alt="weather"
                                />
                            </div>
                            <span>${hrForecast.temp_c}&deg;c</span>
                        </div>
                    </li>
                `;
            }
        });
        const forecastContainer = document.getElementById("forecast-container");
        let forecastHTML = "";

        data.forecast.forecastday.forEach((day) => {
        const date = new Date(day.date);
        const formattedDate = formatDate(date);
        const dayOfWeek = getDayOfWeek(formattedDate);

        forecastHTML += `
        <div
            class="item d-flex justify-content-between align-items-center"
        >
            <div
                class="weather-status d-flex justify-content-center align-content-center column-gap-3"
            >
                <img src="${day.day.condition.icon}" alt="${day.day.condition.text}" />
                <div class="d-flex flex-column justify-content-center align-items-center row-gap-1">
                    <span class="d-flex justify-content-center align-items-center">
                        <span class="text-danger me-1">Max</span>${day.day.maxtemp_c} <span>&deg;C</span>
                    </span>
                    <span class="d-flex justify-content-center align-items-center">
                        <span class="text-info me-1">Min</span> ${day.day.mintemp_c}<span>&deg;C</span>
                    </span>
                </div>
            </div>
                <span>${formattedDate}</span>
                <span>${dayOfWeek}</span>
            </div>
        `;
    });

    forecastContainer.innerHTML = forecastHTML;
})
.catch((error) => {
    console.error("Error fetching weather data:", error);
});

    const airPollutionUrl =`https://api.weatherapi.com/v1/forecast.json?key=${api_key}&q=${lat},${lon}&days=7&aqi=yes`;
    fetch(airPollutionUrl)
        .then(res => res.json())
        .then(data => {
            console.log(data);
            var aqi = data.current.air_quality["us-epa-index"];
            let {pm2_5,so2,no2,o3} = data.current.air_quality;
            highlightsData.innerHTML = `
            <div
                class="highlights-title d-flex justify-content-between align-items-center"
            >
                <h5 class="fs-6 opacity-50">Air Quality Index</h5>
                <span class="api-${aqi} fw-bold ps-2 pe-2 rounded-4">${aqiList[data.current.air_quality["us-epa-index"]]}</span>
            </div>
            <div
                class="highlights-details d-flex justify-content-between align-items-center mt-4"
            >
            <div class="icon">
                <i class="fa-solid fa-wind fs-1"></i>
            </div>
            <div class="item text-center">
                <span class="opacity-50">PM2.5</span>
                <p class="mb-0">${pm2_5}</p>
            </div>
            <div class="item text-center">
                <span class="opacity-50">SO2</span>
                <p class="mb-0">${so2}</p>
            </div>
            <div class="item text-center">
                <span class="opacity-50">NO2</span>
                <p class="mb-0">${no2}</p>
            </div>
            <div class="item text-center">
                <span class="opacity-50">O3</span>
                <p class="mb-0">${o3}</p>
            </div>
            </div>
            `;

            var sunRise = data.forecast.forecastday[0].astro.sunrise;
            var sunSet = data.forecast.forecastday[0].astro.sunset;
            sunDetails.innerHTML = `
            <div
                        class="sunrise d-flex justify-content-center align-items-center column-gap-4"
                      >
                        <div class="icon">
                          <i class="fa-regular fa-sun fs-1"></i>
                        </div>
                        <div class="sunrise-details">
                          <span class="opacity-75">Sunrise</span>
                          <p class="mb-0">${sunRise}</p>
                        </div>
                      </div>
                      <div
                        class="sunset d-flex justify-content-center align-items-center column-gap-4"
                      >
                        <div class="icon">
                          <i class="fa-solid fa-moon fs-1"></i>
                        </div>
                        <div class="sunset-details">
                          <span class="opacity-75">Sunset</span>
                          <p class="mb-0">${sunSet}</p>
                        </div>
                      </div>
            `;
            var humidity = data.current.humidity;
            var pressure = data.current.pressure_in;
            var visibility = data.current.vis_km;
            var feelsLike = data.current.feelslike_c;

            humiditySpan.innerHTML = `${humidity} %`;
            pressureSpan.innerHTML = `${pressure} hpa`;
            visibilitySpan.innerHTML = `${visibility} Km`;
            feelsLikeSpan.innerHTML = `${feelsLike} &deg;c`;

            
        })
        .catch(error => {
            console.log("Error fetching air pollution data:", error);
        });
}

function getCityCoordinates() {
   if(searchInput.value !== ""){
    loader.classList.replace("d-none","d-flex");
    setTimeout(() => {
        loader.classList.replace("d-flex","d-none");
    }, 3000);
   }
    const cityName = searchInput.value.trim();
    searchInput.value = "";
    if (!cityName) return;

    const geoCodingUrl = `https://api.weatherapi.com/v1/search.json?key=${api_key}&q=${cityName}`;

    fetch(geoCodingUrl)
    .then(res => res.json())
    .then(data => {
        let {name, lat, lon, country} = data[0];
        getWeatherDetails(name, lat, lon, country);
    })
    .catch(() => {
        console.log(`Error To Fetch Coordinates Of ${cityName}`);
    })
}

function getUserCurrentLocation() {
    loader.classList.replace("d-none","d-flex");
    setTimeout(() => {
        loader.classList.replace("d-flex","d-none");
    }, 3000);
    navigator.geolocation.getCurrentPosition(position => {
        let { latitude, longitude } = position.coords;
        let weatherUrl = `https://api.weatherapi.com/v1/current.json?key=${api_key}&q=${latitude},${longitude}`;

    fetch(weatherUrl)
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            console.error("Error fetching weather data:", data.error.message);
        } else {
            let {name, country} = data.location;
            var status = data.current.condition.text;
            getWeatherDetails(name,latitude,longitude,country,status);
        }
        })
    .catch(error => {
        console.error("Error fetching weather data:", error);
    });
    }, error => {
        console.error("Geolocation error:", error.message);
    });
}

locationBtn.addEventListener("click", getUserCurrentLocation);
searchIcon.addEventListener("click", getCityCoordinates);
searchInput.addEventListener("keyup", function(e){
    if(e.key === "Enter"){
        getCityCoordinates()
    }
})
document.addEventListener("DOMContentLoaded", getUserCurrentLocation)
