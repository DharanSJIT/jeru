import React from 'react';
import { Input, Select, Checkbox, SectionTitle } from '../components/FormFields';

const AgricultureSection = ({ userData, setUserData }) => {
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setUserData({
            ...userData,
            agriculture: {
                ...userData.agriculture,
                [name]: type === 'checkbox' ? checked : value
            }
        });
    };

    const isFarmer = userData.agriculture?.isFarmer;

    return (
        <div className="space-y-6">
            <SectionTitle title="AGRICULTURAL PROFILE" />
            
            <div className="mb-6">
                <Checkbox 
                    label="Are you a Farmer or involved in Agriculture?" 
                    name="isFarmer" 
                    checked={isFarmer} 
                    onChange={handleChange} 
                />
            </div>

            {isFarmer && (
                <div className="bg-green-50/50 p-6 rounded-lg border border-green-100 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Select 
                            label="FARMER TYPE" 
                            name="farmerType" 
                            value={userData.agriculture?.farmerType} 
                            onChange={handleChange} 
                            options={['Small', 'Marginal', 'Large', 'Tenant', 'Agricultural Labourer']} 
                        />
                        <Checkbox 
                            label="Do you own agricultural land?" 
                            name="landOwnership" 
                            checked={userData.agriculture?.landOwnership} 
                            onChange={handleChange} 
                        />
                    </div>
                    
                    {userData.agriculture?.landOwnership && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-green-100">
                            <Input 
                                label="TOTAL LAND AREA (ACRES)" 
                                name="landAreaAcres" 
                                type="number" 
                                value={userData.agriculture?.landAreaAcres} 
                                onChange={handleChange} 
                            />
                            <Select 
                                label="LAND TYPE" 
                                name="landType" 
                                value={userData.agriculture?.landType} 
                                onChange={handleChange} 
                                options={['Irrigated', 'Rain-fed', 'Dry']} 
                            />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AgricultureSection;
