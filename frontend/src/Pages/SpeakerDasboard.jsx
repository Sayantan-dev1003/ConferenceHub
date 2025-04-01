import React, { useEffect, useState } from 'react';
import Sidebar3 from "../Components/Speaker/Sidebar3";
import { io } from 'socket.io-client'; // Import Socket.IO client
import axios from 'axios';

const SpeakerDashboard = () => {
  const [speaker, setSpeaker] = useState(null);
  const [speakerId, setSpeakerId] = useState('');
  const [socket, setSocket] = useState(null); // State to hold the socket connection
  const [invitations, setInvitations] = useState([]); // State to hold the invitations

  // Fetch speaker details
  useEffect(() => {
    const fetchSpeakerDetails = async () => {
      try {
        const response = await axios.get('/speaker');
        setSpeaker(response.data.fullname);
        setSpeakerId(response.data._id); // Set speakerId from the fetched data
        console.log('Speaker details:', response.data);
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
              {invitations.map(inv => (
                <p key={inv._id} className='bg-gray-200 rounded-lg px-4 py-2 text-gray-800 text-sm'>{inv.message}</p>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SpeakerDashboard;