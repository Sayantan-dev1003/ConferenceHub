import React, { useEffect, useState } from 'react';
import Sidebar1 from './Sidebar1';
import axios from 'axios';

const AttendeeManagement = () => {
  const [conferences, setConferences] = useState([]);

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
        <div className='w-full sticky top-0 right-0 z-50 border-b-2 pb-4 border-b-gray-300'>
          <h1 className="text-3xl font-bold mb-1 montserrat text-center">Manage Attendees</h1>
          <p className='text-lg font-medium montserrat text-gray-500 text-center'>Effortlessly handle attendee registrations, track participation, and enhance engagement with smart management tools!</p>
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4">Your Events</h2>
          {conferences.length > 0 ? (
            <ul className="list-disc pl-5">
              {conferences.map(conference => (
                <li key={conference._id} className="text-lg">{conference.title}</li>
              ))}
            </ul>
          ) : (
            <p className="text-lg text-gray-500">No events found.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default AttendeeManagement;