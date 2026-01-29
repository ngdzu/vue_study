<template>
  <div class="weather-widget">
    <!-- Weather-specific animated background -->
    <div :class="['weather-background', `weather-${weather.condition.toLowerCase().replace(/\s+/g, '-')}`]">
      <div v-if="weather.condition.toLowerCase().includes('rain')" class="rain-container">
        <div class="rain-clouds">
          <div v-for="i in 4" :key="`cloud-${i}`" class="rain-cloud" :style="getRainCloudStyle(i)"></div>
        </div>
        <div v-for="i in 50" :key="i" class="rain-drop" :style="getRainStyle(i)"></div>
      </div>
      <div v-else-if="weather.condition.toLowerCase().includes('sunny') || weather.condition.toLowerCase().includes('clear')" class="sun-rays">
        <div v-for="i in 12" :key="i" class="sun-ray" :style="`transform: rotate(${i * 30}deg)`"></div>
      </div>
      <div v-else-if="weather.condition.toLowerCase().includes('cloud')" class="clouds-container">
        <div v-for="i in 3" :key="i" class="cloud" :style="getCloudStyle(i)"></div>
      </div>
      <div v-else-if="weather.condition.toLowerCase().includes('snow')" class="snow-container">
        <div v-for="i in 80" :key="i" class="snowflake" :style="getSnowStyle(i)"></div>
      </div>
      <div v-else-if="weather.condition.toLowerCase().includes('fall') || weather.condition.toLowerCase().includes('windy')" class="leaf-container">
        <div v-for="i in 40" :key="i" class="leaf" :style="getLeafStyle(i)"></div>
      </div>
    </div>

    <GlassCard variant="gradient" class="weather-card">
      <template #header>
        <h3 class="weather-title">🌤️ Weather</h3>
      </template>

      <div class="weather-content">
      <div class="weather-main">
        <div class="temperature">
          <span class="temp-value">{{ weather.temp }}</span>
          <span class="temp-unit">°C</span>
        </div>
        <div class="weather-condition">{{ weather.condition }}</div>
      </div>

      <div class="weather-details">
        <div class="detail">
          <span class="label">Humidity</span>
          <span class="value">{{ weather.humidity }}%</span>
        </div>
        <div class="detail">
          <span class="label">Wind</span>
          <span class="value">{{ weather.windSpeed }} km/h</span>
        </div>
        <div class="detail">
          <span class="label">UV Index</span>
          <span class="value">{{ weather.uvIndex }}</span>
        </div>
      </div>
    </div>

    <template #footer>
      <Button variant="secondary" size="sm">View Forecast</Button>
    </template>
  </GlassCard>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import GlassCard from './GlassCard.vue'
import Button from './Button.vue'

const weather = reactive({
  temp: 12,
  condition: 'Fall Windy',
  humidity: 55,
  windSpeed: 25,
  uvIndex: 3
})

const getRainStyle = (_index: number) => {
  const left = Math.random() * 100
  const delay = Math.random() * 2
  const duration = 0.8 + Math.random() * 0.8
  // Random height between 40px and 100px
  const height = 40 + Math.random() * 60
  // Random width between 2px and 5px
  const width = 2 + Math.random() * 3
  // Depth effect - random opacity and size for far/near drops
  const depth = Math.random()
  const opacity = 0.3 + depth * 0.7
  const scale = 0.6 + depth * 0.4
  
  return {
    left: `${left}%`,
    animationDelay: `${delay}s`,
    animationDuration: `${duration}s`,
    '--rain-height': `${height}px`,
    '--rain-width': `${width}px`,
    '--rain-opacity': `${opacity}`,
    '--rain-scale': `${scale}`
  }
}

const getRainCloudStyle = (index: number) => {
  const top = Math.random() * 80
  const left = (index * 25) % 100
  const delay = index * 2
  // Random depth for far/near clouds
  const depth = Math.random()
  // Size varies from 0.6 to 1.3 based on depth
  const scale = 0.6 + depth * 0.7
  // Opacity: near clouds (depth > 0.6) are more visible
  const opacity = 0.35 + depth * 0.4
  // Speed varies by depth
  const duration = 20 + (1 - depth) * 10
  
  return {
    top: `${top}%`,
    left: `${left}%`,
    animationDelay: `${delay}s`,
    '--cloud-scale': `${scale}`,
    '--cloud-opacity': `${opacity}`,
    '--cloud-duration': `${duration}s`
  }
}

const getCloudStyle = (index: number) => {
  const top = 10 + index * 20
  const delay = index * 3
  return {
    top: `${top}%`,
    animationDelay: `${delay}s`
  }
}

