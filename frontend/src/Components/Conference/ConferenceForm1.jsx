import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar1 from './Sidebar1';

const ConferenceForm1 = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: '',
    category: '',
    logo: null,
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      logo: e.target.files[0],
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Form submitted:', formData);
    navigate('/create-conference-2');
  };

  const handleCancel = () => {
    console.log('Form cancelled');
    navigate('/');
  };

  return (
    <>
      <div className='min-h-screen w-full bg-gray-100 flex'>
        <Sidebar1 />
        <div className="w-4/5 mx-auto bg-white rounded-xl shadow-2xl p-8">
          <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-8">
            Create Your Conference
          </h2>
          <p className="text-gray-600 text-center mb-8">
            Please fill in the basic information about your conference. We'll help you create an amazing event.
          </p>

          <form onSubmit={handleSubmit} className="space-y-3">
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
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
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
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
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
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
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
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
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

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="logo">
                Conference Logo
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-blue-500 transition duration-200">
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
                        onChange={handleFileChange}
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

            <div className="flex justify-between pt-6">
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition duration-200"
              >
                Cancel
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
    </>
  );
};

export default ConferenceForm1;