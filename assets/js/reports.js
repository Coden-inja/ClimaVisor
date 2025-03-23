
const countryCoordinates = {
    India: { latitude: 22.5726, longitude: 88.3639 },
    USA: { latitude: 37.7749, longitude: -122.4194 },
    Australia: { latitude: -33.8688, longitude: 151.2093 },
    Brazil: { latitude: -23.5505, longitude: -46.6333 },
    UK: { latitude: 51.5074, longitude: -0.1278 },
    Japan: { latitude: 35.6895, longitude: 139.6917 },
    SouthAfrica: { latitude: -26.2041, longitude: 28.0473 },
};


async function fetchWeatherData(latitude, longitude) {
    try {
        const response = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min&timezone=auto`
        );
        if (!response.ok) {
            console.error(`HTTP error! Status: ${response.status}`);
            return;
        }
        const data = await response.json();
        displayWeatherData(data);
    } catch (error) {
        console.error("Error fetching weather data:", error);
    }
}


function displayWeatherData(data) {
    const weatherContainer = document.getElementById("weather-data");
    weatherContainer.innerHTML = "";

    data.daily.time.forEach((date, index) => {
        const weatherBox = document.createElement("div");
        weatherBox.classList.add("weather-box");

        weatherBox.innerHTML = `
            <h3>${new Date(date).toDateString()}</h3>
            <p>Max Temperature: ${data.daily.temperature_2m_max[index]}°C</p>
            <p>Min Temperature: ${data.daily.temperature_2m_min[index]}°C</p>
        `;

        weatherContainer.appendChild(weatherBox);
    });
}


function fetchPredictions() {
    const predictions = [
        {
            title: "Prediction: Rising Sea Levels",
            description: "Sea levels may rise by 1.5 meters by 2100 due to ice sheet melting.",
            link: "https://example.com/prediction-sea-levels",
        },
        {
            title: "Prediction: Increased Heatwaves",
            description: "Heatwaves are expected to become more frequent and intense by 2050.",
            link: "https://example.com/prediction-heatwaves",
        },
        {
            title: "Prediction: Decline in Arctic Ice",
            description: "Arctic ice cover is predicted to decline by 80% by the end of the century.",
            link: "https://example.com/prediction-arctic-ice",
        },
    ];

    displayPredictions(predictions);
}


function displayPredictions(predictions) {
    const predictionsContainer = document.getElementById("predictions-container");
    predictionsContainer.innerHTML = "";

    predictions.forEach((prediction) => {
        const predictionBox = document.createElement("div");
        predictionBox.classList.add("prediction-box");

        predictionBox.innerHTML = `
            <h3>${prediction.title}</h3>
            <p>${prediction.description}</p>
            <a href="${prediction.link}" target="_blank">Read More</a>
        `;

        predictionsContainer.appendChild(predictionBox);
    });
}


function handleCountryChange() {
    const selectedCountry = document.getElementById("country-select").value;
    const coordinates = countryCoordinates[selectedCountry];

    if (coordinates) {
        fetchWeatherData(coordinates.latitude, coordinates.longitude); 
    }
}


function populateCountryDropdown() {
    const countrySelect = document.getElementById("country-select");

    for (const country in countryCoordinates) {
        const option = document.createElement("option");
        option.value = country;
        option.textContent = country;
        countrySelect.appendChild(option);
    }

   
    countrySelect.value = "India";
    fetchWeatherData(countryCoordinates["India"].latitude, countryCoordinates["India"].longitude);
}

populateCountryDropdown();
fetchPredictions();
