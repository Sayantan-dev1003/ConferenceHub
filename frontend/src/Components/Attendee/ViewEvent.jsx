import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faMapMarkerAlt, faArrowRight, faGlobe, faUser, faUserGroup } from '@fortawesome/free-solid-svg-icons';
import Sidebar2 from './Sidebar2';
import Ticket from "./Ticket"; // Import the Ticket component
import jsPDF from "jspdf";

const ViewEvent = () => {
  const { id } = useParams();
  const [conference, setConference] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [attendee, setAttendee] = useState(null);
  const [registrationDetails, setRegistrationDetails] = useState(null);
  const [showTicket, setShowTicket] = useState(false);
  const navigate = useNavigate();

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

    const checkRegistrationStatus = async () => {
      try {
        const response = await fetch('/attendee', { credentials: 'include' }); // Fetch attendee data
        const attendeeData = await response.json();
        setAttendee(attendeeData);
        if (attendeeData.conferences && attendeeData.conferences.includes(id)) {
          setIsRegistered(true); // Set registration status if the conference ID is found
        }
      } catch (error) {
        console.error('Error fetching attendee data:', error);
      }
    };

    const registrationDetailsData = async () => {
      try {
        const response = await fetch(`/api/register/participant/${id}`, { credentials: 'include' });
        const data = await response.json();
        setRegistrationDetails(data);
      } catch (error) {
        console.error('Error displaying Registration Details Data:', error);
      }
    };

    fetchConference();
    checkRegistrationStatus();
    registrationDetailsData();
  }, [id]);

  if (!conference) {
    return <div>Loading...</div>;
  }

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
    <div className="w-full min-h-screen flex justify-end items-start openSans">
      <Sidebar2 />
      <div className="w-4/5 min-h-screen flex flex-col overflow-y-auto">
        <div className='w-full overflow-hidden'>
          <img src={`/${conference.banner}`} alt={conference.title} className="w-full h-80 object-cover" />
        </div>
        <div className='w-full flex p-6 bg-gray-100 gap-6'>
          <div className='w-2/3 flex flex-col gap-6'>
            <div className='w-full p-6 rounded-xl bg-white shadow-md'>
              <div className='w-full flex gap-4 items-center mb-4'>
                <img src={`/${conference.logo}`} alt={conference.title} className='w-[7rem] h-[7rem] border-8 border-white rounded-2xl shadow-md' />
                <span className='text-4xl font-extrabold montserrat'>{conference.title}</span>
              </div>
              <p className='text-base text-gray-500'><FontAwesomeIcon icon={faMapMarkerAlt} className='mr-4' />{conference.venue}</p>
              <p className='text-base text-gray-500'><FontAwesomeIcon icon={faCalendarAlt} className='mr-4' />Start Date : {new Date(conference.startDate).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })} - {conference.startTime}</p>
              <p className='text-base text-gray-500'><FontAwesomeIcon icon={faCalendarAlt} className='mr-4' />End Date : {new Date(conference.endDate).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })} - {conference.endTime}</p>
              <p className='text-base text-gray-500'><FontAwesomeIcon icon={faGlobe} className='mr-4' />
                <a href={conference.socialMediaLinks} className='decoration-0'>Visit here <FontAwesomeIcon icon={faArrowRight} /></a>
              </p>
              <div className='flex gap-4 text-gray-500 text-base mt-4'>
                <span className='py-1 px-4 rounded-3xl border border-gray-400'>{conference.type}</span>
                <span className='py-1 px-4 rounded-3xl border border-gray-400'>{conference.category}</span>
              </div>
            </div>
            <div className='w-full p-6 rounded-xl bg-white shadow-md'>
              <p className='text-base text-black font-medium'>All that you need to know about {conference.title}</p>
              <p style={{ whiteSpace: "pre-line" }} className='text-sm text-gray-600'>{conference.description}</p>
            </div>
          </div>
          <div className='w-1/3'>
            <div className='w-full rounded-xl bg-white shadow-md self-start h-auto mb-6'>
              <div className='w-full p-6 border-b border-b-gray-300 space-y-5'>
                <p className='text-2xl font-medium text-black'>
                  {conference.ticketPrice > 0 ? `$${conference.ticketPrice}` : 'Free'}
                </p>
                {isRegistered ? (
                  <>
                    <button className="bg-gray-300 transition-transform duration-300 shadow-lg text-white text-base px-[6rem] py-2 rounded-lg font-medium cursor-not-allowed" disabled>
                      Registered
                    </button>
                    <button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:scale-105 transition-transform duration-300 shadow-lg text-white text-base px-[5.1rem] py-2 rounded-lg font-medium cursor-pointer" onClick={handlePreviewTicket}>
                      Preview Ticket
                    </button>
                    <button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:scale-105 transition-transform duration-300 shadow-lg text-white text-base px-[4.55rem] py-2 rounded-lg font-medium cursor-pointer" onClick={handleDownloadTicket}>
                      Download Ticket
                    </button>
                  </>
                ) : (
                  <button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:scale-105 transition-transform duration-300 shadow-lg text-white text-base px-[6.6rem] py-2 rounded-lg font-medium cursor-pointer" onClick={() => navigate(`/register-attendee/${conference._id}`)}>
                    Register
                  </button>
                )}
              </div>
              <div className='w-full p-6 space-y-3'>
                <div className='w-full flex items-center gap-3'>
                  <div className='bg-gray-300 rounded-lg text-gray-600 text-center px-4 py-2'>
                    <FontAwesomeIcon icon={faCalendarAlt} />
                  </div>
                  <div className='flex flex-col'>
                    <span className='text-xs text-gray-400'>Registration Deadline:</span>
                    <span className='text-base text-gray-600'>{new Date(conference.registrationDeadline).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  </div>
                </div>
                <div className='w-full flex items-center gap-3'>
                  <div className='bg-gray-300 rounded-lg text-gray-600 text-center px-4 py-2'>
                    <FontAwesomeIcon icon={faUser} />
                  </div>
                  <div className='flex flex-col'>
                    <span className='text-xs text-gray-400'>Eligibility:</span>
                    <span className='text-base text-gray-600'>{conference.targetAudience}</span>
                  </div>
                </div>
                <div className='w-full flex items-center gap-3'>
                  <div className='bg-gray-300 rounded-lg text-gray-600 text-center px-3 py-2'>
                    <FontAwesomeIcon icon={faUserGroup} />
                  </div>
                  <div className='flex flex-col'>
                    <span className='text-xs text-gray-400'>Number of Registration:</span>
                    <span className='text-base text-gray-600'>{conference.registrations.length}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
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

export default ViewEvent;