import React, { useEffect, useState } from 'react';
import { ChevronRight, FileText, BadgeCheck, ArrowDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import HeroCarousel from "./HeroCarousel";

const ROTATING_WORDS = ["you", "your family", "students", "farmers", "women", "entrepreneurs"];

const RotatingWord = () => {
    const [index, setIndex] = useState(0);
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const swap = setInterval(() => {
            setVisible(false);
            setTimeout(() => {
                setIndex((i) => (i + 1) % ROTATING_WORDS.length);
                setVisible(true);
            }, 320);
        }, 2600);
        return () => clearInterval(swap);
    }, []);

    return (
        <span className="relative inline-block overflow-hidden align-bottom" aria-live="polite">
            <span
                className={`inline-block text-brand transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                }`}
            >
                {ROTATING_WORDS[index]}
            </span>
        </span>
    );
};

const HeroSection = () => {
    const navigate = useNavigate();

    const handleExplore = () => navigate("/schemes");

    const marqueeItems = [
        "Education", "Healthcare", "Housing", "Employment", "Agriculture",
        "Women Empowerment", "Skill Development", "Transportation", "Energy", "Digital India",
    ];

    return (
        <section id="home" className="relative min-h-[calc(100dvh-5rem)] flex items-center bg-white overflow-hidden pt-12 lg:pt-16 pb-16 lg:pb-20">
            {/* Massive typographic background element (flat, single color) */}
            <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-[10%] opacity-[0.035] pointer-events-none select-none overflow-hidden hidden lg:block">
                <span className="block text-[24vw] font-display font-extrabold leading-none whitespace-nowrap text-primary">
                    THUNAI
                </span>
            </div>

            {/* Flat geometric accents — borders only, no gradients */}
            <div className="absolute -top-24 right-[8%] w-72 h-72 border-[3px] border-brand/10 rounded-[3rem] rotate-12 hidden lg:block pointer-events-none" aria-hidden="true" />
            <div className="absolute top-[18%] right-[30%] w-16 h-16 border-2 border-brand/25 rounded-2xl hidden xl:block pointer-events-none animate-float-slow" aria-hidden="true" />

            <div className="container mx-auto px-6 md:px-12 z-10 grid lg:grid-cols-[1.1fr_0.9fr] gap-14 lg:gap-14 items-center">
                {/* Left — staggered entrance */}
                <div className="flex flex-col items-start w-full max-w-2xl">
                    {/* Eyebrow badge */}
                    <div className="inline-flex items-center gap-2 rounded-full border border-brand/25 bg-brand-light/60 px-4 py-1.5 mb-6 animate-fade-up stagger-1">
                        <BadgeCheck className="w-4 h-4 text-brand" aria-hidden="true" />
                        <span className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-dark">
                            Government Schemes, Simplified
                        </span>
                    </div>

                    {/* Headline */}
                    <div className="overflow-hidden mb-6">
                        <h1 className="text-[34px] leading-[1.15] sm:text-[44px] lg:text-[52px] font-display font-bold tracking-tight text-primary animate-fade-up stagger-2 [text-wrap:balance]">
                            <span className="block">The right scheme</span>
                            <span className="block">
                                for <RotatingWord />
                            </span>
                        </h1>
                    </div>

                    {/* Subtext */}
                    <div className="overflow-hidden mb-10">
                        <p className="text-lg md:text-xl font-body text-secondary leading-relaxed max-w-xl animate-fade-up stagger-3">
                            Makkal Thunai unites 500+ central and state schemes with eligibility
                            checks, so every citizen claims the benefits they deserve.
                        </p>
                    </div>

                    {/* CTAs */}
                    <div className="animate-fade-up stagger-4 flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                        <button
                            onClick={handleExplore}
                            className="btn-primary sheen-wrapper group"
                            aria-label="Explore government schemes"
                        >
                            Explore Schemes
                            <ChevronRight className="ml-1 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" aria-hidden="true" />
                        </button>
                        <button
                            onClick={() => document.getElementById('how-to-apply')?.scrollIntoView({ behavior: 'smooth' })}
                            className="btn-outline group"
                        >
                            How to Apply
                            <ArrowDown className="ml-1 w-5 h-5 group-hover:translate-y-0.5 transition-transform duration-300" aria-hidden="true" />
                        </button>
                    </div>
                </div>

                {/* Right — sliding image carousel with floating chips */}
                <div className="relative w-full max-w-[680px] mx-auto lg:ml-auto animate-slide-left stagger-3 mb-4">
                    {/* Offset deco frames (flat borders) */}
                    <div className="deco-frame -top-5 -left-5 w-40 h-40 rotate-6" aria-hidden="true" />
                    <div className="deco-frame -bottom-6 -right-4 w-56 h-56 -rotate-3 border-brand/15" aria-hidden="true" />

                    <HeroCarousel />

                    
                </div>
            </div>

            {/* Marquee ticker — flat blue band */}
            <div className="absolute bottom-0 inset-x-0 bg-brand text-white overflow-hidden" aria-hidden="true">
                <div className="marquee-track py-2.5">
                    {[0, 1].map((dup) => (
                        <div key={dup} className="flex items-center shrink-0">
                            {marqueeItems.map((item, i) => (
                                <span key={`${dup}-${i}`} className="flex items-center text-sm font-body font-medium uppercase tracking-[0.16em]">
                                    <span className="px-6">{item}</span>
                                    <span className="w-1.5 h-1.5 rounded-full bg-white/70" />
                                </span>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HeroSection;