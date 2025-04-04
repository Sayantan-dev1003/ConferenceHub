import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBuildingColumns, faEnvelope, faIdCard, faLightbulb, faLock, faPhone, faUser } from '@fortawesome/free-solid-svg-icons';
import axios from "axios";
import { useNavigate } from 'react-router-dom';

const PaperSignup = ({ setIsSignupOpen, setIsSigninOpen }) => {
    const [userType, setUserType] = useState("publisher");
    const [formData, setFormData] = useState({
        fullname: "",
        email: "",
        phone: "",
        affiliation: "",
        areaOfInterest: "",
        designation: "",
        password: "",
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();

    // Handle Input Change
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle Form Submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        const payload = {
            ...formData,
            userType,
            ...(userType === "reviewer" ? { areaOfInterest: formData.areaOfInterest.split(',').map(area => area.trim()) } : {}),
            ...(userType === "publisher" ? { designation: formData.designation } : {}),
        };

        try {
            const response = await axios.post("/paper/register", payload, {
                headers: { "Content-Type": "application/json" },
            });

            setSuccess(response.data.message);
            setFormData({
                fullname: "",
                email: "",
                phone: "",
                affiliation: "",
                areaOfInterest: "",
                designation: "",
                password: "",
            });
            setIsSignupOpen(false);
            navigate(userType === "reviewer" ? '/reviewer-dashboard' : '/publisher-dashboard');
        } catch (err) {
            setError(err.response?.data?.message || "Registration failed!");
        }
    };

    // Close the modal when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (event.target.id === "signup-paper-modal") {
                setIsSignupOpen(false);
            }
        };
        window.addEventListener("click", handleClickOutside);
        return () => window.removeEventListener("click", handleClickOutside);
    }, []);

    // Function to open login form when login is clicked
    const openLogin = () => {
        setIsSignupOpen(false);
        setIsSigninOpen(true);
    };

    return (
        <>
            <section
                id="signup-paper-modal"
                className="fixed top-0 left-0 w-full h-full flex items-center justify-center backdrop-blur-lg bg-[rgba(17,22,28,0.8)] z-50"
            >
                <div className="w-[40vw] flex flex-col items-center justify-center bg-white shadow-lg rounded-xl p-8">
                    <h2 className="text-3xl font-bold text-blue-800 mt-2 text-center mb-6 montserrat">
                        Registration
                    </h2>

                    {/* Close Button */}
                    <button
                        className="relative bottom-14 left-56 text-white cursor-pointer text-xl font-bold"
                        onClick={() => setIsSignupOpen(false)}
                    >
                        ✖
                    </button>

                    {/* User Type Selection */}
                    <div className="flex gap-4 mb-6 items-start openSans">
                        <button
                            className={`px-4 py-2 rounded-lg font-semibold transition-all cursor-pointer hover:scale-105 ${userType === "publisher"
                                ? "bg-blue-400 text-white"
                                : "bg-gray-200 text-gray-700"
                                }`}
                            onClick={() => setUserType("publisher")}
                        >
                            Publisher
                        </button>
                        <button
                            className={`px-4 py-2 rounded-lg font-semibold transition-all cursor-pointer hover:scale-105 ${userType === "reviewer"
                                ? "bg-blue-400 text-white"
                                : "bg-gray-200 text-gray-700"
                                }`}
                            onClick={() => setUserType("reviewer")}
                        >
                            Reviewer
                        </button>
                    </div>

                    {/* Error Message */}
                    {error && <p className="text-red-500">{error}</p>}

                    {/* Success Message */}
                    {success && <p className="text-green-500">{success}</p>}

                    {/* Forms */}
                    <form className="w-full flex flex-col gap-3 text-gray-500 openSans" onSubmit={handleSubmit}>
                        <div className="relative">
                            <FontAwesomeIcon icon={faUser} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                name="fullname"
                                value={formData.fullname}
                                onChange={handleChange}
                                placeholder="Full Name"
                                className="w-full pl-10 pr-3 py-2 border-2 border-blue-300 rounded-lg outline-none transition-all duration-300 focus:border-blue-500"
                                required
                            />
                        </div>
                        <div className="relative">
                            <FontAwesomeIcon icon={faEnvelope} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Email Address"
                                className="w-full pl-10 pr-3 py-2 border-2 border-blue-300 rounded-lg outline-none transition-all duration-300 focus:border-blue-500"
                                required
                            />
                        </div>
                        <div className="relative">
                            <FontAwesomeIcon icon={faPhone} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="Phone Number"
                                className="w-full pl-10 pr-3 py-2 border-2 border-blue-300 rounded-lg outline-none transition-all duration-300 focus:border-blue-500"
                                required
                            />
                        </div>
                        <div className="relative">
                            <FontAwesomeIcon icon={faBuildingColumns} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                name="affiliation"
                                value={formData.affiliation}
                                onChange={handleChange}
                                placeholder="Affiliation"
                                className="w-full pl-10 pr-3 py-2 border-2 border-blue-300 rounded-lg outline-none transition-all duration-300 focus:border-blue-500"
                                required
                            />
                        </div>

                        {/* Reviewer-Specific Field */}
                        {userType === "reviewer" && (
                            <div className="relative">
                                <FontAwesomeIcon icon={faLightbulb} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    name="areaOfInterest"
                                    value={formData.areaOfInterest}
                                    onChange={handleChange}
                                    placeholder="Area of Interest"
                                    className="w-full pl-10 pr-3 py-2 border-2 border-blue-300 rounded-lg outline-none transition-all duration-300 focus:border-blue-500"
                                    required
                                />
                            </div>
                        )}

                        {/* Publisher-Specific Field */}
                        {userType === "publisher" && (
                            <div className="relative">
                                <FontAwesomeIcon icon={faIdCard} className="absolute left-4 top-4 text-gray-400" />
                                <input
                                    type="text"
                                    name="designation"
                                    value={formData.designation}
                                    onChange={handleChange}
                                    placeholder="Designation"
                                    className="w-full pl-10 pr-3 py-2 border-2 border-blue-300 rounded-lg outline-none transition-all duration-300 focus:border-blue-500"
                                    required
                                />
                            </div>
                        )}
                        <div className="relative">
                            <FontAwesomeIcon icon={faLock} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Password"
                                className="w-full pl-10 pr-3 py-2 border-2 border-blue-300 rounded-lg outline-none transition-all duration-300 focus:border-blue-500"
                                required
                            />
                        </div>

                        <p className="mt-4 text-gray-600 text-center text-sm">
                            Already have an account?{" "}
                            <button
                                type="button"
                                className="text-blue-400 font-semibold hover:underline hover:text-blue-600 cursor-pointer"
                                onClick={openLogin}
                            >
                                Login
                            </button>
                        </p>

                        <button
                            type="submit"
                            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg cursor-pointer transition-all duration-300 hover:scale-105"
                        >
                            {userType === "publisher" ? "Register as Publisher" : "Register as Reviewer"}
                        </button>
                    </form>
                </div>
            </section>
        </>
    );
};

export default PaperSignup;
