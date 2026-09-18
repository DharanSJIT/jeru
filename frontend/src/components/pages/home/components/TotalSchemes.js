import { FileText, Building, Landmark, ShieldCheck } from "lucide-react";
import { useInView, useCountUp } from "./useInView";

const StatCard = ({ icon: Icon, title, value, suffix, delay }) => {
    const [ref, isInView] = useInView();
    const count = useCountUp(value, isInView, 1800);

    return (
        <div
            ref={ref}
            className={`group bg-white/5 border border-white/10 rounded-2xl p-8 flex flex-col items-start gap-5 transition-all duration-500 hover:bg-white/10 hover:-translate-y-1.5 hover:border-brand/60 ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"} reveal-delay-${delay}`}
        >
            <span className="w-14 h-14 rounded-2xl bg-brand flex items-center justify-center shadow-brand-glow transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                <Icon size={26} className="text-white" aria-hidden="true" />
            </span>
            <div>
                <span className="block font-display font-extrabold text-5xl md:text-6xl text-white tabular-nums leading-none">
                    {isInView ? count : 0}
                    <span className="text-brand">{suffix}</span>
                </span>
                <span className="mt-3 block text-sm font-body font-semibold uppercase tracking-[0.16em] text-slate-300">
                    {title}
                </span>
            </div>
        </div>
    );
};

const TotalSchemes = () => {
    return (
        <section className="relative px-6 md:px-12 py-24 md:py-28 bg-navy overflow-hidden">
            {/* Flat brand accents */}
            <div className="absolute top-0 left-0 h-1 w-full bg-brand" aria-hidden="true" />
            <div className="absolute -top-20 -right-20 w-80 h-80 border-[3px] border-white/5 rounded-full hidden lg:block pointer-events-none" aria-hidden="true" />
            <div className="absolute -bottom-28 -left-24 w-96 h-96 border-[3px] border-brand/10 rounded-[4rem] rotate-12 hidden lg:block pointer-events-none" aria-hidden="true" />

            <div className="container mx-auto max-w-7xl relative z-10">
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
                    <div className="max-w-2xl">
                        <p className="eyebrow !text-brand !text-white/90">
                            <span className="inline-flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4" aria-hidden="true" />
                                The Ecosystem
                            </span>
                        </p>
                        <h2 className="section-title !text-white">
                            Every scheme that supports India, in one place
                        </h2>
                    </div>
                    <p className="font-body text-slate-300 text-base leading-relaxed max-w-sm md:text-right">
                        Continuously updated from official central and state sources,
                        so the numbers you see are the numbers you can trust.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
                    <StatCard icon={FileText} title="Available Schemes" value={500} suffix="+" delay={1} />
                    <StatCard icon={Building} title="Central Schemes" value={200} suffix="+" delay={2} />
                    <StatCard icon={Landmark} title="State Schemes" value={300} suffix="+" delay={3} />
                </div>

                <div className="flex flex-wrap justify-center gap-x-8 gap-y-3">
                    {[
                        "No signup needed to browse",
                        "Updated from official sources",
                        "Central and state schemes",
                    ].map((item) => (
                        <span key={item} className="inline-flex items-center gap-2 font-body text-sm text-slate-300">
                            <ShieldCheck className="w-4 h-4 text-brand" aria-hidden="true" />
                            {item}
                        </span>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TotalSchemes;