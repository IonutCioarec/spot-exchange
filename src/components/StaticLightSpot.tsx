import React from 'react';

interface StaticLightSpotProps {
  size: number;         // Size of the light spot
  x: string;            // Position on the X axis (e.g., '50%', '0%')
  y: string;            // Position on the Y axis (e.g., '50%', '0%')
  color: string;        // Color of the light spot
  intensity?: number;   // Intensity (opacity)
  blur?: number
}

const StaticLightSpot: React.FC<StaticLightSpotProps> = ({ size, x, y, color, intensity = 0.3, blur = size / 3 }) => {
  return (
    <div
      style={{
        position: 'absolute',
        top: y,
        left: x,
        width: size,
        height: size,
        borderRadius: '50%',
        background: color,
        zIndex: -1,
        filter: `blur(${size / 3}px)`,
        opacity: intensity,
      }}
    />
  );
};

export default StaticLightSpot;