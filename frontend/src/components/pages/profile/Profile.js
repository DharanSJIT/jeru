import React, { useState, useEffect } from "react";
import { getUserProfile, updateUserProfile } from "../../../services/users/user";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import ProfileSidebar from "./components/ProfileSidebar";
import PersonalSection from "./sections/PersonalSection";
import AddressSection from "./sections/AddressSection";
import SocialSection from "./sections/SocialSection";
import EducationSection from "./sections/EducationSection";
import EmploymentSection from "./sections/EmploymentSection";
import FamilySection from "./sections/FamilySection";
import AgricultureSection from "./sections/AgricultureSection";
import DisabilitySection from "./sections/DisabilitySection";
import ReviewSection from "./sections/ReviewSection";
import { calculateProfileCompletion } from "./utils/profileUtils";

const SECTIONS = [
    { id: "personal", label: "PERSONAL INFORMATION", component: PersonalSection },
    { id: "address", label: "CONTACT & ADDRESS", component: AddressSection },
    { id: "social", label: "SOCIAL CATEGORY", component: SocialSection },
    { id: "education", label: "EDUCATION", component: EducationSection },
    { id: "employment", label: "EMPLOYMENT", component: EmploymentSection },
    { id: "family", label: "FAMILY MEMBERS", component: FamilySection },
    { id: "agriculture", label: "AGRICULTURE", component: AgricultureSection },
    { id: "disability", label: "DISABILITY", component: DisabilitySection },
    { id: "review", label: "REVIEW & CONFIRMATION", component: ReviewSection }
];

const DEFAULT_USER_DATA = {
    personal: { firstName: "", middleName: "", lastName: "", dob: "", age: "", gender: "", maritalStatus: "", fatherName: "", motherName: "", spouseName: "", alternateMobile: "", preferredLanguage: "", nationality: "" },
    address: { currentAddress: "", permanentAddress: "", sameAsCurrent: false, houseNumber: "", street: "", areaLocality: "", villageTownCity: "", taluk: "", district: "", state: "", pincode: "", residenceType: "", ruralUrban: "", isMigrant: false },
    social: { category: "", community: "", casteCertificateAvailable: false, casteCertificateNumber: "", isMinority: false, minorityCommunity: "", isEWS: false },
    education: { isStudying: false, highestQualification: "", currentLevel: "", institutionName: "", institutionType: "", courseName: "", yearOfStudy: "", isFirstGenGraduate: false, marksPercentage: "", passedYear: "", receivingScholarship: false },
    employment: { status: "", occupation: "", sector: "", jobType: "", annualIncome: "", isJobSeeker: false, employmentExchangeRegistered: false },
    family: [],
    agriculture: { isFarmer: false, landOwnership: false, landAreaAcres: "", landType: "", farmerType: "" },
    disability: { hasDisability: false, disabilityType: "", disabilityPercentage: "", hasDisabilityCertificate: false, hasChronicIllness: false, hasHealthInsurance: false },
    documents: { hasAadhaar: false, aadhaarNumber: "", hasPan: false, hasRationCard: false, rationCardType: "", hasIncomeCertificate: false, hasBankPassbook: false }
};

