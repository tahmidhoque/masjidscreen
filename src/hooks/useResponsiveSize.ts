import { useState, useEffect } from 'react';

interface ResponsiveSizes {
  fontSize: {
    h1: string;
    h2: string;
    h3: string;
    h6: string;
    body1: string;
    body2: string;
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
  };
}

const calculateSizes = (width: number, height: number): ResponsiveSizes => {
  const isLandscape = width > height;
  
  // Increased base size for better readability
  const baseSize = isLandscape 
    ? Math.min(height * 0.003, width * 0.0015) 
    : Math.min(width * 0.003, height * 0.0015);

  // Adjusted scale factors for better readability while maintaining hierarchy
  const scaleFactor = isLandscape ? {
    h1: 1.5,
    h2: 1.3,
    h3: 1.2,
    h6: 1.1,
    body1: 1,
    body2: 0.9
  } : {
    h1: 1.4,
    h2: 1.3,
    h3: 1.2,
    h6: 1.1,
    body1: 1,
    body2: 0.9
  };

  // Adjusted spacing units for better layout
  const vw = width * 0.01;
  const vh = height * 0.01;

  return {
    fontSize: {
      h1: `${baseSize * scaleFactor.h1}rem`,
      h2: `${baseSize * scaleFactor.h2}rem`,
      h3: `${baseSize * scaleFactor.h3}rem`,
      h6: `${baseSize * scaleFactor.h6}rem`,
      body1: `${baseSize * scaleFactor.body1}rem`,
      body2: `${baseSize * scaleFactor.body2}rem`,
    },
    spacing: {
      xs: Math.min(vw, vh) * 0.2,
      sm: Math.min(vw, vh) * 0.4,
      md: Math.min(vw, vh) * 0.5,
      lg: Math.min(vw, vh) * 0.6,
    },
  };
};

const useResponsiveSize = () => {
  const [sizes, setSizes] = useState<ResponsiveSizes>(
    calculateSizes(window.innerWidth, window.innerHeight)
  );

  useEffect(() => {
    const handleResize = () => {
      setSizes(calculateSizes(window.innerWidth, window.innerHeight));
    };

    window.addEventListener('resize', handleResize);
    // Also handle orientation changes explicitly
    window.addEventListener('orientationchange', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  return sizes;
};

export default useResponsiveSize; 