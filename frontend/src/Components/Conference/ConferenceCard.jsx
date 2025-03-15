import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faClock, faMapMarkerAlt, faLink } from '@fortawesome/free-solid-svg-icons';

const ConferenceCard = ({ conference }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/conference/${conference._id}`);
    };

    return (
        <div className="w-4/5 bg-white shadow-md rounded-xl overflow-hidden cursor-pointer openSans transition duration-200 hover:bg-blue-50 hover:scale-105 hover:shadow-lg" onClick={handleClick}>
            <div className="relative w-full">
                <img src={`/${conference.banner}`} alt={conference.title} className="w-full h-32 object-cover" />
                <img
                    src={`/${conference.logo}`}
                    alt={conference.title}
                    className="absolute top-14 transform w-36 h-36 rounded-full border-4 border-white"
                />
                <p className="text-gray-400 absolute top-[7.2rem] left-44 border border-dotted border-gray-400 rounded-full px-4 bg-white">
                    {conference.ticketPrice ? `$${conference.ticketPrice}` : 'Free'}
                </p>
                <p className="text-gray-400 absolute top-[7.2rem] left-64 border border-dotted border-gray-400 rounded-full px-4 bg-white">
                    {conference.mode === 'offline' ? 'Offline' : 'Online'}
                </p>
            </div>
            <div className="p-4 w-full flex flex-col justify-center items-start relative left-40">
                <div className='w-[77.5%] mt-4 flex items-center justify-between'>
                    <div className='flex gap-2 items-center'>
                        <h3 className="text-2xl font-extrabold uppercase montserrat">{conference.title}</h3>
                        <span className="text-gray-400 relative bottom-1 text-base mt-2 border border-dotted border-gray-400 rounded-full px-4">{conference.category}</span>
                    </div>
                    <p className={`text-${new Date() < new Date(conference.registrationDeadline) ? 'red-600' : 'gray-400'} text-xs relative bottom-1 mt-2 border border-dotted border-${new Date() < new Date(conference.registrationDeadline) ? 'red-600' : 'gray-400'} rounded-full px-4`}>
                        {new Date() < new Date(conference.registrationDeadline) ? 'LIVE' : 'OVER'}
                    </p>
                </div>
                <div className='flex w-full gap-4 text-base mt-4'>
                    <p className="text-gray-400 text-right">
                        <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
                        {new Date(conference.startDate).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })} - 
                        {new Date(conference.endDate).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                    <p className="text-gray-400 text-right">
                        <FontAwesomeIcon icon={faClock} className="mr-2" />
                        {conference.startTime} - {conference.endTime}
                    </p>
                    <p className="text-gray-400 text-right">
                        <FontAwesomeIcon icon={conference.mode === 'offline' ? faMapMarkerAlt : faLink} className="mr-2" />
                        {conference.mode === 'offline' ? conference.venue : conference.virtualLink}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ConferenceCard;