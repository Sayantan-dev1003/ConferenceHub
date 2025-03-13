import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar1 from './Sidebar1';

const ConferenceForm2 = () => {
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
    timeZone: '',
    mode: 'offline',
    venue: '',
    virtualLink: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    navigate('/create-conference-3');
  };

  const handleBack = () => {
    // Handle back navigation
    console.log('Going back');
    navigate('/create-conference');
  };

  return (
    <div className="min-h-screen w-full bg-gray-100 flex">
      <Sidebar1 />
      <div className="w-4/5 mx-auto bg-white rounded-xl shadow-2xl p-8">
        <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-8">
          Conference Details
        </h2>
        <p className="text-gray-600 text-center mb-8">
          Please provide the schedule and venue details for your conference.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="startDate">
                Start Date
              </label>
              <input
                type="date"
                name="startDate"
                id="startDate"
                value={formData.startDate}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="endDate">
                End Date
              </label>
              <input
                type="date"
                name="endDate"
                id="endDate"
                value={formData.endDate}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="startTime">
                Start Time
              </label>
              <input
                type="time"
                name="startTime"
                id="startTime"
                value={formData.startTime}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="endTime">
                End Time
              </label>
              <input
                type="time"
                name="endTime"
                id="endTime"
                value={formData.endTime}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="timeZone">
              Time Zone
            </label>
            <select
              name="timeZone"
              id="timeZone"
              value={formData.timeZone}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
            >
              <option value="">Select a timezone</option>
              <option value="UTC">UTC</option>
              <option value="EST">EST (UTC-5)</option>
              <option value="CST">CST (UTC-6)</option>
              <option value="PST">PST (UTC-8)</option>
              <option value="IST">IST (UTC+5:30)</option>
              <option value="GMT">GMT</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Conference Mode
            </label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="mode"
                  value="offline"
                  checked={formData.mode === 'offline'}
                  onChange={handleChange}
                  className="mr-2"
                />
                Offline
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="mode"
                  value="online"
                  checked={formData.mode === 'online'}
                  onChange={handleChange}
                  className="mr-2"
                />
                Online
              </label>
            </div>
          </div>

          {formData.mode === 'offline' ? (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="venue">
                Venue
              </label>
              <textarea
                name="venue"
                id="venue"
                value={formData.venue}
                onChange={handleChange}
                required
                rows="3"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                placeholder="Enter the physical location details"
              />
            </div>
          ) : (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="virtualLink">
                Virtual Meeting Link
              </label>
              <input
                type="url"
                name="virtualLink"
                id="virtualLink"
                value={formData.virtualLink}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                placeholder="Enter virtual meeting URL"
              />
            </div>
          )}

          <div className="flex justify-between pt-6">
            <button
              type="button"
              onClick={handleBack}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition duration-200"
            >
              Back
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200"
            >
              Next Step
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ConferenceForm2;