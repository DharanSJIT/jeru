import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import SchemeCard from '../../common/schemeCard/SchemeCard';
import Pagination from '../../common/pagination/Pagination';
import { getPersonalizedRecommendations } from '../../../services/recommendations/recommendationService';

const Recommendations = () => {
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalSchemes, setTotalSchemes] = useState(0);
    const [error, setError] = useState(null);

    const fetchRecommendations = useCallback(async (page) => {
        try {
            setLoading(true);
            setError(null);
            const data = await getPersonalizedRecommendations(page);
            
            setRecommendations(data.schemes);
            setTotalPages(data.totalPages);
            setCurrentPage(data.currentPage);
            setTotalSchemes(data.totalSchemes);
        } catch (error) {
            console.error('Failed to fetch recommendations:', error);
            setError('Failed to fetch recommendations. Please try again.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchRecommendations(currentPage);
    }, [currentPage, fetchRecommendations]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo(0, 0);
    };

    const recommendationsCountText = totalSchemes > 0 
        ? `Showing ${(currentPage-1)*9}-${currentPage*9} of ${totalSchemes} recommended schemes`
        : '';

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50/50 flex flex-col items-center justify-center p-6">
                <div className="relative">
                    {/* Outer pulsing rings */}
                    <div className="absolute inset-0 border-4 border-[#0052CC]/20 rounded-full animate-ping" style={{ animationDuration: '3s' }}></div>
                    <div className="absolute inset-[-1rem] border-2 border-[#0052CC]/10 rounded-full animate-ping" style={{ animationDuration: '2s', animationDelay: '0.5s' }}></div>
                    
                    {/* Core spinner */}
                    <div className="relative flex items-center justify-center w-24 h-24 bg-white rounded-full shadow-lg border-4 border-gray-50 z-10">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-[#0052CC]"></div>
                    </div>
                </div>

                <div className="mt-12 text-center max-w-md">
                    <h2 className="text-[#0052CC] font-bold text-lg tracking-widest uppercase mb-3 animate-pulse">
                        Analyzing Your Profile...
                    </h2>
                    <p className="text-gray-500 text-sm font-medium tracking-wide leading-relaxed">
                        CROSS-REFERENCING YOUR DETAILS AGAINST HUNDREDS OF GOVERNMENT SCHEMES TO FIND YOUR PERFECT MATCHES
                    </p>
                </div>

                {/* Skeleton Cards Grid for background context */}
                <div className="w-full max-w-5xl mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-40">
                    {[1, 2, 3].map((item) => (
                        <div key={item} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm animate-pulse">
                            <div className="h-6 bg-gray-200 rounded-md w-3/4 mb-4"></div>
                            <div className="h-4 bg-gray-100 rounded-md w-full mb-2"></div>
                            <div className="h-4 bg-gray-100 rounded-md w-5/6 mb-6"></div>
                            <div className="flex gap-2 mb-6">
                                <div className="h-6 bg-blue-50 rounded-full w-16"></div>
                                <div className="h-6 bg-blue-50 rounded-full w-20"></div>
                            </div>
                            <div className="h-10 bg-gray-100 rounded-lg w-full"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-100 min-h-screen">
            <section className="container mx-auto py-12">
                <h1 className="text-4xl font-bold pt-10 mb-8 text-center">Recommended Schemes for You</h1>

                {error && (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-8" role="alert">
                        <p>{error}</p>
                    </div>
                )}

                {recommendationsCountText && (
                    <p className="text-gray-600 mb-4">{recommendationsCountText}</p>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {recommendations.map((scheme) => (
                        <Link to={`/scheme/${scheme._id}`} key={scheme._id}>
                            <SchemeCard scheme={scheme} />
                        </Link>
                    ))}
                </div>

                {!loading && recommendations.length > 0 && (
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                )}

                {recommendations.length === 0 && !loading && (
                    <div className="text-center py-8">
                        <Search size={48} className="text-gray-400 mx-auto mb-4" />
                        <p className="text-xl text-gray-600">
                            No recommendations found. Please update your profile preferences.
                        </p>
                    </div>
                )}
            </section>
        </div>
    );
};

export default Recommendations;
