"use client";

import React, { useState, useEffect } from "react";
import {
    User, Mail, Phone, MapPin, Calendar, Edit2, Save, X, Star, Shield, Building, Home, GraduationCap, Percent, CheckSquare, IndianRupee, Layers
} from "lucide-react";
import { getUserProfile, updateUserProfile } from "../../../services/users/user";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";

const STATES = [
    "Tamil Nadu", "Andaman and Nicobar Islands", "Arunachal Pradesh", "Assam", "Bihar",
    "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh",
    "Jammu and Kashmir", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh",
    "Maharashtra", "Meghalaya", "Mizoram", "Nagaland", "Odisha",
    "Punjab", "Rajasthan", "Sikkim", "Telangana", "Tripura",
    "Uttar Pradesh", "Uttarakhand", "West Bengal", "Chandigarh",
    "Dadra and Nagar Haveli and Daman and Diu", "Lakshadweep", "Delhi", "Puducherry"
];

const DISTRICTS_TN = [
    "Chennai", "Coimbatore", "Cuddalore", "Dharmapuri", "Dindigul", "Erode", 
    "Kanchipuram", "Kanyakumari", "Karur", "Krishnagiri", "Madurai", "Nagapattinam", 
    "Namakkal", "Nilgiris", "Perambalur", "Pudukkottai", "Ramanathapuram", "Salem", 
    "Sivaganga", "Thanjavur", "Theni", "Thoothukudi", "Tiruchirappalli", "Tirunelveli", 
    "Tiruppur", "Tiruvallur", "Tiruvannamalai", "Tiruvarur", "Vellore", "Viluppuram", "Virudhunagar"
];

const CATEGORIES = ["General", "BC", "MBC", "SC", "ST"];
const EDUCATION_LEVELS = ["High School", "Higher Secondary", "Diploma", "Undergraduate", "Postgraduate", "PhD"];

