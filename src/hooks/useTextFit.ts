import { useEffect, useRef, useState } from 'react';

export const useTextFit = (content: string) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const [fontSize, setFontSize] = useState(16); // Start with default size

    useEffect(() => {
        const container = containerRef.current;
        const content = contentRef.current;
        if (!container || !content) return;

        const fitText = () => {
            const containerHeight = container.clientHeight;
            const containerWidth = container.clientWidth;
            
            // Start with a larger font size
            let currentSize = 20;
            content.style.fontSize = `${currentSize}px`;

            // Binary search for the best fitting font size
            let min = 8;  // Minimum readable size
            let max = 40; // Maximum reasonable size

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
            setFontSize(max);
        };

        fitText();

        // Refit on window resize
        const resizeObserver = new ResizeObserver(fitText);
        resizeObserver.observe(container);

        return () => {
            resizeObserver.disconnect();
        };
    }, [content]); // Rerun when content changes

    return { containerRef, contentRef, fontSize };
}; 