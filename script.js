const apiKey = 'a5a135bccbc26e5c5cd521e81e3a0211';
const weatherContainer = document.querySelector('.weather-container');
const forecastContainer = document.querySelector('.forecast-container');
const themeButtons = document.querySelectorAll('.theme-buttons button');
const unitsSelect = document.getElementById('units');
const languageSelect = document.getElementById('language');
const searchBox = document.getElementById('city');

document.addEventListener('DOMContentLoaded', () => {
    searchBox.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            getWeather();
        }
    });

    themeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const isDarkMode = button.id === 'dark';
            document.querySelectorAll('.container, .weather-container, .forecast-container, .forecast-item')
                .forEach(el => el.classList.toggle('dark-mode', isDarkMode));
        });
    });
});

async function getWeather() {
    const city = document.getElementById('city').value;
    const units = unitsSelect.value;
    const language = languageSelect.value;
    if (!city) return;

    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${units}&lang=${language}&appid=${apiKey}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=${units}&lang=${language}&appid=${apiKey}`;

    try {
        const [weatherResponse, forecastResponse] = await Promise.all([fetch(weatherUrl), fetch(forecastUrl)]);
        const weatherData = await weatherResponse.json();
        const forecastData = await forecastResponse.json();
        displayWeather(weatherData);
        displayForecast(forecastData);
    } catch (error) {
        console.error('Error fetching weather data:', error);
        // Handle error: Display a message to the user or log it for debugging.
    }
}

function displayWeather(data) {
    const { name, main, weather, rain, wind, sys } = data;

    let rainInfo = 'No rain'; // Default message if rain data is not available
    if (rain && rain['1h']) {
        rainInfo = `Rain: ${rain['1h']} mm`; // Display rain amount if available
    }

    const sunriseTime = new Date(sys.sunrise * 1000).toLocaleTimeString();
    const sunsetTime = new Date(sys.sunset * 1000).toLocaleTimeString();

    weatherContainer.innerHTML = `
        <h2>${name}</h2>
        <p>Temperature: ${main.temp}°</p>
        <p>Weather: ${weather[0].description}</p>
        <p>${rainInfo}</p>
        <p>Humidity: ${main.humidity}%</p>
        <p>Wind Speed: ${wind.speed} m/s</p>
        <p>Sunrise: ${sunriseTime}</p>
        <p>Sunset: ${sunsetTime}</p>
    `;
    weatherContainer.classList.remove('hidden');
}

function displayForecast(data) {
    forecastContainer.innerHTML = '';
    // Limit to show only 5 items
    const forecastItems = data.list.slice(0, 5);
    forecastItems.forEach(item => {
        const { dt_txt, main, weather } = item;
        const forecastItem = document.createElement('div');
        forecastItem.classList.add('forecast-item');
        forecastItem.innerHTML = `
            <h3>${new Date(dt_txt).toLocaleDateString()}</h3>
            <p>Temp: ${main.temp}°</p>
            <p>${weather[0].description}</p>
        `;
        forecastContainer.appendChild(forecastItem);
    });
    forecastContainer.classList.remove('hidden');
}
