import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faMapMarkerAlt, faArrowRight, faGlobe, faUser } from '@fortawesome/free-solid-svg-icons';
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

  const handleEdit = () => {
    navigate(`/edit-conference/${id}`);
  };

  if (!conference) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full min-h-screen flex justify-end items-start openSans">
      <Sidebar1 />
      <div className="w-4/5 min-h-screen flex flex-col overflow-y-auto">
        <div className='w-full overflow-hidden'>
          <img src={`/${conference.banner}`} alt={conference.title} className="w-full h-80 object-cover" />
        </div>
        <div className='w-full flex p-6 bg-gray-100 gap-6'>
          <div className='w-2/3 flex flex-col gap-6'>
            <div className='w-full p-6 rounded-xl bg-white shadow-md'>
              <div className='w-full flex gap-4 items-center mb-4'>
                <img src={`/${conference.logo}`} alt={conference.title} className='w-[7rem] h-[7rem] border-8 border-white rounded-2xl shadow-md' />
                <span className='text-4xl font-extrabold montserrat'>{conference.title}</span>
              </div>
              <p className='text-base text-gray-500'><FontAwesomeIcon icon={faMapMarkerAlt} className='mr-4' />{conference.venue}</p>
              <p className='text-base text-gray-500'><FontAwesomeIcon icon={faCalendarAlt} className='mr-4' />Start Date : {new Date(conference.startDate).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })} - {conference.startTime}</p>
              <p className='text-base text-gray-500'><FontAwesomeIcon icon={faCalendarAlt} className='mr-4' />End Date : {new Date(conference.endDate).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })} - {conference.endTime}</p>
              <p className='text-base text-gray-500'><FontAwesomeIcon icon={faGlobe} className='mr-4' /><a href={conference.socialMediaLinks} className='decoration-0'>Visit here <FontAwesomeIcon icon={faArrowRight} /></a></p>
              <div className='flex gap-4 text-gray-500 text-base mt-4'>
                <span className='py-1 px-4 rounded-3xl border border-gray-400'>{conference.type}</span>
                <span className='py-1 px-4 rounded-3xl border border-gray-400'>{conference.category}</span>
              </div>
            </div>
            <div className='w-full p-6 rounded-xl bg-white shadow-md'>
              <p className='text-base text-black font-medium'>All that you need to know about {conference.title}</p>
              <p style={{ whiteSpace: "pre-line" }} className='text-sm text-gray-600'>{conference.description}</p>
            </div>
          </div>
          <div className='w-1/3'>
            <div className='w-full rounded-xl bg-white shadow-md self-start h-auto mb-6'>
              <div className='w-full p-6 border-b border-b-gray-300 space-y-5'>
                <p className='text-2xl font-medium text-black'>
                  {conference.ticketPrice > 0 ? `$${conference.ticketPrice}` : 'Free'}
                </p>
                <Link to="/conference-dashboard" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:scale-105 transition-transform duration-300 shadow-lg text-white text-base px-[4.3rem] py-2 rounded-lg font-medium cursor-pointer">Go to Dashboard</Link>
              </div>
              <div className='w-full p-6 space-y-3'>
                <div className='w-full flex items-center gap-3'>
                  <div className='bg-gray-300 rounded-lg text-gray-600 text-center px-3 py-2'>
                    <FontAwesomeIcon icon={faCalendarAlt} />
                  </div>
                  <div className='flex flex-col'>
                    <span className='text-xs text-gray-400'>Registration Deadline:</span>
                    <span className='text-base text-gray-600'>{new Date(conference.registrationDeadline).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  </div>
                </div>
                <div className='w-full flex items-center gap-3'>
                  <div className='bg-gray-300 rounded-lg text-gray-600 text-center px-3 py-2'>
                    <FontAwesomeIcon icon={faUser} />
                  </div>
                  <div className='flex flex-col'>
                    <span className='text-xs text-gray-400'>Eligibility:</span>
                    <span className='text-base text-gray-600'>{conference.targetAudience}</span>
                  </div>
                </div>
              </div>
            </div>
            <button onClick={handleEdit} className='px-4 py-2 rounded-xl bg-blue-400 text-white cursor-pointer transition duration-200 hover:bg-blue-600'>Edit</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConferenceDetail;