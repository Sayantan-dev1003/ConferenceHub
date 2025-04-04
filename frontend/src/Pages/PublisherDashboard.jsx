import React, { useEffect, useState } from "react";
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faCalendarAlt, faMapMarkerAlt, faLink } from '@fortawesome/free-solid-svg-icons';
import Sidebar4 from "../Components/Publisher/Sidebar4";
import axios from "axios";
// import { useNavigate } from "react-router-dom";

const PublisherDashboard = () => {
  const [publisherName, setPublisherName] = useState("");
  // const navigate = useNavigate();

  useEffect(() => {
    // Fetch attendee name
    const fetchPublisherName = async () => {
      try {
        const response = await axios.get("/publisher");
        setPublisherName(response.data.fullname);
      } catch (error) {
        console.error("Error fetching attendee data:", error);
      }
    };

    fetchPublisherName();
  }, []);

  // Function to get dynamic greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };


  return (
    <div className="w-full min-h-screen flex justify-end items-start openSans">
      <Sidebar4 />

      <div className="w-4/5 min-h-screen flex flex-col p-6 bg-gray-100 overflow-y-auto">
        <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 montserrat">
            {getGreeting()}, {publisherName} 👋
          </h2>
          <p className="text-gray-6=500 text-sm mt-1">Here’s what’s happening next:</p>

        </div>
      </div>
    </div>
  );
};

export default PublisherDashboard;