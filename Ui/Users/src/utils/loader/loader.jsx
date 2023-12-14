import { useEffect, useRef } from 'react';
import loaderStyles from './loader.module.css';

const Loader = () => {
    const circlesRef = useRef([]);

    useEffect(() => {
        const circles = circlesRef.current;

        const reset = () => {
            for (let circle of circles) {
                circle.style.zIndex = 1;
            }
        };

        let idx = 0;

        const interval = setInterval(() => {
            reset();
            if (idx < 4) idx++;
            else idx = 0;
            circles[idx].style.zIndex = 100;
        }, 1500);

        return () => clearInterval(interval);
    }, []);

    const colors = ['blue', 'red', 'yellow', 'green', 'purple'];

    return (
        <div style={{ height: '100%', width: '100%', position: 'fixed' }}>
            <div className={loaderStyles.transition}>
                {colors.map((color) => (
                    <div
                        key={color}
                        ref={el => (circlesRef.current = el)}
                        className={`${loaderStyles.circle} ${loaderStyles[color]}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default Loader;
