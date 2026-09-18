import { GraduationCap, Heart, Users, Briefcase, Home, Sprout, Book, Truck, Sun, Wifi, Zap, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useInView } from "./useInView";

const CategoryCard = ({ icon: Icon, title, description, index }) => (
    <div
        className="group relative h-full cursor-pointer rounded-2xl border border-slate-200 bg-white p-7 transition-all duration-500 hover:-translate-y-2 hover:border-brand/50 hover:shadow-lift overflow-hidden"
        style={{ transitionDelay: `${(index % 4) * 60}ms` }}
    >
        {/* Top accent line grows on hover */}
        <span className="absolute top-0 left-0 right-0 h-[3px] bg-brand origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100" aria-hidden="true" />

        <span className="flex items-center justify-center w-14 h-14 rounded-2xl bg-brand-light text-brand transition-all duration-500 group-hover:bg-brand group-hover:text-white group-hover:scale-110 group-hover:-rotate-3 mb-6">
            <Icon size={26} aria-hidden="true" />
        </span>
        <h3 className="font-display font-bold text-xl text-primary mb-2 tracking-tight transition-colors duration-300 group-hover:text-brand-dark">
            {title}
        </h3>
        <p className="font-body text-sm text-secondary leading-relaxed">{description}</p>

        <span className="absolute bottom-6 right-6 w-9 h-9 rounded-full bg-brand/10 flex items-center justify-center opacity-0 translate-x-3 transition-all duration-500 group-hover:opacity-100 group-hover:translate-x-0" aria-hidden="true">
            <ArrowRight className="w-4 h-4 text-brand" />
        </span>
    </div>
);

const Categories = () => {
    const navigate = useNavigate();
    const [ref, isInView] = useInView({ threshold: 0.08 });

    const categories = [
        { icon: GraduationCap, title: "Education", description: "Scholarships, loans and learning support" },
        { icon: Heart, title: "Healthcare", description: "Insurance, treatment and wellness aid" },
        { icon: Users, title: "Women Empowerment", description: "Safety, finance and skill initiatives" },
        { icon: Briefcase, title: "Employment", description: "Jobs, training and entrepreneurship" },
        { icon: Home, title: "Housing", description: "Affordable homes and rental support" },
        { icon: Sprout, title: "Agriculture", description: "Farming aid, seeds and subsidies" },
        { icon: Book, title: "Skill Development", description: "Certifications and upskilling tracks" },
        { icon: Truck, title: "Transportation", description: "Vehicle and mobility assistance" },
        { icon: Sun, title: "Energy", description: "Solar, power and clean fuel schemes" },
        { icon: Wifi, title: "Digital India", description: "Connectivity and e-services" },
        { icon: Zap, title: "Rural Development", description: "Infrastructure and village growth" },
    ];

    return (
        <section ref={ref} className="py-24 md:py-32 px-6 md:px-12 bg-white overflow-hidden">
            <div className="container mx-auto max-w-7xl">
                <div className={`flex flex-col items-center text-center mb-16 max-w-2xl mx-auto transition-all duration-700 ${isInView ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}>
                    <p className="eyebrow justify-center !before:hidden">
                        <span className="inline-flex items-center gap-2">Sectors</span>
                    </p>
                    <h2 className="section-title mb-4">Browse by sector</h2>
                    <p className="font-body text-lg text-secondary leading-relaxed [text-wrap:pretty]">
                        Select your area of interest and instantly see every scheme that fits.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {categories.map((category, index) => (
                        <div
                            key={category.title}
                            className={`h-full transition-all duration-700 ${isInView ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
                            style={{ transitionDelay: `${index * 60}ms` }}
                            onClick={() => navigate(`/schemes?cat=${category.title}`)}
                        >
                            <CategoryCard {...category} index={index} />
                        </div>
                    ))}

                    {/* 12th tile — complete the grid and route to all sectors */}
                    <div
                        className={`h-full transition-all duration-700 ${isInView ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
                        style={{ transitionDelay: `${categories.length * 60}ms` }}
                        onClick={() => navigate("/schemes")}
                    >
                        <div className="group relative h-full cursor-pointer rounded-2xl bg-navy p-7 flex flex-col justify-between overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-lift">
                            <div className="absolute -top-10 -right-10 w-36 h-36 rounded-full border-[3px] border-white/10 group-hover:scale-110 transition-transform duration-500" aria-hidden="true" />
                            <span className="w-14 h-14 rounded-2xl bg-brand flex items-center justify-center mb-6 transition-transform duration-500 group-hover:scale-110">
                                <Zap size={26} className="text-white" aria-hidden="true" />
                            </span>
                            <div>
                                <h3 className="font-display font-bold text-xl text-white mb-2 tracking-tight">All sectors</h3>
                                <p className="font-body text-sm text-slate-300 leading-relaxed mb-5">Browse the complete scheme database</p>
                                <span className="inline-flex items-center gap-2 font-body font-semibold text-sm text-white group-hover:gap-3 transition-all duration-300">
                                    Explore all <ArrowRight className="w-4 h-4" aria-hidden="true" />
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Categories;