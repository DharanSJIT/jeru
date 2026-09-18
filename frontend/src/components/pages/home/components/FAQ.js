"use client";

import { useState } from "react";
import { ChevronDown, MessageCircle } from "lucide-react";
import { useInView } from "./useInView";

const FAQItem = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div
            className={`rounded-2xl border bg-white transition-all duration-500 overflow-hidden ${
                isOpen ? "border-brand/50 shadow-card" : "border-slate-200 hover:border-slate-300"
            }`}
        >
            <button
                className="flex justify-between items-center w-full text-left gap-4 px-6 py-5 focus:outline-none focus-visible:ring-4 focus-visible:ring-accent/30 rounded-2xl"
                onClick={() => setIsOpen(!isOpen)}
                aria-expanded={isOpen}
            >
                <span className={`font-display font-semibold text-base md:text-lg transition-colors duration-300 ${isOpen ? "text-brand-dark" : "text-primary"}`}>
                    {question}
                </span>
                <span
                    className={`flex items-center justify-center w-9 h-9 rounded-full border shrink-0 transition-all duration-500 ${
                        isOpen ? "bg-brand border-brand text-white rotate-180" : "border-slate-200 text-secondary"
                    }`}
                >
                    <ChevronDown className="w-5 h-5" aria-hidden="true" />
                </span>
            </button>
            <div className={`faq-body ${isOpen ? "open" : ""}`}>
                <div>
                    <p className="px-6 pb-6 font-body text-secondary leading-relaxed max-w-2xl">
                        {answer}
                    </p>
                </div>
            </div>
        </div>
    );
};

const FAQ = () => {
    const [ref, isInView] = useInView({ threshold: 0.1 });

    const faqs = [
        {
            question: "How can I apply for a scheme?",
            answer:
                "Open the scheme page from the Schemes section, review the eligibility criteria, then follow the guided application steps. Every scheme page lists exactly what is needed before you apply.",
        },
        {
            question: "What documents are required for application?",
            answer:
                "Documents vary by scheme, but most need proof of identity such as Aadhaar, address proof, an income certificate, and where applicable a category certificate. Each scheme page lists its specific requirements.",
        },
        {
            question: "Who is eligible for the central schemes?",
            answer:
                "Eligibility depends on factors like age, income, occupation and location. Many schemes target specific groups such as women, farmers or students. Check each scheme's eligibility section for accurate guidance.",
        },
        {
            question: "How long does the application process take?",
            answer:
                "Some schemes approve instantly while others take a few weeks to process. Estimated timelines appear on each scheme page, and your application status can be tracked through the portal.",
        },
        {
            question: "Can I apply for multiple schemes at once?",
            answer:
                "Yes, as long as you meet the eligibility criteria for each one. Some schemes restrict combining benefits, so always read the terms before applying.",
        },
        {
            question: "What should I do if my application is rejected?",
            answer:
                "You will receive a notification explaining the reason. Review it, fix any gaps, and reapply if the issue is resolved. Our support team can also guide you on the next steps.",
        },
    ];

    return (
        <section id="faq" ref={ref} className="py-24 md:py-32 px-6 md:px-12 bg-background overflow-hidden">
            <div className="container mx-auto max-w-6xl">
                <div className="grid lg:grid-cols-[0.9fr_1.3fr] gap-12 lg:gap-20">
                    {/* Left — sticky intro */}
                    <div className={`lg:sticky lg:top-32 self-start transition-all duration-700 ${isInView ? "translate-x-0 opacity-100" : "-translate-x-10 opacity-0"}`}>
                        <p className="eyebrow">
                            <span className="inline-flex items-center gap-2">Support</span>
                        </p>
                        <h2 className="section-title mb-6">
                            Frequently asked<br className="hidden sm:block" /> questions
                        </h2>
                        <p className="font-body text-lg text-secondary leading-relaxed mb-10 max-w-md [text-wrap:pretty]">
                            Everything you need to know about discovering, applying and tracking your schemes.
                        </p>
                        <div className="rounded-2xl bg-navy p-7 text-white transition-transform duration-500 hover:-translate-y-1.5 hover:shadow-lift">
                            <span className="flex items-center justify-center w-12 h-12 rounded-xl bg-brand mb-5">
                                <MessageCircle className="w-6 h-6 text-white" aria-hidden="true" />
                            </span>
                            <h3 className="font-display font-bold text-lg mb-2">Still have questions?</h3>
                            <p className="font-body text-sm text-slate-300 leading-relaxed mb-5">
                                Our team is happy to help you find the right scheme.
                            </p>
                            <a
                                href="makkalthunai@gmail.com"
                                className="inline-flex items-center gap-2 font-body font-semibold text-sm text-white bg-white/10 hover:bg-brand transition-colors duration-300 rounded-full px-5 py-2.5"
                            >
                                Contact support
                            </a>
                        </div>
                    </div>

                    {/* Right — accordion */}
                    <div className="space-y-4">
                        {faqs.map((faq, index) => (
                            <div
                                key={index}
                                className={`transition-all duration-700 ${isInView ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}
                                style={{ transitionDelay: `${index * 90}ms` }}
                            >
                                <FAQItem question={faq.question} answer={faq.answer} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FAQ;