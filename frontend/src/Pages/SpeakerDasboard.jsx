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
        setSpeaker(response.data);
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

  return (
    <div className='w-full min-h-screen flex justify-end items-start openSans'>
      <Sidebar3 />
      <div className='w-4/5 min-h-screen flex flex-col p-6 bg-gray-100 overflow-y-auto'>
        <p>This is Speaker's Dashboard</p>
        {invitations.length > 0 && (
          <div>
            <h2>Pending Invitations:</h2>
            {invitations.map(inv => (
              <p key={inv._id}>Invitation: {inv.message}</p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SpeakerDashboard;