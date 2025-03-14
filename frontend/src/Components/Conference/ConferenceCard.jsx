import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faClock, faMapMarkerAlt, faLink, faMoneyBillWave } from '@fortawesome/free-solid-svg-icons';

const ConferenceCard = ({ conference }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/conference/${conference._id}`);
    };

    const maxDescriptionLength = 160;

    return (
        <div className="w-4/5 bg-white shadow-md rounded-lg overflow-hidden cursor-pointer openSans transition duration-200 hover:bg-blue-100 hover:scale-105 hover:shadow-md" onClick={handleClick}>
            <div className="relative w-full">
                {console.log(conference.banner)}
                <img src={`/${conference.banner}`} alt={conference.title} className="w-full h-32 object-cover" />
                <img
                    src={`/${conference.logo}`}
                    alt={conference.title}
                    className="absolute top-14 transform w-36 h-36 rounded-full border-4 border-white"
                />
            </div>
            <div className="p-4 w-full flex flex-col justify-center items-center">
                <h3 className="text-2xl font-bold text-center uppercase montserrat">{conference.title}</h3>
                <p className='text-sm font-medium text-center text-gray-600 w-2/3'>
                    {conference.description.length > maxDescriptionLength
                        ? `${conference.description.substring(0, maxDescriptionLength)}...   read more`
                        : conference.description}
                </p>
                <div className='flex w-full justify-center items-center gap-5 text-sm mt-4'>
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
                    <p className="text-gray-400 text-right">
                        <FontAwesomeIcon icon={faMoneyBillWave} className="mr-2" />
                        {conference.ticketPrice ? `$${conference.ticketPrice}` : 'Free'}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ConferenceCard;