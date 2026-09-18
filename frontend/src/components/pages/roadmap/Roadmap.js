import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSchemeById } from '../../../services/schemes/schemeService';
import { ArrowLeft, Map, CheckCircle2, ChevronRight, MapPin } from 'lucide-react';

const Roadmap = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [scheme, setScheme] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSchemeDetails = async () => {
            try {
                const data = await getSchemeById(id);
                setScheme(data);
            } catch (err) {
                setError("Failed to fetch scheme roadmap");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchSchemeDetails();
        }
    }, [id]);

    if (loading) return <div className="p-4 text-center">Loading roadmap...</div>;
    if (error) return <div className="p-4 text-red-500 text-center">{error}</div>;
    if (!scheme) return <div className="p-4 text-center">Scheme not found</div>;

    // Try to extract steps from application process
    let steps = [];
    if (scheme.applicationProcess && scheme.applicationProcess.length > 0) {
        // If there are multiple modes, just take the first one or combine them
        // Usually, mode is "Online Application" or similar.
        steps = scheme.applicationProcess[0].process || [];
    }

    if (steps.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
                <div className="bg-white p-8 rounded-2xl shadow-sm text-center max-w-md w-full">
                    <Map size={48} className="mx-auto text-gray-300 mb-4" />
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">No Roadmap Available</h2>
                    <p className="text-gray-500 mb-6">This scheme doesn't have a detailed step-by-step application process listed yet.</p>
                    <button 
                        onClick={() => navigate(-1)}
                        className="px-6 py-2 bg-[#0052CC] text-white rounded-lg font-medium hover:bg-[#003D99] transition-colors"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50/50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <button
                    onClick={() => navigate(-1)}
                    className="mb-8 px-4 py-2 text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-gray-900 flex items-center shadow-sm transition-all duration-200 group w-fit"
                >
                    <ArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform duration-200" size={18} />
                    Back to Scheme
                </button>

                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden relative">
                    {/* Decorative Header */}
                    <div className="bg-[#0052CC] p-10 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white opacity-10 blur-3xl pointer-events-none"></div>
                        <div className="relative z-10">
                            <div className="inline-flex items-center justify-center p-3 bg-white/20 rounded-2xl backdrop-blur-sm mb-6 border border-white/20">
                                <Map size={32} className="text-white" />
                            </div>
                            <h1 className="text-3xl font-bold mb-3">{scheme.schemeName}</h1>
                            <p className="text-blue-100 text-lg flex items-center gap-2">
                                <span className="flex-1 opacity-90">Step-by-Step Application Roadmap</span>
                            </p>
                        </div>
                    </div>

                    <div className="p-10 pt-12 relative">
                        {/* Vertical Timeline Line */}
                        <div className="absolute left-[3.25rem] top-12 bottom-12 w-0.5 bg-[#0052CC] opacity-20"></div>

                        <div className="space-y-12 relative">
                            {steps.map((step, index) => {
                                const isLast = index === steps.length - 1;
                                
                                return (
                                    <div key={index} className="relative flex group">
                                        {/* Number/Icon Node */}
                                        <div className="flex-shrink-0 mr-6 mt-1 relative z-10">
                                            <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white border-2 border-blue-100 text-[#0052CC] font-bold text-lg shadow-sm group-hover:scale-110 group-hover:border-[#0052CC] group-hover:bg-blue-50 transition-all duration-300">
                                                {isLast ? <CheckCircle2 size={24} className="text-emerald-500" /> : index + 1}
                                            </div>
                                        </div>

                                        {/* Content Card */}
                                        <div className="flex-1">
                                            <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 group-hover:border-blue-200">
                                                <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                                                    {isLast ? "Final Step" : `Step ${index + 1}`}
                                                </h3>
                                                <p className="text-gray-600 leading-relaxed text-base">
                                                    {step.details || (step.children && step.children[0]?.text) || "Step details"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Completion Banner */}
                        <div className="mt-16 bg-emerald-50 border border-emerald-100 rounded-2xl p-6 text-center">
                            <div className="inline-flex items-center justify-center w-12 h-12 bg-emerald-100 rounded-full mb-4 text-emerald-600">
                                <MapPin size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-emerald-800 mb-2">You're Ready to Apply!</h3>
                            <p className="text-emerald-600 mb-0">Follow these steps carefully to ensure a smooth application process.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Roadmap;