const Profile = () => {
    const { t } = useTranslation();
    const [isEditing, setIsEditing] = useState(false);
    const [userData, setUserData] = useState({
        name: "", email: "", phoneNumber: "", age: "", gender: "",
        state: "Tamil Nadu", district: "", areaType: "", educationLevel: "", previousPercentage: "",
        familyIncome: "", incomeGroup: "", isMinority: false, isFirstGenerationGraduate: false,
        isSingleGirlChild: false, isDifferentlyAbled: false, favorites: [], hasCompletedProfile: false
    });

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await getUserProfile();
                if (response.success) {
                    setUserData({ ...userData, ...response.data });
                } else {
                    toast.error("Failed to fetch profile data");
                }
            } catch (error) {
                console.error("Failed to fetch user data:", error);
                toast.error(error.response?.data?.message || "Error fetching profile");
            }
        };
        fetchUserData();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setUserData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const dataToUpdate = { ...userData, hasCompletedProfile: true };
            const response = await updateUserProfile(dataToUpdate);
            if (response.success) {
                toast.success("Profile updated & matches generated successfully!");
                setIsEditing(false);
                setUserData(response.data);
            } else {
                toast.error("Failed to update profile");
            }
        } catch (error) {
            console.error("Failed to update profile:", error);
            toast.error(error.response?.data?.message || "Error updating profile");
        }
    };

    return (
        <div className="max-w-5xl mx-auto p-6 min-h-[calc(100svh-4rem)]">
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-blue-100">
                <div className="flex justify-between items-center mb-8 border-b pb-4">
                    <div>
                        <h1 className="text-3xl font-bold text-[#0052CC]">{t('profile.title', 'Personal Eligibility Form')}</h1>
                        <p className="text-gray-500 mt-2">{t('profile.subtitle', 'Complete this form to discover personalized government schemes & scholarships.')}</p>
                    </div>
                    {!isEditing && (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="flex items-center text-white bg-[#0052CC] px-4 py-2 rounded-lg hover:bg-[#003D99] transition-colors"
                        >
                            <Edit2 className="w-4 h-4 mr-2" /> Edit Profile
                        </button>
                    )}
                </div>

                {!isEditing ? (
                    <div className="space-y-8">
                        <Section title="Applicant Details" icon={<User className="text-[#0052CC]" />}>
                            <ProfileItem label="Full Name" value={userData.name} />
                            <ProfileItem label="Email" value={userData.email} />
                            <ProfileItem label="Phone Number" value={userData.phoneNumber || "Not provided"} />
                            <ProfileItem label="Age" value={userData.age || "Not provided"} />
                            <ProfileItem label="Gender" value={userData.gender ? userData.gender.charAt(0).toUpperCase() + userData.gender.slice(1) : "Not provided"} />
                        </Section>

                        <Section title="Domicile Information" icon={<MapPin className="text-[#0052CC]" />}>
                            <ProfileItem label="State" value={userData.state || "Not provided"} />
                            <ProfileItem label="District" value={userData.district || "Not provided"} />
                            <ProfileItem label="Area Type" value={userData.areaType || "Not provided"} />
                        </Section>

                        <Section title="Academic Profile" icon={<GraduationCap className="text-[#0052CC]" />}>
                            <ProfileItem label="Current Education Level" value={userData.educationLevel || "Not provided"} />
                            <ProfileItem label="Previous Year Percentage" value={userData.previousPercentage ? `${userData.previousPercentage}%` : "Not provided"} />
                        </Section>

                        <Section title="Socio-Economic Criteria" icon={<Layers className="text-[#0052CC]" />}>
                            <ProfileItem label="Category" value={userData.incomeGroup || "Not provided"} />
                            <ProfileItem label="Annual Family Income" value={userData.familyIncome ? `₹${userData.familyIncome}` : "Not provided"} />
                            <div className="col-span-1 md:col-span-2 grid grid-cols-2 gap-4 mt-2">
                                <Badge label="Minority Community" active={userData.isMinority} />
                                <Badge label="First Gen Graduate" active={userData.isFirstGenerationGraduate} />
                                <Badge label="Single Girl Child" active={userData.isSingleGirlChild} />
                                <Badge label="Differently Abled (PwD)" active={userData.isDifferentlyAbled} />
                            </div>
                        </Section>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-8">
                        
                        {/* 1. Applicant Details */}
                        <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                            <h3 className="text-xl font-semibold text-[#0052CC] mb-4 flex items-center"><User className="mr-2" /> Applicant Details</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <InputField icon={<User />} label="Full Name" name="name" value={userData.name} onChange={handleChange} required />
                                <InputField icon={<Phone />} label="Phone Number" name="phoneNumber" value={userData.phoneNumber} onChange={handleChange} pattern="[0-9]{10}" title="10-digit number" />
                                <InputField icon={<Calendar />} label="Age" name="age" type="number" value={userData.age} onChange={handleChange} required />
                                <SelectField icon={<User />} label="Gender" name="gender" value={userData.gender} onChange={handleChange} options={[{ value: "male", label: "Male" }, { value: "female", label: "Female" }, { value: "other", label: "Other" }]} />
                            </div>
                        </div>

                        {/* 2. Domicile Information */}
                        <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                            <h3 className="text-xl font-semibold text-[#0052CC] mb-4 flex items-center"><MapPin className="mr-2" /> Domicile Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <SelectField icon={<MapPin />} label="State" name="state" value={userData.state} onChange={handleChange} options={STATES.map(s => ({ value: s, label: s }))} />
                                <SelectField icon={<Building />} label="District" name="district" value={userData.district} onChange={handleChange} options={DISTRICTS_TN.map(d => ({ value: d, label: d }))} />
                                <SelectField icon={<Home />} label="Area Type" name="areaType" value={userData.areaType} onChange={handleChange} options={[{ value: "Urban", label: "Urban" }, { value: "Rural", label: "Rural" }]} />
                            </div>
                        </div>

                        {/* 3. Academic Profile */}
                        <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                            <h3 className="text-xl font-semibold text-[#0052CC] mb-4 flex items-center"><GraduationCap className="mr-2" /> Academic Profile</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <SelectField icon={<GraduationCap />} label="Current Education Level" name="educationLevel" value={userData.educationLevel} onChange={handleChange} options={EDUCATION_LEVELS.map(e => ({ value: e, label: e }))} />
                                <InputField icon={<Percent />} label="Previous Year Percentage (%)" name="previousPercentage" type="number" value={userData.previousPercentage} onChange={handleChange} max="100" />
                            </div>
                        </div>

                        {/* 4. Socio-Economic Criteria */}
                        <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                            <h3 className="text-xl font-semibold text-[#0052CC] mb-4 flex items-center"><Layers className="mr-2" /> Socio-Economic Criteria</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <SelectField icon={<Layers />} label="Category" name="incomeGroup" value={userData.incomeGroup} onChange={handleChange} options={CATEGORIES.map(c => ({ value: c, label: c }))} />
                                <InputField icon={<IndianRupee />} label="Annual Family Income (₹)" name="familyIncome" type="number" value={userData.familyIncome} onChange={handleChange} />
                                
                                <div className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                    <CheckboxField label="Minority Community Member" name="isMinority" checked={userData.isMinority} onChange={handleChange} />
                                    <CheckboxField label="First Generation Graduate" name="isFirstGenerationGraduate" checked={userData.isFirstGenerationGraduate} onChange={handleChange} />
                                    <CheckboxField label="Single Girl Child Status" name="isSingleGirlChild" checked={userData.isSingleGirlChild} onChange={handleChange} />
                                    <CheckboxField label="Differently Abled (PwD)" name="isDifferentlyAbled" checked={userData.isDifferentlyAbled} onChange={handleChange} />
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end space-x-4 pt-4 border-t">
                            <button type="button" onClick={() => setIsEditing(false)} className="px-6 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors flex items-center font-medium">
                                <X className="w-5 h-5 mr-2" /> Cancel
                            </button>
                            <button type="submit" className="px-6 py-3 text-white bg-[#0052CC] rounded-lg hover:bg-[#003D99] transition-colors flex items-center font-medium shadow-md">
                                <Save className="w-5 h-5 mr-2" /> Submit Profile & Find Matches
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

const Section = ({ title, icon, children }) => (
    <div className="border border-gray-100 rounded-xl overflow-hidden shadow-sm">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex items-center">
            {icon}
            <h3 className="text-lg font-semibold text-gray-800 ml-3">{title}</h3>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 bg-white">
            {children}
        </div>
    </div>
);

const ProfileItem = ({ label, value }) => (
    <div>
        <p className="text-sm font-medium text-gray-500 mb-1">{label}</p>
        <p className="text-base font-semibold text-gray-900">{value}</p>
    </div>
);

const Badge = ({ label, active }) => (
    <div className={`flex items-center p-3 rounded-lg border ${active ? 'bg-blue-50 border-blue-200 text-[#0052CC]' : 'bg-gray-50 border-gray-200 text-gray-500'}`}>
        <CheckSquare className={`w-5 h-5 mr-3 ${active ? 'text-[#0052CC]' : 'text-gray-300'}`} />
        <span className="font-medium">{label}</span>
    </div>
);

const InputField = ({ icon, label, name, value, onChange, type = "text", required = false, pattern, title, max }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
            <span className="mr-2 text-gray-400">{icon && React.cloneElement(icon, { className: "w-4 h-4" })}</span>
            {label}
        </label>
        <input type={type} id={name} name={name} value={value || ''} onChange={onChange} required={required} pattern={pattern} title={title} max={max} className="block w-full p-3 rounded-lg border border-gray-300 shadow-sm focus:border-[#0052CC] focus:ring focus:ring-[#0052CC] focus:ring-opacity-20 transition-all outline-none" />
    </div>
);

const SelectField = ({ icon, label, name, value, onChange, options }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
            <span className="mr-2 text-gray-400">{icon && React.cloneElement(icon, { className: "w-4 h-4" })}</span>
            {label}
        </label>
        <select id={name} name={name} value={value || ''} onChange={onChange} className="block w-full p-3 rounded-lg border border-gray-300 shadow-sm focus:border-[#0052CC] focus:ring focus:ring-[#0052CC] focus:ring-opacity-20 transition-all outline-none bg-white">
            <option value="">Select an option</option>
            {options.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
            ))}
        </select>
    </div>
);

const CheckboxField = ({ label, name, checked, onChange }) => (
    <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
        <input type="checkbox" name={name} checked={checked || false} onChange={onChange} className="w-5 h-5 text-[#0052CC] rounded focus:ring-[#0052CC] border-gray-300" />
        <span className="ml-3 text-sm font-medium text-gray-700">{label}</span>
    </label>
);

export default Profile;
