export const calculateProfileCompletion = (userData) => {
    if (!userData) return 0;
    
    let totalFields = 0;
    let completedFields = 0;

    const checkField = (field) => {
        totalFields++;
        if (field !== null && field !== undefined && field !== "") {
            completedFields++;
        }
    };

    // Personal
    checkField(userData.personal?.firstName);
    checkField(userData.personal?.dob);
    checkField(userData.personal?.gender);
    checkField(userData.personal?.maritalStatus);

    // Address
    checkField(userData.address?.currentAddress);
    checkField(userData.address?.state);
    checkField(userData.address?.district);
    checkField(userData.address?.pincode);
    checkField(userData.address?.ruralUrban);

    // Social
    checkField(userData.social?.category);

    // Education
    checkField(userData.education?.highestQualification);
    if (userData.education?.isStudying) {
        checkField(userData.education?.institutionName);
        checkField(userData.education?.courseName);
    }

    // Employment
    checkField(userData.employment?.status);
    if (userData.employment?.status === 'employed' || userData.employment?.status === 'self_employed') {
        checkField(userData.employment?.occupation);
        checkField(userData.employment?.annualIncome);
    }

    // Family (check if they added any members or verified none exist)
    if (userData.family?.length > 0) {
        // give completion points for adding members
        totalFields += 2;
        completedFields += 2;
    } else {
        totalFields += 1;
        // Assume empty means they haven't filled it unless they explicitly marked it, but hard to tell. We just skip or count 1.
    }

    // Housing
    checkField(userData.housing?.houseOwnership);
    checkField(userData.housing?.houseType);

    // Health/Disability
    if (userData.disability?.hasDisability) {
        checkField(userData.disability?.disabilityType);
        checkField(userData.disability?.disabilityPercentage);
    }

    // Agriculture
    if (userData.agriculture?.isFarmer) {
        checkField(userData.agriculture?.landOwnership);
        checkField(userData.agriculture?.landType);
    }
    
    // Documents
    checkField(userData.documents?.aadhaarNumber);

    if (totalFields === 0) return 0;
    return Math.round((completedFields / totalFields) * 100);
};

export const calculateAge = (dobString) => {
    if (!dobString) return "";
    const today = new Date();
    const birthDate = new Date(dobString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
};
