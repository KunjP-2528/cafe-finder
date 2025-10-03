// components/Map.tsx
import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Cafe, Position } from '../types';

// Fix for default markers in Leaflet with Webpack
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapProps {
  userPosition: Position;
  cafes: Cafe[];
  selectedCafe: Cafe | null;
  onCafeSelect: (cafe: Cafe) => void;
}

const Map: React.FC<MapProps> = ({ userPosition, cafes, selectedCafe, onCafeSelect }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  useEffect(() => {
    if (!mapRef.current) return;

    // Initialize map
    const map = L.map(mapRef.current).setView(
      [userPosition.lat, userPosition.lng],
      15
    );

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
    };
  }, [userPosition]);

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Add user location marker
    const userIcon = L.divIcon({
      className: 'user-location-marker',
      html: '📍',
      iconSize: [30, 30],
      iconAnchor: [15, 30],
    });

    const userMarker = L.marker([userPosition.lat, userPosition.lng], {
      icon: userIcon,
    })
      .addTo(map)
      .bindPopup('Your Location')
      .openPopup();

    markersRef.current.push(userMarker);

    // Add cafe markers
    cafes.forEach(cafe => {
      const cafeIcon = L.divIcon({
        className: `cafe-marker ${selectedCafe?.id === cafe.id ? 'selected' : ''}`,
        html: '☕',
        iconSize: [25, 25],
        iconAnchor: [12, 25],
      });

      const marker = L.marker([cafe.lat, cafe.lng], {
        icon: cafeIcon,
      })
        .addTo(map)
        .bindPopup(`
          <div class="cafe-popup">
            <h3>${cafe.name}</h3>
            ${cafe.address ? `<p>${cafe.address}</p>` : ''}
            ${cafe.rating ? `<p>⭐ ${cafe.rating}/5</p>` : ''}
          </div>
        `);

      marker.on('click', () => {
        onCafeSelect(cafe);
      });

      markersRef.current.push(marker);
    });
  }, [cafes, userPosition, selectedCafe, onCafeSelect]);

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !selectedCafe) return;

    // Pan to selected cafe
    map.setView([selectedCafe.lat, selectedCafe.lng], 16);

    // Find and open popup for selected cafe
    const selectedMarker = markersRef.current.find(marker => {
      const latLng = marker.getLatLng();
      return latLng.lat === selectedCafe.lat && latLng.lng === selectedCafe.lng;
    });

    if (selectedMarker) {
      selectedMarker.openPopup();
    }
  }, [selectedCafe]);

  return <div ref={mapRef} className="map" />;
};

export default Map;