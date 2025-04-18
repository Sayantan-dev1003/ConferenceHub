import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar3 = () => {
  return (
    <div className="h-screen w-1/5 bg-gray-800 text-white openSans fixed top-0 left-0 z-10">
      <div className="p-4 text-4xl font-bold moonDance">ConferenceHub</div>
      <nav className="mt-10">
        <ul>
          <li className="my-2">
            <Link to="/speaker-dashboard" className="block p-2 hover:bg-gray-700 rounded">Dashboard</Link>
          </li>
          <li className="my-2">
            <Link to="/speaker-sessions" className="block p-2 hover:bg-gray-700 rounded">My Sessions</Link>
          </li>
          <li className="my-2">
            <Link to="/speaker-submissions" className="block p-2 hover:bg-gray-700 rounded">My Submissions</Link>
          </li>
          <li className="my-2">
            <Link to="/publish-paper" className="block p-2 hover:bg-gray-700 rounded">Publish Paper</Link>
          </li>
          <li className="my-2">
            <Link to="/feedback-reviews" className="block p-2 hover:bg-gray-700 rounded">Feedback & Reviews</Link>
          </li>
          <li className="my-2">
            <Link to="/speaker-settings" className="block p-2 hover:bg-gray-700 rounded">Settings</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar3;