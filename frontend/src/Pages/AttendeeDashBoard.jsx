import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faMapMarkerAlt, faLink } from '@fortawesome/free-solid-svg-icons';
import Sidebar2 from "../Components/Attendee/Sidebar2";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AttendeeDashBoard = () => {
  const [attendeeName, setAttendeeName] = useState("");
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch attendee name
    const fetchAttendeeName = async () => {
      try {
        const response = await axios.get("/attendee");
        setAttendeeName(response.data.fullname);
      } catch (error) {
        console.error("Error fetching attendee data:", error);
      }
    };

    // Fetch upcoming events
    const fetchUpcomingEvents = async () => {
      try {
        const response = await axios.get("/api/upcoming-events", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Include auth token if required
          },
        });

        // Format event dates to IST
        const formattedEvents = response.data.map(event => ({
          ...event,
          startDate: new Date(event.startDate).toLocaleDateString("en-IN", {
            timeZone: "Asia/Kolkata",
            year: "numeric",
            month: "long",
            day: "2-digit"
          }),
        }));

        setUpcomingEvents(formattedEvents);
      } catch (error) {
        console.error("Error fetching upcoming events:", error);
      }
    };

    fetchAttendeeName();
    fetchUpcomingEvents();
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
      <Sidebar2 />

      <div className="w-4/5 min-h-screen flex flex-col p-6 bg-gray-100 overflow-y-auto">
        <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 montserrat">
            {getGreeting()}, {attendeeName} 👋
          </h2>
          <p className="text-gray-6=500 text-sm mt-1">Here’s what’s happening next:</p>

          {/* Upcoming Events */}
          <div className="mt-4">
            <h3 className="text-base font-bold text-gray-600 openSand">Upcoming Events</h3>
            {upcomingEvents.length > 0 ? (
              <>
                <ul className="mt-2 space-y-2">
                  {upcomingEvents.map((event) => (
                    <li key={event._id} className="p-3 bg-gray-200 rounded-md flex flex-col">
                      <span className="font-semibold text-2xl montserrat">{event.title} ({event.mode})</span>
                      <div className="flex gap-12">
                        <span className="text-gray-500 text-xs"><FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />{event.startDate} {event.startTime}</span>
                        <p className="text-gray-500 text-xs">
                          <FontAwesomeIcon icon={event.mode === 'offline' ? faMapMarkerAlt : faLink} className="mr-2" />
                          {event.mode === 'offline' ? event.venue : event.virtualLink}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
                {/* View All Events Button */}
                <button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:scale-105 transition-transform duration-300 shadow-lg text-white text-base px-4 py-2 rounded-lg font-medium cursor-pointer mt-14" onClick={() => navigate('/attendee-events')}>
                  View Your Events
                </button>
              </>
            ) : (
              <p className="text-gray-500">No upcoming events.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendeeDashBoard;