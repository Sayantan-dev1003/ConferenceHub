import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar1 from './Sidebar1';

const ConferenceForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: '',
    category: '',
    logo: null,
    banner: null,
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
    mode: 'offline',
    venue: '',
    virtualLink: '',
    ticketType: 'free',
    ticketPrice: '',
    registrationDeadline: '',
    keynoteSpeakers: '',
    targetAudience: '',
    socialMediaLinks: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e, type) => {
    setFormData({
      ...formData,
      [type]: e.target.files[0],
    });
  };

  const handleNext = () => {
    setCurrentStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setCurrentStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formDataToSend = new FormData();
    for (const key in formData) {
      formDataToSend.append(key, formData[key]);
    }
  
    try {
      const response = await fetch('/api/conference', {
        method: 'POST',
        body: formDataToSend,
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log(data.message);
        navigate('/manage-conference');
      } else {
        console.error('Error submitting form');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="w-full min-h-screen flex justify-end items-start openSans">
      <Sidebar1 />
      <div className="w-4/5 rounded-xl py-6 px-28">
        <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-2 montserrat">
          Create Your Conference
        </h2>
        <p className="text-gray-600 text-center mb-6 text-sm">
          Please fill in the information about your conference.
        </p>

        <form onSubmit={handleSubmit} className="space-y-3 text-sm">
          {currentStep === 1 && (
            <>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Basic Information</h3>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="title">
                  Conference Title
                </label>
                <input
                  type="text"
                  name="title"
                  id="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-blue-400 transition duration-200"
                  placeholder="Enter conference title"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="description">
                  Description
                </label>
                <textarea
                  name="description"
                  id="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-blue-400 transition duration-200"
                  rows="4"
                  placeholder="Describe your conference"
                />
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="type">
                    Conference Type
                  </label>
                  <select
                    name="type"
                    id="type"
                    value={formData.type}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-blue-400 transition duration-200"
                  >
                    <option value="">Select a type</option>
                    <option value="keynote">Keynotes</option>
                    <option value="panel">Panel Discussion</option>
                    <option value="workshop">Workshop</option>
                    <option value="paper">Paper Submission</option>
                    <option value="qa">Q&A Session</option>
                    <option value="seminar">Seminar</option>
                    <option value="roundtable">Roundtable Discussion</option>
                    <option value="networking">Networking Event</option>
                    <option value="training">Training Session</option>
                  </select>
                </div>

                <div className="flex-1">
                  <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="category">
                    Conference Category
                  </label>
                  <select
                    name="category"
                    id="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-blue-400 transition duration-200"
                  >
                    <option value="">Select a category</option>
                    <option value="tech">Technology & Innovation</option>
                    <option value="business">Business & Entrepreneurship</option>
                    <option value="science">Science & Research</option>
                    <option value="health">Healthcare & Medicine</option>
                    <option value="education">Education & Learning</option>
                    <option value="art">Arts & Culture</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="logo">
                    Conference Logo
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-blue-400 focus:outline-blue-400 transition duration-200">
                    <div className="space-y-1 text-center">
                      <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <div className="flex text-sm text-gray-600">
                        <label htmlFor="logo" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                          <span>Upload a file</span>
                          <input
                            id="logo"
                            name="logo"
                            type="file"
                            onChange={(e) => handleFileChange(e, 'logo')}
                            accept="image/*"
                            className="sr-only"
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                    </div>
                  </div>
                </div>

                <div className="flex-1">
                  <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="banner">
                    Conference Banner
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-blue-400 focus:outline-blue-400 transition duration-200">
                    <div className="space-y-1 text-center">
                      <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <div className="flex text-sm text-gray-600">
                        <label htmlFor="banner" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                          <span>Upload a file</span>
                          <input
                            id="banner"
                            name="banner"
                            type="file"
                            onChange={(e) => handleFileChange(e, 'banner')}
                            accept="image/*"
                            className="sr-only"
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {currentStep === 2 && (
            <>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Conference Schedule</h3>
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
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-blue-400 transition duration-200"
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
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-blue-400 transition duration-200"
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
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-blue-400 transition duration-200"
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
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-blue-400 transition duration-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Conference Mode</label>
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
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-blue-400 transition duration-200"
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
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-blue-400 transition duration-200"
                    placeholder="Enter virtual meeting URL"
                  />
                </div>
              )}
            </>
          )}

          {currentStep === 3 && (
            <>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Registration Details</h3>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Ticket Type</label>
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
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-blue-400 transition duration-200"
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
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-blue-400 transition duration-200"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Keynote Speakers</label>
                <textarea
                  name="keynoteSpeakers"
                  id="keynoteSpeakers"
                  value={formData.keynoteSpeakers}
                  onChange={handleChange}
                  required
                  rows="3"
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-blue-400 transition duration-200"
                  placeholder="Enter keynote speakers' names and bios"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="targetAudience">
                  Target Audience
                </label>
                <select
                  name="targetAudience"
                  id="targetAudience"
                  value={formData.targetAudience}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-blue-400 transition duration-200"
                >
                  <option value="">Select Audience</option>
                  <option value="researchers">Researchers</option>
                  <option value="students">Students</option>
                  <option value="professionals">Professionals</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Social Media & Website Links</label>
                <input
                  type="url"
                  name="socialMediaLinks"
                  id="socialMediaLinks"
                  value={formData.socialMediaLinks}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-blue-400 transition duration-200"
                  placeholder="Enter official conference links"
                />
              </div>
            </>
          )}

          <div className="flex justify-between pt-4">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={handleBack}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 focus:outline-none transition duration-200 cursor-pointer"
              >
                Back
              </button>
            )}
            {currentStep < 3 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none transition duration-200 cursor-pointer"
              >
                Next Step
              </button>
            ) : (
              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200"
              >
                Finish
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ConferenceForm;