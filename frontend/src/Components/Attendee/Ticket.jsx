import React from "react";

const Ticket = ({ registrationDetails, attendeeDetails, eventDetails, setShowTicket }) => {
    return (
        <section className="fixed top-0 left-0 w-full h-full flex items-center justify-center backdrop-blur-lg bg-[rgba(17,22,28,0.8)] z-50">
            <div className="w-2/3 flex flex-col items-center justify-center bg-white shadow-lg rounded-xl p-8">
                <h2 className="text-3xl font-bold text-blue-800 mt-2 text-center mb-6 montserrat">
                    Ticket
                </h2>

                <div className="w-full flex items-start justify-center gap-4">
                    <div className="w-full">
                        <div>
                            <p><strong>Registration Date:</strong> {new Date(registrationDetails.registrationDate).toLocaleString()}</p>
                            <p><strong>Registration ID:</strong> {registrationDetails._id}</p>
                        </div>
                        <h3 className="font-semibold mt-4">Attendee Details</h3>
                        <div>
                            <p><strong>Name:</strong> {attendeeDetails.fullname}</p>
                            <p><strong>Email:</strong> {attendeeDetails.email}</p>
                            <p><strong>Phone:</strong> {attendeeDetails.phone}</p>
                            <p><strong>Affiliation:</strong> {attendeeDetails.affiliation}</p>
                        </div>
                    </div>
                    <div className="w-full text-center">
                        <p className="font-semibold"></p>
                    </div>
                </div>
                <div className="w-full mt-4">
                    <p><strong>Event Name:</strong> {eventDetails.name}</p>
                    <p><strong>Event Date and Time:</strong> {new Date(eventDetails.date).toLocaleString()}</p>
                    <p><strong>Event Location:</strong> {eventDetails.location}</p>
                </div>
                <p className="mt-4">Powered By</p>
                <p className="font-semibold">ConferenceHub</p>
                <button 
                    className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700" 
                    onClick={() => setShowTicket(false)} // Function to close the ticket modal
                >
                    Close
                </button>
            </div>
        </section>
    );
};

export default Ticket;