const getSnowStyle = (_index: number) => {
  const left = Math.random() * 100
  const delay = Math.random() * 8
  // Random depth for far/near snowflakes
  const depth = Math.random()
  // Size varies from 0.5 to 1.4 based on depth (larger range for more intensity)
  const scale = 0.5 + depth * 0.9
  // Opacity: near snowflakes (depth > 0.6) are more visible
  const opacity = 0.5 + depth * 0.5
  // Speed varies by depth - near snows fall faster
  const duration = 3 + (1 - depth) * 3
  // Sway amount: far snows sway less, near snows sway more
  const sway = depth * 60
  
  return {
    left: `${left}%`,
    animationDelay: `${delay}s`,
    '--snow-scale': `${scale}`,
    '--snow-opacity': `${opacity}`,
    '--snow-duration': `${duration}s`,
    '--snow-sway': `${sway}px`
  }
}

const getLeafStyle = (_index: number) => {
  const top = Math.random() * 100
  const delay = Math.random() * 8
  // Random depth for far/near leaves
  const depth = Math.random()
  // Size varies from 0.5 to 1.3 based on depth
  const scale = 0.5 + depth * 0.8
  // Opacity: near leaves are more visible
  const opacity = 0.4 + depth * 0.6
  // Speed 3x faster - ranges from 1.5 to 3 seconds instead of 5 to 10
  const duration = 1.5 + (1 - depth) * 1.5
  // Wave amplitude: how much leaves bob up and down
  const amplitude = 30 + depth * 40
  // Rotation speed for spinning leaves
  const rotationDuration = 2 + Math.random() * 3
  
  return {
    top: `${top}%`,
    animationDelay: `${delay}s`,
    '--leaf-scale': `${scale}`,
    '--leaf-opacity': `${opacity}`,
    '--leaf-duration': `${duration}s`,
    '--leaf-amplitude': `${amplitude}px`,
    '--leaf-rotate': `${rotationDuration}s`
  }
}
</script>

<style scoped>
.weather-widget {
  position: relative;
  overflow: hidden;
  border-radius: var(--radius-glass);
}

.weather-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2;
  overflow: hidden;
  border-radius: var(--radius-glass);
  pointer-events: none;
}

.weather-card {
  position: relative;
  z-index: 1;
}

