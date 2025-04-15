import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar4 = () => {
  return (
    <div className="h-screen w-1/5 bg-gray-800 text-white openSans fixed top-0 left-0 z-10">
      <div className="p-4 text-4xl font-bold moonDance">ConferenceHub</div>
      <nav className="mt-10">
        <ul>
          <li className="my-2">
            <Link to="/reviewer-dashboard" className="block p-2 hover:bg-gray-700 rounded">Dashboard</Link>
          </li>
          <li className="my-2">
            <Link to="/evaluation-criteria" className="block p-2 hover:bg-gray-700 rounded">Evaluation Criteria</Link>
          </li>
          <li className="my-2">
            <Link to="/assigned-papers" className="block p-2 hover:bg-gray-700 rounded">Assigned Papers</Link>
          </li>
          <li className="my-2">
            <Link to="/review-history" className="block p-2 hover:bg-gray-700 rounded">Review History</Link>
          </li>
          <li className="my-2">
            <Link to="/reviewer-settings" className="block p-2 hover:bg-gray-700 rounded">Settings</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar4;