import React, { useState, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../../../context/UserContext";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import GoogleIcon from '@mui/icons-material/Google';

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { setIsUserLoggedIn } = useContext(UserContext);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!email || !password) {
            toast.error("Please enter both email and password");
            return;
        }

        setIsLoading(true);
        try {
            const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5001";
            const response = await axios.post(
                `${BACKEND_URL}/api/v1/users/login`,
                { email, password },
                { withCredentials: true }
            );
            const data = response.data;
            
            if (data.success) {
                localStorage.setItem("accessToken", data.user.accessToken);
                setIsUserLoggedIn(true);
                toast.success("Signed in successfully!");
                // Direct user to previous page or profile
                const origin = location.state?.from?.pathname || "/profile";
                navigate(origin); 
            } else {
                toast.error(data.message || "Failed to login");
            }
        } catch (error) {
            if (error.response && error.response.data) {
                toast.error(error.response.data.message);
            } else {
                toast.error("An error occurred. Please try again.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100svh-5rem)] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob animation-delay-2000"></div>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-md w-full space-y-8 bg-white/80 backdrop-blur-xl p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white/20 relative z-10"
            >
                <div className="relative">
                    <button 
                        onClick={() => navigate("/")}
                        className="absolute left-0 top-1 text-gray-500 hover:text-brand transition-colors"
                    >
                        <ArrowBackIcon />
                    </button>
                    <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900 tracking-tight">
                        Welcome Back
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Sign in to check your eligible schemes
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                <MailOutlineIcon fontSize="small" />
                            </div>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="appearance-none rounded-xl relative block w-full pl-10 px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand focus:z-10 sm:text-sm transition-all"
                                placeholder="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                <LockOutlinedIcon fontSize="small" />
                            </div>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                className="appearance-none rounded-xl relative block w-full pl-10 px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand focus:z-10 sm:text-sm transition-all"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-end">
                        <div className="text-sm">
                            <a href="#" className="font-medium text-brand hover:text-indigo-500 transition-colors">
                                Forgot your password?
                            </a>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-blue-600 to-brand hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand transition-all shadow-md ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-lg transform hover:-translate-y-0.5'}`}
                        >
                            {isLoading ? 'Signing in...' : 'Log In'}
                        </button>

                        <button
                            type="button"
                            className="w-full flex justify-center items-center py-3 px-4 border border-gray-300 rounded-xl shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand transition-all hover:shadow-md"
                        >
                            <GoogleIcon className="text-red-500 mr-2" fontSize="small" />
                            Continue with Google
                        </button>
                    </div>

                    <div className="text-center mt-4">
                        <p className="text-sm text-gray-600">
                            Don't have an account?{' '}
                            <Link to="/signup" className="font-semibold text-brand hover:text-indigo-600 transition-colors">
                                Sign Up
                            </Link>
                        </p>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default Login;
