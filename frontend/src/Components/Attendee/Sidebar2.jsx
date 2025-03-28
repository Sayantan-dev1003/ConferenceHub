import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar2 = () => {
  return (
    <div className="h-screen w-1/5 bg-gray-800 text-white openSans fixed top-0 left-0 z-10">
      <div className="p-4 text-4xl font-bold moonDance">ConferenceHub</div>
      <nav className="mt-10">
        <ul>
          <li className="my-2">
            <Link to="/attendee-dashboard" className="block p-2 hover:bg-gray-700 rounded">Dashboard</Link>
          </li>
          <li className="my-2">
            <Link to="/attendee-events" className="block p-2 hover:bg-gray-700 rounded">My Events</Link>
          </li>
          <li className="my-2">
            <Link to="/attendee-explore" className="block p-2 hover:bg-gray-700 rounded">Explore Events</Link>
          </li>
          <li className="my-2">
            <Link to="/attendee-feedback" className="block p-2 hover:bg-gray-700 rounded">Feedback & Reviews</Link>
          </li>
          <li className="my-2">
            <Link to="/attendee-settings" className="block p-2 hover:bg-gray-700 rounded">Settings</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar2;