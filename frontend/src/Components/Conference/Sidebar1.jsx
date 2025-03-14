import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar1 = () => {
  return (
    <div className="h-screen w-1/5 bg-gray-800 text-white openSans fixed top-0 left-0 z-10">
      <div className="p-4 text-4xl font-bold moonDance">ConferenceHub</div>
      <nav className="mt-10">
        <ul>
          <li className="my-2">
            <Link to="/conference-dashboard" className="block p-2 hover:bg-gray-700 rounded">Dashboard</Link>
          </li>
          <li className="my-2">
            <Link to="/create-conference" className="block p-2 hover:bg-gray-700 rounded">Create Conference</Link>
          </li>
          <li className="my-2">
            <Link to="/manage-conference" className="block p-2 hover:bg-gray-700 rounded">Manage Conferences</Link>
          </li>
          <li className="my-2">
            <Link to="/attendee-management" className="block p-2 hover:bg-gray-700 rounded">Attendee Management</Link>
          </li>
          <li className="my-2">
            <Link to="/speaker-management" className="block p-2 hover:bg-gray-700 rounded">Speaker Management</Link>
          </li>
          <li className="my-2">
            <Link to="/view-submissions" className="block p-2 hover:bg-gray-700 rounded">View Submissions</Link>
          </li>
          <li className="my-2">
            <Link to="/assign-reviewers" className="block p-2 hover:bg-gray-700 rounded">Assign Reviewers</Link>
          </li>
          <li className="my-2">
            <Link to="/manage-reviewers" className="block p-2 hover:bg-gray-700 rounded">Manage Reviewers</Link>
          </li>
          <li className="my-2">
            <Link to="/settings" className="block p-2 hover:bg-gray-700 rounded">Settings</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar1;