<template>  
  <div class="weather-page">
    <div class="container">
      <div class="header">
        <h1>WEATHER APP</h1>
        <div class="search-bar">
          <input
            v-model="city"
            @keyup.enter="searchByCity"
            placeholder="Enter city name"
            class="search-input"
          />
          <button @click="searchByCity" class="search-button">Search</button>
        </div>
      </div>
    </div>

    <main>
      <div v-if="weatherData">
        <h2>{{ weatherData.name }}, {{ weatherData.sys.country }}</h2>
        <div>
          <img :src="iconUrl" alt="Weather Icon" />
          <p>{{ temperature }} °C</p>
        </div>
        <span>{{ weatherData.weather[0].description }}</span>
      </div>

      <p v-else-if="errorMessage">{{ errorMessage }}</p>
    </main>
  </div>
</template>

<script>
import axios from "axios";

const apikey = "24c5811fab1432d15f596e898141d4d8";

export default {
  name: "App",
  data() {
    return {
      city: "",
      weatherData: null,
      errorMessage: "",
      hourlyForecast: [],
      dailyForecast: [],
    };
  },
  computed: {
    temperature() {
      return this.weatherData ? Math.round(this.weatherData.main.temp) : null;
    },
    iconUrl() {
      return this.weatherData
        ? `https://openweathermap.org/img/wn/${this.weatherData.weather[0].icon}@2x.png`
        : null;
    },
  },
  mounted() {
    this.fetchCurrentLocationWeather();
  },
  methods: {
    async fetchCurrentLocationWeather() {
      this.errorMessage = "";

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apikey}&units=metric`;
            await this.fetchWeatherData(url);
          },
          (error) => {
            console.error("Geolocation error:", error);
            this.errorMessage = "Unable to get your current location.";
          }
        );
      } else {
        this.errorMessage = "Geolocation is not supported by this browser.";
      }
    },

    async searchByCity() {
      const cityName = this.city.trim();

      if (!cityName) {
        this.errorMessage = "Please enter a city name.";
        return;
      }

      this.errorMessage = "";
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(cityName)}&appid=${apikey}&units=metric`;
      await this.fetchWeatherData(url);
    },

    async fetchWeatherData(url) {
      try {
        const response = await axios.get(url);
        this.weatherData = response.data;
        this.errorMessage = "";
      } catch (error) {
        console.error("Error fetching weather data:", error);
        this.weatherData = null;
        this.errorMessage = "Unable to find weather information for this location.";
      }
    },
  },
};
</script>

<style scoped>
.weather-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  text-align: center;
  min-height: 70vh;
  padding: 40px 20px;
}

.container {
  width: 100%;
  display: flex;
  justify-content: center;
}

.header {
  width: 100%;
  max-width: 700px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.search-bar {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  margin-top: 12px;
}

@media (min-width: 600px) {
  .search-bar {
    flex-direction: row;
  }
  .search-input {
    width: 320px;
  }
}

.search-input {
  padding: 10px 14px;
  width: 100%;
  max-width: 420px;
  border: 1px solid #ccc;
  border-radius: 6px;
}

.search-button {
  padding: 8px 14px;
  border: none;
  border-radius: 6px;
  background-color: var(--bs-primary, #2b6ef6);
  color: #fff;
  cursor: pointer;
}

.weather-result {
  margin-top: 30px;
  width: 100%;
  display: flex;
  justify-content: center;
}

.weather-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.weather-main {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.error-message {
  color: #d9534f;
  font-weight: bold;
}
</style>