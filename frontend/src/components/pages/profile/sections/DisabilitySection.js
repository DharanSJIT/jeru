import React from 'react';
import { Input, Checkbox, SectionTitle } from '../components/FormFields';

const DisabilitySection = ({ userData, setUserData }) => {
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setUserData({
            ...userData,
            disability: {
                ...userData.disability,
                [name]: type === 'checkbox' ? checked : value
            }
        });
    };

    const hasDisability = userData.disability?.hasDisability;

    return (
        <div className="space-y-6">
            <SectionTitle title="HEALTH & DISABILITY" />
            
            <div className="mb-6">
                <Checkbox 
                    label="Are you a Person with Disability (PwD)?" 
                    name="hasDisability" 
                    checked={hasDisability} 
                    onChange={handleChange} 
                />
            </div>

            {hasDisability && (
                <div className="bg-yellow-50/50 p-6 rounded-lg border border-yellow-100 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input 
                            label="TYPE OF DISABILITY" 
                            name="disabilityType" 
                            value={userData.disability?.disabilityType} 
                            onChange={handleChange} 
                            placeholder="e.g. Visual Impairment, Locomotor..."
                        />
                        <Input 
                            label="DISABILITY PERCENTAGE (%)" 
                            name="disabilityPercentage" 
                            type="number" 
                            max="100" 
                            value={userData.disability?.disabilityPercentage} 
                            onChange={handleChange} 
                        />
                    </div>
                    
                    <div className="pt-4 border-t border-yellow-100">
                        <Checkbox 
                            label="Do you have a valid Disability Certificate?" 
                            name="hasDisabilityCertificate" 
                            checked={userData.disability?.hasDisabilityCertificate} 
                            onChange={handleChange} 
                        />
                    </div>
                </div>
            )}

            <SectionTitle title="OTHER HEALTH CRITERIA" />
            <div className="space-y-4 mt-4">
                <Checkbox 
                    label="Do you have any chronic illness?" 
                    name="hasChronicIllness" 
                    checked={userData.disability?.hasChronicIllness} 
                    onChange={handleChange} 
                />
                <Checkbox 
                    label="Are you covered under any Government Health Insurance scheme?" 
                    name="hasHealthInsurance" 
                    checked={userData.disability?.hasHealthInsurance} 
                    onChange={handleChange} 
                />
            </div>
        </div>
    );
};

export default DisabilitySection;
