import React, { useEffect, useState } from 'react';
import Sidebar1 from './Sidebar1';
import ConferenceCard from './ConferenceCard';

const ManageConference = () => {
  const [conferences, setConferences] = useState([]);

  useEffect(() => {
    const fetchConferences = async () => {
      try {
        const response = await fetch('/api/conferences');
        const data = await response.json();
        setConferences(data);
      } catch (error) {
        console.error('Error fetching conferences:', error);
      }
    };

    fetchConferences();
  }, []);

  return (
    <div className='w-full min-h-screen flex'>
      <Sidebar1 />
      <div className='w-4/5 px-8 pb-8 flex flex-col justify-start items-center gap-4'>
        {conferences.map(conference => (
          <ConferenceCard key={conference._id} conference={conference} />
        ))}
      </div>
    </div>
  );
};

export default ManageConference;