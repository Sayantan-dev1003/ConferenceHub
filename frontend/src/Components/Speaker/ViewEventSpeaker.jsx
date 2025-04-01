import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faMapMarkerAlt, faArrowRight, faGlobe, faUser , faUserGroup } from '@fortawesome/free-solid-svg-icons';
import Sidebar3 from './Sidebar3';
import axios from 'axios';

const ViewEventSpeaker = () => {
  const { id } = useParams();
  const [conference, setConference] = useState(null);
  const [invitations, setInvitations] = useState([]); // Added state for invitations

  useEffect(() => {
    const fetchConference = async () => {
      try {
        const response = await fetch(`/api/conference/${id}`);
        const data = await response.json();
        setConference(data);
        
        // Fetch invitations for the conference using the conference title
        const invitationsResponse = await fetch(`/api/invitations/conference/${data.title}`);
        const invitationsData = await invitationsResponse.json();
        setInvitations(invitationsData);
      } catch (error) {
        console.error('Error fetching conference or invitations:', error);
      }
    };

    fetchConference();
  }, [id]);

  console.log("Conference Details: ", conference);
  console.log("Invitation Details: ", invitations);

  if (!conference) {
    return <div>Loading...</div>;
  }

  // Function to update invitation status
  const updateInvitationStatus = async (invitationId, status) => {
    try {
      await axios.patch(`/api/invitations/${invitationId}`, { status });
      console.log(`Invitation status updated to ${status}`);
      // Update local state to reflect the change
      setInvitations(prev => prev.map(inv => inv._id === invitationId ? { ...inv, status } : inv));
    } catch (error) {
      console.error('Error updating invitation status:', error);
    }
  };

  return (
    <div className="w-full min-h-screen flex justify-end items-start openSans">
      <Sidebar3 />
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
              <p className='text-base text-gray-500'><FontAwesomeIcon icon={faGlobe} className='mr-4' />
                <a href={conference.socialMediaLinks} className='decoration-0'>Visit here <FontAwesomeIcon icon={faArrowRight} /></a>
              </p>
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
                {invitations.map(inv => (
                  <div key={inv._id} className="flex justify-between items-center">
                    <div className='flex gap-4'>
                      {inv.status === 'Accepted' ? (
                        <button className='py-1.5 px-3 rounded-lg shadow cursor-not-allowed text-white font-medium bg-gray-400' disabled>
                          Accepted
                        </button>
                      ) : inv.status === 'Declined' ? (
                        <button className='py-1.5 px-3 rounded-lg shadow cursor-not-allowed text-white font-medium bg-gray-400' disabled>
                          Declined
                        </button>
                      ) : (
                        <>
                          <button 
                            className='py-1.5 px-3 rounded-lg shadow cursor-pointer text-white font-medium bg-green-500 hover:bg-green-600' 
                            onClick={() => updateInvitationStatus(inv._id, 'Accepted')}
                          >
                            Accept
                          </button>
                          <button 
                            className='py-1.5 px-3 rounded-lg shadow cursor-pointer text-white font-medium bg-red-500 hover:bg-red-600' 
                            onClick={() => updateInvitationStatus(inv._id, 'Declined')}
                          >
                            Reject
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className='w-full p-6 space-y-3'>
                <div className='w-full flex items-center gap-3'>
                  <div className='bg-gray-300 rounded-lg text-gray-600 text-center px-4 py-2'>
                    <FontAwesomeIcon icon={faCalendarAlt} />
                  </div>
                  <div className='flex flex-col'>
                    <span className='text-xs text-gray-400'>Registration Deadline:</span>
                    <span className='text-base text-gray-600'>{new Date(conference.registrationDeadline).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  </div>
                </div>
                <div className='w-full flex items-center gap-3'>
                  <div className='bg-gray-300 rounded-lg text-gray-600 text-center px-4 py-2'>
                    <FontAwesomeIcon icon={faUser } />
                  </div>
                  <div className='flex flex-col'>
                    <span className='text-xs text-gray-400'>Eligibility:</span>
                    <span className='text-base text-gray-600'>{conference.targetAudience}</span>
                  </div>
                </div>
                <div className='w-full flex items-center gap-3'>
                  <div className='bg-gray-300 rounded-lg text-gray-600 text-center px-3 py-2'>
                    <FontAwesomeIcon icon={faUserGroup} />
                  </div>
                  <div className='flex flex-col'>
                    <span className='text-xs text-gray-400'>Number of Registration:</span>
                    <span className='text-base text-gray-600'>{conference.registrations.length}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewEventSpeaker;