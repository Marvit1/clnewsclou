import { useState, useEffect } from "react";
import { Cloud, Sun, CloudRain, Snowflake, Wind, Thermometer } from "lucide-react";
import { motion } from "framer-motion";
import styles from "./WeatherWidget.module.css";

interface WeatherData {
  city: string;
  temp: number;
  condition: string;
  humidity: number;
  wind: number;
  feelsLike: number;
}

const mockWeather: WeatherData[] = [
  { city: "Yerevan", temp: -2, condition: "snow", humidity: 72, wind: 12, feelsLike: -6 },
  { city: "Moscow", temp: -8, condition: "cloudy", humidity: 80, wind: 18, feelsLike: -14 },
  { city: "London", temp: 7, condition: "rain", humidity: 85, wind: 22, feelsLike: 3 },
  { city: "New York", temp: 4, condition: "sunny", humidity: 45, wind: 10, feelsLike: 1 },
];

interface WeatherIcon {
  sunny: string;
  cloudy: string;
  rain: string;
  snow: string;
}

const getWeatherIcon = (condition: string): React.ReactNode => {
  switch (condition) {
    case "sunny":
      return <Sun size={28} style={{ color: "#fbbf24" }} />;
    case "cloudy":
      return <Cloud size={28} style={{ color: "hsl(var(--muted-foreground))" }} />;
    case "rain":
      return <CloudRain size={28} style={{ color: "#60a5fa" }} />;
    case "snow":
      return <Snowflake size={28} style={{ color: "#7dd3fc" }} />;
    default:
      return <Sun size={28} style={{ color: "#fbbf24" }} />;
  }
};

const WeatherWidget = () => {
  const [selected, setSelected] = useState(0);
  const w = mockWeather[selected];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Thermometer size={16} style={{ color: "hsl(var(--accent))" }} />
        <span className={styles.title}>Weather</span>
      </div>

      {/* City selector */}
      <div className={styles.citySelector}>
        {mockWeather.map((c, i) => (
          <button
            key={c.city}
            onClick={() => setSelected(i)}
            className={`${styles.cityButton} ${
              i === selected ? styles.cityButtonActive : styles.cityButtonInactive
            }`}
          >
            {c.city}
          </button>
        ))}
      </div>

      <motion.div
        key={selected}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className={styles.weatherDisplay}
      >
        <div className={styles.weatherIcon}>
          {getWeatherIcon(w.condition)}
        </div>
        <div>
          <div className={styles.temperature}>{w.temp}°C</div>
          <div className={styles.condition}>{w.condition}</div>
        </div>
      </motion.div>

      <div className={styles.statsGrid}>
        <div className={styles.stat}>
          <div className={styles.statLabel}>Feels</div>
          <div className={styles.statValue}>{w.feelsLike}°</div>
        </div>
        <div className={styles.stat}>
          <div className={styles.statLabel}>Humidity</div>
          <div className={styles.statValue}>{w.humidity}%</div>
        </div>
        <div className={styles.stat}>
          <div className={styles.statLabel}>Wind</div>
          <div className={styles.statValue}>{w.wind} km/h</div>
        </div>
      </div>
    </div>
  );
};

export default WeatherWidget;