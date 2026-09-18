import React from 'react';
import { Input, Select, Checkbox, SectionTitle } from '../components/FormFields';

const STATES = [
    "Tamil Nadu", "Andaman and Nicobar Islands", "Arunachal Pradesh", "Assam", "Bihar",
    "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh",
    "Jammu and Kashmir", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh",
    "Maharashtra", "Meghalaya", "Mizoram", "Nagaland", "Odisha",
    "Punjab", "Rajasthan", "Sikkim", "Telangana", "Tripura",
    "Uttar Pradesh", "Uttarakhand", "West Bengal", "Chandigarh",
    "Dadra and Nagar Haveli and Daman and Diu", "Lakshadweep", "Delhi", "Puducherry"
];

const AddressSection = ({ userData, setUserData }) => {
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setUserData({
            ...userData,
            address: {
                ...userData.address,
                [name]: type === 'checkbox' ? checked : value
            }
        });
    };

    return (
        <div className="space-y-6">
            <SectionTitle title="CURRENT ADDRESS" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input label="HOUSE NUMBER / NAME" name="houseNumber" value={userData.address?.houseNumber} onChange={handleChange} />
                <Input label="STREET / AREA" name="street" value={userData.address?.street} onChange={handleChange} />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Input label="VILLAGE / TOWN / CITY" name="villageTownCity" value={userData.address?.villageTownCity} onChange={handleChange} />
                <Input label="TALUK" name="taluk" value={userData.address?.taluk} onChange={handleChange} />
                <Input label="DISTRICT" name="district" value={userData.address?.district} onChange={handleChange} required />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Select label="STATE" name="state" value={userData.address?.state} onChange={handleChange} options={STATES} required />
                <Input label="PINCODE" name="pincode" value={userData.address?.pincode} onChange={handleChange} required />
                <Select label="RURAL / URBAN" name="ruralUrban" value={userData.address?.ruralUrban} onChange={handleChange} options={['Urban', 'Rural']} required />
            </div>

            <div className="mt-8">
                <SectionTitle title="PERMANENT ADDRESS" />
                <Checkbox 
                    label="Same as Current Address" 
                    name="sameAsCurrent" 
                    checked={userData.address?.sameAsCurrent} 
                    onChange={handleChange} 
                />
                
                {!userData.address?.sameAsCurrent && (
                    <div className="grid grid-cols-1 mt-4">
                        <Input 
                            label="FULL PERMANENT ADDRESS" 
                            name="permanentAddress" 
                            value={userData.address?.permanentAddress} 
                            onChange={handleChange} 
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default AddressSection;
