// components/LocationPrompt.tsx
import React from 'react';

interface LocationPromptProps {
  onAccept: () => void;
}

const LocationPrompt: React.FC<LocationPromptProps> = ({ onAccept }) => {
  return (
    <div className="location-prompt">
      <div className="prompt-content">
        <div className="prompt-icon">📍</div>
        <h2>Find Cafes Near You</h2>
        <p>
          To show you the best coffee spots nearby, we need access to your location. 
          Your location data is only used to display nearby cafes and is not stored.
        </p>
        <button onClick={onAccept} className="location-accept-button">
          Allow Location Access
        </button>
        <p className="location-note">
          You'll be able to see cafes even if you deny location, but we won't be able to show distances.
        </p>
      </div>
    </div>
  );
};

export default LocationPrompt;