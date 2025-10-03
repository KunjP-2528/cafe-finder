// components/CafeList.tsx
import React from 'react';
import { Cafe, Position } from '../types';

interface CafeListProps {
  cafes: Cafe[];
  selectedCafe: Cafe | null;
  onCafeSelect: (cafe: Cafe) => void;
  userPosition: Position;
}

const CafeList: React.FC<CafeListProps> = ({ 
  cafes, 
  selectedCafe, 
  onCafeSelect, 
  userPosition 
}) => {
  // Calculate distance between two points using Haversine formula
  const calculateDistance = (cafeLat: number, cafeLng: number): number => {
    const R = 6371; // Earth's radius in km
    const dLat = (cafeLat - userPosition.lat) * Math.PI / 180;
    const dLng = (cafeLng - userPosition.lng) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(userPosition.lat * Math.PI / 180) * Math.cos(cafeLat * Math.PI / 180) * 
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const sortedCafes = [...cafes].sort((a, b) => {
    const distA = calculateDistance(a.lat, a.lng);
    const distB = calculateDistance(b.lat, b.lng);
    return distA - distB;
  });

  return (
    <div className="cafe-list">
      <h2>Nearby Cafes ({cafes.length})</h2>
      <div className="cafe-items">
        {sortedCafes.map(cafe => {
          const distance = calculateDistance(cafe.lat, cafe.lng);
          return (
            <div
              key={cafe.id}
              className={`cafe-item ${selectedCafe?.id === cafe.id ? 'selected' : ''}`}
              onClick={() => onCafeSelect(cafe)}
            >
              <div className="cafe-info">
                <h3>{cafe.name}</h3>
                <p className="cafe-distance">{distance.toFixed(1)} km away</p>
                {cafe.address && (
                  <p className="cafe-address">{cafe.address}</p>
                )}
                {cafe.rating && (
                  <p className="cafe-rating">⭐ {cafe.rating}/5</p>
                )}
                {cafe.hours && (
                  <p className="cafe-hours">{cafe.hours}</p>
                )}
              </div>
              <div className="cafe-actions">
                <span className="select-indicator">→</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CafeList;