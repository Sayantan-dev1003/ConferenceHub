import React, { useEffect, useState } from 'react'
import Sidebar3 from "./Sidebar3";
import EventFilter from "./EventFilter"
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faClock, faMapMarkerAlt, faLink } from '@fortawesome/free-solid-svg-icons';

const Sessions = () => {
  const [conferences, setConferences] = useState([]);
  const [filteredConferences, setFilteredConferences] = useState([]);
  const [filters, setFilters] = useState({
    searchTerm: "",
    status: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchConferences = async () => {
      try {
        const response = await axios.get('/api/speaker/events');
        setConferences(response.data);
        setFilteredConferences(response.data);
      } catch (error) {
        console.error("Error fetching conferences:", error);
      }
    };

    fetchConferences();
  }, []);

  useEffect(() => {
    const applyFilters = () => {
      let filtered = conferences;

      // Apply search term filter
      if (filters.searchTerm) {
        filtered = filtered.filter(conference =>
          conference.title.toLowerCase().includes(filters.searchTerm.toLowerCase())
        );
      }

      // Apply status filter
      if (filters.status) {
        filtered = filtered.filter(conference => {
          const conferenceIsLive = new Date() < new Date(conference.registrationDeadline);
          if (filters.status === "Upcoming") {
            return conferenceIsLive; // Upcoming conferences
          } else if (filters.status === "Past") {
            return !conferenceIsLive; // Past conferences
          } else if (filters.status === "Cancelled") {
            return conference.status === "Cancelled"; // Assuming you have a status field in your conference model
          }
          return true; // If no valid status is selected, return all
        });
      }

      setFilteredConferences(filtered);
    };

    applyFilters();
  }, [filters, conferences]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <div className='w-full min-h-screen flex justify-end items-start openSans'>
      <Sidebar3 />

      <div className='w-4/5 min-h-screen flex flex-col p-6 bg-gray-100 overflow-y-auto'>
        <div className='w-full sticky top-0 right-0 z-50 bg-white p-6 shadow-lg'>
          <h1 className="text-3xl font-bold text-gray-800 mb-6 montserrat">Your Events</h1>
          <EventFilter onFilterChange={handleFilterChange} />
        </div>

        {/* Events Listing */}
        <div className="mt-6 min-h-screen flex flex-col justify-start items-center gap-4 overflow-y-auto">
          {filteredConferences.length > 0 ? (
            filteredConferences.map(conference => (
              <div key={conference._id} className="w-4/5 bg-white shadow-md rounded-xl overflow-hidden cursor-pointer openSans transition duration-200 hover:bg-blue-50 hover:scale-105 hover:shadow-lg" onClick={() => navigate(`/view-event/${conference._id}`)}>
                <div className="relative w-full">
                  <img src={`/${conference.banner}`} alt={conference.title} className="w-full h-32 object-cover" />
                  <img
                    src={`/${conference.logo}`}
                    alt={conference.title}
                    className="absolute top-14 transform w-36 h-36 rounded-full border-4 border-white"
                  />
                  <p className="text-gray-400 absolute top-[7.2rem] left-44 border border-dotted border-gray-400 rounded-full px-4 bg-white">
                    {conference.mode === 'offline' ? 'Offline' : 'Online'}
                  </p>
                </div>
                <div className="p-4 w-full flex flex-col justify-center items-start relative left-40">
                  <div className='w-[77.5%] mt-4 flex items-center justify-between'>
                    <div className='flex gap-2 items-center'>
                      <h3 className="text-2xl font-extrabold uppercase montserrat">{conference.title}</h3>
                    </div>
                    <p className={`text-${new Date() < new Date(conference.registrationDeadline) ? 'red-600' : 'gray-400'} text-xs relative bottom-1 mt-2 border border-dotted border-${new Date() < new Date(conference.registrationDeadline) ? 'red-600' : 'gray-400'} rounded-full px-4`}>
                      {new Date() < new Date(conference.registrationDeadline) ? 'LIVE' : 'OVER'}
                    </p>
                  </div>
                  <div className='flex w-full gap-4 text-sm mt-4'>
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
            ))
          ) : (
            <p className="text-gray-600">No conferences found based on the applied filters.</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default Sessions