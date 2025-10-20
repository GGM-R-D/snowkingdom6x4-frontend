import React from 'react';

const Snowfall = () => {
  // Create an array of numbers to map over for snowflakes
  // Adjust the number (e.g., 150) to increase or decrease snow density
  const snowflakes = Array.from({ length: 750 });

  return (
    <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
      {snowflakes.map((_, index) => (
        <div
          key={index}
          className="snowflake"
          style={{
            // Random horizontal position
            left: `${Math.random() * 100}vw`,
            // Random animation duration for varied speed
            animationDuration: `${Math.random() * 10 + 5}s`, // Between 5 and 15 seconds
            // Random animation delay to start at different times
            animationDelay: `${Math.random() * 5}s`,
            // Random size for snowflakes
            width: `${Math.random() * 3 + 1}px`,
            height: `${Math.random() * 3 + 1}px`,
            // Random opacity
            opacity: Math.random(),
          }}
        />
      ))}
    </div>
  );
};

export default Snowfall;