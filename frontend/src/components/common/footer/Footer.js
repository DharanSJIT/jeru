import headphones from "../../../utils/images/footer/headphones.svg";
import mail from "../../../utils/images/footer/mail.svg";
import instagram from "../../../utils/images/footer/instagram.png";
import facebook from "../../../utils/images/footer/facebook.png";
import youtube from "../../../utils/images/footer/youtube.png";
import x from "../../../utils/images/footer/twitter.png";
import { Link } from "react-router-dom";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { useState } from "react";
import toast from "react-hot-toast";

const Footer = () => {
    const [email, setEmail] = useState("");

    const quickLinks = [
        { label: "About", target: "/#about" },
        { label: "Schemes", target: "/schemes" },
        { label: "Recommendations", target: "/recommendations" },
        { label: "Login", target: "/login" },
        { label: "Create Account", target: "/signup" },
    ];
    const categories = [
        { label: "Education", target: "/schemes?cat=Education" },
        { label: "Healthcare", target: "/schemes?cat=Healthcare" },
        { label: "Housing", target: "/schemes?cat=Housing" },
        { label: "Agriculture", target: "/schemes?cat=Agriculture" },
        { label: "Employment", target: "/schemes?cat=Employment" },
    ];
    const socialMedia = [facebook, x, instagram, youtube];

    const handleSubscribe = (e) => {
        e.preventDefault();
        if (!email.trim()) return;
        toast.success("You are subscribed to scheme updates");
        setEmail("");
    };

    return (
        <footer className="flex flex-col bg-navy text-white border-t border-slate-800 overflow-hidden">
            {/* Newsletter strip */}
            <div className="border-b border-white/10">
                <div className="max-w-7xl mx-auto px-6 md:px-12 py-10 flex flex-col md:flex-row md:items-center gap-6 md:justify-between">
                    <div>
                        <h3 className="font-display font-bold text-xl text-white mb-1">Never miss a new scheme</h3>
                        <p className="font-body text-sm text-slate-400">
                            Get notified when central and state schemes are added or updated.
                        </p>
                    </div>
                    <form onSubmit={handleSubscribe} className="flex w-full md:w-auto gap-3" aria-label="Newsletter subscription">
                        <label htmlFor="newsletter-email" className="sr-only">Email address</label>
                        <input
                            id="newsletter-email"
                            type="email"
                            required
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="flex-1 md:w-72 px-5 py-3 rounded-full bg-white/10 border border-white/15 text-white placeholder:text-slate-400 font-body text-sm focus:outline-none focus:border-brand transition-colors duration-300"
                        />
                        <button
                            type="submit"
                            className="rounded-full bg-brand px-6 py-3 font-body font-semibold text-sm text-white transition-all duration-300 hover:bg-brand-dark hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] shadow-brand-glow shrink-0 cursor-pointer"
                        >
                            Subscribe
                        </button>
                    </form>
                </div>
            </div>

            <div className="flex justify-center py-16 px-6 md:px-12">
                <div className="flex flex-wrap gap-12 lg:gap-16 w-full max-w-7xl justify-between">
                    {/* Brand */}
                    <div className="flex flex-col gap-6 max-w-sm">
                        <div>
                            <h2 className="font-display font-bold text-3xl tracking-tight text-white mb-1">
                                Makkal <span className="text-brand">Thunai</span>
                            </h2>
                            <p className="font-body text-sm text-slate-400">
                                One portal for every government scheme in India.
                            </p>
                        </div>
                        <div className="flex flex-col gap-4 font-body text-slate-300">
                            <a href="tel:+911234567890" className="flex items-center gap-3 group cursor-pointer">
                                <span className="p-2.5 bg-white/5 rounded-xl border border-white/10 group-hover:bg-brand group-hover:border-brand transition-all duration-300 group-hover:-translate-y-0.5">
                                    <img src={headphones} alt="" className="w-5 h-5 filter invert" />
                                </span>
                                <span className="font-medium group-hover:text-white transition-colors duration-300">+91 12345 67890</span>
                            </a>
                            <a href="mailto:9582anupamk@gmail.com" className="flex items-center gap-3 group cursor-pointer">
                                <span className="p-2.5 bg-white/5 rounded-xl border border-white/10 group-hover:bg-brand group-hover:border-brand transition-all duration-300 group-hover:-translate-y-0.5">
                                    <img src={mail} alt="" className="w-5 h-5 filter invert" />
                                </span>
                                <span className="font-medium group-hover:text-white transition-colors duration-300">9582anupamk@gmail.com</span>
                            </a>
                        </div>
                    </div>

                    {/* Quick links */}
                    <div className="flex flex-col gap-5">
                        <h3 className="font-display font-bold text-lg text-white tracking-wide uppercase">Quick Links</h3>
                        <div className="flex flex-col gap-3 font-body text-slate-400">
                            {quickLinks.map((link) => (
                                <Link
                                    key={link.label}
                                    to={link.target}
                                    className="group flex items-center gap-2 text-sm font-medium w-fit transition-colors duration-300 hover:text-white"
                                >
                                    <span className="h-px w-0 bg-brand transition-all duration-300 group-hover:w-4" aria-hidden="true" />
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Categories */}
                    <div className="flex flex-col gap-5">
                        <h3 className="font-display font-bold text-lg text-white tracking-wide uppercase">Categories</h3>
                        <div className="flex flex-col gap-3 font-body text-slate-400">
                            {categories.map((category) => (
                                <Link
                                    key={category.label}
                                    to={category.target}
                                    className="group flex items-center gap-2 text-sm font-medium w-fit transition-colors duration-300 hover:text-white"
                                >
                                    <span className="h-px w-0 bg-brand transition-all duration-300 group-hover:w-4" aria-hidden="true" />
                                    {category.label}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Social */}
                    <div className="flex flex-col gap-5">
                        <h3 className="font-display font-bold text-lg text-white tracking-wide uppercase">Connect</h3>
                        <div className="flex gap-4">
                            {socialMedia.map((icon, index) => (
                                <button
                                    key={index}
                                    type="button"
                                    aria-label={`Social media link ${index + 1}`}
                                    className="cursor-pointer bg-white/5 border border-white/10 rounded-xl p-3 hover:bg-brand hover:border-brand hover:-translate-y-1.5 transition-all duration-300"
                                >
                                    <img src={icon} alt="" className="w-5 h-5 filter invert" />
                                </button>
                            ))}
                        </div>
                        <p className="font-body text-sm text-slate-400 max-w-[240px]">
                            Follow us for scheme alerts, deadlines and eligibility tips.
                        </p>
                    </div>
                </div>
            </div>

            <div className="border-t border-white/10 bg-navy-light w-full flex justify-between items-center px-6 md:px-12 py-6 flex-col md:flex-row gap-4">
                <p className="text-slate-400 font-body text-sm">
                    &copy; {new Date().getFullYear()} Makkal Thunai. All rights reserved.{" "}
                    <span className="mx-1 text-white/20" aria-hidden="true">|</span>{" "}
                    <button type="button" className="hover:text-white transition-colors duration-300 cursor-pointer">Privacy</button>{" "}
                    <span className="mx-1 text-white/20" aria-hidden="true">•</span>{" "}
                    <button type="button" className="hover:text-white transition-colors duration-300 cursor-pointer">Terms</button>
                </p>
                
                <Link
                    
                >
                    <p className="font-body font-medium text-sm text-slate-400 group-hover:text-white transition-colors duration-300">
                        Developed by <span className="text-brand font-semibold group-hover:text-white">Skippers</span>
                    </p>
                    {/* <OpenInNewIcon className="w-4 h-4 text-slate-400 group-hover:text-brand transition-colors duration-300" /> */}
                </Link>
            </div>
        </footer>
    );
};

export default Footer;