import React, { useEffect, useState } from 'react';
import Sidebar1 from './Sidebar1';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SpeakerManagement = () => {
  const [conferences, setConferences] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchConferences = async () => {
      try {
        const response = await axios.get('/api/organiser/conferences', { withCredentials: true });
        setConferences(response.data);
      } catch (error) {
        console.error("Error fetching conferences:", error);
      }
    };

    fetchConferences();
  }, []);

  return (
    <div className='w-full min-h-screen flex justify-end items-start openSans'>
      <Sidebar1 />

      <div className='w-4/5 min-h-screen flex flex-col overflow-y-auto p-6'>
        <div className='w-full sticky top-0 right-0 z-50 border-b-2 pb-4 mb-4 border-b-gray-300'>
          <h1 className="text-3xl font-bold mb-1 montserrat text-center">Manage Speaker</h1>
          <p className='text-lg font-medium montserrat text-gray-500 text-center'>Seamlessly manage speakers, schedule sessions, and streamline communication with powerful speaker management tools!</p>
        </div>
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <h2 className="p-4 text-lg leading-6 font-medium text-gray-900 montserrat">Your Events</h2>
          {conferences.length > 0 ? (
            <ul className="border-t border-gray-200 divide-y divide-gray-200">
              {conferences.map(conference => (
                <li key={conference._id} className="px-4 py-4  cursor-pointer hover:bg-gray-100" onClick={() => navigate(`/speaker-management/${conference._id}`)}>
                  <div className="text-lg text-gray-500">{conference.title}</div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-4 py-5 sm:px-6">
              <p className="text-sm text-gray-500">No events found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SpeakerManagement;