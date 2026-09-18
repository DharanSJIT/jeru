import React, { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import banner1 from "../../../../assets/banner1.png";
import banner2 from "../../../../assets/banner2.webp";
import banner3 from "../../../../assets/banner3.jpg";
import banner4 from "../../../../assets/banner4.jpg";
import banner5 from "../../../../assets/banner5.jpg";

const SLIDES = [
    {
        src: banner2,
        tag: "Discover",
        title: "Every scheme you qualify for, at a glance",
        alt: "Citizen browsing government schemes on the Makkal Thunai portal",
    },
    {
        src: banner3,
        tag: "Eligibility",
        title: "Check eligibility in under two minutes",
        alt: "Quick eligibility check for government schemes",
    },
    {
        src: banner4,
        tag: "Apply",
        title: "Apply online, without the paperwork",
        alt: "Simple online application form for a government scheme",
    },
    {
        src: banner5,
        tag: "Track",
        title: "Follow every application in one place",
        alt: "Application status tracking on the Makkal Thunai portal",
    },
    {
        src: banner1,
        tag: "Support",
        title: "Support for every stage of life",
        alt: "Support across education, health, housing and work",
    },
];

const AUTOPLAY_MS = 3500;

const HeroCarousel = () => {
    const [index, setIndex] = useState(0);
    const [paused, setPaused] = useState(false);
    const [noTransition, setNoTransition] = useState(false);
    const [swipeDelta, setSwipeDelta] = useState(0);
    const [swiping, setSwiping] = useState(false);
    const touchStartX = useRef(null);
    const indexRef = useRef(0);
    const count = SLIDES.length;
    const reducedMotion = useRef(false);

    useEffect(() => {
        reducedMotion.current =
            window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
    }, []);

    useEffect(() => {
        indexRef.current = index;
    }, [index]);

    /* Jump to a slide; wrapping around snaps instantly instead of rewinding */
    const goTo = useCallback(
        (next) => {
            if (next >= count || next < 0) {
                setNoTransition(true);
                setIndex(((next % count) + count) % count);
                requestAnimationFrame(() =>
                    requestAnimationFrame(() => setNoTransition(false))
                );
            } else {
                setIndex(next);
            }
        },
        [count]
    );

    const advance = useCallback(() => goTo(indexRef.current + 1), [goTo]);

    /* Autoplay — pauses on hover/focus, on hidden tabs, and for reduced motion */
    useEffect(() => {
        if (paused || reducedMotion.current) return undefined;
        const timer = setInterval(() => {
            if (!document.hidden) advance();
        }, AUTOPLAY_MS);
        return () => clearInterval(timer);
    }, [paused, advance]);

    const onKeyDown = (event) => {
        if (event.key === "ArrowLeft") goTo(index - 1);
        if (event.key === "ArrowRight") goTo(index + 1);
    };

    /* Touch swipe — drag the track, release to snap to the next/previous slide */
    const onTouchStart = (event) => {
        touchStartX.current = event.touches[0].clientX;
        setSwiping(true);
        setSwipeDelta(0);
        setPaused(true);
    };
    const onTouchMove = (event) => {
        if (touchStartX.current === null) return;
        setSwipeDelta(touchStartX.current - event.touches[0].clientX);
    };
    const onTouchEnd = () => {
        if (swipeDelta > 40) goTo(index + 1);
        else if (swipeDelta < -40) goTo(index - 1);
        touchStartX.current = null;
        setSwiping(false);
        setSwipeDelta(0);
        setPaused(false);
    };

    return (
        <div className="relative" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
            {/* Frame + sliding track */}
            <div
                role="region"
                aria-roledescription="carousel"
                aria-label="Makkal Thunai highlights"
                onFocus={() => setPaused(true)}
                onBlur={() => setPaused(false)}
                onKeyDown={onKeyDown}
                tabIndex={0}
                className={`relative rounded-[28px] overflow-hidden shadow-lift ring-1 ring-slate-900/5 bg-navy outline-none focus-visible:ring-4 focus-visible:ring-brand/40 ${
                    paused ? "carousel-paused" : ""
                }`}
            >
                <div
                    className={`flex h-[260px] sm:h-[340px] lg:h-[480px] select-none touch-pan-y ease-[cubic-bezier(0.16,1,0.3,1)] ${
                        noTransition || swiping ? "" : "transition-transform duration-700"
                    }`}
                    style={{
                        transform: `translateX(calc(-${index * 100}% ${
                            swiping ? `- ${swipeDelta}px` : ""
                        }))`,
                    }}
                    onTouchStart={onTouchStart}
                    onTouchMove={onTouchMove}
                    onTouchEnd={onTouchEnd}
                >
                    {SLIDES.map((slide, i) => (
                        <div
                            key={slide.title}
                            aria-hidden={i !== index}
                            className="relative w-full h-full shrink-0 overflow-hidden"
                        >
                            <img
                                src={slide.src}
                                alt={i === index ? slide.alt : ""}
                                className="w-full h-full object-contain bg-black/20"
                                loading={i === 0 ? "eager" : "lazy"}
                                fetchpriority={i === 0 ? "high" : "low"}
                                decoding="async"
                                draggable={false}
                            />
                            {/* Flat navy caption panel with autoplay progress */}
                            <div className="absolute inset-x-0 bottom-0 bg-navy/85 backdrop-blur-sm">
                                <div className="h-[3px] bg-white/15" aria-hidden="true">
                                    <div
                                        key={index}
                                        className="carousel-progress-fill h-full bg-brand"
                                        style={{ animationPlayState: paused ? "paused" : "running" }}
                                    />
                                </div>
                                <div className="px-6 py-4 flex items-end justify-between gap-4">
                                    <div>
                                        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-brand-light mb-0.5">
                                            {slide.tag}
                                        </p>
                                        <p className="font-display font-semibold text-white text-base sm:text-lg leading-snug max-w-[24rem]">
                                            {slide.title}
                                        </p>
                                    </div>
                                    <p className="shrink-0 font-body text-sm text-slate-400 tabular-nums pb-0.5">
                                        {String(i + 1).padStart(2, "0")}{" "}
                                        <span className="text-slate-600 mx-0.5">/</span>{" "}
                                        {String(count).padStart(2, "0")}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Prev / next controls */}
                <button
                    type="button"
                    onClick={() => goTo(index - 1)}
                    aria-label="Previous slide"
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/90 text-primary shadow-card hover:bg-brand hover:text-white hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center"
                >
                    <ChevronLeft className="w-5 h-5" aria-hidden="true" />
                </button>
                <button
                    type="button"
                    onClick={() => goTo(index + 1)}
                    aria-label="Next slide"
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/90 text-primary shadow-card hover:bg-brand hover:text-white hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center"
                >
                    <ChevronRight className="w-5 h-5" aria-hidden="true" />
                </button>
            </div>

            {/* Thumbnail rail */}
            <div className="mt-4 flex items-center gap-2 sm:gap-2.5">
                {SLIDES.map((slide, i) => (
                    <button
                        key={slide.title}
                        type="button"
                        onClick={() => goTo(i)}
                        aria-label={`Go to slide ${i + 1}: ${slide.title}`}
                        aria-current={i === index}
                        className={`relative flex-1 h-[52px] sm:h-[60px] rounded-xl overflow-hidden ring-2 transition-all duration-300 ${
                            i === index
                                ? "ring-brand shadow-card opacity-100"
                                : "ring-transparent opacity-55 hover:opacity-90 hover:-translate-y-0.5"
                        }`}
                    >
                        <img
                            src={slide.src}
                            alt=""
                            loading="lazy"
                            decoding="async"
                            className="w-full h-full object-cover"
                        />
                    </button>
                ))}
            </div>
        </div>
    );
};

export default HeroCarousel;