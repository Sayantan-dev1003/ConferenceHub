import React, { useEffect, useState } from "react";
import Signup from "./Signup";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

export default function SignIn({ setIsSigninOpen, setIsSignupOpen }) {
    const [userType, setUserType] = useState("attendee");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate(); // Added useNavigate hook

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await axios.post("/login", {
                email,
                password,
                role: userType, 
            }, { withCredentials: true });

            console.log("Login successful:", response.data);
            alert(`Login successful as ${userType}`);
            setIsSigninOpen(false);
            navigate('/feed'); // Navigate to /feed after successful login
        } catch (err) {
            setError(err.response?.data || "Invalid email or password. Please try again.");
        }
    };

    // Close the modal when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (event.target.id === "signin-modal") {
                setIsSigninOpen(false);
            }
        };
        window.addEventListener("click", handleClickOutside);
        return () => window.removeEventListener("click", handleClickOutside);
    }, []);

    return (
        <>
            <section id="signin-modal" className="fixed top-0 left-0 w-full h-full flex items-center justify-center backdrop-blur-lg bg-[rgba(17,22,28,0.8)] z-50">
                <div className="bg-white shadow-lg rounded-lg p-8 w-96 relative">
                    <h2 className="text-3xl font-bold text-blue-800 text-center mb-6">Signin</h2>

                    {/* Close Button */}
                    <button className="absolute top-4 right-4 text-gray-700 text-xl" onClick={() => setIsSigninOpen(false)}>✖</button>

                    {/* Role Selection */}
                    <div className="flex gap-4 mb-6 justify-center">
                        <button
                            className={`px-4 py-2 rounded-lg font-semibold transition ${userType === "attendee" ? "bg-blue-400 text-white" : "bg-gray-200 text-gray-700"}`}
                            onClick={() => setUserType("attendee")}
                        >
                            Attendee
                        </button>
                        <button
                            className={`px-4 py-2 rounded-lg font-semibold transition ${userType === "speaker" ? "bg-blue-400 text-white" : "bg-gray-200 text-gray-700"}`}
                            onClick={() => setUserType("speaker")}
                        >
                            Speaker
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <input type="email" placeholder="Email Address" className="p-2 border-2 border-blue-300 rounded-lg outline-none focus:border-blue-500"
                            value={email} onChange={(e) => setEmail(e.target.value)} required />

                        <input type="password" placeholder="Password" className="p-2 border-2 border-blue-300 rounded-lg outline-none focus:border-blue-500"
                            value={password} onChange={(e) => setPassword(e.target.value)} required />

                        {error && <p className="text-red-500 text-center">{error}</p>}

                        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition">Login</button>

                        <p className="text-gray-600 mt-4 text-center">
                            Don't have an account?{" "}
                            <button className="text-blue-500 font-semibold hover:underline" onClick={() => { setIsSigninOpen(false); setIsSignupOpen(true); }}>Register here</button>
                        </p>
                    </form>
                </div>
            </section>

            {setIsSignupOpen && <Signup setIsSignupOpen={setIsSignupOpen} setIsSigninOpen={setIsSigninOpen} />}
        </>
    );
}
