import { UserPlus, Search, CheckSquare } from "lucide-react";
import { useInView } from "./useInView";

const steps = [
    {
        icon: UserPlus,
        step: "01",
        title: "Share your details",
        description: "Tell us a little about yourself and your needs in under two minutes.",
    },
    {
        icon: Search,
        step: "02",
        title: "Find your match",
        description: "Our engine instantly shortlists every scheme you are eligible for.",
    },
    {
        icon: CheckSquare,
        step: "03",
        title: "Apply with confidence",
        description: "Follow the guided process and track your application in one place.",
    },
];

const HowToApply = () => {
    const [ref, isInView] = useInView({ threshold: 0.15 });

    return (
        <section id="how-to-apply" ref={ref} className="py-24 md:py-32 px-6 md:px-12 bg-background overflow-hidden">
            <div className="container mx-auto max-w-6xl">
                <div className={`flex flex-col items-center text-center mb-16 max-w-2xl mx-auto transition-all duration-700 ${isInView ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}>
                    <p className="eyebrow justify-center !before:hidden">
                        <span className="inline-flex items-center gap-2">How it works</span>
                    </p>
                    <h2 className="section-title mb-4">Apply in three simple steps</h2>
                    <p className="font-body text-lg text-secondary leading-relaxed [text-wrap:pretty]">
                        No paperwork, no queues. From discovery to application in minutes.
                    </p>
                </div>

                <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">
                    {/* Connector line (desktop) */}
                    <div className="hidden md:block absolute top-16 left-[16%] right-[16%] h-0.5 bg-slate-200" aria-hidden="true">
                        <div
                            className={`h-full bg-brand origin-left transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${isInView ? "scale-x-100" : "scale-x-0"}`}
                        />
                    </div>

                    {steps.map(({ icon: Icon, step, title, description }, index) => (
                        <div
                            key={step}
                            className={`group relative flex md:block items-start gap-5 rounded-2xl bg-white border border-slate-200 p-8 transition-all duration-500 hover:-translate-y-2 hover:border-brand/50 hover:shadow-lift ${isInView ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
                            style={{ transitionDelay: `${index * 140}ms` }}
                        >
                            <div className="relative mb-6 shrink-0">
                                <span className="flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-light text-brand border border-brand/15 transition-all duration-500 group-hover:bg-brand group-hover:text-white group-hover:scale-105 group-hover:shadow-brand-glow">
                                    <Icon size={28} aria-hidden="true" />
                                </span>
                                <span className="absolute -top-2.5 -right-2.5 flex items-center justify-center w-8 h-8 rounded-full bg-white border-2 border-brand font-display font-bold text-xs text-brand transition-all duration-500 group-hover:bg-brand group-hover:text-white">
                                    {step}
                                </span>
                            </div>
                            <div>
                                <h3 className="font-display font-bold text-xl text-primary mb-2 tracking-tight transition-colors duration-300 group-hover:text-brand-dark">
                                    {title}
                                </h3>
                                <p className="font-body text-sm text-secondary leading-relaxed">{description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HowToApply;