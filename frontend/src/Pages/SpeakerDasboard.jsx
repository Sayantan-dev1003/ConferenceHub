import React, { useEffect, useState } from 'react';
import Sidebar3 from "../Components/Speaker/Sidebar3";
import { io } from 'socket.io-client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faMapMarkerAlt, faLink } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SpeakerDashboard = () => {
  const [speaker, setSpeaker] = useState(null);
  const [speakerId, setSpeakerId] = useState('');
  const [socket, setSocket] = useState(null);
  const [invitations, setInvitations] = useState([]);
  const [conferenceTitles, setConferenceTitles] = useState([]);
  const [conferenceDetails, setConferenceDetails] = useState(null);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const navigate = useNavigate();

  // Fetch speaker details
  useEffect(() => {
    const fetchSpeakerDetails = async () => {
      try {
        const response = await axios.get('/speaker');
        setSpeaker(response.data.fullname);
        setSpeakerId(response.data._id);
      } catch (error) {
        console.error('Error fetching speaker details:', error);
      }
    };

    // Fetch upcoming events
    const fetchUpcomingEvents = async () => {
      try {
        const response = await axios.get("/api/speaker/upcoming-events", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Include auth token if required
          },
        });

        // Format event dates to IST
        const formattedEvents = response.data.map(event => ({
          ...event,
          startDate: new Date(event.startDate).toLocaleDateString("en-IN", {
            timeZone: "Asia/Kolkata",
            year: "numeric",
            month: "long",
            day: "2-digit"
          }),
        }));

        setUpcomingEvents(formattedEvents);
      } catch (error) {
        console.error("Error fetching upcoming events:", error);
      }
    };

    fetchSpeakerDetails();
    fetchUpcomingEvents();
  }, []); // This effect runs only once when the component mounts

  // Fetch invitations when the speakerId is available
  useEffect(() => {
    const fetchInvitations = async () => {
      if (speakerId) {
        try {
          const response = await axios.get('/api/invitations', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } // Adjust based on your auth method
          });
          setInvitations(response.data);
          const titles = response.data.map(invitation => invitation.title);
          setConferenceTitles(titles);
        } catch (error) {
          console.error('Error fetching invitations:', error);
        }
      }
    };

    fetchInvitations();
  }, [speakerId]); // This effect runs whenever speakerId changes

  // Establish Socket.IO connection when speakerId is available
  useEffect(() => {
    if (speakerId) {
      console.log('Connecting with speaker ID:', speakerId); // Log the speaker ID
      const newSocket = io('http://localhost:3000', { query: { speakerId } });
      setSocket(newSocket); // Set the socket connection

      newSocket.on('connect', () => {
        console.log('Socket.IO connection established for speaker ID:', speakerId);
      });

      newSocket.on('invitation', (data) => {
        console.log('Received invitation:', data);
        setInvitations(prev => [...prev, data]); // Add the new invitation to the list
        alert(data.message);
        // Update conference titles array with the new invitation's title
        setConferenceTitles(prev => [...prev, data.title]);
      });

      newSocket.on('disconnect', () => {
        console.log('Socket.IO connection closed');
      });

      return () => {
        newSocket.disconnect(); // Clean up on component unmount
      };
    } else {
      console.log('Speaker ID is not available yet.'); // Log if speakerId is not set
    }
  }, [speakerId]); // This effect runs whenever speakerId changes

  // Function to fetch conference details by title
  useEffect(() => {
    const fetchConferenceDetails = async () => {
      if (conferenceTitles.length === 0) return; // Skip if no titles

      try {
        const response = await axios.get(`/api/conference/titles/${conferenceTitles.join(',')}`);
        setConferenceDetails(response.data);
      } catch (err) {
        console.error('Error fetching conference details:', err);
        setConferenceDetails(null); // Clear previous conference details
      }
    };

    fetchConferenceDetails();
  }, [conferenceTitles]);

  // Function to update invitation status
  const updateInvitationStatus = async (invitationId, status) => {
    try {
      await axios.patch(`/api/invitations/${invitationId}`, { status });
      console.log(`Invitation status updated to ${status}`);
      // Update local state to reflect the change
      setInvitations(prev => prev.map(inv => inv._id === invitationId ? { ...inv, status } : inv));
    } catch (error) {
      console.error('Error updating invitation status:', error);
    }
  };



  // Function to get dynamic greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <div className='w-full min-h-screen flex justify-end items-start openSans'>
      <Sidebar3 />
      <div className='w-4/5 min-h-screen flex flex-col p-6 bg-gray-100 overflow-y-auto'>
        <div className='bg-white p-6 rounded-lg shadow-lg mb-6'>
          <h2 className="text-2xl font-semibold text-gray-800 montserrat">
            {getGreeting()}, {speaker} 👋
          </h2>
          <p className="text-gray-500 text-sm mt-1">Here’s what’s happening next:</p>

          {invitations.length > 0 && (
            <div className='flex flex-col gap-2'>
              <h2 className="text-gray-600 font-bold text-base mt-8 openSans">Pending Invitations:</h2>

              {invitations.filter(inv => inv.status !== 'Accepted' && inv.status !== 'Declined').map(inv => {
                const conferenceDetail = conferenceDetails ? conferenceDetails.find(conf => conf.title === inv.title) : null;

                return (
                  <div key={inv._id} className='w-1/2 bg-gradient-to-r from-blue-100 to-violet-100 rounded-lg px-6 py-3 text-sm'>
                    <p className='text-blue-950 text-xl font-bold montserrat'>{inv.title}</p>
                    {conferenceDetail ? (
                      <>
                        <span className="text-blue-900 text-xs font-medium">
                          <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
                          {new Date(conferenceDetail.startDate).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata', year: 'numeric', month: 'long', day: 'numeric' })} {conferenceDetail.startTime}
                        </span>
                        <p className="text-blue-900 text-xs font-medium">
                          <FontAwesomeIcon icon={conferenceDetail.mode === 'offline' ? faMapMarkerAlt : faLink} className="mr-2" />
                          {conferenceDetail.mode === 'offline' ? conferenceDetail.venue : conferenceDetail.virtualLink}
                        </p>
                      </>
                    ) : (
                      <p className="text-blue-900 text-xs">Conference details not available</p>
                    )}
                    <div className='flex gap-2 text-xs justify-end mt-6'>
                      <button className='py-1 px-2 rounded-lg shadow cursor-pointer text-blue-900 font-medium bg-gradient-to-r from-blue-300 to-violet-300 hover:from-blue-400 hover:to-violet-400' onClick={() => navigate(`/view-event/${conferenceDetail._id}`)}>Know more</button>
                      <button className='py-1 px-2 rounded-lg shadow cursor-pointer text-white font-medium bg-green-500 hover:bg-green-600' onClick={() => updateInvitationStatus(inv._id, 'Accepted')}>Accept</button>
                      <button className='py-1 px-2 rounded-lg shadow cursor-pointer text-white font-medium bg-red-500 hover:bg-red-600' onClick={() => updateInvitationStatus(inv._id, 'Declined')}>Reject</button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Upcoming Events */}
          <div className="mt-4">
            <h3 className="text-base font-bold text-gray-600 openSans">Upcoming Events</h3>
            {upcomingEvents.length > 0 ? (
              <>
                <ul className="mt-2 space-y-2">
                  {upcomingEvents.map((event) => (
                    <li key={event._id} className="p-3 bg-gray-200 rounded-md flex flex-col">
                      <span className="font-semibold text-2xl montserrat">{event.title} ({event.mode})</span>
                      <div className="flex gap-12">
                        <span className="text-gray-500 text-xs"><FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />{event.startDate} {event.startTime}</span>
                        <p className="text-gray-500 text-xs">
                          <FontAwesomeIcon icon={event.mode === 'offline' ? faMapMarkerAlt : faLink} className="mr-2" />
                          {event.mode === 'offline' ? event.venue : event.virtualLink}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
                {/* View All Events Button */}
                <button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:scale-105 transition-transform duration-300 shadow-lg text-white text-base px-4 py-2 rounded-lg font-medium cursor-pointer mt-14" onClick={() => navigate('/speaker-sessions')}>
                  View Your Events
                </button>
              </>
            ) : (
              <p className="text-gray-500">No upcoming events.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpeakerDashboard;