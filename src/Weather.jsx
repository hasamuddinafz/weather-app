import React, { useState, useEffect } from 'react';
import logo from './img/logo.svg';
import { useNavigate } from 'react-router-dom';
import { MapPin } from "@phosphor-icons/react"; // Import MapPin icon from Phosphor icons

function Weather() {
  const [location, setLocation] = useState('');
  const [cityList, setCityList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/find?q=${location}&type=like&appid=05fae19304ef6cde64c837d5c8613781`
        );
        const data = await response.json();
        if (data && data.list) {
          setCityList(data.list);
        } else {
          setCityList([]);
        }
      } catch (error) {
        console.error('Error fetching cities:', error);
        setCityList([]); // Reset cityList in case of error
      }
    };

    if (location.trim() !== '') {
      fetchCities();
    } else {
      setCityList([]);
    }
  }, [location]);

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      navigateToDetailPage();
    }
  };

  const navigateToDetailPage = () => {
    navigate(`/weather/${location}`);
  };

  const handleLocationClick = async () => {
    try {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            const weatherResponse = await fetch(
              `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=05fae19304ef6cde64c837d5c8613781`
            );
            const weatherData = await weatherResponse.json();
            navigate(`/weather/${weatherData.name}`, { state: { weatherData } });
          },
          (error) => {
            console.error("Error getting user's location:", error);
          }
        );
      } else {
        console.error("Geolocation is not supported by this browser.");
      }
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  };

  const handleOptionClick = async (city) => {
    try {
      const weatherResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city.name}&appid=05fae19304ef6cde64c837d5c8613781`
      );
      const weatherData = await weatherResponse.json();
      navigate(`/weather/${city.name}`, { state: { weatherData } });
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  };

  return (
    <div className="App vh-100 d-flex align-items-center">
      <div className='container'>
        <div className='header my-5 d-flex align-items-center justify-content-center'>
          <span className='fs-2'>
            <img className='img-fluid logo' src={logo} alt='logo' />
            <span className='nunito-bold gray-200'> iweather</span>
          </span>
        </div>
        <div className='text-white text-center gray-300'>
          <h1>Welcome to <span className='blue-light'>TypeWeather</span></h1>
          <p>Choose a location to see the weather forecast</p>
          <div className="mb-3">
          <div className="input-group d-flex align-items-center">
            <input
              type="text"
              className="form-control choose-location p-3"
              placeholder="Search location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onKeyDown={handleKeyDown}
              required // Make the input required
              style={{ height: '38px' }} // Set the height of the input
            />
            <MapPin
              size={38}
              className="cursor-pointer bg-blue-light p-2 rounded-1"
              onClick={handleLocationClick}
              style={{ height: '38px', width: '38px' }} // Set the height and width of the MapPin icon
            />
          </div>

            {cityList && cityList.length > 0 && (
              <ul className="list-group mt-3 bg-gray-800" style={{cursor: "pointer"}}>
                {cityList.map((city) => (
                  <li
                    key={city.id}
                    className="list-group-item bg-gray-500 gray-200"
                    onClick={() => handleOptionClick(city)}
                  >
                    {city.name}, {city.sys.country}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Weather;
