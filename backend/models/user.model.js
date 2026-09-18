import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
    {
        // CORE AUTH FIELDS
        name: { type: String, required: true },
        email: {
            type: String,
            required: true,
            unique: true,
            match: new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/),
        },
        password: { type: String, required: true, minlength: 6 },
        phoneNumber: { type: String },
        role: { type: String, enum: ["USER", "ADMIN"], default: "USER", required: true },
        refreshToken: { type: String, default: null },
        
        // SYSTEM FIELDS
        favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Scheme' }],
        hasCompletedProfile: { type: Boolean, default: false },
        profileCompletionPercentage: { type: Number, default: 0 },

        // --- CITIZEN PROFILE DATA ---

        // 1. Personal Information
        personal: {
            firstName: String,
            middleName: String,
            lastName: String,
            dob: Date,
            age: Number,
            gender: { type: String, enum: ['male', 'female', 'other', 'prefer_not_to_say', 'Male', 'Female', 'Other'] },
            maritalStatus: String,
            fatherName: String,
            motherName: String,
            spouseName: String,
            alternateMobile: String,
            preferredLanguage: String,
            nationality: { type: String, default: 'Indian' }
        },

        // 2. Address & Domicile
        address: {
            currentAddress: String,
            permanentAddress: String,
            sameAsCurrent: Boolean,
            houseNumber: String,
            street: String,
            areaLocality: String,
            villageTownCity: String,
            taluk: String,
            district: String,
            state: { type: String, default: 'Tamil Nadu' },
            pincode: String,
            residenceType: String,
            ruralUrban: { type: String, enum: ['Urban', 'Rural'] },
            isMigrant: Boolean
        },

        // 3. Social Category
        social: {
            category: { type: String, enum: ['General', 'BC', 'MBC', 'SC', 'ST', 'OBC', 'EWS'] },
            community: String,
            casteCertificateAvailable: Boolean,
            casteCertificateNumber: String,
            isMinority: Boolean,
            minorityCommunity: String,
            isEWS: Boolean
        },

        // 4. Education
        education: {
            isStudying: Boolean,
            highestQualification: String,
            currentLevel: String,
            institutionName: String,
            institutionType: { type: String, enum: ['Government', 'Private', 'Aided'] },
            courseName: String,
            yearOfStudy: String,
            isFirstGenGraduate: Boolean,
            marksPercentage: Number,
            passedYear: String,
            receivingScholarship: Boolean
        },

        // 5. Employment
        employment: {
            status: { type: String, enum: ['student', 'employed', 'self_employed', 'farmer', 'unemployed', 'homemaker', 'retired', 'other'] },
            occupation: String,
            sector: { type: String, enum: ['Government', 'Private', 'Public Sector', 'Unorganized'] },
            jobType: String,
            annualIncome: Number,
            isJobSeeker: Boolean,
            employmentExchangeRegistered: Boolean
        },

        // 6. Family
        family: [{
            name: String,
            relationship: String,
            age: Number,
            gender: String,
            occupation: String,
            annualIncome: Number,
            isDependent: Boolean
        }],
        
        familyStats: {
            familySize: Number,
            adults: Number,
            children: Number,
            dependents: Number,
            workingMembers: Number,
            totalFamilyIncome: Number
        },

        // 7. Housing
        housing: {
            houseOwnership: { type: String, enum: ['Owned', 'Rented', 'Leased', 'Homeless'] },
            houseType: { type: String, enum: ['Pucca', 'Kutcha', 'Semi-Pucca'] },
            hasElectricity: Boolean,
            hasToilet: Boolean,
            hasLPG: Boolean
        },

        // 8. Health & Disability
        healthAndDisability: {
            hasDisability: Boolean,
            disabilityType: String,
            disabilityPercentage: Number,
            hasDisabilityCertificate: Boolean,
            hasChronicIllness: Boolean,
            hasHealthInsurance: Boolean
        },

        // 9. Agriculture
        agriculture: {
            isFarmer: Boolean,
            landOwnership: Boolean,
            landAreaAcres: Number,
            landType: { type: String, enum: ['Irrigated', 'Rain-fed', 'Dry'] },
            farmerType: { type: String, enum: ['Small', 'Marginal', 'Large', 'Tenant', 'Agricultural Labourer'] }
        },

        // 10. Documents Readiness
        documents: {
            hasAadhaar: Boolean,
            aadhaarNumber: String,
            hasPan: Boolean,
            hasRationCard: Boolean,
            rationCardType: { type: String, enum: ['PHH', 'AAY', 'NPHH', 'NPHH-S', 'NPHH-NC'] },
            hasIncomeCertificate: Boolean,
            hasBankPassbook: Boolean
        }
    },
    { timestamps: true }
);

// Hash password before saving user
userSchema.pre("save", async function (next) {
    try {
        if (this.isModified("password")) {
            this.password = await bcrypt.hash(this.password, 10);
        }
        next();
    } catch (error) {
        next(error);
    }
});

// Compare password with hashed password
userSchema.methods.isPasswordCorrect = async function (candidatePassword) {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
        throw error;
    }
};

// Generate access token
userSchema.methods.generateAccessToken = async function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            name: this.name,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
        }
    );
};

// Generate refresh token
userSchema.methods.generateRefreshToken = async function () {
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
        }
    );
};

const User = mongoose.model("User", userSchema);

export default User;