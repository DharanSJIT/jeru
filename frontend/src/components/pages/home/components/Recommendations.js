import { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Sparkles, UserPlus } from 'lucide-react';
import { UserContext } from '../../../../context/UserContext';
import SchemeCard from '../../../common/schemeCard/SchemeCard';
import { getPersonalizedRecommendations } from '../../../../services/recommendations/recommendationService';

const Recommendations = () => {
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { isUserLoggedIn } = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRecommendations = async () => {
            if (!isUserLoggedIn) return;

            try {
                setLoading(true);
                const data = await getPersonalizedRecommendations();
                setRecommendations(data.schemes);
            } catch (err) {
                setError("Failed to fetch recommendations");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchRecommendations();
    }, [isUserLoggedIn]);

    // Not logged in — full-width blue CTA band
    if (!isUserLoggedIn) {
        return (
            <section className="relative py-24 md:py-28 px-6 md:px-12 bg-brand overflow-hidden">
                <div className="absolute -top-24 -right-16 w-96 h-96 border-[3px] border-white/10 rounded-full hidden lg:block pointer-events-none animate-float-slow" aria-hidden="true" />
                <div className="absolute -bottom-32 -left-20 w-[28rem] h-[28rem] border-[3px] border-white/10 rounded-[4rem] rotate-12 hidden lg:block pointer-events-none" aria-hidden="true" />

                <div className="container mx-auto max-w-4xl relative z-10 text-center">
                    <span className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 border border-white/20 mb-8 animate-bounce-soft">
                        <Sparkles className="w-8 h-8 text-white" aria-hidden="true" />
                    </span>
                    <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/80 mb-4">
                        For You
                    </p>
                    <h2 className="font-display font-bold text-3xl md:text-5xl text-white leading-[1.15] tracking-tight mb-5">
                        Get recommendations built around your profile
                    </h2>
                    <p className="font-body text-lg md:text-xl text-white/85 leading-relaxed max-w-2xl mx-auto mb-10 [text-wrap:pretty]">
                        Create a free account and instantly see the schemes you are actually eligible for.
                    </p>
                    <button
                        onClick={() => navigate('/signup')}
                        className="group inline-flex items-center gap-3 rounded-full bg-white text-brand-dark font-body font-semibold text-lg px-9 py-4 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl active:translate-y-0 active:scale-[0.98]"
                    >
                        <UserPlus className="w-5 h-5" aria-hidden="true" />
                        Create your account
                        <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
                    </button>
                </div>
            </section>
        );
    }

    // Loading state
    if (loading) {
        return (
            <div className="text-center py-20 px-6">
                <div className="inline-block animate-spin rounded-full h-10 w-10 border-[3px] border-brand border-t-transparent"></div>
                <p className="mt-4 font-body text-secondary">Loading recommendations...</p>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <section className="px-6 py-20">
                <div className="container mx-auto max-w-3xl rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
                    <p className="font-body text-lg text-red-600">{error}</p>
                </div>
            </section>
        );
    }

    // Logged in — results grid
    return (
        <section className="py-24 md:py-28 px-6 md:px-12 bg-background">
            <div className="container mx-auto max-w-7xl">
                <div className="flex flex-col items-center text-center mb-14 max-w-2xl mx-auto">
                    <p className="eyebrow justify-center !before:hidden">
                        <span className="inline-flex items-center gap-2">
                            <Sparkles className="w-4 h-4" aria-hidden="true" />
                            For you
                        </span>
                    </p>
                    <h2 className="section-title mb-4">Recommended for you</h2>
                    <p className="font-body text-lg text-secondary [text-wrap:pretty]">
                        Schemes matched to your profile and goals.
                    </p>
                </div>

                {recommendations.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {recommendations.map((scheme, index) => (
                            <Link
                                to={`/scheme/${scheme._id}`}
                                key={scheme._id}
                                className="transition-all duration-500 hover:-translate-y-1.5"
                                style={{ transitionDelay: `${(index % 3) * 80}ms` }}
                            >
                                <SchemeCard scheme={scheme} />
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 max-w-xl mx-auto">
                        <Search size={48} className="text-slate-300 mx-auto mb-4" aria-hidden="true" />
                        <p className="font-body text-lg text-secondary">
                            No recommendations yet. Complete your profile to get personalized suggestions.
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default Recommendations;