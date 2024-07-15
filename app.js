document.addEventListener("DOMContentLoaded", function() {
    const apiKey = "q4moiPN4e7Prdn1Ebgdx3lfe1mwqeGVf";
    const form = document.getElementById("cityForm");
    const weatherDiv = document.getElementById("weather");

    form.addEventListener("submit", function(event) {
        event.preventDefault();
        const city = document.getElementById("cityInput").value;
        getWeather(city);
    });

    function getWeather(city) {
        const locationUrl = `http://dataservice.accuweather.com/locations/v1/cities/search?apikey=${apiKey}&q=${city}`;

        fetch(locationUrl)
            .then(response => response.json())
            .then(data => {
                if (data && data.length > 0) {
                    const locationKey = data[0].Key;
                    fetchWeatherData(locationKey);
                    fetchHourlyForecast(locationKey);
                    fetchDailyForecast(locationKey);
                } else {
                    weatherDiv.innerHTML = `<p>City not found.</p>`;
                }
            })
            .catch(error => {
                console.error("Error fetching location data:", error);
                weatherDiv.innerHTML = `<p>Error fetching location data.</p>`;
            });
    }

    function fetchWeatherData(locationKey) {
        const currentConditionsUrl = `http://dataservice.accuweather.com/currentconditions/v1/${locationKey}?apikey=${apiKey}`;

        fetch(currentConditionsUrl)
            .then(response => response.json())
            .then(data => {
                if (data && data.length > 0) {
                    displayWeather(data[0]);
                } else {
                    weatherDiv.innerHTML = `<p>No weather data available.</p>`;
                }
            })
            .catch(error => {
                console.error("Error fetching weather data:", error);
                weatherDiv.innerHTML = `<p>Error fetching weather data.</p>`;
            });
    }

    function fetchHourlyForecast(locationKey) {
        const hourlyForecastUrl = `http://dataservice.accuweather.com/forecasts/v1/hourly/12hour/${locationKey}?apikey=${apiKey}&metric=true`;

        fetch(hourlyForecastUrl)
            .then(response => response.json())
            .then(data => {
                if (data && data.length > 0) {
                    displayHourlyForecast(data);
                } else {
                    weatherDiv.innerHTML = `<p>No hourly forecast data available.</p>`;
                }
            })
            .catch(error => {
                console.error("Error fetching hourly forecast data:", error);
                weatherDiv.innerHTML = `<p>Error fetching hourly forecast data.</p>`;
            });
    }

    function fetchDailyForecast(locationKey) {
        const dailyForecastUrl = `http://dataservice.accuweather.com/forecasts/v1/daily/5day/${locationKey}?apikey=${apiKey}&metric=true`;

        fetch(dailyForecastUrl)
            .then(response => response.json())
            .then(data => {
                if (data && data.DailyForecasts && data.DailyForecasts.length > 0) {
                    displayDailyForecast(data.DailyForecasts);
                } else {
                    weatherDiv.innerHTML += `<p>No daily forecast data available.</p>`;
                }
            })
            .catch(error => {
                console.error("Error fetching daily forecast data:", error);
                weatherDiv.innerHTML += `<p>Error fetching daily forecast data.</p>`;
            });
    }

    function displayWeather(data) {
        const temperature = data.Temperature.Metric.Value;
        const weatherText = data.WeatherText;
        const weatherContent = `
            <h2>Current Weather</h2>
            <p>Temperature: ${temperature}°C</p>
            <p>Weather: ${weatherText}</p>
        `;
        weatherDiv.innerHTML = weatherContent;
    }

    function displayHourlyForecast(data) {
        let hourlyForecastContent = `<h2>Hourly Forecast</h2>`;
        hourlyForecastContent += `<div class="hourly-forecast">`;
        data.forEach((hour, index) => {
            if (index < 6) {
                const time = new Date(hour.DateTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
                const temperature = hour.Temperature.Value;
                const weatherText = hour.IconPhrase;

                hourlyForecastContent += `
                    <div class="hourlyItem">
                        <p>Time: ${time}</p>
                        <p>Weather: ${weatherText}</p>
                    </div>
                `;
            }
        });
        hourlyForecastContent += `</div>`;
        weatherDiv.innerHTML += hourlyForecastContent;
    }

    function displayDailyForecast(dailyForecasts) {
    let dailyForecastContent = `<h2>Daily Forecast</h2>`;
    dailyForecasts.forEach(day => {
        const date = new Date(day.Date);
        const weekday = date.toLocaleDateString('en-US', { weekday: 'long' });
        const minTemp = day.Temperature.Minimum.Value;
        const maxTemp = day.Temperature.Maximum.Value;
        const dayWeatherText = day.Day.IconPhrase; 
        const nightWeatherText = day.Night.IconPhrase; 

        const dayIcon = getWeatherIcon(dayWeatherText);
        const nightIcon = getWeatherIcon(nightWeatherText);

        dailyForecastContent += `
            <div class="dailyItem">
                <p class="weekday">${weekday}</p><img src="${dayIcon}" alt="Weather Icon" class="weather-icon">
                <div class="weather-info">
                    <p><strong>Weather Status:</strong> ${dayWeatherText}</p>
                    <p><strong>Temperature:</strong> ${minTemp}°C - ${maxTemp}°C</p>
                    
                </div>
            </div>
        `;
    });
    weatherDiv.innerHTML += dailyForecastContent;
}

// Function to get the appropriate weather icon based on weather text
function getWeatherIcon(weatherText) {
    let icon = 'default-icon.png'; // Default icon in case specific icons are not available

    // You can add more cases depending on the weather descriptions you have
    switch (weatherText) {
        case 'Rain':
            icon = 'rain.png';
            break;
        case 'Thunderstorms':
            icon = 'thunderstorms.png';
            break;
        // Add more cases as needed for other weather conditions
        default:
            icon = 'default-icon.png';
            break;
    }

    return icon;
}

    
});
