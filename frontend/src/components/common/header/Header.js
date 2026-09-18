import React, { useState, useContext, useRef, useEffect } from "react";
import { LogIn, User, ShieldCheck, ChevronDown } from 'lucide-react';
import { Link, useLocation, useNavigate } from "react-router-dom";
import { UserContext } from "../../../context/UserContext";
import userAuthenticatedAxiosInstance from "../../../services/users/userAuthenticatedAxiosInstance";
import lionlogo from "../../../assets/lionsymbol.png";
import { useTranslation } from 'react-i18next';


const Header = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [progress, setProgress] = useState(0);
    const { isUserLoggedIn, setIsUserLoggedIn } = useContext(UserContext);
    const navigate = useNavigate();
    const location = useLocation();
    const profileRef = useRef(null);
    const { t, i18n } = useTranslation();

    const userAxiosInstance = userAuthenticatedAxiosInstance('/api/v1/users');


    // Close the mobile menu whenever the route changes
    useEffect(() => {
        setIsOpen(false);
    }, [location.pathname]);

    // Close profile dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setIsProfileOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Scrolled state + scroll progress (passive + rAF throttled, fully cleaned up)
    useEffect(() => {
        let raf = null;
        const onScroll = () => {
            if (raf) return;
            raf = requestAnimationFrame(() => {
                const max = document.documentElement.scrollHeight - window.innerHeight;
                setProgress(max > 0 ? Math.min(window.scrollY / max, 1) : 0);
                setScrolled(window.scrollY > 10);
                raf = null;
            });
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
        return () => {
            window.removeEventListener('scroll', onScroll);
            if (raf) cancelAnimationFrame(raf);
        };
    }, []);

    const handleLogout = async () => {
        try {
            await userAxiosInstance.post("/logout");
        } catch (error) {
            console.error("An error occurred", error.message);
        } finally {
            localStorage.removeItem("accessToken");
            setIsUserLoggedIn(false);
            setIsProfileOpen(false);
            navigate("/");
        }
    };

    const scrollToSection = (id) => {
        setIsOpen(false);
        if (location.pathname !== "/") {
            navigate("/");
            setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }), 350);
        } else {
            document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
        }
    };

    const toggleLanguage = () => {
        const newLang = i18n.language === 'en' ? 'ta' : 'en';
        i18n.changeLanguage(newLang);
    };

    return (
        <>
            <header
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
                    scrolled
                        ? "bg-white/90 backdrop-blur-md shadow-card border-b border-slate-200/80 py-2.5"
                        : "bg-white/60 backdrop-blur-sm border-b border-transparent py-4"
                }`}
            >
                {/* Scroll progress bar */}
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-transparent" aria-hidden="true">
                    <div
                        className="h-full bg-brand origin-left transition-transform duration-150 ease-out"
                        style={{ transform: `scaleX(${progress})` }}
                    />
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-6">
                    {/* Brand */}
                    <Link to="/" className="flex items-center gap-3 group flex-shrink-0">
                        <span className="relative">
                            <img
                                src={lionlogo}
                                alt="Makkal Thunai logo"
                                className="w-10 h-10 md:w-11 md:h-11 rounded-xl object-cover ring-2 ring-brand/20 transition-all duration-300 group-hover:ring-brand/50 group-hover:scale-105"
                            />
                        </span>
                        <span className="leading-tight">
                            <span className="block font-display font-bold text-xl md:text-[22px] tracking-tight text-primary">
                                Makkal <span className="text-brand">Thunai</span>
                            </span>
                            <span className="hidden sm:block text-[10px] font-body font-semibold uppercase tracking-[0.22em] text-secondary">
                                One portal for schemes
                            </span>
                        </span>
                    </Link>

                    {/* Desktop nav */}
                    <nav className="hidden lg:flex items-center gap-10" aria-label="Primary">
                        <button onClick={() => scrollToSection("home")} className={`nav-link ${location.pathname === "/" ? "nav-active" : ""}`}>{t('nav.home', 'Home')}</button>
                        <button onClick={() => scrollToSection("about")} className="nav-link">{t('nav.about', 'About')}</button>
                        <Link to="/schemes" className={`nav-link ${location.pathname.startsWith("/scheme") ? "nav-active" : ""}`}>{t('nav.schemes', 'Schemes')}</Link>
                        <Link to="/profile" className={`nav-link ${location.pathname.startsWith("/profile") ? "nav-active" : ""}`}>
                            <span className="inline-flex items-center gap-1.5">
                                <User className="w-4 h-4" aria-hidden="true" />
                                {t('nav.profile', 'Profile')}
                            </span>
                        </Link>
                    </nav>

                    {/* Right actions */}
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={toggleLanguage}
                            className="text-sm font-semibold text-brand px-3 py-1.5 border border-brand rounded-md hover:bg-brand hover:text-white transition-colors"
                        >
                            {i18n.language === 'en' ? 'தமிழ்' : 'English'}
                        </button>

                        {isUserLoggedIn ? (
                            <div className="relative" ref={profileRef}>
                                <button
                                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                                    className="flex items-center gap-1.5 bg-surface border border-slate-200 text-primary rounded-full px-3.5 py-2 hover:border-accent hover:text-accent transition-colors duration-300 focus:outline-none focus-visible:ring-4 focus-visible:ring-accent/30"
                                    aria-label="Account menu"
                                    aria-expanded={isProfileOpen}
                                >
                                    <User size={18} />
                                    <span className="hidden md:block font-body text-sm font-medium">Account</span>
                                    <ChevronDown size={14} className={`transition-transform duration-300 ${isProfileOpen ? "rotate-180" : ""}`} />
                                </button>
                                {isProfileOpen && (
                                    <div className="absolute right-0 mt-3 w-48 bg-white border border-slate-200 shadow-lift rounded-xl py-2 z-50 animate-drop-in overflow-hidden">
                                        <Link
                                            to="/profile"
                                            className="block px-4 py-2.5 text-primary hover:bg-brand-light/60 font-body text-sm transition-colors duration-200"
                                            onClick={() => setIsProfileOpen(false)}
                                        >
                                            Profile
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="block w-full text-left px-4 py-2.5 text-red-600 hover:bg-red-50 font-body text-sm transition-colors duration-200"
                                        >
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link
                                to="/login"
                                className="btn-primary !px-6 !py-2.5 text-sm"
                            >
                                <LogIn size={16} aria-hidden="true" />
                                <span>Login</span>
                            </Link>
                        )}

                        {/* Mobile hamburger */}
                        <button
                            className="lg:hidden text-primary p-2 hover:text-brand transition-colors duration-300 focus:outline-none focus-visible:ring-4 focus-visible:ring-accent/30 rounded-lg"
                            onClick={() => setIsOpen(!isOpen)}
                            aria-label={isOpen ? "Close menu" : "Open menu"}
                            aria-expanded={isOpen}
                        >
                            <span className="relative block w-6 h-6">
                                <span className={`absolute left-0 top-1/2 -translate-y-1/2 block h-0.5 w-6 bg-current transition-all duration-300 ${isOpen ? "rotate-45" : "-translate-y-[5px]"}`} />
                                <span className={`absolute left-0 top-1/2 -translate-y-1/2 block h-0.5 w-6 bg-current transition-all duration-300 ${isOpen ? "opacity-0" : ""}`} />
                                <span className={`absolute left-0 top-1/2 -translate-y-1/2 block h-0.5 w-6 bg-current transition-all duration-300 ${isOpen ? "-rotate-45" : "translate-y-[5px]"}`} />
                            </span>
                        </button>
                    </div>
                </div>

                {/* Mobile panel */}
                <div
                    className={`lg:hidden overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                        isOpen ? "max-h-[420px] opacity-100 visible" : "max-h-0 opacity-0 invisible"
                    }`}
                    aria-hidden={!isOpen}
                >
                    <nav className="mx-4 mt-3 mb-4 bg-white border border-slate-200 shadow-lift rounded-2xl px-4 py-3 flex flex-col" aria-label="Mobile">
                        <MobileNavLink to="/" onClick={() => setIsOpen(false)}>{t('nav.home', 'Home')}</MobileNavLink>
                        <MobileNavLink to="/" onClick={() => scrollToSection("about")}>{t('nav.about', 'About')}</MobileNavLink>
                        <MobileNavLink to="/schemes" onClick={() => setIsOpen(false)}>{t('nav.schemes', 'Schemes')}</MobileNavLink>
                        <MobileNavLink to="/profile" onClick={() => setIsOpen(false)}>{t('nav.profile', 'Profile')}</MobileNavLink>

                        {!isUserLoggedIn && (
                            <Link
                                to="/login"
                                onClick={() => setIsOpen(false)}
                                className="mt-3 btn-primary w-full"
                            >
                                <LogIn size={16} aria-hidden="true" />
                                Login
                            </Link>
                        )}
                    </nav>
                </div>
            </header>
        </>
    );
};

const MobileNavLink = ({ to, children, onClick }) => (
    <Link
        to={to}
        onClick={onClick}
        className="text-primary hover:text-accent py-3.5 border-b border-slate-100 last:border-0 font-body text-base font-semibold flex items-center transition-colors duration-200 group"
    >
        <span className="mr-3 h-1.5 w-1.5 rounded-full bg-brand/30 group-hover:bg-brand transition-colors duration-200" aria-hidden="true" />
        {children}
    </Link>
);

export default Header;