import { useEffect, useRef, useState } from "react";

/**
 * Observes an element and flips `true` once it enters the viewport.
 * Keeps the flag sticky so reveals only fire once.
 */
export const useInView = (options = { threshold: 0.15 }) => {
    const [isInView, setIsInView] = useState(false);
    const ref = useRef(null);
    const optionsRef = useRef(options);
    optionsRef.current = options;

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        if (typeof IntersectionObserver === "undefined") {
            setIsInView(true);
            return;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsInView(true);
                    observer.disconnect();
                }
            },
            optionsRef.current
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    return [ref, isInView];
};

/**
 * Animates a number from 0 to `target` once `start` becomes true.
 * Uses requestAnimationFrame with an ease-out curve and full cleanup.
 */
export const useCountUp = (target, start, duration = 1600) => {
    const [value, setValue] = useState(0);
    const rafRef = useRef(null);

    useEffect(() => {
        if (!start) return;

        let startTime = null;
        const tick = (now) => {
            if (startTime === null) startTime = now;
            const elapsed = now - startTime;
            const t = Math.min(elapsed / duration, 1);
            // easeOutCubic
            const eased = 1 - Math.pow(1 - t, 3);
            setValue(Math.round(eased * target));
            if (t < 1) rafRef.current = requestAnimationFrame(tick);
        };

        rafRef.current = requestAnimationFrame(tick);
        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, [start, target, duration]);

    return value;
};