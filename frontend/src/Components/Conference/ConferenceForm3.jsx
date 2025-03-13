import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar1 from './Sidebar1';

const ConferenceForm3 = () => {
  const [formData, setFormData] = useState({
    ticketType: 'free',
    ticketPrice: '',
    registrationDeadline: '',
    callForPapers: 'no',
    sponsorsEnabled: 'no'
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
    // Navigate to next step or finish
    navigate('/');
  };

  const handleBack = () => {
    navigate('/create-conference-2');
  };

  return (
    <div className="min-h-screen w-full bg-gray-100 flex">
      <Sidebar1 />
      <div className="w-4/5 mx-auto bg-white rounded-xl shadow-2xl p-8">
        <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-8">
          Registration Details
        </h2>
        <p className="text-gray-600 text-center mb-8">
          Set up ticketing and registration options for your conference.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Ticket Type
            </label>
            <div className="flex gap-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="ticketType"
                  value="free"
                  checked={formData.ticketType === 'free'}
                  onChange={handleChange}
                  className="form-radio h-4 w-4 text-blue-600"
                />
                <span className="ml-2">Free</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="ticketType"
                  value="paid"
                  checked={formData.ticketType === 'paid'}
                  onChange={handleChange}
                  className="form-radio h-4 w-4 text-blue-600"
                />
                <span className="ml-2">Paid</span>
              </label>
            </div>
          </div>

          {formData.ticketType === 'paid' && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="ticketPrice">
                Ticket Price ($)
              </label>
              <input
                type="number"
                name="ticketPrice"
                id="ticketPrice"
                value={formData.ticketPrice}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                placeholder="Enter ticket price"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="registrationDeadline">
              Registration Deadline
            </label>
            <input
              type="date"
              name="registrationDeadline"
              id="registrationDeadline"
              value={formData.registrationDeadline}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Call for Papers/Speakers
            </label>
            <div className="flex gap-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="callForPapers"
                  value="yes"
                  checked={formData.callForPapers === 'yes'}
                  onChange={handleChange}
                  className="form-radio h-4 w-4 text-blue-600"
                />
                <span className="ml-2">Yes</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="callForPapers"
                  value="no"
                  checked={formData.callForPapers === 'no'}
                  onChange={handleChange}
                  className="form-radio h-4 w-4 text-blue-600"
                />
                <span className="ml-2">No</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Enable Sponsors
            </label>
            <div className="flex gap-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="sponsorsEnabled"
                  value="yes"
                  checked={formData.sponsorsEnabled === 'yes'}
                  onChange={handleChange}
                  className="form-radio h-4 w-4 text-blue-600"
                />
                <span className="ml-2">Yes</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="sponsorsEnabled"
                  value="no"
                  checked={formData.sponsorsEnabled === 'no'}
                  onChange={handleChange}
                  className="form-radio h-4 w-4 text-blue-600"
                />
                <span className="ml-2">No</span>
              </label>
            </div>
          </div>

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
              Finish
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ConferenceForm3;