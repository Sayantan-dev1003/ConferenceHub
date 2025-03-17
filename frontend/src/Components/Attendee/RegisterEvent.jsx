import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Sidebar2 from "./Sidebar2";
import Ticket from "./Ticket"; // Import the Ticket component
import jsPDF from "jspdf"; // Import jsPDF for PDF generation

const RegisterEvent = () => {
    const { id } = useParams();
    const [conference, setConference] = useState(null);
    const steps = ["Personal Information", "Event & Preferences", "Payment"];
    const [currentStep, setCurrentStep] = useState(1);
    const [attendee, setAttendee] = useState({
        fullname: "",
        email: "",
        phone: "",
        affiliation: "",
    });
    const [eventDetails, setEventDetails] = useState({
        ticketType: "",
        dietaryPreference: "",
        paymentMethod: "",
        billingAddress: "",
        termsAgreed: false,
    });
    const [isRegistered, setIsRegistered] = useState(false);
    const [registrationDetails, setRegistrationDetails] = useState(null); // State to hold registration details
    const [showTicket, setShowTicket] = useState(false); // State to control ticket preview

    useEffect(() => {
        const fetchConference = async () => {
            try {
                const response = await fetch(`/api/conference/${id}`);
                const data = await response.json();
                setConference(data);
            } catch (error) {
                console.error('Error fetching conference:', error);
            }
        };

        const checkRegistration = async () => {
            try {
                const response = await fetch(`/api/check-registration?participantId=${attendee._id}&conferenceId=${id}`);
                const data = await response.json();
                setIsRegistered(data.isRegistered); // Set registration status
            } catch (error) {
                console.error('Error checking registration:', error);
            }
        };

        fetchConference();

        fetch("/attendee")
            .then((res) => res.json())
            .then((data) => {
                setAttendee(data);
                checkRegistration(); // Check registration after fetching attendee
            })
            .catch((error) => console.error("Error fetching attendee:", error));
    }, [id]);

    const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, steps.length));
    const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

    const handlePaymentMethodChange = (e) => {
        setEventDetails({ ...eventDetails, paymentMethod: e.target.value });
    };

    const handleTermsChange = (e) => {
        setEventDetails({ ...eventDetails, termsAgreed: e.target.checked });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check if all required fields are filled
        if (!attendee.fullname || !attendee.email || !attendee.phone || !attendee.affiliation) {
            alert("Please fill out all personal information fields.");
            return;
        }

        if (!eventDetails.ticketType) {
            alert("Please select a ticket type.");
            return;
        }

        // Only check payment method and billing address if ticket price is greater than 0
        if (conference && conference.ticketPrice > 0) {
            if (!eventDetails.paymentMethod) {
                alert("Please select a payment method.");
                return;
            }

            if (!eventDetails.billingAddress) {
                alert("Please enter your billing address.");
                return;
            }
        }

        if (!eventDetails.termsAgreed) {
            alert("You must agree to the terms and conditions.");
            return;
        }

        if (isRegistered) {
            alert("You have already registered for this conference.");
            return;
        }

        const registrationData = {
            participantId: attendee._id,
            conferenceId: id,
            ticketType: eventDetails.ticketType,
            status: "Confirmed",
            dietaryPreference: eventDetails.dietaryPreference,
            paymentMethod: eventDetails.paymentMethod,
            billingAddress: eventDetails.billingAddress,
        };
        console.log(registrationData)


        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(registrationData),
            });

            const result = await response.json();
            if (response.ok) {
                alert("Registration successful!");
                setRegistrationDetails(result.registration); // Store registration details
                setCurrentStep(4); // Move to confirmation step
            } else {
                alert(result.error || "Registration failed.");
            }
        } catch (error) {
            console.error("Error during registration:", error);
            alert("An error occurred during registration.");
        }
    };

    const handlePreviewTicket = () => {
        setShowTicket(true); // Show the ticket preview
    };

    const handleDownloadTicket = () => {
        const doc = new jsPDF();
    
        // Set up formatting
        doc.setFontSize(20);
        doc.text("Ticket", 20, 20);
        doc.setFontSize(12);
        
        // Registration Information
        doc.text(`Registration Date: ${new Date(registrationDetails.registrationDate).toLocaleString()}`, 20, 40);
        doc.text(`Registration ID: ${registrationDetails._id}`, 20, 50);
    
        // Attendee Details
        doc.text("Attendee Details", 20, 70);
        doc.text(`Name: ${attendee.fullname}`, 20, 80);
        doc.text(`Email: ${attendee.email}`, 20, 90);
        doc.text(`Phone: ${attendee.phone}`, 20, 100);
        doc.text(`Affiliation: ${attendee.affiliation}`, 20, 110);
    
        // Event Details
        doc.text(`Event Name: ${conference.name}`, 20, 130);
        doc.text(`Event Venue: ${conference.location}`, 20, 140);
        // You may need to format the dates properly
        doc.text(`Event Start Date & Time: ${new Date(conference.startDate).toLocaleString()}`, 20, 150);
        doc.text(`Event End Date & Time: ${new Date(conference.endDate).toLocaleString()}`, 20, 160);
        
        // Add footer
        doc.text("Powered By ConferenceHub", 20, 180);
    
        // Save the PDF
        doc.save("ticket.pdf");
    };

    return (
        <div className="w-full min-h-screen flex justify-end items-start bg-white openSans">
            <Sidebar2 />
            <div className="w-4/5 min-h-screen flex flex-col items-center justify-center">
                <div className="w-2/3 flex flex-col items-center justify-center rounded-xl shadow-lg p-8 gap-6">
                    <div className="w-full ">
                        <h1 className="text-center text-3xl font-bold montserrat">Registration</h1>
                        <p className="text-center text-lg font-medium italic mt-2">Be a Part of Something Amazing – Register Now!</p>
                    </div>

                    <div className="flex justify-between items-center w-full max-w-2xl mx-auto my-6">
                        {steps.map((label, index) => (
                            <div key={index} className="flex flex-col items-center flex-1">
                                <div
                                    className={`w-10 h-10 flex items-center justify-center rounded-full text-black font-semibold transition duration-1000 ${index + 1 < currentStep ? "bg-green-500" : index + 1 === currentStep ? "border-2 border-blue-500 text-blue-500" : "bg-gray-300"}`}
                                >
                                    {index + 1 < currentStep ? "✔" : index + 1}
                                </div>
                                <p className={`text-sm mt-2 ${index + 1 === currentStep ? "text-blue-500" : "text-gray-500"}`}>
                                    {label}
                                </p>
                                {index < steps.length && (
                                    <div className={`w-full h-1 transition duration-1000 ${index + 1 < currentStep ? "bg-green-500" : "bg-gray-300"}`} />
                                )}
                            </div>
                        ))}
                    </div>

                    {currentStep === 1 && (
                        <div className="w-[90%] flex flex-col justify-center items-center">
                            <h2 className="text-xl font-semibold mb-6">Personal Information</h2>
                            <div className="w-full flex flex-col gap-4">
                                <input type="text" value={attendee.fullname} onChange={(e) => setAttendee({ ...attendee, fullname: e.target.value })} className="w-full px-3 py-2 border-2 text-gray-500 border-blue-300 rounded-lg outline-none transition-all duration-300 focus:border-blue-500" placeholder="Full Name" required />
                                <input type="email" value={attendee.email} onChange={(e) => setAttendee({ ...attendee, email: e.target.value })} className="w-full px-3 py-2 border-2 text-gray-500 border-blue-300 rounded-lg outline-none transition-all duration-300 focus:border-blue-500" placeholder="Email" required />
                                <input type="tel" value={attendee.phone} onChange={(e) => setAttendee({ ...attendee, phone: e.target.value })} className="w-full px-3 py-2 border-2 text-gray-500 border-blue-300 rounded-lg outline-none transition-all duration-300 focus:border-blue-500" placeholder="Phone" required />
                                <input type="text" value={attendee.affiliation} onChange={(e) => setAttendee({ ...attendee, affiliation: e.target.value })} className="w-full px-3 py-2 border-2 text-gray-500 border-blue-300 rounded-lg outline-none transition-all duration-300 focus:border-blue-500" placeholder="Affiliation" required />
                            </div>
                            <button onClick={nextStep} className="bg-gradient-to-r from-blue-500 to-purple-600 hover:scale-105 transition-transform duration-300 shadow-lg text-white text-base px-8 py-2 rounded-lg font-medium cursor-pointer mt-4">Next</button>
                        </div>
                    )}

                    {currentStep === 2 && (
                        <div className="w-2/3 flex flex-col justify-center items-center">
                            <h2 className="text-xl font-semibold mb-6">Event Preferences</h2>
                            <div className="mb-4 w-full">
                                <label className="font-semibold">Ticket Type:</label>
                                <select
                                    className="w-full px-3 py-2 border-2 text-gray-500 border-blue-300 rounded-lg outline-none transition-all duration-300 focus:border-blue-500"
                                    value={eventDetails.ticketType}
                                    onChange={(e) => setEventDetails({ ...eventDetails, ticketType: e.target.value })}
                                    required
                                >
                                    <option value="">Select Ticket Type</option>
                                    {conference && conference.ticketPrice > 0 ? (
                                        <>
                                            <option value="Paid">Paid - ${conference.ticketPrice}</option>
                                        </>
                                    ) : (
                                        <option value="Free">Free</option>
                                    )}
                                </select>
                            </div>
                            <div className="mb-4 w-full">
                                <label className="font-semibold">Dietary Preferences:</label>
                                <select
                                    className="w-full px-3 py-2 border-2 text-gray-500 border-blue-300 rounded-lg outline-none transition-all duration-300 focus:border-blue-500"
                                    value={eventDetails.dietaryPreference}
                                    onChange={(e) => setEventDetails({ ...eventDetails, dietaryPreference: e.target.value })}
                                    required
                                >
                                    <option value="">Select Dietary Preference</option>
                                    <option value="Vegetarian">Vegetarian</option>
                                    <option value="Vegan">Vegan</option>
                                    <option value="Jain">Jain</option>
                                    <option value="Gluten-Free">Gluten-Free</option>
                                    <option value="Non-Vegetarian">Non-Vegetarian</option>
                                </select>
                            </div>
                            <div className="flex justify-between mt-4 gap-10">
                                <button onClick={prevStep} className="bg-gray-400 hover:bg-gray-500 hover:scale-105 transition-transform duration-300 shadow-lg text-white text-base px-8 py-2 rounded-lg font-medium cursor-pointer mt-4">Back</button>
                                <button onClick={nextStep} className="bg-gradient-to-r from-blue-500 to-purple-600 hover:scale-105 transition-transform duration-300 shadow-lg text-white text-base px-8 py-2 rounded-lg font-medium cursor-pointer mt-4">Next</button>
                            </div>
                        </div>
                    )}

                    {currentStep === 3 && (
                        <div className="w-3/4 flex flex-col justify-center items-center">
                            <h2 className="text-xl font-semibold mb-6">Payment Information</h2>
                            {conference && conference.ticketPrice > 0 ? (
                                <>
                                    <div className="mb-4 w-full text-gray-500">
                                        <label className="font-semibold">Payment Method:</label>
                                        <div className="w-full flex justify-center items-center gap-6">
                                            <label>
                                                <input type="radio" className="mr-2" value="UPI" checked={eventDetails.paymentMethod === "UPI"} onChange={handlePaymentMethodChange} />
                                                UPI
                                            </label>
                                            <label>
                                                <input type="radio" className="mr-2" value="Credit Card" checked={eventDetails.paymentMethod === "Credit Card"} onChange={handlePaymentMethodChange} />
                                                Credit Card
                                            </label>
                                            <label>
                                                <input type="radio" className="mr-2" value="Debit Card" checked={eventDetails.paymentMethod === "Debit Card"} onChange={handlePaymentMethodChange} />
                                                Debit Card
                                            </label>
                                            <label>
                                                <input type="radio" className="mr-2" value="Net Banking" checked={eventDetails.paymentMethod === "Net Banking"} onChange={handlePaymentMethodChange} />
                                                Net Banking
                                            </label>
                                        </div>
                                    </div>
                                    <div className="mb-4 w-full">
                                        <label className="font-semibold">Billing Address:</label>
                                        <textarea className="w-full px-3 py-2 border-2 text-gray-500 border-blue-300 rounded-lg outline-none transition-all duration-300 focus:border-blue-500" value={eventDetails.billingAddress} onChange={(e) => setEventDetails({ ...eventDetails, billingAddress: e.target.value })} placeholder="Enter your billing address"></textarea>
                                    </div>
                                </>
                            ) : (
                                <p className="text-center mb-2 text-lg">This event is free, no payment is required.</p> // Message for free events
                            )}
                            <div className="mb-4 w-full flex justify-center">
                                <label className="text-center">
                                    <input type="checkbox" className="mr-2" checked={eventDetails.termsAgreed} onChange={handleTermsChange} required />
                                    I agree to the Terms & Conditions
                                </label>
                            </div>
                            <div className="flex justify-between mt-4 gap-10">
                                <button onClick={prevStep} className="bg-gray-400 hover:bg-gray-500 hover:scale-105 transition-transform duration-300 shadow-lg text-white text-base px-8 py-2 rounded-lg font-medium cursor-pointer mt-4">Back</button>
                                <button onClick={handleSubmit} className="bg-gradient-to-r from-blue-500 to-purple-600 hover:scale-105 transition-transform duration-300 shadow-lg text-white text-base px-8 py-2 rounded-lg font-medium cursor-pointer mt-4">Submit</button>
                            </div>
                        </div>
                    )}

                    {currentStep === 4 && (
                        <div className="w-3/4 flex flex-col justify-center items-center">
                            <h2 className="text-xl font-semibold mb-4">🎉 Registration Complete! 🎉</h2>
                            <p className="text-center">Thank you for registering. You will receive a confirmation email soon.</p>
                            <div className="flex gap-10 mt-4">
                                <button onClick={handlePreviewTicket} className="bg-gradient-to-r from-blue-500 to-purple-600 hover:scale-105 transition-transform duration-300 shadow-lg text-white text-base px-3 py-2 rounded-lg font-medium cursor-pointer">Preview Ticket</button>
                                <button onClick={handleDownloadTicket} className="bg-gradient-to-r from-blue-500 to-purple-600 hover:scale-105 transition-transform duration-300 shadow-lg text-white text-base px-3 py-2 rounded-lg font-medium cursor-pointer">Download Ticket</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Ticket Preview Modal */}
            {showTicket && (
                <Ticket
                    registrationDetails={registrationDetails}
                    attendeeDetails={attendee}
                    eventDetails={conference}
                    setShowTicket={setShowTicket}
                />
            )}
        </div>
    );
};

export default RegisterEvent;