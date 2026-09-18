import React from 'react';
import { Input, Select, Checkbox, SectionTitle } from '../components/FormFields';

const EDUCATION_LEVELS = [
    "No Formal Education", "Primary School", "Middle School", 
    "High School (10th)", "Higher Secondary (12th)", "Diploma", 
    "Undergraduate", "Postgraduate", "PhD"
];

const EducationSection = ({ userData, setUserData }) => {
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setUserData({
            ...userData,
            education: {
                ...userData.education,
                [name]: type === 'checkbox' ? checked : value
            }
        });
    };

    const isStudying = userData.education?.isStudying;

    return (
        <div className="space-y-6">
            <SectionTitle title="EDUCATIONAL QUALIFICATIONS" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Select 
                    label="HIGHEST QUALIFICATION ACHIEVED" 
                    name="highestQualification" 
                    value={userData.education?.highestQualification} 
                    onChange={handleChange} 
                    options={EDUCATION_LEVELS} 
                    required 
                />
                <Input 
                    label="YEAR OF PASSING" 
                    name="passedYear" 
                    type="number" 
                    value={userData.education?.passedYear} 
                    onChange={handleChange} 
                />
            </div>

            <div className="mt-8 border-t border-gray-100 pt-6">
                <Checkbox 
                    label="Are you currently studying?" 
                    name="isStudying" 
                    checked={isStudying} 
                    onChange={handleChange} 
                />
            </div>

            {/* Conditional Fields based on isStudying */}
            {isStudying && (
                <div className="bg-blue-50/50 p-6 rounded-lg border border-blue-100 space-y-6">
                    <SectionTitle title="CURRENT STUDY DETAILS" />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Select 
                            label="CURRENT EDUCATION LEVEL" 
                            name="currentLevel" 
                            value={userData.education?.currentLevel} 
                            onChange={handleChange} 
                            options={EDUCATION_LEVELS} 
                        />
                        <Input 
                            label="COURSE / DEGREE NAME" 
                            name="courseName" 
                            value={userData.education?.courseName} 
                            onChange={handleChange} 
                        />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input 
                            label="INSTITUTION NAME" 
                            name="institutionName" 
                            value={userData.education?.institutionName} 
                            onChange={handleChange} 
                        />
                        <Select 
                            label="INSTITUTION TYPE" 
                            name="institutionType" 
                            value={userData.education?.institutionType} 
                            onChange={handleChange} 
                            options={['Government', 'Private', 'Aided']} 
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input 
                            label="YEAR OF STUDY (E.G., 1, 2, 3)" 
                            name="yearOfStudy" 
                            type="number" 
                            value={userData.education?.yearOfStudy} 
                            onChange={handleChange} 
                        />
                        <Input 
                            label="PREVIOUS YEAR MARKS / CGPA (%)" 
                            name="marksPercentage" 
                            type="number" 
                            max="100" 
                            value={userData.education?.marksPercentage} 
                            onChange={handleChange} 
                        />
                    </div>
                </div>
            )}

            <SectionTitle title="SPECIAL SCHOLARSHIP CRITERIA" />
            <div className="grid grid-cols-1 gap-4">
                <Checkbox 
                    label="Are you the First Generation Graduate in your family?" 
                    name="isFirstGenGraduate" 
                    checked={userData.education?.isFirstGenGraduate} 
                    onChange={handleChange} 
                />
                <Checkbox 
                    label="Are you currently receiving any government scholarship?" 
                    name="receivingScholarship" 
                    checked={userData.education?.receivingScholarship} 
                    onChange={handleChange} 
                />
            </div>
        </div>
    );
};

export default EducationSection;