const Profile = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [activeSectionId, setActiveSectionId] = useState("personal");
    const [userData, setUserData] = useState(DEFAULT_USER_DATA);
    
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await getUserProfile();
                if (response.success && response.data) {
                    // Merge fetched data with default data to ensure all nested objects exist
                    setUserData(prev => ({
                        ...prev,
                        ...response.data,
                        personal: { ...prev.personal, ...(response.data.personal || {}) },
                        address: { ...prev.address, ...(response.data.address || {}) },
                        social: { ...prev.social, ...(response.data.social || {}) },
                        education: { ...prev.education, ...(response.data.education || {}) },
                        employment: { ...prev.employment, ...(response.data.employment || {}) },
                        family: response.data.family || [],
                        agriculture: { ...prev.agriculture, ...(response.data.agriculture || {}) },
                        disability: { ...prev.disability, ...(response.data.healthAndDisability || response.data.disability || {}) },
                        documents: { ...prev.documents, ...(response.data.documents || {}) }
                    }));
                }
            } catch (error) {
                console.error("Failed to fetch user data:", error);
                toast.error("Unable to load your profile. Please try again.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchUserData();
    }, []);

    const completionPercentage = calculateProfileCompletion(userData);

    const handleSave = async (showToast = true, isFinalSubmit = false) => {
        setIsSaving(true);
        try {
            // Calculate family stats before saving
            const familyStats = {
                familySize: userData.family.length + 1, // members + user
                adults: userData.family.filter(m => Number(m.age) >= 18).length + (Number(userData.personal?.age) >= 18 ? 1 : 0),
                children: userData.family.filter(m => Number(m.age) < 18).length + (Number(userData.personal?.age) < 18 ? 1 : 0),
                dependents: userData.family.filter(m => m.isDependent).length,
                workingMembers: userData.family.filter(m => Number(m.annualIncome) > 0).length + (Number(userData.employment?.annualIncome) > 0 ? 1 : 0),
                totalFamilyIncome: userData.family.reduce((sum, m) => sum + (Number(m.annualIncome) || 0), 0) + (Number(userData.employment?.annualIncome) || 0)
            };

            const dataToUpdate = {
                ...userData,
                familyStats,
                profileCompletionPercentage: completionPercentage,
                hasCompletedProfile: isFinalSubmit || completionPercentage > 80
            };

            const response = await updateUserProfile(dataToUpdate);
            if (response.success) {
                if (showToast) toast.success("Profile saved successfully");
                setUserData(prev => ({ ...prev, ...response.data })); // Sync state
                return true;
            }
        } catch (error) {
            console.error("Failed to save profile:", error);
            toast.error("Your changes could not be saved. Please try again.");
            return false;
        } finally {
            setIsSaving(false);
        }
    };

    const handleNext = async () => {
        const currentIndex = SECTIONS.findIndex(s => s.id === activeSectionId);
        if (currentIndex < SECTIONS.length - 1) {
            const saved = await handleSave(false);
            if (saved) {
                setActiveSectionId(SECTIONS[currentIndex + 1].id);
                window.scrollTo(0, 0);
            }
        }
    };

    const handlePrevious = () => {
        const currentIndex = SECTIONS.findIndex(s => s.id === activeSectionId);
        if (currentIndex > 0) {
            setActiveSectionId(SECTIONS[currentIndex - 1].id);
            window.scrollTo(0, 0);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-20">
                <div className="flex flex-col items-center space-y-4">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-200 border-t-[#0B2149]"></div>
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-widest">Profile Loading...</p>
                </div>
            </div>
        );
    }

    const ActiveComponent = SECTIONS.find(s => s.id === activeSectionId)?.component || PersonalSection;

    return (
        <div className="bg-[#F8F9FA] min-h-screen pt-[5rem]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8">
                
                {/* Sidebar Navigation */}
                <div className="w-full md:w-1/4 flex-shrink-0">
                    <ProfileSidebar 
                        sections={SECTIONS} 
                        activeSectionId={activeSectionId} 
                        setActiveSectionId={setActiveSectionId}
                        completionPercentage={completionPercentage}
                    />
                </div>

                {/* Main Content Area */}
                <div className="w-full md:w-3/4">
                    <div className="bg-white shadow-sm border border-gray-100 rounded-xl overflow-hidden min-h-[600px] flex flex-col">
                        
                        {/* Section Header */}
                        <div className="px-8 py-6 border-b border-gray-100">
                            <h2 className="text-2xl font-bold text-[#0B2149] uppercase tracking-wide">
                                {SECTIONS.find(s => s.id === activeSectionId)?.label}
                            </h2>
                        </div>

                        {/* Section Content */}
                        <div className="flex-1 p-8">
                            <ActiveComponent 
                                userData={userData} 
                                setUserData={setUserData} 
                            />
                        </div>

                        {/* Navigation Footer */}
                        <div className="px-8 py-6 bg-gray-50 border-t border-gray-100 flex items-center justify-between mt-auto">
                            <button
                                onClick={handlePrevious}
                                disabled={activeSectionId === SECTIONS[0].id || isSaving}
                                className={`px-6 py-2.5 border border-gray-300 rounded-md font-medium text-sm transition-colors ${
                                    activeSectionId === SECTIONS[0].id ? 'opacity-0 cursor-default' : 'text-gray-700 bg-white hover:bg-gray-50'
                                }`}
                            >
                                PREVIOUS
                            </button>
                            
                            <div className="flex space-x-4">
                                <button
                                    onClick={() => handleSave(true)}
                                    disabled={isSaving}
                                    className="px-6 py-2.5 border border-gray-300 rounded-md font-medium text-sm text-gray-700 bg-white hover:bg-gray-50 transition-colors disabled:opacity-50"
                                >
                                    {isSaving ? "SAVING..." : "SAVE PROFILE"}
                                </button>
                                
                                {activeSectionId !== "review" ? (
                                    <button
                                        onClick={handleNext}
                                        disabled={isSaving}
                                        className="px-6 py-2.5 bg-[#0B2149] rounded-md font-medium text-sm text-white hover:bg-[#153468] transition-colors disabled:opacity-50"
                                    >
                                        SAVE & CONTINUE
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => handleSave(true, true).then((res) => { if (res) navigate('/recommendations') })}
                                        disabled={isSaving}
                                        className="px-6 py-2.5 bg-[#0B2149] rounded-md font-medium text-sm text-white hover:bg-[#153468] transition-colors disabled:opacity-50 shadow-md"
                                    >
                                        {isSaving ? "PROCESSING..." : "SUBMIT & FIND SCHEMES"}
                                    </button>
                                )}
                            </div>
                        </div>
                        
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Profile;
