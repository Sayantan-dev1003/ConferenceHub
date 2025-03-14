import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar1 from './Sidebar1';

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
    if (window.confirm('Are you sure you want to delete this conference?')) {
      try {
        const response = await fetch(`/api/conference/${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          navigate('/manage-conference');
        } else {
          console.error('Error deleting conference');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  const handleEdit = () => {
    navigate(`/edit-conference/${id}`);
  };

  if (!conference) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full min-h-screen flex justify-end items-start">
      <Sidebar1 />
      <div className="w-4/5 min-h-screen px-8 pb-8 flex flex-col justify-center items-center gap-4 overflow-y-auto">
        <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-2 montserrat">
          Conference Details
        </h2>
        <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-2xl">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">{conference.title}</h3>
          <p className="text-gray-600 mb-4">{conference.description}</p>
          <div className="mb-4">
            <strong>Type:</strong> {conference.type}
          </div>
          <div className="mb-4">
            <strong>Category:</strong> {conference.category}
          </div>
          <div className="mb-4">
            <strong>Start Date:</strong> {new Date(conference.startDate).toLocaleDateString()}
          </div>
          <div className="mb-4">
            <strong>End Date:</strong> {new Date(conference.endDate).toLocaleDateString()}
          </div>
          <div className="mb-4">
            <strong>Mode:</strong> {conference.mode}
          </div>
          {conference.mode === 'offline' ? (
            <div className="mb-4">
              <strong>Venue:</strong> {conference.venue}
            </div>
          ) : (
            <div className="mb-4">
              <strong>Virtual Link:</strong> <a href={conference.virtualLink} target="_blank" rel="noopener noreferrer">{conference.virtualLink}</a>
            </div>
          )}
          <div className="mb-4">
            <strong>Ticket Type:</strong> {conference.ticketType}
          </div>
          {conference.ticketType === 'paid' && (
            <div className="mb-4">
              <strong>Ticket Price:</strong> ${conference.ticketPrice}
            </div>
          )}
          <div className="mb-4">
            <strong>Registration Deadline:</strong> {new Date(conference.registrationDeadline).toLocaleDateString()}
          </div>
          <div className="mb-4">
            <strong>Keynote Speakers:</strong> {conference.keynoteSpeakers}
          </div>
          <div className="mb-4">
            <strong>Target Audience:</strong> {conference.targetAudience}
          </div>
          <div className="mb-4">
            <strong>Social Media Links:</strong> <a href={conference.socialMediaLinks} target="_blank" rel="noopener noreferrer">{conference.socialMediaLinks}</a>
          </div>
          <div className="flex justify-between mt-6">
            <button
              onClick={handleEdit}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConferenceDetail;