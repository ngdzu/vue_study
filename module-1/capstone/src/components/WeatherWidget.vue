<script setup lang="ts">
import { ref, computed } from 'vue'
import type { WeatherData } from '../types'

const props = defineProps<{
  unit?: 'C' | 'F'
}>()

const weatherData = ref<WeatherData>({
  temp: 22,
  condition: 'Partly Cloudy',
  humidity: 65,
  windSpeed: 12,
  forecast: [
    { day: 'Mon', high: 25, low: 18, condition: 'Sunny' },
    { day: 'Tue', high: 24, low: 17, condition: 'Cloudy' },
    { day: 'Wed', high: 23, low: 16, condition: 'Rainy' },
    { day: 'Thu', high: 22, low: 15, condition: 'Cloudy' },
    { day: 'Fri', high: 26, low: 19, condition: 'Sunny' }
  ]
})

const getEmoji = (condition: string) => {
  const emoji: Record<string, string> = {
    'Sunny': '☀️',
    'Cloudy': '☁️',
    'Rainy': '🌧️',
    'Partly Cloudy': '⛅'
  }
  return emoji[condition] || '🌤️'
}

const displayUnit = computed(() => props.unit || 'C')
</script>

<template>
  <div class="card weather-widget">
    <h2>🌤️ Weather</h2>

    <div class="current-weather">
      <div class="weather-main">
        <span class="emoji">{{ getEmoji(weatherData.condition) }}</span>
        <div class="info">
          <p class="temp">{{ weatherData.temp }}°{{ displayUnit }}</p>
          <p class="condition">{{ weatherData.condition }}</p>
        </div>
      </div>
      <div class="details">
        <div class="detail">
          <span class="label">Humidity</span>
          <span class="value">{{ weatherData.humidity }}%</span>
        </div>
        <div class="detail">
          <span class="label">Wind</span>
          <span class="value">{{ weatherData.windSpeed }} km/h</span>
        </div>
      </div>
    </div>

    <div class="forecast">
      <h3>5-Day Forecast</h3>
      <div class="forecast-items">
        <div v-for="day in weatherData.forecast" :key="day.day" class="forecast-item">
          <p class="day">{{ day.day }}</p>
          <p class="emoji">{{ getEmoji(day.condition) }}</p>
          <p class="temps">
            <span class="high">{{ day.high }}°</span>
            <span class="low">{{ day.low }}°</span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.weather-widget {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.weather-widget h2 {
  margin: 0;
}

.current-weather {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.weather-main {
  display: flex;
  align-items: center;
  gap: 16px;
}

.emoji {
  font-size: 64px;
}

.info p {
  margin: 4px 0;
}

.temp {
  font-size: 28px;
  font-weight: 600;
  margin: 0;
}

.condition {
  font-size: 14px;
  color: var(--text-secondary);
  margin: 0;
}

.details {
  display: flex;
  gap: 20px;
}

.detail {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.detail .label {
  font-size: 12px;
  color: var(--text-secondary);
  margin-bottom: 4px;
}

.detail .value {
  font-size: 16px;
  font-weight: 500;
}

.forecast h3 {
  margin: 0;
  font-size: 14px;
  color: var(--text-secondary);
}

.forecast-items {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 8px;
}

.forecast-item {
  background: var(--bg-secondary);
  padding: 12px;
  border-radius: 6px;
  text-align: center;
}

.forecast-item .day {
  font-size: 12px;
  font-weight: 500;
  margin: 0 0 4px 0;
}

.forecast-item .emoji {
  font-size: 24px;
  margin: 4px 0;
}

.forecast-item .temps {
  font-size: 12px;
  margin: 4px 0 0 0;
}

.temps .low {
  color: var(--text-secondary);
}
</style>
