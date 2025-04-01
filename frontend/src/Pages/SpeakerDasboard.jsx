import React, { useEffect, useState } from 'react';
import Sidebar3 from "../Components/Speaker/Sidebar3";
import { io } from 'socket.io-client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faMapMarkerAlt, faLink } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const SpeakerDashboard = () => {
  const [speaker, setSpeaker] = useState(null);
  const [speakerId, setSpeakerId] = useState('');
  const [socket, setSocket] = useState(null);
  const [invitations, setInvitations] = useState([]);
  const [conferenceTitles, setConferenceTitles] = useState([]); // Array to store conference titles
  const [conferenceDetails, setConferenceDetails] = useState(null); // State for conference details

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

    fetchSpeakerDetails();
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

              {invitations.map(inv => {
                // Find the corresponding conference details based on the invitation title
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
                      <button className='py-1 px-2 rounded-lg shadow cursor-pointer text-blue-900 font-medium bg-gradient-to-r from-blue-300 to-violet-300 hover:from-blue-400 hover:to-violet-400'>Know more</button>
                      <button className='py-1 px-2 rounded-lg shadow cursor-pointer text-white font-medium bg-green-500 hover:bg-green-600'>Accept</button>
                      <button className='py-1 px-2 rounded-lg shadow cursor-pointer text-white font-medium bg-red-500 hover:bg-red-600'>Reject</button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SpeakerDashboard;