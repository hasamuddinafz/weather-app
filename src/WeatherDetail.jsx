import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
// bg-custom backgrounds
import clearDay from "./img/clear_day.png";
import clearNight from "./img/clear_night.png";
import cloudyDay from "./img/cloudy_day.png";
import cloudyNight from "./img/cloudy_night.png";
import fewCloudsDay from "./img/few_clouds_day.png";
import fewCloudsNight from "./img/few_clouds_night.png";
import rainDay from "./img/rain_day.png";
import rainNight from "./img/rain_night.png";
import stormDay from "./img/storm_day.png";
import stormNight from "./img/storm_night.png";

// daily images and weather status images
import moon from "./img/moon.png";
import moonAndRain from "./img/moon_and_rain.png";
import moonClouds from "./img/moon_clouds.png";
import moonStarsClouds from "./img/moon_stars_and_cloud.png";
import rain from "./img/rain.png";
import sun from "./img/sun.png";
import sunClouds from "./img/sun_clouds.png";
import fewClouds from "./img/sun_cloudss.png";
import sunRain from "./img/sun_rain.png";
import thunder from "./img/thunder.png";
//phosphor icons 
import { CloudRain, Drop, Sun, ThermometerSimple, Wind } from "@phosphor-icons/react";
import axios from "axios";

const WeatherDetail = () => {
  const { location } = useParams();
  const [weather, setWeather] = useState(null);
  const [dailyForecasts, setDailyForecasts] = useState([]);

  useEffect(() => {
    const getWeather = async () => {
      try {
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=05fae19304ef6cde64c837d5c8613781`);
        setWeather(response.data);
        const forecasts = response.data.list;
        const dailyForecasts = {};

        forecasts.forEach(forecast => {
          const date = new Date(forecast.dt * 1000).toISOString().split('T')[0];
          if (!dailyForecasts[date]) {
            dailyForecasts[date] = {
              date: date,
              temp_min: forecast.main.temp_min,
              temp_max: forecast.main.temp_max,
              description: forecast.weather[0].description
            };
          } else {
            dailyForecasts[date].temp_min = Math.min(dailyForecasts[date].temp_min, forecast.main.temp_min);
            dailyForecasts[date].temp_max = Math.max(dailyForecasts[date].temp_max, forecast.main.temp_max);
          }
        });
        setDailyForecasts(Object.values(dailyForecasts).slice(0, 5));
      } catch (error) {
        console.error(error);
      }
    };

    getWeather();
  }, [location]);

  const getBackgroundImage = (description, isDayTime) => {
    if (description.includes("clear")) {
      return isDayTime ? clearDay : clearNight;
    } else if (description.includes("clouds")) {
      return isDayTime ? cloudyDay : cloudyNight;
    } else if (description.includes("few clouds")) {
      return isDayTime ? fewCloudsDay : fewCloudsNight;
    } else if (description.includes("rain")) {
      return isDayTime ? rainDay : rainNight;
    } else if (description.includes("storm")) {
      return isDayTime ? stormDay : stormNight;
    }
    return isDayTime ? clearDay : clearNight;
  };

  const getWeatherIcon = (description, isDayTime) => {
    if (description.includes("clear")) {
      return isDayTime ? sun : moon;
    } else if (description.includes("clouds")) {
      return isDayTime ? sunClouds : moonClouds;
    } else if (description.includes("few clouds")) {
      return isDayTime ? fewClouds : moonStarsClouds;
    } else if (description.includes("rain")) {
      return isDayTime ? sunRain : moonAndRain;
    } else if (description.includes("storm")) {
      return thunder;
    }
    return isDayTime ? sun : moon;
  };

  if (!weather) {
    return <div>Loading...</div>;
  }

  const currentHour = new Date().getHours();
  const sunrise = new Date(weather.city.sunrise * 1000);
  const sunset = new Date(weather.city.sunset * 1000);
  const isDayTime = currentHour >= sunrise.getHours() && currentHour < sunset.getHours();
  const currentWeather = weather.list[0];

  return (
    <div className="container">
      <div className="row d-flex flex-row p-3 justify-content-center text-white">
        <div className="col-12 col-md-6 col-lg-4 p-3 d-flex flex-column align-items-center justify-content-center bg-gray-800 rounded-4">
          <div className="header p-2 bg-gray-700 rounded-4 my-2">
            <div
              className="rounded-4 p-4 d-flex flex-column justify-content-between"
              style={{
                backgroundImage: `url(${getBackgroundImage(
                  currentWeather.weather[0].description,
                  isDayTime
                )})`,
              }}
            >
              <div className="row nunito-bold">
                <span>
                  {weather.city.name}, {weather.city.country}
                </span>
                <p className="gray-300">{new Date().toLocaleDateString()}</p>
              </div>
              <div className="row d-flex justify-content-between align-items-center mt-5">
                <div className="col-6">
                  <h1 className="nunito-extra-bold">
                    {Math.round(currentWeather.main.temp - 273.15)}ºc
                  </h1>
                  <span className="nunito-bold">
                    {Math.round(currentWeather.main.temp_min - 273.15)}ºc /{' '}
                    {Math.round(currentWeather.main.temp_max - 273.15)}ºc
                  </span>
                  <br />
                  <span className="nunito-semi-bold">
                    {currentWeather.weather[0].description}
                  </span>
                </div>
                <div className="col-4">
                  <img
                    className="img-fluid"
                    src={getWeatherIcon(currentWeather.weather[0].description, isDayTime)}
                    alt="Weather-status"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="list p-3 bg-gray-700 rounded-4 my-2 nunito-bold w-100">
            <div className="list-content d-flex align-items-center justify-content-between my-4">
              <div className="icon-title">
                <ThermometerSimple size={28} className="gray-500" />{' '}
                <span className="gray-300">Thermal Sensation</span>
              </div>
              <div className="number">
                <span>{Math.round(currentWeather.main.feels_like - 273.15)}ºc</span>
              </div>
            </div>

            <div className="list-content d-flex align-items-center justify-content-between my-4">
              <div className="icon-title">
                <CloudRain size={28} className="gray-500" />{' '}
                <span className="gray-300">Probability of rain</span>
              </div>
              <div className="number">
                <span>{currentWeather.pop * 100}%</span>
              </div>
            </div>

            <div className="list-content d-flex align-items-center justify-content-between my-4">
              <div className="icon-title">
                <Wind size={28} className="gray-500" />{' '}
                <span className="gray-300">Wind speed</span>
              </div>
              <div className="number">
                <span>{currentWeather.wind.speed} m/s</span>
              </div>
            </div>

            <div className="list-content d-flex align-items-center justify-content-between my-4">
              <div className="icon-title">
                <Drop size={28} className="gray-500" />{' '}
                <span className="gray-300">Air humidity</span>
              </div>
              <div className="number">
                <span>{currentWeather.main.humidity}%</span>
              </div>
            </div>

            <div className="list-content d-flex align-items-center justify-content-between my-4">
              <div className="icon-title">
                <Sun size={28} className="gray-500" />{' '}
                <span className="gray-300">Sunrise Time</span>
              </div>
              <div className="number">
                <span>{sunrise.toLocaleTimeString()}</span>
              </div>
            </div>
          </div>

          <div className="daily-weather bg-gray-700 my-2 rounded-4 p-3 w-100">
            <div className="daily-weather-content">
              <div className="d-flex flex-nowrap align-items-center justify-content-between">
                {dailyForecasts.map((day, index) => (
                  <div className="daily-content text-center nunito-bold mx-1" key={index}>
                    <div className="weekend">
                      <span className="gray-200">
                        {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                      </span>
                    </div>
                    <div className="img-status">
                      <img
                        src={getWeatherIcon(day.description, isDayTime)}
                        alt={day.description}
                        className="img-fluid"
                      />
                    </div>
                    <div className="highest-degree">
                      <span>{Math.round(day.temp_max - 273.15)}ºc</span>
                    </div>
                    <div className="lowest-degree gray-200">
                      <span>{Math.round(day.temp_min - 273.15)}ºc</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  );
};

export default WeatherDetail;
