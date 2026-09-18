import React from 'react';
import { Input, Select, Checkbox, SectionTitle } from '../components/FormFields';

const EmploymentSection = ({ userData, setUserData }) => {
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setUserData({
            ...userData,
            employment: {
                ...userData.employment,
                [name]: type === 'checkbox' ? checked : value
            }
        });
    };

    const isWorking = userData.employment?.status === 'employed' || userData.employment?.status === 'self_employed';

    return (
        <div className="space-y-6">
            <SectionTitle title="EMPLOYMENT STATUS" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Select 
                    label="CURRENT STATUS" 
                    name="status" 
                    value={userData.employment?.status} 
                    onChange={handleChange} 
                    options={[
                        { value: 'student', label: 'Student' },
                        { value: 'employed', label: 'Employed' },
                        { value: 'self_employed', label: 'Self-Employed / Business' },
                        { value: 'farmer', label: 'Farmer / Agricultural' },
                        { value: 'unemployed', label: 'Unemployed' },
                        { value: 'homemaker', label: 'Homemaker' },
                        { value: 'retired', label: 'Retired / Pensioner' },
                        { value: 'other', label: 'Other' }
                    ]} 
                    required 
                />
                
                {isWorking && (
                    <Select 
                        label="SECTOR" 
                        name="sector" 
                        value={userData.employment?.sector} 
                        onChange={handleChange} 
                        options={['Government', 'Private', 'Public Sector', 'Unorganized']} 
                    />
                )}
            </div>

            {/* Conditional Fields based on employment status */}
            {isWorking && (
                <>
                    <SectionTitle title="INCOME & OCCUPATION" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input 
                            label="OCCUPATION / JOB ROLE" 
                            name="occupation" 
                            value={userData.employment?.occupation} 
                            onChange={handleChange} 
                        />
                        <Input 
                            label="ANNUAL INCOME (₹)" 
                            name="annualIncome" 
                            type="number" 
                            value={userData.employment?.annualIncome} 
                            onChange={handleChange} 
                        />
                    </div>
                </>
            )}

            {!isWorking && userData.employment?.status === 'unemployed' && (
                <div className="bg-blue-50/50 p-6 rounded-lg border border-blue-100 space-y-4">
                    <SectionTitle title="UNEMPLOYMENT DETAILS" />
                    <Checkbox 
                        label="Are you actively looking for a job?" 
                        name="isJobSeeker" 
                        checked={userData.employment?.isJobSeeker} 
                        onChange={handleChange} 
                    />
                    <Checkbox 
                        label="Are you registered with the Government Employment Exchange?" 
                        name="employmentExchangeRegistered" 
                        checked={userData.employment?.employmentExchangeRegistered} 
                        onChange={handleChange} 
                    />
                </div>
            )}
        </div>
    );
};

export default EmploymentSection;
