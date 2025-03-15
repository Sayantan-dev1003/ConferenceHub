import React, { useState } from "react";

const Filters = ({ onFilterChange }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [eventType, setEventType] = useState("");
  const [category, setCategory] = useState("");

  // Handles filter changes and sends updates to parent component
  const handleFilterChange = () => {
    onFilterChange({ searchTerm, eventType, category });
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4 md:p-6 flex flex-wrap gap-4 items-center justify-between">
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

      <select
        className="border border-gray-300 px-4 py-2 rounded-md"
        value={eventType}
        onChange={(e) => {
          setEventType(e.target.value);
          handleFilterChange();
        }}
      >
        <option value="">Select a type</option>
        <option value="Keynotes">Keynotes</option>
        <option value="Panel Discussion">Panel Discussion</option>
        <option value="Workshop">Workshop</option>
        <option value="Paper Submission">Paper Submission</option>
        <option value="Q&A Session">Q&A Session</option>
        <option value="Seminar">Seminar</option>
        <option value="Roundtable Discussion">Roundtable Discussion</option>
        <option value="Networking Event">Networking Event</option>
        <option value="Training Session">Training Session</option>
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
        <option value="">Select a category</option>
        <option value="Technology & Innovation">Technology & Innovation</option>
        <option value="Business & Entrepreneurship">Business & Entrepreneurship</option>
        <option value="Science & Research">Science & Research</option>
        <option value="Healthcare & Medicine">Healthcare & Medicine</option>
        <option value="Education & Learning">Education & Learning</option>
        <option value="Arts & Culture">Arts & Culture</option>
      </select>
    </div>
  );
};

export default Filters;