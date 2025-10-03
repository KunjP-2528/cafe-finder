// App.tsx
import React, { useState, useEffect } from 'react';
import Map from './components/Map';
import CafeList from './components/CafeList';
import LocationPrompt from './components/LocationPrompt';
import { Cafe, Position } from './types';
import './App.css';

const App: React.FC = () => {
  const [userPosition, setUserPosition] = useState<Position | null>(null);
  const [cafes, setCafes] = useState<Cafe[]>([]);
  const [selectedCafe, setSelectedCafe] = useState<Cafe | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [locationError, setLocationError] = useState<string | null>(null);

  // Load cafe data from JSON
  useEffect(() => {
    const loadCafes = async () => {
      try {
        const response = await fetch('/cafes.json');
        const cafeData = await response.json();
        setCafes(cafeData.cafes);
      } catch (error) {
        console.error('Failed to load cafe data:', error);
      }
    };

    loadCafes();
  }, []);

  // Get user location
  const getUserLocation = () => {
    setIsLoading(true);
    setLocationError(null);

    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserPosition({ lat: latitude, lng: longitude });
        setIsLoading(false);
      },
      (error) => {
        console.error('Error getting location:', error);
        setLocationError('Unable to retrieve your location. Please enable location permissions.');
        setIsLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  const handleCafeSelect = (cafe: Cafe) => {
    setSelectedCafe(cafe);
  };

  const handleLocationAccept = () => {
    getUserLocation();
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>☕ Find Nearby Cafes</h1>
        <p>Discover great coffee spots near you</p>
      </header>

      <main className="app-main">
        {!userPosition && !locationError && (
          <LocationPrompt onAccept={handleLocationAccept} />
        )}

        {locationError && (
          <div className="error-message">
            <p>{locationError}</p>
            <button onClick={getUserLocation} className="retry-button">
              Try Again
            </button>
          </div>
        )}

        {isLoading && userPosition === null && (
          <div className="loading">Getting your location...</div>
        )}

        {userPosition && (
          <div className="content-wrapper">
            <div className="cafe-list-container">
              <CafeList
                cafes={cafes}
                selectedCafe={selectedCafe}
                onCafeSelect={handleCafeSelect}
                userPosition={userPosition}
              />
            </div>
            <div className="map-container">
              <Map
                userPosition={userPosition}
                cafes={cafes}
                selectedCafe={selectedCafe}
                onCafeSelect={handleCafeSelect}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;