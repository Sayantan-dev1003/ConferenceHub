import React, { useEffect, useState } from 'react';
import Sidebar1 from './Sidebar1';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faEnvelope, faPhone, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { faLinkedin, faTwitter } from '@fortawesome/free-brands-svg-icons';
import { useParams } from 'react-router-dom';

const AssignSpeaker = () => {
    const [speakers, setSpeakers] = useState([]);
    const { title } = useParams();

    useEffect(() => {
        const fetchSpeakers = async () => {
            try {
                const response = await axios.get(`/api/speaker-details/${title}`);
                setSpeakers(response.data);
            } catch (error) {
                console.error('Error fetching speakers:', error);
            }
        };

        fetchSpeakers();
    }, [title]);

    const handleInvite = async (speakerId, title) => {
        try {
            const response = await axios.post('/api/invite-speaker', {
                speakerId,
                title,
                message: `You have been invited to speak at "${title}"`, // Customize the message
            });
            console.log("Invite Response:", response.data);
            alert('Invitation sent successfully!');
        } catch (error) {
            console.error('Error sending invitation:', error);
            alert('Failed to send invitation.');
        }
    };

    return (
        <div className='w-full min-h-screen flex justify-end items-start openSans'>
            <Sidebar1 />
            <div className='w-4/5 min-h-screen flex flex-col overflow-y-auto p-6'>
                <h1 className="text-3xl font-bold mb-1 montserrat text-center">Assign Speaker</h1>
                <p className='text-lg font-medium montserrat text-gray-500 text-center'>Seamlessly manage speaker assignments, track participation, and boost engagement with intuitive and efficient tools!</p>
                <div className='mt-4'>
                    <h2 className="text-2xl font-semibold text-center mb-2">Speakers</h2>
                    <div className='flex flex-wrap justify-start'>
                        {Array.isArray(speakers) && speakers.map((speaker) => (
                            <div key={speaker._id} className='w-[48%] m-2 p-4 border border-gray-300 rounded-lg hover:bg-gray-100 hover:shadow-lg transition duration-200 flex flex-col justify-between'>
                                <div>
                                    <div className='flex justify-between items-end'>
                                        <h3 className="text-xl font-semibold montserrat">{speaker.fullname}, <span className='text-xs font-light italic'>{speaker.affiliation}</span></h3>
                                        <button className='bg-gradient-to-r from-blue-500 to-purple-600 hover:scale-110 hover:shadow-lg transition-transform duration-300 text-white px-2 py-1 rounded text-xs cursor-pointer mt-4'
                                            onClick={() => handleInvite(speaker._id, title)}
                                        >Invite <FontAwesomeIcon icon={faPaperPlane} /></button>
                                    </div>
                                    <p className='text-xs text-gray-500 mt-2'>{speaker.bio}</p>
                                    <p className='text-xs text-gray-500 mt-4'><FontAwesomeIcon icon={faMapMarkerAlt} className='mr-2 text-gray-400' />{speaker.location}</p>
                                    <p className='text-xs text-gray-500'><FontAwesomeIcon icon={faEnvelope} className='mr-2 text-gray-400' />{speaker.email}</p>
                                    <p className='text-xs text-gray-500'><FontAwesomeIcon icon={faPhone} className='mr-2 text-gray-400' />{speaker.phone}</p>
                                </div>
                                <div className='flex gap-2 justify-end'>
                                    <span className='text-gray-400 text-sm'>Follow on:</span>
                                    <span className='text-gray-400 text-sm'><a href={speaker.socialMediaLinks.twitter}><FontAwesomeIcon icon={faTwitter} /></a></span>
                                    <span className='text-gray-400 text-sm'><a href={speaker.socialMediaLinks.linkedin}><FontAwesomeIcon icon={faLinkedin} /></a></span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AssignSpeaker;