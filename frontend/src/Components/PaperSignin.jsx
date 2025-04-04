import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';
import axios from "axios";
import { useNavigate } from 'react-router-dom';

const PaperSignIn = ({ setIsSignupOpen, setIsSigninOpen }) => {
    const [userType, setUserType] = useState("publisher");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            await axios.post("/paper/login", {
                email,
                password,
                role: userType,
            }, { withCredentials: true });

            alert(`Login successful as ${userType}`);
            setIsSigninOpen(false);
            navigate(userType === "reviewer" ? '/reviewer-dashboard' : '/publisher-dashboard');
        } catch (err) {
            setError(err.response?.data || "Invalid email or password. Please try again.");
        }
    };

    // Close the modal when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (event.target.id === "signin-paper-modal") {
                setIsSigninOpen(false);
            }
        };
        window.addEventListener("click", handleClickOutside);
        return () => window.removeEventListener("click", handleClickOutside);
    }, []);

    return (
        <>
            <section id="signin-paper-modal" className="fixed top-0 left-0 w-full h-full flex items-center justify-center backdrop-blur-lg bg-[rgba(17,22,28,0.8)] z-50">
                <div className="w-[40vw] flex flex-col items-center justify-center bg-white shadow-lg rounded-xl p-8">
                    <h2 className="text-3xl font-bold text-blue-800 text-center mb-6">Signin</h2>

                    {/* Close Button */}
                    <button className="relative bottom-14 left-52 text-gray-700 text-xl cursor-pointer" onClick={() => setIsSigninOpen(false)}>✖</button>

                    {/* Role Selection */}
                    <div className="flex gap-4 mb-6 justify-center w-full openSans">
                        <button
                            className={`px-4 py-2 rounded-lg font-semibold transition hover:scale-105 cursor-pointer ${userType === "publisher" ? "bg-blue-400 text-white" : "bg-gray-200 text-gray-700"}`}
                            onClick={() => setUserType("publisher")}
                        >
                            Publisher
                        </button>
                        <button
                            className={`px-4 py-2 rounded-lg font-semibold transition hover:scale-105 cursor-pointer ${userType === "reviewer" ? "bg-blue-400 text-white" : "bg-gray-200 text-gray-700"}`}
                            onClick={() => setUserType("reviewer")}
                        >
                            Reviewer
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full openSans">
                        <div className="relative">
                            <FontAwesomeIcon icon={faEnvelope} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input type="email" name="email" placeholder="Email Address" className="w-full pl-10 pr-3 py-2 border-2 border-blue-300 rounded-lg outline-none focus:border-blue-500"
                                value={email} onChange={(e) => setEmail(e.target.value)} required />
                        </div>

                        <div className="relative">
                            <FontAwesomeIcon icon={faLock} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input type="password" name="password" placeholder="Password" className="w-full pl-10 pr-3 py-2 border-2 border-blue-300 rounded-lg outline-none focus:border-blue-500"
                                value={password} onChange={(e) => setPassword(e.target.value)} required />
                        </div>

                        {error && <p className="text-red-500 text-center">{error}</p>}

                        <p className="text-gray-600 mt-4 text-center">
                            Don't have an account?{" "}
                            <button className="text-blue-400 font-semibold hover:underline hover:text-blue-600 cursor-pointer" onClick={() => { setIsSigninOpen(false); setIsSignupOpen(true); }}>Register here</button>
                        </p>
                        <button type="submit" className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg cursor-pointer transition-all duration-300 hover:scale-105">                            {userType === "publisher" ? "Signin as Publisher" : "Signin as Reviewer"}</button>
                    </form>
                </div>
            </section>
        </>
    );
};

export default PaperSignIn;
