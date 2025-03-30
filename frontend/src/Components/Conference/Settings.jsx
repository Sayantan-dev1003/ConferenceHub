import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import Sidebar1 from "./Sidebar1";
import DeleteOrganiserAcc from "./DeleteOrganiserAcc"

const SettingsSpeaker = () => {

  const [activeSection, setActiveSection] = useState('profile');
  const [organiserData, setOrganiserData] = useState({
    organiserId: '',
    fullname: '',
    email: '',
    phone: '',
    organisation: '',
    bio: '',
    location: '',
    socialMediaLinks: {
      twitter: '',
      linkedin: ''
    }
  });
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('/organiser');
        const data = response.data;

        setOrganiserData({
          organiserId: data._id,
          fullname: data.fullname || '',
          email: data.email || '',
          phone: data.phone || '',
          organisation: data.organisation || '',
          bio: data.bio || '',
          location: data.location || '',
          socialMediaLinks: {
            twitter: data.socialMediaLinks?.twitter || '',
            linkedin: data.socialMediaLinks?.linkedin || ''
          }
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchUserData();
  }, [organiserData.organiserId]);
  console.log("organiserData: ", organiserData)

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setOrganiserData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSaveProfile = async () => {
    try {
      await axios.put('/api/update/organiser', organiserData);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleChangePassword = async () => {
    try {
      // Call the correct endpoint for changing the password
      const response = await axios.post('/api/passwordchange/organiser', { oldPassword, newPassword }, { withCredentials: true });

      // Handle success response
      alert('Password changed successfully!');
      console.log(response.data); // Optional: log the response data
    } catch (error) {
      // Handle error response
      console.error('Error changing password:', error.response ? error.response.data : error.message);
      alert('Error changing password: ' + (error.response ? error.response.data.error : error.message));
    }
  };

  const handleLogout = async () => {
    try {
      const response = await axios.post('/logout', {}, { withCredentials: true }); // Use POST request for logout
      console.log("Logged out successfully:", response.data);
      navigate('/'); // Redirect to the home page or login page
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const handleDelete = () => {
    setDeleteModalOpen(true);
  };
  return (
    <div className='w-full min-h-screen flex justify-end items-start openSans'>
      <Sidebar1 />

      <div className='w-4/5 min-h-screen flex flex-col overflow-y-auto p-6'>
        <div className='w-full sticky top-0 right-0 z-50 border-b-2 pb-8 border-b-gray-300'>
          <h1 className="text-3xl font-bold text-gray-800 mb-6 montserrat">Settings</h1>
          <div className='flex items-center justify-between'>
            <div className='flex gap-5'>
              <span onClick={() => setActiveSection('profile')} className='bg-gray-200 font-medium px-4 py-2 rounded-lg shadow transition hover:scale-105 hover:shadow-lg cursor-pointer'>Profile Settings</span>
              <span onClick={() => setActiveSection('security')} className='bg-gray-200 font-medium px-4 py-2 rounded-lg shadow transition hover:scale-105 hover:shadow-lg cursor-pointer'>Security & Account</span>
            </div>
            <button onClick={handleLogout} className='font-semibold text-white bg-red-500 px-4 py-2 rounded-lg shadow transition hover:scale-105 hover:shadow-lg hover:bg-red-600 cursor-pointer'>Logout</button>
          </div>
        </div>

        {/* Render the active section */}
        {activeSection === 'profile' && (
          <div className='mt-6'>
            <h2 className="text-2xl font-bold mb-4 montserrat">Profile Settings</h2>
            <div className='bg-white p-6 rounded-lg shadow-md'>
              <div className='mb-4 flex justify-between gap-4'>
                <div className='w-1/2'>
                  <label className='block text-gray-700'>Full Name</label>
                  <input type='text' name='fullname' value={organiserData.fullname} onChange={handleProfileChange} className='border border-gray-300 rounded-md w-full p-2' />
                </div>
                <div className='w-1/2'>
                  <label className='block text-gray-700'>Email</label>
                  <input type='email' name='email' value={organiserData.email} onChange={handleProfileChange} className='border border-gray-300 rounded-md w-full p-2' />
                </div>
              </div>
              <div className='mb-4 flex justify-between gap-4'>
                <div className='w-1/2'>
                  <label className='block text-gray-700'>Phone</label>
                  <input type='text' name='phone' value={organiserData.phone} onChange={handleProfileChange} className='border border-gray-300 rounded-md w-full p-2' />
                </div>
                <div className='w-1/2'>
                  <label className='block text-gray-700'>Organisation</label>
                  <input type='text' name='organisation' value={organiserData.organisation} onChange={handleProfileChange} className='border border-gray-300 rounded-md w-full p-2' />
                </div>
              </div>
              <div className='mb-4 flex justify-between gap-4'>
                <div className='w-1/2'>
                  <label className='block text-gray-700'>Bio</label>
                  <textarea name="bio" value={organiserData.bio} onChange={handleProfileChange} className='border border-gray-300 rounded-md w-full p-2' ></textarea>
                </div>
                <div className='w-1/2'>
                  <label className='block text-gray-700'>Location</label>
                  <input type='text' name='location' value={organiserData.location} onChange={handleProfileChange} className='border border-gray-300 rounded-md w-full p-2' />
                </div>
              </div>
              <div className='mb-4'>
                <label className='block text-gray-700'>Social Media Links</label>
                <div className='flex justify-between gap-4'>
                  <input type='text' name='twitter' placeholder='Twitter' value={organiserData.socialMediaLinks.twitter} onChange={(e) => handleProfileChange({ target: { name: 'socialMediaLinks', value: { ...organiserData.socialMediaLinks, twitter: e.target.value } } })} className='border border-gray-300 rounded-md w-full p-2' />
                  <input type='text' name='linkedin' placeholder='LinkedIn' value={organiserData.socialMediaLinks.linkedin} onChange={(e) => handleProfileChange({ target: { name: 'socialMediaLinks', value: { ...organiserData.socialMediaLinks, linkedin: e.target.value } } })} className='border border-gray-300 rounded-md w-full p-2' />
                </div>
              </div>
              <button onClick={handleSaveProfile} className='bg-gradient-to-r from-blue-500 to-purple-600 hover:scale-105 transition-transform duration-300 shadow-lg text-white text-base px-8 py-2 rounded-lg font-medium cursor-pointer mt-4'>Save Changes</button>
            </div>
          </div>
        )}

        {activeSection === 'security' && (
          <div className='mt-6'>
            <h2 className="text-2xl font-bold mb-4 montserrat">Security & Account</h2>
            <div className='bg-white p-6 rounded-lg shadow-md'>
              <div className='mb-4'>
                <label className='block text-gray-700'>Old Password</label>
                <input type='password' value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} className='border border-gray-300 rounded-md w-full p-2' />
              </div>
              <div className='mb-4'>
                <label className='block text-gray-700'>New Password</label>
                <input type='password' value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className='border border-gray-300 rounded-md w-full p-2' />
              </div>
              <div className='flex gap-6'>
                <button onClick={handleChangePassword} className='bg-gradient-to-r from-blue-500 to-purple-600 hover:scale-105 transition-transform duration-300 shadow-lg text-white text-base px-8 py-2 rounded-lg font-medium cursor-pointer'>Change Password</button>
                <button onClick={handleDelete} className='font-semibold text-white bg-red-500 px-4 py-2 rounded-lg shadow transition hover:scale-105 hover:shadow-lg hover:bg-red-600 cursor-pointer'>Delete Account</button>
              </div>
            </div>
          </div>
        )}
      </div>
      <DeleteOrganiserAcc isOpen={isDeleteModalOpen} onClose={() => setDeleteModalOpen(false)} />
    </div>
  )
}

export default SettingsSpeaker