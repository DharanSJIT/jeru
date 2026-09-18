import React from 'react';
import { Input, Select, SectionTitle } from '../components/FormFields';
import { calculateAge } from '../utils/profileUtils';

const PersonalSection = ({ userData, setUserData }) => {
    const handleChange = (e) => {
        const { name, value } = e.target;
        
        if (name === 'aadhaarNumber') {
            setUserData({ ...userData, documents: { ...userData.documents, aadhaarNumber: value, hasAadhaar: !!value } });
            return;
        }
        
        let newPersonal = { ...userData.personal, [name]: value };
        
        // Auto-calculate age if DOB changes
        if (name === 'dob') {
            newPersonal.age = calculateAge(value);
        }

        setUserData({ ...userData, personal: newPersonal });
    };

    return (
        <div className="space-y-6">
            <SectionTitle title="BASIC DETAILS" />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Input label="FIRST NAME" name="firstName" value={userData.personal?.firstName} onChange={handleChange} required />
                <Input label="MIDDLE NAME" name="middleName" value={userData.personal?.middleName} onChange={handleChange} />
                <Input label="LAST NAME" name="lastName" value={userData.personal?.lastName} onChange={handleChange} required />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Input label="DATE OF BIRTH" name="dob" type="date" value={userData.personal?.dob?.split('T')[0]} onChange={handleChange} required />
                <Input label="AGE (AUTO-CALCULATED)" name="age" type="number" value={userData.personal?.age} disabled />
                <Select label="GENDER" name="gender" value={userData.personal?.gender} onChange={handleChange} options={[
                    { value: 'male', label: 'Male' },
                    { value: 'female', label: 'Female' },
                    { value: 'other', label: 'Other' }
                ]} required />
            </div>

            <SectionTitle title="FAMILY DETAILS" />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Input label="FATHER'S NAME" name="fatherName" value={userData.personal?.fatherName} onChange={handleChange} />
                <Input label="MOTHER'S NAME" name="motherName" value={userData.personal?.motherName} onChange={handleChange} />
                <Input label="SPOUSE'S NAME" name="spouseName" value={userData.personal?.spouseName} onChange={handleChange} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Select label="MARITAL STATUS" name="maritalStatus" value={userData.personal?.maritalStatus} onChange={handleChange} options={['Single', 'Married', 'Widowed', 'Divorced', 'Separated']} />
                <Input label="ALTERNATE MOBILE" name="alternateMobile" value={userData.personal?.alternateMobile} onChange={handleChange} />
                <Select label="PREFERRED LANGUAGE" name="preferredLanguage" value={userData.personal?.preferredLanguage} onChange={handleChange} options={['English', 'Tamil', 'Hindi']} />
            </div>

            <SectionTitle title="IDENTITY DOCUMENTS" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Input label="AADHAAR NUMBER" name="aadhaarNumber" type="number" placeholder="12-digit Aadhaar" value={userData.documents?.aadhaarNumber || ''} onChange={handleChange} maxLength="12" />
            </div>
        </div>
    );
};

export default PersonalSection;
