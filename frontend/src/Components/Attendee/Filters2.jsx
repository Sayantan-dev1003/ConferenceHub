import React, { useState } from "react";

const Filters2 = ({ onFilterChange }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [status, setStatus] = useState("");

  // Handles filter changes and sends updates to parent component
  const handleFilterChange = (newStatus) => {
    setStatus(newStatus);
    onFilterChange({ searchTerm, status: newStatus });
  };

  return (
    <div className="flex gap-6 items-center justify-between">
      <input
        type="text"
        placeholder="Search events..."
        className="border border-gray-300 px-4 py-2 rounded-md w-full"
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          onFilterChange({ searchTerm: e.target.value, status });
        }}
      />

      <div className="flex gap-3">
        <span 
          onClick={() => handleFilterChange("Upcoming")} 
          className={`bg-gray-200 font-medium px-4 py-2 rounded-lg shadow transition hover:scale-105 hover:shadow-lg cursor-pointer ${status === "Upcoming" ? "bg-blue-300" : ""}`}
        >
          Upcoming
        </span>
        <span 
          onClick={() => handleFilterChange("Past")} 
          className={`bg-gray-200 font-medium px-4 py-2 rounded-lg shadow transition hover:scale-105 hover:shadow-lg cursor-pointer ${status === "Past" ? "bg-blue-300" : ""}`}
        >
          Past
        </span>
        <span 
          onClick={() => handleFilterChange("Cancelled")} 
          className={`bg-gray-200 font-medium px-4 py-2 rounded-lg shadow transition hover:scale-105 hover:shadow-lg cursor-pointer ${status === "Cancelled" ? "bg-blue-300" : ""}`}
        >
          Cancelled
        </span>
      </div>
    </div>
  );
};

export default Filters2;