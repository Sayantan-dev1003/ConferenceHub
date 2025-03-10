import React, { useState, useEffect } from "react";
import axios from "axios";
import SignIn from "./Signin";
import { useNavigate } from 'react-router-dom';

const Signup = ({ setIsSignupOpen, setIsSigninOpen }) => {
    const [userType, setUserType] = useState("attendee");
    const [formDataAttendee, setFormDataAttendee] = useState({
        fullname: "",
        email: "",
        phone: "",
        affiliation: "",
        areaOfInterest: "",
        password: "",
    });

    const [formDataSpeaker, setFormDataSpeaker] = useState({
        fullname: "",
        email: "",
        phone: "",
        affiliation: "",
        bio: "",
        password: "",
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();

    // Handle Input Change
    const handleChange = (e) => {
        if (userType === "attendee") {
            setFormDataAttendee({ ...formDataAttendee, [e.target.name]: e.target.value });
        } else {
            setFormDataSpeaker({ ...formDataSpeaker, [e.target.name]: e.target.value });
        }
    };

    // Handle Form Submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        let payload;
        if (userType === "attendee") {
            payload = {
                ...formDataAttendee,
                userType,
                areaOfInterest: formDataAttendee.areaOfInterest.split(',').map(area => area.trim()),
            };
        } else {
            payload = {
                ...formDataSpeaker,
                userType,
                bio: formDataSpeaker.bio,
            };
        }

        try {
            const response = await axios.post("/register", payload, {
                headers: { "Content-Type": "application/json" },
            });

            setSuccess(response.data.message);
            if (userType === "attendee") {
                setFormDataAttendee({
                    fullname: "",
                    email: "",
                    phone: "",
                    affiliation: "",
                    areaOfInterest: "",
                    password: "",
                });
            } else {
                setFormDataSpeaker({
                    fullname: "",
                    email: "",
                    phone: "",
                    affiliation: "",
                    bio: "",
                    password: "",
                });
            }

            // Automatically navigate to /feed after success
            setTimeout(() => {
                setIsSignupOpen(false);
                navigate('/feed');
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || "Registration failed!");
        }
    };

    // Close the modal when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (event.target.id === "signup-modal") {
                setIsSignupOpen(false);
            }
        };
        window.addEventListener("click", handleClickOutside);
        return () => window.removeEventListener("click", handleClickOutside);
    }, []);

    return (
        <>
            <section
                id="signup-modal"
                className="fixed top-0 left-0 w-full h-full flex items-center justify-center backdrop-blur-lg bg-[rgba(17,22,28,0.8)] z-50"
            >
                <div className="w-1/2 flex flex-col items-center justify-center bg-white shadow-lg rounded-xl p-8">
                    <h2 className="text-3xl font-bold text-blue-800 mt-2 text-center mb-6 montserrat">
                        Event Registration
                    </h2>

                    {/* Close Button */}
                    <button
                        className="relative bottom-14 left-68 text-white cursor-pointer text-xl font-bold"
                        onClick={() => setIsSignupOpen(false)}
                    >
                        ✖
                    </button>

                    {/* User Type Selection */}
                    <div className="flex gap-4 mb-6 items-start openSans">
                        <button
                            className={`px-4 py-2 rounded-lg font-semibold transition-all cursor-pointer hover:scale-105 ${userType === "attendee"
                                ? "bg-blue-400 text-white"
                                : "bg-gray-200 text-gray-700"
                                }`}
                            onClick={() => setUserType("attendee")}
                        >
                            Attendee
                        </button>
                        <button
                            className={`px-4 py-2 rounded-lg font-semibold transition-all cursor-pointer hover:scale-105 ${userType === "speaker"
                                ? "bg-blue-400 text-white"
                                : "bg-gray-200 text-gray-700"
                                }`}
                            onClick={() => setUserType("speaker")}
                        >
                            Speaker
                        </button>
                    </div>

                    {/* Error Message */}
                    {error && <p className="text-red-500">{error}</p>}

                    {/* Success Message */}
                    {success && <p className="text-green-500">{success}</p>}

                    {/* Forms */}
                    <form className="w-full flex flex-col gap-3 text-gray-500 openSans" onSubmit={handleSubmit}>
                        <input
                            type="text"
                            name="fullname"
                            value={userType === "attendee" ? formDataAttendee.fullName : formDataSpeaker.fullName}
                            onChange={handleChange}
                            placeholder="Full Name"
                            className="w-full p-2 border-2 border-blue-300 rounded-lg outline-none transition-all duration-300 focus:border-blue-500"
                            required
                        />
                        <input
                            type="email"
                            name="email"
                            value={userType === "attendee" ? formDataAttendee.email : formDataSpeaker.email}
                            onChange={handleChange}
                            placeholder="Email Address"
                            className="w-full p-2 border-2 border-blue-300 rounded-lg outline-none transition-all duration-300 focus:border-blue-500"
                            required
                        />
                        <input
                            type="tel"
                            name="phone"
                            value={userType === "attendee" ? formDataAttendee.phone : formDataSpeaker.phone}
                            onChange={handleChange}
                            placeholder="Phone Number"
                            className="w-full p-2 border-2 border-blue-300 rounded-lg outline-none transition-all duration-300 focus:border-blue-500"
                            required
                        />
                        <input
                            type="text"
                            name="affiliation"
                            value={userType === "attendee" ? formDataAttendee.affiliation : formDataSpeaker.affiliation}
                            onChange={handleChange}
                            placeholder="Affiliation"
                            className="w-full p-2 border-2 border-blue-300 rounded-lg outline-none transition-all duration-300 focus:border-blue-500"
                            required
                        />

                        {/* Attendee-Specific Field */}
                        {userType === "attendee" && (
                            <input
                                type="text"
                                name="areaOfInterest"
                                value={formDataAttendee.areaOfInterest}
                                onChange={handleChange}
                                placeholder="Area of Interest"
                                className="w-full p-2 border-2 border-blue-300 rounded-lg outline-none transition-all duration-300 focus:border-blue-500"
                                required
                            />
                        )}

                        {/* Speaker-Specific Field */}
                        {userType === "speaker" && (
                            <textarea
                                name="bio"
                                value={formDataSpeaker.bio}
                                onChange={handleChange}
                                placeholder="Your Bio"
                                className="w-full p-2 border-2 border-blue-300 rounded-lg outline-none transition-all duration-300 focus:border-blue-500"
                                required
                            ></textarea>
                        )}

                        <input
                            type="password"
                            name="password"
                            value={userType === "attendee" ? formDataAttendee.password : formDataSpeaker.password}
                            onChange={handleChange}
                            placeholder="Password"
                            className="w-full p-2 border-2 border-blue-300 rounded-lg outline-none transition-all duration-300 focus:border-blue-500"
                            required
                        />

                        <p className="mt-4 text-gray-600 text-center">
                            Already have an account?{" "}
                            <button
                                type="button"
                                className="text-blue-600 font-semibold hover:underline"
                                onClick={() => {
                                    setIsSignupOpen(false);
                                    setIsSigninOpen(true);
                                }}
                            >
                                Login
                            </button>
                        </p>

                        <button
                            type="submit"
                            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg cursor-pointer transition-all duration-300 hover:scale-105"
                        >
                            {userType === "attendee" ? "Register as Attendee" : "Register as Speaker"}
                        </button>
                    </form>
                </div>
            </section>

            {setIsSigninOpen && <SignIn setIsSigninOpen={setIsSigninOpen} setIsSignupOpen={setIsSignupOpen} />}
        </>
    );
};

export default Signup;
