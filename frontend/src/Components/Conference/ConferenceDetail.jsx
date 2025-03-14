import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const ConferenceDetail = () => {
  const { id } = useParams();
  const [conference, setConference] = useState(null);
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

    fetchConference();
  }, [id]);

  const handleDelete = async () => {
    try {
      await fetch(`/api/conference/${id}`, {
        method: 'DELETE',
      });
      navigate('/manage-conference'); // Redirect after deletion
    } catch (error) {
      console.error('Error deleting conference:', error);
    }
  };

  const handleEdit = () => {
    navigate(`/edit-conference/${id}`); // Redirect to edit page
  };

  if (!conference) return <div>Loading...</div>;

  return (
    <div className='p-4'>
      <h2 className='text-2xl font-bold'>{conference.title}</h2>
      <img src={`/${conference.banner}`} alt={conference.title} className='w-full h-48 object-cover' />
      <img src={`/${conference.logo}`} alt={conference.title} className='w-24 h-24 rounded-full border-4 border-white' />
      <p>{conference.description}</p>
      <p>Date: {new Date(conference.startDate).toLocaleDateString()} - {new Date(conference.endDate).toLocaleDateString()}</p>
      <p>Time: {conference.startTime} - {conference.endTime}</p>
      <p>Venue: {conference.mode === 'offline' ? conference.venue : conference.virtualLink}</p>
      <p>Ticket Price: {conference.ticketPrice ? `$${conference.ticketPrice}` : 'Free'}</p>
      <button onClick={handleEdit} className='bg-blue-600 text-white px-4 py-2 rounded'>Edit</button>
      <button onClick={handleDelete} className='bg-red-600 text-white px-4 py-2 rounded ml-2'>Delete</button>
    </div>
  );
};

export default ConferenceDetail;