import React from 'react';
import { SectionTitle } from '../components/FormFields';

const ReviewSection = ({ userData }) => {
    
    // Auto calculate family statistics for review
    const familySize = (userData.family?.length || 0) + 1;
    let totalIncome = Number(userData.employment?.annualIncome || 0);
    userData.family?.forEach(m => {
        totalIncome += Number(m.annualIncome || 0);
    });

    const SectionBlock = ({ title, data }) => (
        <div className="mb-6">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 border-b border-gray-100 pb-2">{title}</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {data.map((item, index) => (
                    item.value && (
                        <div key={index} className="flex flex-col">
                            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wide">{item.label}</span>
                            <span className="text-sm font-medium text-[#0B2149] mt-0.5">{item.value}</span>
                        </div>
                    )
                ))}
            </div>
        </div>
    );

    return (
        <div className="space-y-8">
            <div className="bg-blue-50/50 p-6 rounded-lg border border-blue-100 text-center mb-8">
                <h3 className="text-xl font-bold text-[#0B2149] mb-2">Ready to find your eligible schemes?</h3>
                <p className="text-gray-600 text-sm">Please review your information below. Accurate information ensures the AI engine finds the best government schemes for you.</p>
            </div>

            <SectionTitle title="PROFILE SUMMARY" />
            
            <SectionBlock 
                title="Personal Information" 
                data={[
                    { label: "Name", value: `${userData.personal?.firstName || ''} ${userData.personal?.lastName || ''}` },
                    { label: "Date of Birth", value: userData.personal?.dob?.split('T')[0] },
                    { label: "Age", value: userData.personal?.age },
                    { label: "Gender", value: userData.personal?.gender },
                    { label: "Marital Status", value: userData.personal?.maritalStatus }
                ]}
            />

            <SectionBlock 
                title="Address & Domicile" 
                data={[
                    { label: "District", value: userData.address?.district },
                    { label: "State", value: userData.address?.state },
                    { label: "Area Type", value: userData.address?.ruralUrban },
                    { label: "Pincode", value: userData.address?.pincode }
                ]}
            />

            <SectionBlock 
                title="Social Category" 
                data={[
                    { label: "Category", value: userData.social?.category },
                    { label: "Community", value: userData.social?.community },
                    { label: "Minority", value: userData.social?.isMinority ? "Yes" : "No" }
                ]}
            />

            <SectionBlock 
                title="Family & Financials" 
                data={[
                    { label: "Total Family Size", value: familySize },
                    { label: "Total Household Income", value: `₹${totalIncome}` },
                    { label: "Employment Status", value: userData.employment?.status }
                ]}
            />

            <div className="bg-amber-50 p-4 rounded-md border border-amber-200 mt-8 flex items-start">
                <div className="text-amber-500 mr-3 mt-0.5">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                </div>
                <div>
                    <p className="text-sm font-bold text-amber-800">Declaration</p>
                    <p className="text-xs text-amber-700 mt-1">I declare that all the information provided above is true and correct to the best of my knowledge. I understand this information will be used to recommend government schemes.</p>
                </div>
            </div>
        </div>
    );
};

export default ReviewSection;
