import React from 'react';

const ProfileSidebar = ({ sections, activeSectionId, setActiveSectionId, completionPercentage }) => {
    return (
        <div className="bg-white shadow-sm border border-gray-100 rounded-xl overflow-hidden p-6">
            <div className="mb-6">
                <h3 className="text-sm font-bold text-[#0B2149] uppercase tracking-wider mb-2">MY PROFILE</h3>
                <p className="text-xs text-gray-500 mb-4">Build your citizen profile to discover government schemes that may be relevant to you.</p>
                
                <div className="flex justify-between items-end mb-1">
                    <span className="text-xs font-bold text-gray-700 tracking-wider">COMPLETION</span>
                    <span className="text-xs font-bold text-gray-700">{completionPercentage}%</span>
                </div>
                <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                    <div 
                        className="bg-[#0B2149] h-full transition-all duration-500 ease-out" 
                        style={{ width: `${completionPercentage}%` }}
                    ></div>
                </div>
            </div>

            <nav className="flex flex-col space-y-1 mt-6">
                {sections.map((section) => (
                    <button
                        key={section.id}
                        onClick={() => setActiveSectionId(section.id)}
                        className={`text-left px-4 py-3 text-xs font-bold tracking-wider transition-colors ${
                            activeSectionId === section.id 
                            ? 'bg-[#0B2149] text-white rounded' 
                            : 'text-gray-600 hover:bg-gray-50 hover:text-[#0B2149]'
                        }`}
                    >
                        {section.label}
                    </button>
                ))}
            </nav>
        </div>
    );
};

export default ProfileSidebar;
