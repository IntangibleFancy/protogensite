// Weather widget using Open-Meteo API
document.addEventListener('DOMContentLoaded', function() {
    const weatherWidget = document.getElementById('weather-widget');
    
    // Weather code to icon and description mapping
    const weatherCodes = {
        0: { icon: '☀️', desc: 'Clear sky' },
        1: { icon: '🌤️', desc: 'Mainly clear' },
        2: { icon: '⛅', desc: 'Partly cloudy' },
        3: { icon: '☁️', desc: 'Overcast' },
        45: { icon: '🌫️', desc: 'Fog' },
        48: { icon: '🌫️', desc: 'Depositing rime fog' },
        51: { icon: '🌦️', desc: 'Light drizzle' },
        53: { icon: '🌦️', desc: 'Moderate drizzle' },
        55: { icon: '🌦️', desc: 'Dense drizzle' },
        61: { icon: '🌧️', desc: 'Slight rain' },
        63: { icon: '🌧️', desc: 'Moderate rain' },
        65: { icon: '🌧️', desc: 'Heavy rain' },
        71: { icon: '🌨️', desc: 'Slight snow' },
        73: { icon: '🌨️', desc: 'Moderate snow' },
        75: { icon: '🌨️', desc: 'Heavy snow' },
        80: { icon: '🌦️', desc: 'Slight rain showers' },
        81: { icon: '🌦️', desc: 'Moderate rain showers' },
        82: { icon: '🌦️', desc: 'Violent rain showers' },
        95: { icon: '⛈️', desc: 'Thunderstorm' },
        96: { icon: '⛈️', desc: 'Thunderstorm with hail' },
        99: { icon: '⛈️', desc: 'Thunderstorm with heavy hail' }
    };

    // Get user's location
    function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                position => {
                    const lat = position.coords.latitude;
                    const lon = position.coords.longitude;
                    fetchWeather(lat, lon);
                },
                error => {
                    console.error('Location error:', error);
                    // Default to San Francisco coordinates if location access is denied
                    fetchWeather(37.7749, -122.4194);
                }
            );
        } else {
            // Default to San Francisco if geolocation is not supported
            fetchWeather(37.7749, -122.4194);
        }
    }

    // Fetch weather data from Open-Meteo API
    async function fetchWeather(lat, lon) {
        try {
            // Updated API call with correct parameter names
            const response = await fetch(
                `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m&timezone=auto`
            );
            
            if (!response.ok) {
                throw new Error(`Weather API request failed: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('Weather data received:', data); // Debug log
            displayWeather(data);
            
        } catch (error) {
            console.error('Weather fetch error:', error);
            weatherWidget.innerHTML = `
                <div class="weather-loading">Unable to load weather data<br><small>${error.message}</small></div>
            `;
        }
    }

    // Display weather data
    function displayWeather(data) {
        try {
            const current = data.current;
            const weatherCode = current.weather_code;
            const weatherInfo = weatherCodes[weatherCode] || { icon: '❓', desc: 'Unknown' };
            
            const temperature = current.temperature_2m || 'N/A';
            const humidity = current.relative_humidity_2m || 'N/A';
            const precipitation = current.precipitation || 0;
            const windSpeed = current.wind_speed_10m || 'N/A';
            
            weatherWidget.innerHTML = `
                <div class="weather-content">
                    <div class="weather-location">Current Weather</div>
                    <div class="weather-main">
                        <span class="weather-icon">${weatherInfo.icon}</span>
                        <span class="weather-temp">${Math.round(temperature)}°C</span>
                    </div>
                    <div class="weather-description">${weatherInfo.desc}</div>
                    <div class="weather-stats">
                        <div class="weather-stat">
                            <span class="weather-stat-label">Wind:</span>
                            <span class="weather-stat-value">${windSpeed} km/h</span>
                        </div>
                        <div class="weather-stat">
                            <span class="weather-stat-label">Humidity:</span>
                            <span class="weather-stat-value">${humidity}%</span>
                        </div>
                        <div class="weather-stat">
                            <span class="weather-stat-label">Precipitation:</span>
                            <span class="weather-stat-value">${precipitation} mm</span>
                        </div>
                    </div>
                </div>
            `;
        } catch (error) {
            console.error('Error displaying weather data:', error);
            weatherWidget.innerHTML = `
                <div class="weather-loading">Error displaying weather data</div>
            `;
        }
    }

    // Initialize weather widget
    getLocation();
});