import React from 'react';
import { Input, Select, Checkbox, SectionTitle } from '../components/FormFields';
import { Trash2, Plus } from 'lucide-react';

const FamilySection = ({ userData, setUserData }) => {
    
    const handleAddMember = () => {
        setUserData({
            ...userData,
            family: [
                ...userData.family,
                { name: '', relationship: '', age: '', gender: '', occupation: '', annualIncome: '', isDependent: false }
            ]
        });
    };

    const handleRemoveMember = (index) => {
        const newFamily = [...userData.family];
        newFamily.splice(index, 1);
        setUserData({ ...userData, family: newFamily });
    };

    const handleChange = (index, e) => {
        const { name, value, type, checked } = e.target;
        const newFamily = [...userData.family];
        newFamily[index] = {
            ...newFamily[index],
            [name]: type === 'checkbox' ? checked : value
        };
        setUserData({ ...userData, family: newFamily });
    };

    return (
        <div className="space-y-6">
            <SectionTitle 
                title="FAMILY MEMBERS" 
                subtitle="Add details of all members living in your household. This helps us calculate your family size and total household income automatically."
            />
            
            {userData.family.length === 0 ? (
                <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                    <p className="text-gray-500 mb-4">No family members added yet.</p>
                </div>
            ) : (
                <div className="space-y-8">
                    {userData.family.map((member, index) => (
                        <div key={index} className="relative bg-white border border-gray-200 shadow-sm rounded-xl p-6">
                            <button 
                                onClick={() => handleRemoveMember(index)}
                                className="absolute top-4 right-4 text-red-400 hover:text-red-600 transition-colors p-2"
                                title="Remove member"
                            >
                                <Trash2 size={18} />
                            </button>
                            
                            <h4 className="font-bold text-[#0B2149] mb-4">MEMBER {index + 1}</h4>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <Input label="NAME" name="name" value={member.name} onChange={(e) => handleChange(index, e)} required />
                                <Select label="RELATIONSHIP" name="relationship" value={member.relationship} onChange={(e) => handleChange(index, e)} options={['Father', 'Mother', 'Spouse', 'Son', 'Daughter', 'Brother', 'Sister', 'Grandfather', 'Grandmother', 'Other']} required />
                                <Input label="AGE" name="age" type="number" value={member.age} onChange={(e) => handleChange(index, e)} required />
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <Select label="GENDER" name="gender" value={member.gender} onChange={(e) => handleChange(index, e)} options={['Male', 'Female', 'Other']} />
                                <Input label="OCCUPATION" name="occupation" value={member.occupation} onChange={(e) => handleChange(index, e)} />
                                <Input label="ANNUAL INCOME (₹)" name="annualIncome" type="number" value={member.annualIncome} onChange={(e) => handleChange(index, e)} />
                            </div>

                            <div className="mt-2">
                                <Checkbox label="Is this member financially dependent on you?" name="isDependent" checked={member.isDependent} onChange={(e) => handleChange(index, e)} />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="flex justify-center mt-6 pt-4 border-t border-gray-100">
                <button 
                    onClick={handleAddMember}
                    className="flex items-center text-sm font-bold text-[#0B2149] bg-blue-50 px-6 py-3 rounded-md hover:bg-blue-100 transition-colors"
                >
                    <Plus size={18} className="mr-2" />
                    ADD FAMILY MEMBER
                </button>
            </div>
        </div>
    );
};

export default FamilySection;
