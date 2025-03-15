import React, { useState } from 'react'
import Sidebar2 from './Sidebar2'
import Filters from './Filters';

const ExploreEvents = () => {
  const [filters, setFilters] = useState({
    searchTerm: "",
    eventType: "",
    category: "",
    location: "",
    sortBy: "",
  });

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    console.log("Updated Filters:", newFilters); // Debugging: Check applied filters
  };

  return (
    <div className='w-full min-h-screen flex justify-end items-start openSans'>
      <Sidebar2 />
      <div className='w-4/5 min-h-screen flex flex-col overflow-y-auto'>
        <div className="min-h-screen bg-gray-100 p-6">
          <h1 className="text-3xl font-semibold text-gray-800 mb-6">Explore & Register for Events</h1>

          {/* Search & Filters Section */}
          <Filters onFilterChange={handleFilterChange} />

          {/* Events Listing Placeholder */}
          <div className="mt-6">
            <p className="text-gray-600">Displaying results based on filters...</p>
            {/* You will integrate your event listing component here */}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ExploreEvents;