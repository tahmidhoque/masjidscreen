import { useEffect, useRef, useState } from 'react';
import useScreenOrientation from './useScreenOrientation';

interface TextFitOptions {
    maxFontSize?: number;
}

export const useTextFit = (content: string, options: TextFitOptions = {}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const [fontSize, setFontSize] = useState(10);
    const { orientation } = useScreenOrientation();
    const isLandscape = orientation === "landscape-primary";

    useEffect(() => {
        const container = containerRef.current;
        const content = contentRef.current;
        if (!container || !content) return;

        const fitText = () => {
            const containerHeight = container.clientHeight;
            const containerWidth = container.clientWidth;
            
            // Determine if we're on a smaller device based on container width
            const isSmallDevice = containerWidth < 500;
            
            // Start with a smaller font size
            let currentSize = isSmallDevice ? 10 : (isLandscape ? 14 : 12);
            content.style.fontSize = `${currentSize}px`;

            // Binary search for the best fitting font size
            let min = isSmallDevice ? 8 : 10;  // Minimum for iPad Mini
            let max = isSmallDevice 
                ? (isLandscape ? 12 : 10)  // Max for iPad Mini
                : (options.maxFontSize || (isLandscape ? 18 : 16)); // Normal max for larger devices

            while (min <= max) {
                currentSize = Math.floor((min + max) / 2);
                content.style.fontSize = `${currentSize}px`;

                if (content.scrollHeight <= containerHeight && content.scrollWidth <= containerWidth) {
                    min = currentSize + 1;
                } else {
                    max = currentSize - 1;
                }
            }

            // Set the final size slightly smaller to ensure no overflow
            const finalSize = Math.min(max - 1, options.maxFontSize || (isLandscape ? 18 : 16));
            setFontSize(finalSize);
        };

        fitText();

        // Refit on window resize
        const resizeObserver = new ResizeObserver(fitText);
        resizeObserver.observe(container);

        return () => {
            resizeObserver.disconnect();
        };
    }, [content, isLandscape, options.maxFontSize]);

    return { containerRef, contentRef, fontSize };
}; 