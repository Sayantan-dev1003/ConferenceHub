import React, { useEffect, useState } from "react";
import Sidebar1 from "./Sidebar1";
import ConferenceCard from "./ConferenceCard";

const ManageConference = () => {
  const [conferences, setConferences] = useState([]);

  useEffect(() => {
    const fetchConferences = async () => {
      try {
        const response = await fetch("/api/conferences");
        const data = await response.json();
        setConferences(data);
      } catch (error) {
        console.error("Error fetching conferences:", error);
      }
    };

    fetchConferences();
  }, []);

  return (
    <div className="w-full min-h-screen flex justify-end items-start">
      <Sidebar1 />
      <div className="w-4/5 min-h-screen px-8 pb-8 flex flex-col justify-center items-center gap-4 overflow-y-auto">
        <h1 className="text-3xl font-bold mt-8 mb-1 montserrat">Manage Conferences</h1>
        <p className="text-lg font-medium pb-4 mb-4 montserrat text-gray-500 border-b border-b-gray-400">Streamline your conference management with smart tools. Organize, track, and execute like a pro!</p>
        {conferences.map((conference) => (
          <ConferenceCard key={conference._id} conference={conference} />
        ))}
      </div>
    </div>
  );
};

export default ManageConference;
