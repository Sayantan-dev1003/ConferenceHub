import React, { useEffect, useState } from 'react';
import Sidebar1 from '../Components/Conference/Sidebar1';
import axios from 'axios';
import { io } from 'socket.io-client';
import { useNavigate } from 'react-router-dom';

const ConferenceDashboard = () => {
  const [organiser, setOrganiser] = useState(null);
  const [organiserId, setOrganiserId] = useState(null);
  const [speakerName, setSpeakerName] = useState('');
  const [conferenceName, setConferenceName] = useState('');
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrganiserDetails = async () => {
      try {
        const response = await axios.get('/organiser');
        setOrganiser(response.data.fullname);
        setOrganiserId(response.data._id);
      } catch (error) {
        console.error('Error fetching organiser details:', error);
      }
    };

    fetchOrganiserDetails();
  }, []);

  // Establish Socket.IO connection when organiser is available
  useEffect(() => {
    if (organiserId) {
      console.log('Connecting with organiser ID:', organiserId);
      const newSocket = io('http://localhost:3000', { query: { organizerId: organiserId } });
      setSocket(newSocket); // Set the socket connection

      newSocket.on('connect', () => {
        console.log('Socket.IO connection established for organiser ID:', organiserId);
      });

      newSocket.on('paperData', async (data) => {
        console.log('Received paper review notification:', data);

        const conferenceResponse = await axios.get(`/api/conference/${data.conferenceId}`);
        console.log("conferenceResponse: ", conferenceResponse);
        setConferenceName(conferenceResponse.data.title);
        
        const speakerResponse = await axios.get(`/api/speaker/paper/${data.speakerId}`);
        console.log("speakerResponse: ", speakerResponse);
        setSpeakerName(speakerResponse.data.fullname);
        setMessages(prev => [...prev, { message: 'New paper submitted!', ...data }]);
      });

      newSocket.on('disconnect', () => {
        console.log('Socket.IO connection closed');
      });

      return () => {
        newSocket.disconnect(); // Clean up on component unmount
      };
    } else {
      console.log('Organiser ID is not available yet.'); // Log if organiser ID is not set
    }
  }, [organiserId]);
  console.log("conferenceName: ", conferenceName);
  console.log("speakerName: ", speakerName);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <>
      <div className='w-full min-h-screen flex justify-end items-start openSans'>
        <Sidebar1 />
        <div className='w-4/5 min-h-screen flex flex-col p-6 bg-gray-100 overflow-y-auto'>
          <div className='bg-white p-6 rounded-lg shadow-lg mb-6'>
            <h2 className="text-2xl font-semibold text-gray-800 montserrat">
              {getGreeting()}, {organiser} 👋
            </h2>
            <p className="text-gray-500 text-sm mt-1">Here’s what’s happening next:</p>
          </div>
          {/* Display messages from organizer */}
          {messages.length > 0 && (
            <div className='flex flex-col gap-2'>
              <h2 className="text-gray-600 font-bold text-base mt-8 openSans">Notifications:</h2>
              {messages.map((message, index) => (
                <div key={index} className='w-1/2 bg-gray-200 p-4 rounded-lg'>
                  <p className="text-gray-700 text-sm font-medium">{message.message}</p>
                  <p className="text-gray-500 text-xs">Paper Title: {message.title}</p>
                  <p className="text-gray-500 text-xs">Conference: {conferenceName}</p>
                  <p className="text-gray-500 text-xs">Submitted by: {speakerName}</p>
                  <div className='flex items-end justify-end mt-4'>
                    {console.log(message)}
                    <button
                      className='py-1 px-2.5 rounded-lg text-xs shadow cursor-pointer text-blue-900 font-medium bg-gradient-to-r from-blue-300 to-violet-300 hover:from-blue-400 hover:to-violet-400'
                      onClick={() => {
                        if (socket) {
                          socket.emit('clearNotifications');
                        }
                        navigate(`/assign-reviewers/${message.paperId}`);
                      }}
                    >
                      Assign Reviewers
                    </button>
                  </div>

                </div>
              ))}

            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default ConferenceDashboard;