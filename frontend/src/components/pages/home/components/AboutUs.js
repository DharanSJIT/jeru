import { Target, Users, Shield, ArrowDown } from "lucide-react";
import digitalIndia from "../../../../assets/digitalIndia.webp";
import { useInView } from "./useInView";

const pillars = [
    {
        icon: Target,
        title: "Our Mission",
        text: "Empower every citizen with clear, current information about the schemes they are entitled to.",
    },
    {
        icon: Users,
        title: "Who We Serve",
        text: "Students, farmers, women, seniors and every Indian looking to benefit from government initiatives.",
    },
    {
        icon: Shield,
        title: "Our Commitment",
        text: "Accurate, up-to-date scheme data sourced directly from official central and state portals.",
    },
];

const AboutUs = () => {
    const [ref, isInView] = useInView({ threshold: 0.1 });

    return (
        <section id="about" ref={ref} className="relative py-24 md:py-32 px-6 md:px-12 bg-white overflow-hidden">
            <div className="absolute -bottom-24 -right-24 w-96 h-96 border-[3px] border-brand/10 rounded-[4rem] rotate-12 hidden lg:block pointer-events-none" aria-hidden="true" />

            <div className="container mx-auto max-w-7xl grid lg:grid-cols-2 gap-14 lg:gap-20 items-center relative z-10">
                {/* Left — copy */}
                <div className={`transition-all duration-700 ${isInView ? "translate-x-0 opacity-100" : "-translate-x-10 opacity-0"}`}>
                    <p className="eyebrow">
                        <span className="inline-flex items-center gap-2">About Makkal Thunai</span>
                    </p>
                    <h2 className="section-title mb-6">
                        Bridging citizens and<br className="hidden sm:block" /> government schemes
                    </h2>
                    <p className="font-body text-lg text-secondary leading-relaxed mb-8 max-w-xl [text-wrap:pretty]">
                        Makkal Thunai exists to close the gap between schemes and the people they
                        were created for. What used to require visits, paperwork and endless
                        searches now takes minutes, from any device.
                    </p>

                    <div className="space-y-4 mb-10">
                        {pillars.map(({ icon: Icon, title, text }, index) => (
                            <div
                                key={title}
                                className={`group flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5 transition-all duration-500 hover:-translate-y-1 hover:border-brand/50 hover:shadow-card ${isInView ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}
                                style={{ transitionDelay: `${index * 120}ms` }}
                            >
                                <span className="flex items-center justify-center w-12 h-12 rounded-xl bg-brand-light text-brand shrink-0 transition-all duration-500 group-hover:bg-brand group-hover:text-white group-hover:scale-105">
                                    <Icon size={22} aria-hidden="true" />
                                </span>
                                <div>
                                    <h3 className="font-display font-bold text-base text-primary mb-1">{title}</h3>
                                    <p className="font-body text-sm text-secondary leading-relaxed">{text}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={() => document.getElementById("faq")?.scrollIntoView({ behavior: "smooth" })}
                        className="btn-outline group"
                    >
                        Learn more
                        <ArrowDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform duration-300" aria-hidden="true" />
                    </button>
                </div>

                {/* Right — framed visual */}
                <div className={`relative transition-all duration-700 ${isInView ? "translate-x-0 opacity-100" : "translate-x-10 opacity-0"}`}>
                    <div className="deco-frame -top-5 -left-5 w-44 h-44 -rotate-6" aria-hidden="true" />
                    <div className="relative rounded-[28px] overflow-hidden shadow-lift ring-1 ring-slate-900/5 group">
                        <img
                            src={digitalIndia}
                            alt="Digital India initiative supporting connected citizens"
                            className="w-full h-[340px] md:h-[440px] object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                            loading="lazy"
                            decoding="async"
                        />
                        <div className="absolute inset-x-0 bottom-0 bg-navy/85 backdrop-blur-sm px-6 py-4 flex items-center justify-between text-white">
                            <p className="font-body text-sm font-medium text-slate-200">
                                Updated from official
                                <span className="text-white font-semibold"> central &amp; state sources</span>
                            </p>
                            <span className="flex -space-x-2" aria-hidden="true">
                                <span className="w-7 h-7 rounded-full bg-brand border-2 border-white" />
                                <span className="w-7 h-7 rounded-full bg-accent border-2 border-white" />
                                <span className="w-7 h-7 rounded-full bg-navy-light border-2 border-white" />
                            </span>
                        </div>
                    </div>

                    {/* Floating chip */}
                    <div className="absolute -right-4 lg:-right-8 -top-6 bg-white rounded-2xl shadow-lift border border-slate-100 px-4 py-3 flex items-center gap-3 animate-float">
                        <span className="w-10 h-10 rounded-xl bg-brand flex items-center justify-center">
                            <Shield className="w-5 h-5 text-white" aria-hidden="true" />
                        </span>
                        <span>
                            <span className="block font-display font-bold text-sm text-primary leading-tight">Verified Data</span>
                            <span className="block text-xs text-secondary font-body">Refreshed regularly</span>
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutUs;