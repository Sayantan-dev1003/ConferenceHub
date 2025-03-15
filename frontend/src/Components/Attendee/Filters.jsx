import React, { useState } from "react";

const Filters = ({ onFilterChange }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [eventType, setEventType] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [sortBy, setSortBy] = useState("");

  // Handles filter changes and sends updates to parent component
  const handleFilterChange = () => {
    onFilterChange({ searchTerm, eventType, category, location, sortBy });
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4 md:p-6 flex flex-wrap gap-4 items-center justify-between">
      {/* 🔍 Search Bar */}
      <input
        type="text"
        placeholder="Search events..."
        className="border border-gray-300 px-4 py-2 rounded-md w-full md:w-1/3"
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          handleFilterChange();
        }}
      />

      {/* 📅 Event Type Dropdown */}
      <select
        className="border border-gray-300 px-4 py-2 rounded-md"
        value={eventType}
        onChange={(e) => {
          setEventType(e.target.value);
          handleFilterChange();
        }}
      >
        <option value="">Event Type</option>
        <option value="workshop">Workshop</option>
        <option value="seminar">Seminar</option>
        <option value="webinar">Webinar</option>
        <option value="conference">Conference</option>
      </select>

      {/* 📚 Category Dropdown */}
      <select
        className="border border-gray-300 px-4 py-2 rounded-md"
        value={category}
        onChange={(e) => {
          setCategory(e.target.value);
          handleFilterChange();
        }}
      >
        <option value="">Category</option>
        <option value="technology">Technology</option>
        <option value="business">Business</option>
        <option value="healthcare">Healthcare</option>
        <option value="education">Education</option>
      </select>

      {/* 📍 Location Dropdown */}
      <select
        className="border border-gray-300 px-4 py-2 rounded-md"
        value={location}
        onChange={(e) => {
          setLocation(e.target.value);
          handleFilterChange();
        }}
      >
        <option value="">Location</option>
        <option value="online">Online</option>
        <option value="new-york">New York</option>
        <option value="san-francisco">San Francisco</option>
        <option value="london">London</option>
      </select>

      {/* 🔄 Sort By Dropdown */}
      <select
        className="border border-gray-300 px-4 py-2 rounded-md"
        value={sortBy}
        onChange={(e) => {
          setSortBy(e.target.value);
          handleFilterChange();
        }}
      >
        <option value="">Sort By</option>
        <option value="upcoming">Upcoming</option>
        <option value="popularity">Popularity</option>
        <option value="newest">Newest</option>
      </select>
    </div>
  );
};

export default Filters;