/* Rain Animation */
.rain-container {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.rain-clouds {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  overflow: hidden;
}

.rain-cloud {
  position: absolute;
  width: 200px;
  height: 60px;
  background: linear-gradient(to right, 
    rgba(130, 140, 150, 0.45),
    rgba(150, 160, 170, 0.5),
    rgba(130, 140, 150, 0.45)
  );
  border-radius: 100px;
  filter: blur(20px);
  opacity: var(--cloud-opacity, 0.6);
  animation: rain-cloud-drift var(--cloud-duration, 20s) linear infinite;
  transform: scaleX(var(--cloud-scale, 1)) scaleY(calc(var(--cloud-scale, 1) * 0.8));
  transform-origin: center;
}

.rain-cloud::before,
.rain-cloud::after {
  content: '';
  position: absolute;
  background: rgba(140, 150, 160, 0.4);
  border-radius: 100%;
  filter: blur(15px);
}

.rain-cloud::before {
  width: 100px;
  height: 100px;
  top: -30px;
  left: 20px;
}

.rain-cloud::after {
  width: 120px;
  height: 120px;
  top: -35px;
  right: 15px;
}

@keyframes rain-cloud-drift {
  from {
    transform: translateX(-200px);
  }
  to {
    transform: translateX(calc(100% + 200px));
  }
}

.rain-drop {
  position: absolute;
  top: -100px;
  width: var(--rain-width, 3px);
  height: var(--rain-height, 50px);
  background: linear-gradient(to bottom, rgba(100, 180, 255, 0.9), rgba(100, 180, 255, 0.4));
  box-shadow: 0 0 6px rgba(100, 180, 255, calc(var(--rain-opacity, 0.6) * 0.9));
  animation: rain-fall linear infinite;
  opacity: var(--rain-opacity, 0.6);
  filter: none;
  transform: scaleY(var(--rain-scale, 1));
  transform-origin: center top;
}

@keyframes rain-fall {
  to {
    transform: translateY(calc(100vh + 100px)) scaleY(var(--rain-scale, 1));
  }
}

/* Sunny Animation */
.sun-rays {
  position: absolute;
  top: 30%;
  left: 30%;
  width: 100px;
  height: 100px;
  animation: sun-rotate 20s linear infinite;
}

.sun-ray {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 4px;
  height: 60px;
  background: linear-gradient(to bottom, 
    rgba(255, 215, 0, 0.6), 
    rgba(255, 165, 0, 0.3),
    transparent
  );
  transform-origin: 2px 0;
  animation: sun-beam 3s ease-in-out infinite;
}

@keyframes sun-rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes sun-beam {
  0%, 100% {
    opacity: 0.4;
  }
  50% {
    opacity: 0.8;
    height: 80px;
  }
}

/* Clouds Animation */
.clouds-container {
  position: absolute;
  width: 100%;
  height: 100%;
}

.cloud {
  position: absolute;
  width: 120px;
  height: 40px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50px;
  animation: cloud-move 15s linear infinite;
}

.cloud::before,
.cloud::after {
  content: '';
  position: absolute;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
}

.cloud::before {
  width: 50px;
  height: 50px;
  top: -25px;
  left: 10px;
}

.cloud::after {
  width: 60px;
  height: 60px;
  top: -30px;
  right: 10px;
}

@keyframes cloud-move {
  from {
    transform: translateX(-150px);
  }
  to {
    transform: translateX(calc(100% + 150px));
  }
}

/* Snow Animation */
.snow-container {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.snowflake {
  position: absolute;
  top: -10px;
  width: calc(6px * var(--snow-scale, 1));
  height: calc(6px * var(--snow-scale, 1));
  background: rgba(255, 255, 255, var(--snow-opacity, 0.7));
  border-radius: 50%;
  animation: snow-fall var(--snow-duration, 5s) linear infinite;
  box-shadow: 0 0 calc(4px * var(--snow-scale, 1)) rgba(255, 255, 255, calc(var(--snow-opacity, 0.7) * 0.8));
}

@keyframes snow-fall {
  0% {
    transform: translateY(0) translateX(0);
    opacity: 0;
  }
  10% {
    opacity: var(--snow-opacity, 0.7);
  }
  90% {
    opacity: var(--snow-opacity, 0.7);
  }
  to {
    transform: translateY(calc(100vh + 10px)) translateX(var(--snow-sway, 30px));
    opacity: 0;
  }
}

/* Leaf Fall Animation */
.leaf-container {
  position: absolute;
  top: 0;
  left: -100px;
  width: calc(100% + 100px);
  height: 100%;
  overflow: visible;
  z-index: 1;
}

.leaf {
  position: absolute;
  left: 0;
  width: calc(20px * var(--leaf-scale, 1));
  height: calc(20px * var(--leaf-scale, 1));
  background: linear-gradient(135deg, #ff6b35, #f7931e, #ffb347);
  border-radius: 0 100% 0 100%;
  opacity: var(--leaf-opacity, 0.6);
  box-shadow: 0 0 calc(3px * var(--leaf-scale, 1)) rgba(255, 107, 53, calc(var(--leaf-opacity, 0.6) * 0.7));
}

.leaf:nth-child(4n+1) {
  animation: leaf-float-1 var(--leaf-duration, 2s) linear infinite;
}

.leaf:nth-child(4n+2) {
  animation: leaf-float-2 var(--leaf-duration, 2s) linear infinite;
}

.leaf:nth-child(4n+3) {
  animation: leaf-float-3 var(--leaf-duration, 2s) linear infinite;
}

.leaf:nth-child(4n) {
  animation: leaf-float-4 var(--leaf-duration, 2s) linear infinite;
}

@keyframes leaf-float-1 {
  0% {
    transform: translateX(-100px) translateY(0) rotateZ(0deg);
    opacity: 0;
  }
  5% {
    opacity: var(--leaf-opacity, 0.6);
    transform: translateX(0px) translateY(calc(-0.1 * var(--leaf-amplitude, 30px))) rotateZ(0deg);
  }
  15% {
    transform: translateX(125px) translateY(calc(0.15 * var(--leaf-amplitude, 30px))) rotateZ(45deg);
  }
  25% {
    transform: translateX(250px) translateY(calc(-0.2 * var(--leaf-amplitude, 30px))) rotateZ(90deg);
  }
  35% {
    transform: translateX(375px) translateY(calc(0.1 * var(--leaf-amplitude, 30px))) rotateZ(135deg);
  }
  50% {
    transform: translateX(500px) translateY(calc(-0.08 * var(--leaf-amplitude, 30px))) rotateZ(180deg);
  }
  60% {
    transform: translateX(600px) translateY(calc(0.12 * var(--leaf-amplitude, 30px))) rotateZ(225deg);
  }
  75% {
    transform: translateX(725px) translateY(calc(-0.15 * var(--leaf-amplitude, 30px))) rotateZ(270deg);
  }
  90% {
    opacity: var(--leaf-opacity, 0.6);
    transform: translateX(850px) translateY(0) rotateZ(360deg);
  }
  to {
    transform: translateX(900px) translateY(0) rotateZ(360deg);
    opacity: 0;
  }
}

@keyframes leaf-float-2 {
  0% {
    transform: translateX(-100px) translateY(0) rotateZ(0deg);
    opacity: 0;
  }
  5% {
    opacity: var(--leaf-opacity, 0.6);
    transform: translateX(0px) translateY(calc(0.18 * var(--leaf-amplitude, 30px))) rotateZ(0deg);
  }
  18% {
    transform: translateX(162px) translateY(calc(-0.12 * var(--leaf-amplitude, 30px))) rotateZ(50deg);
  }
  32% {
    transform: translateX(324px) translateY(calc(0.2 * var(--leaf-amplitude, 30px))) rotateZ(120deg);
  }
  48% {
    transform: translateX(486px) translateY(calc(-0.05 * var(--leaf-amplitude, 30px))) rotateZ(200deg);
  }
  65% {
    transform: translateX(648px) translateY(calc(0.14 * var(--leaf-amplitude, 30px))) rotateZ(270deg);
  }
  80% {
    transform: translateX(810px) translateY(calc(-0.1 * var(--leaf-amplitude, 30px))) rotateZ(330deg);
  }
  90% {
    opacity: var(--leaf-opacity, 0.6);
    transform: translateX(850px) translateY(0) rotateZ(360deg);
  }
  to {
    transform: translateX(900px) translateY(0) rotateZ(360deg);
    opacity: 0;
  }
}

@keyframes leaf-float-3 {
  0% {
    transform: translateX(-100px) translateY(0) rotateZ(0deg);
    opacity: 0;
  }
  5% {
    opacity: var(--leaf-opacity, 0.6);
    transform: translateX(0px) translateY(calc(-0.16 * var(--leaf-amplitude, 30px))) rotateZ(0deg);
  }
  12% {
    transform: translateX(140px) translateY(calc(0.08 * var(--leaf-amplitude, 30px))) rotateZ(30deg);
  }
  28% {
    transform: translateX(340px) translateY(calc(-0.14 * var(--leaf-amplitude, 30px))) rotateZ(100deg);
  }
  45% {
    transform: translateX(540px) translateY(calc(0.18 * var(--leaf-amplitude, 30px))) rotateZ(170deg);
  }
  62% {
    transform: translateX(740px) translateY(calc(-0.09 * var(--leaf-amplitude, 30px))) rotateZ(250deg);
  }
  78% {
    transform: translateX(880px) translateY(calc(0.11 * var(--leaf-amplitude, 30px))) rotateZ(320deg);
  }
  90% {
    opacity: var(--leaf-opacity, 0.6);
    transform: translateX(850px) translateY(0) rotateZ(360deg);
  }
  to {
    transform: translateX(900px) translateY(0) rotateZ(360deg);
    opacity: 0;
  }
}

@keyframes leaf-float-4 {
  0% {
    transform: translateX(-100px) translateY(0) rotateZ(0deg);
    opacity: 0;
  }
  5% {
    opacity: var(--leaf-opacity, 0.6);
    transform: translateX(0) translateY(calc(0.12 * var(--leaf-amplitude, 30px))) rotateZ(0deg);
  }
  22% {
    transform: translateX(243px) translateY(calc(-0.18 * var(--leaf-amplitude, 30px))) rotateZ(80deg);
  }
  38% {
    transform: translateX(432px) translateY(calc(0.06 * var(--leaf-amplitude, 30px))) rotateZ(150deg);
  }
  55% {
    transform: translateX(621px) translateY(calc(-0.13 * var(--leaf-amplitude, 30px))) rotateZ(220deg);
  }
  72% {
    transform: translateX(810px) translateY(calc(0.15 * var(--leaf-amplitude, 30px))) rotateZ(290deg);
  }
  87% {
    transform: translateX(885px) translateY(calc(-0.07 * var(--leaf-amplitude, 30px))) rotateZ(350deg);
  }
  90% {
    opacity: var(--leaf-opacity, 0.6);
    transform: translateX(850px) translateY(0) rotateZ(360deg);
  }
  to {
    transform: translateX(900px) translateY(0) rotateZ(360deg);
    opacity: 0;
  }
}

@keyframes leaf-spin {
  from {
    transform: rotateZ(0deg);
  }
  to {
    transform: rotateZ(360deg);
  }
}

.weather-title {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-primary);
}

.weather-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.weather-main {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.temperature {
  display: flex;
  align-items: baseline;
  gap: 0.25rem;
}

.temp-value {
  font-size: 3.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, var(--color-accent), var(--color-primary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.temp-unit {
  font-size: 1.5rem;
  color: var(--text-secondary);
}

.weather-condition {
  font-size: 1rem;
  color: var(--text-secondary);
}

.weather-details {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
}

.detail {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.detail .label {
  font-size: 0.75rem;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.detail .value {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text-primary);
}

@media (max-width: 480px) {
  .weather-details {
    grid-template-columns: 1fr;
  }

  .temp-value {
    font-size: 2.5rem;
  }
}
</style>
