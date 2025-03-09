import { useState } from "react";
import Register from "../assets/registration.jpg";
import Signup from "../Components/Signup";

export default function Registration() {
    const [isSignupOpen, setIsSignupOpen] = useState(false);

    return (
        <section className="w-full flex gap-12 items-start justify-start py-44 px-8 bg-gray-100 openSans">
            <div className="w-[55vw] flex justify-center">
                <div className="relative rounded-2xl overflow-hidden h-[60vh] w-full shadow-2xl shadow-blue-200 hover:shadow-blue-500 transition">
                    <img
                        src={Register}
                        alt="Registration Preview"
                        className="w-full h-full object-cover"
                    />
                </div>
            </div>

            <div className="w-[40vw] flex flex-col items-start justify-start">
                <h3 className="text-gray-500 font-semibold uppercase tracking-wide">
                    Registration
                </h3>
                <h2 className="text-5xl font-bold text-blue-800 moonDance leading-tight mb-6">
                    Streamline Event Registrations
                </h2>
                <p className="text-gray-600 mt-4 leading-relaxed">
                    <b>ConferenceHub</b> simplifies event registration with a seamless and user-friendly workflow. Customizable forms allow attendees to provide necessary details effortlessly, while automated approvals reduce manual work. Instant confirmations and reminders keep participants informed at every step. Secure check-ins with QR-based entry eliminate long queues, ensuring a smooth experience. With an intuitive interface and real-time updates, ConferenceHub makes registration easier than ever.
                </p>

                <button className="bg-gradient-to-r mt-6 from-blue-500 to-purple-600 hover:scale-105 transition-transform duration-300 shadow-lg text-white px-6 py-2 rounded-full font-semibold cursor-pointer" onClick={() => setIsSignupOpen(true)}>
                    Register
                </button>
            </div>

            {isSignupOpen && <Signup setIsSignupOpen={setIsSignupOpen} />}
        </section>
    );
}