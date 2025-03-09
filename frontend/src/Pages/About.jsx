import React from "react";
import AboutImg from "../assets/About2.jpeg";
import Navbar from "../Components/Navbar";
import { Link as ScrollLink } from 'react-scroll';

const About = () => {
  return (
    <>
      <Navbar />
      <div className="w-full flex items-left p-8 pt-16 bg-gray-100 min-h-screen gap-12 text-justify poppins">
        <div className="w-2/3 flex flex-col items-start justify-start">
          <h2 className="text-5xl text-left font-bold text-blue-800 mb-6 moonDance">Why ConferenceHub</h2>
          <p className="text-gray-600 max-w-3xl mb-8">
            Our Conference Management System <b>ConferenceHub</b> streamlines event planning, participant registration, session scheduling, and resource allocation, providing an efficient and seamless conference experience for organizers, speakers, and attendees.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
            <div className="bg-white p-5 text-sm flex flex-col items-start justify-center rounded-2xl shadow-lg cursor-pointer hover:scale-105 transition hover:bg-blue-100">
              <h3 className="text-lg font-semibold text-blue-700">Seamless Registration</h3>
              <p className="text-gray-600">Effortless sign-up for attendees, speakers, and organizers.</p>
            </div>
            <div className="bg-white p-5 text-sm flex flex-col items-start justify-center rounded-2xl shadow-lg cursor-pointer hover:scale-105 transition hover:bg-blue-100">
              <h3 className="text-lg font-semibold text-blue-700">Intelligent Session Management</h3>
              <p className="text-gray-600">Plan and schedule sessions, assign speakers, and allocate resources efficiently.</p>
            </div>
            <div className="bg-white p-5 text-sm flex flex-col items-start justify-center rounded-2xl shadow-lg cursor-pointer hover:scale-105 transition hover:bg-blue-100">
              <h3 className="text-lg font-semibold text-blue-700">Smart Paper Review System</h3>
              <p className="text-gray-600">Submit, review, and track research papers with assigned reviewers and real-time status updates.</p>
            </div>
            <div className="bg-white p-5 text-sm flex flex-col items-start justify-center rounded-2xl shadow-lg cursor-pointer hover:scale-105 transition hover:bg-blue-100">
              <h3 className="text-lg font-semibold text-blue-700">Automated Notifications & Reminders</h3>
              <p className="text-gray-600">Stay informed with real-time updates on schedules, submissions, and conference activities.</p>
            </div>

          </div>
          <h3 className="text-2xl font-semibold text-gray-400 mt-10">Elevate Your Conference Experience with ConferenceHub</h3>
          <p className="text-gray-600 mt-2">
            Simplify event management, streamline registrations, and optimize session planning—all in one powerful platform.
            Whether you're an organizer, speaker, or attendee, ConferenceHub ensures a seamless and efficient conference journey.
          </p>
          <ScrollLink to="event-registration" smooth={true} className="bg-gradient-to-r mt-6 from-blue-500 to-purple-600 hover:scale-105 transition-transform duration-300 shadow-lg text-white px-6 py-2 rounded-full font-semibold cursor-pointer">
            Discover More
          </ScrollLink>
        </div>
        <div className="flex justify-center mt-10 w-1/3">
          <img src={AboutImg} alt="Conference" className="rounded-2xl w-auto h-[90%] shadow-xl shadow-blue-200 hover:shadow-blue-500 transition" />
        </div>
      </div>
    </>
  );
};

export default About;
