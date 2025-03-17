import React from "react";

const Ticket = ({ registrationDetails, attendeeDetails, eventDetails, setShowTicket }) => {
    console.log("registrationDetails: ", registrationDetails)
    console.log("attendeeDetails: ", attendeeDetails)
    console.log("eventDetails: ", eventDetails)
    return (
        <section className="fixed top-0 left-0 w-full h-full flex items-center justify-center backdrop-blur-lg bg-[rgba(17,22,28,0.8)] z-50 openSans p-10">
            <div className="w-[60vw] p-6 bg-white rounded-4xl">
                <div className="w-full flex flex-col items-center justify-center bg-white rounded-2xl p-8 border-2 border-dashed border-gray-400">
                    <h2 className="text-3xl font-bold text-blue-800 mt-2 text-center mb-6 montserrat">
                        Ticket
                    </h2>
                    <div className="w-full flex flex-col items-start justify-center gap-4 tracking-wider">
                        <div className="text-xs">
                            <p><strong>Registration Date:</strong> {new Date(registrationDetails.registrationDate).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                            <p><strong>Registration ID:</strong> {registrationDetails._id}</p>
                        </div>
                        <div className="w-full flex justify-between items-center">
                            <div>
                                <h3 className="font-bold text-xl mt-6">Attendee Details</h3>
                                <div className="text-base space-y-1">
                                    <p><strong>Name:</strong> {attendeeDetails.fullname}</p>
                                    <p><strong>Email:</strong> {attendeeDetails.email}</p>
                                    <p><strong>Phone:</strong> {attendeeDetails.phone}</p>
                                    <p><strong>Affiliation:</strong> {attendeeDetails.affiliation}</p>
                                </div>
                            </div>
                            <img src={`/${eventDetails.logo}`} alt={eventDetails.title} className='w-[10rem] h-[10rem] rounded-2xl' />
                        </div>
                    </div>
                    <div className="w-full mt-6 tracking-wider text-base">
                        <p><strong>Event Name:</strong> {eventDetails.title}</p>
                        <p><strong>Event Venue:</strong> {eventDetails.venue}</p>
                        <p><strong>Event Start Date & Time:</strong> {new Date(eventDetails.startDate).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })} - {eventDetails.startTime}</p>
                        <p><strong>Event End Date & Time:</strong> {new Date(eventDetails.endDate).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })} - {eventDetails.endTime}</p>
                    </div>
                    <p className="mt-8 text-sm text-gray-400">Powered By</p>
                    <p className="font-bold text-3xl moonDance">ConferenceHub</p>
                    <button
                        className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                        onClick={() => setShowTicket(false)} // This should work if setShowTicket is passed correctly
                    >
                        Close
                    </button>
                </div>
            </div>
        </section>
    );
};

export default Ticket;