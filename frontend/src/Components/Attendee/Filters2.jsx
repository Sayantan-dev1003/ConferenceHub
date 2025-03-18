import React, { useState } from "react";

const Filters2 = ({ onFilterChange }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [status, setStatus] = useState("");

  // Handles filter changes and sends updates to parent component
  const handleFilterChange = () => {
    onFilterChange({ searchTerm, status });
  };

  return (
    <div className="flex gap-6 items-center justify-between">
      <input
        type="text"
        placeholder="Search events..."
        className="border border-gray-300 px-4 py-2 rounded-md w-full"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <select
        className="border border-gray-300 px-4 py-2 rounded-md"
        value={status}
        onChange={(e) => setStatus(e.target.value)}
      >
        <option value="">Select status</option>
        <option value="Upcoming">Upcoming</option>
        <option value="Past">Past</option>
        <option value="Cancelled">Cancelled</option>
      </select>

      <button
        onClick={handleFilterChange}
        className="bg-blue-500 text-white px-4 py-2 rounded-md"
      >
        Search
      </button>
    </div>
  );
};

export default Filters2;