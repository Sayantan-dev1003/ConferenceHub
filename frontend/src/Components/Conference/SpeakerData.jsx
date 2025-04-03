import React, { useEffect, useState } from 'react';
import Sidebar1 from './Sidebar1';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faMapMarkerAlt, faPhone } from '@fortawesome/free-solid-svg-icons';
import { faLinkedin, faTwitter } from '@fortawesome/free-brands-svg-icons';
import axios from 'axios';

const SpeakerData = () => {
    const { id } = useParams();
    const [speakers, setSpeakers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSpeakers = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`/api/speaker-invited/${id}`);
                const data = response.data;
                console.log(data);

                if (Array.isArray(data)) {
                    setSpeakers(data);
                } else {
                    setError("Unexpected response format");
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchSpeakers();
    }, [id]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className='w-full min-h-screen flex justify-end items-start openSans'>
            <Sidebar1 />

            <div className='w-4/5 min-h-screen flex flex-col overflow-y-auto p-6'>
                <div className='w-full sticky top-0 right-0 z-50 border-b-2 pb-4 mb-4 border-b-gray-300'>
                    <h1 className="text-3xl font-bold mb-1 montserrat text-center">Manage Speaker</h1>
                    <p className='text-lg font-medium montserrat text-gray-500 text-center'>Seamlessly manage speakers, schedule sessions, and streamline communication with powerful speaker management tools!</p>
                </div>

                <div className='mt-4'>
                    <h2 className="text-2xl font-semibold text-center mb-2">Speakers</h2>
                    <div className='flex flex-wrap justify-start'>
                        {Array.isArray(speakers) && speakers.map((speaker) => (
                            <div key={speaker._id} className='w-[48%] m-2 p-4 border border-gray-300 rounded-lg hover:bg-gray-100 hover:shadow-lg transition duration-200 flex flex-col justify-between'>
                                <div>
                                    <div className='flex justify-between items-end'>
                                        <h3 className="text-xl font-semibold montserrat">{speaker.fullname}, <span className='text-xs font-light italic'>{speaker.affiliation}</span></h3>
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
}

export default SpeakerData;