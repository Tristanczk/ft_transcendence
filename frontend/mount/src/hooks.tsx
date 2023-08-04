import { useState, useEffect } from 'react';

export const useWidth = () => {
    const [width, setWidth] = useState<number | undefined>(
        typeof window !== 'undefined' ? window.innerWidth : undefined,
    );

    useEffect(() => {
        function handleResize() {
            setWidth(window.innerWidth);
        }
        window.addEventListener('resize', handleResize);
        handleResize();
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return width;
};
