import React from 'react';
import { Input, Select, Checkbox, SectionTitle } from '../components/FormFields';

const SocialSection = ({ userData, setUserData }) => {
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setUserData({
            ...userData,
            social: {
                ...userData.social,
                [name]: type === 'checkbox' ? checked : value
            }
        });
    };

    return (
        <div className="space-y-6">
            <SectionTitle title="CASTE & COMMUNITY" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Select 
                    label="SOCIAL CATEGORY" 
                    name="category" 
                    value={userData.social?.category} 
                    onChange={handleChange} 
                    options={['General', 'BC', 'MBC', 'SC', 'ST', 'OBC', 'EWS']} 
                    required 
                />
                <Input 
                    label="SPECIFIC COMMUNITY / CASTE NAME" 
                    name="community" 
                    value={userData.social?.community} 
                    onChange={handleChange} 
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div>
                    <Checkbox 
                        label="Do you have a valid Community/Caste Certificate?" 
                        name="casteCertificateAvailable" 
                        checked={userData.social?.casteCertificateAvailable} 
                        onChange={handleChange} 
                    />
                </div>
                {userData.social?.casteCertificateAvailable && (
                    <Input 
                        label="CERTIFICATE NUMBER" 
                        name="casteCertificateNumber" 
                        value={userData.social?.casteCertificateNumber} 
                        onChange={handleChange} 
                    />
                )}
            </div>

            <SectionTitle title="SPECIAL CATEGORIES" />
            
            <div className="grid grid-cols-1 gap-4">
                <Checkbox 
                    label="Do you belong to a Minority Community?" 
                    name="isMinority" 
                    checked={userData.social?.isMinority} 
                    onChange={handleChange} 
                />
                {userData.social?.isMinority && (
                    <div className="md:w-1/2 ml-8">
                        <Select 
                            label="MINORITY COMMUNITY" 
                            name="minorityCommunity" 
                            value={userData.social?.minorityCommunity} 
                            onChange={handleChange} 
                            options={['Muslim', 'Christian', 'Sikh', 'Buddhist', 'Jain', 'Parsi', 'Other']} 
                        />
                    </div>
                )}
                
                <Checkbox 
                    label="Are you eligible for Economically Weaker Section (EWS) quota?" 
                    name="isEWS" 
                    checked={userData.social?.isEWS} 
                    onChange={handleChange} 
                />
            </div>
        </div>
    );
};

export default SocialSection;
