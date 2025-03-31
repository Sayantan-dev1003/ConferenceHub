import React, { useEffect, useState } from 'react';
import Sidebar2 from "./Sidebar2";
import DeleteAccount from './DeleteAccount';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const [activeSection, setActiveSection] = useState('profile');
  const [userData, setUserData] = useState({
    attendeeId: '',
    fullname: '',
    email: '',
    phone: '',
    affiliation: '',
    areaOfInterest: '',
    location: '',
    socialMediaLinks: {
      twitter: '',
      linkedin: ''
    }
  });
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('/attendee');
        const data = response.data;

        setUserData({
          attendeeId: data._id,
          fullname: data.fullname || '',
          email: data.email || '',
          phone: data.phone || '',
          affiliation: data.affiliation || '',
          areaOfInterest: data.areaOfInterest || '',
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

    const fetchTransactions = async () => {
      try {
        if (!userData.attendeeId) return;
        const response = await axios.get(`/api/transaction/history/${userData.attendeeId}`);
        setTransactions(response.data.transactions);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      }
    };

    fetchUserData();
    if (userData.attendeeId) {
      fetchTransactions();
    }
  }, [userData.attendeeId]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSaveProfile = async () => {
    try {
      await axios.put('/api/update/attendee', userData);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleChangePassword = async () => {
    try {
      // Call the correct endpoint for changing the password
      const response = await axios.post('/api/passwordchange/attendee', { oldPassword, newPassword }, { withCredentials: true });

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
      <Sidebar2 />
      <div className='w-4/5 min-h-screen flex flex-col overflow-y-auto p-6'>
        <div className='w-full sticky top-0 right-0 z-50 border-b-2 pb-8 border-b-gray-300'>
          <h1 className="text-3xl font-bold text-gray-800 mb-6 montserrat">Settings</h1>
          <div className='flex items-center justify-between'>
            <div className='flex gap-5'>
              <span onClick={() => setActiveSection('profile')} className='bg-gray-200 font-medium px-4 py-2 rounded-lg shadow transition hover:scale-105 hover:shadow-lg cursor-pointer'>Profile Settings</span>
              <span onClick={() => setActiveSection('security')} className='bg-gray-200 font-medium px-4 py-2 rounded-lg shadow transition hover:scale-105 hover:shadow-lg cursor-pointer'>Security & Account</span>
              <span onClick={() => setActiveSection('transactions')} className='bg-gray-200 font-medium px-4 py-2 rounded-lg shadow transition hover:scale-105 hover:shadow-lg cursor-pointer'>Transactions History</span>
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
                  <input type='text' name='fullname' value={userData.fullname} onChange={handleProfileChange} className='border border-gray-300 rounded-md w-full p-2' />
                </div>
                <div className='w-1/2'>
                  <label className='block text-gray-700'>Email</label>
                  <input type='email' name='email' value={userData.email} onChange={handleProfileChange} className='border border-gray-300 rounded-md w-full p-2' />
                </div>
              </div>
              <div className='mb-4 flex justify-between gap-4'>
                <div className='w-1/2'>
                  <label className='block text-gray-700'>Phone</label>
                  <input type='text' name='phone' value={userData.phone} onChange={handleProfileChange} className='border border-gray-300 rounded-md w-full p-2' />
                </div>
                <div className='w-1/2'>
                  <label className='block text-gray-700'>Affiliation</label>
                  <input type='text' name='affiliation' value={userData.affiliation} onChange={handleProfileChange} className='border border-gray-300 rounded-md w-full p-2' />
                </div>
              </div>
              <div className='mb-4 flex justify-between gap-4'>
                <div className='w-1/2'>
                  <label className='block text-gray-700'>Area of Interest</label>
                  <select name='areaOfInterest' value={userData.areaOfInterest} onChange={handleProfileChange} className='border border-gray-300 rounded-md w-full p-2'>
                    <option value="" disabled>Select Area of Interest</option>
                    <option value="Technology & Innovation">Technology & Innovation</option>
                    <option value="Business & Entrepreneurship">Business & Entrepreneurship</option>
                    <option value="Science & Research">Science & Research</option>
                    <option value="Healthcare & Medicine">Healthcare & Medicine</option>
                    <option value="Education & Learning">Education & Learning</option>
                    <option value="Arts & Culture">Arts & Culture</option>
                  </select>
                </div>
                <div className='w-1/2'>
                  <label className='block text-gray-700'>Location</label>
                  <input type='text' name='location' value={userData.location} onChange={handleProfileChange} className='border border-gray-300 rounded-md w-full p-2' />
                </div>
              </div>
              <div className='mb-4'>
                <label className='block text-gray-700'>Social Media Links</label>
                <div className='flex justify-between gap-4'>
                  <input type='text' name='twitter' placeholder='Twitter' value={userData.socialMediaLinks.twitter} onChange={(e) => handleProfileChange({ target: { name: 'socialMediaLinks', value: { ...userData.socialMediaLinks, twitter: e.target.value } } })} className='border border-gray-300 rounded-md w-full p-2' />
                  <input type='text' name='linkedin' placeholder='LinkedIn' value={userData.socialMediaLinks.linkedin} onChange={(e) => handleProfileChange({ target: { name: 'socialMediaLinks', value: { ...userData.socialMediaLinks, linkedin: e.target.value } } })} className='border border-gray-300 rounded-md w-full p-2' />
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

        {activeSection === 'transactions' && (
          <div className='mt-6'>
            <h2 className="text-2xl font-bold mb-4 montserrat">Transaction History</h2>
            <div className='bg-white p-6 rounded-lg shadow-md'>
              {transactions.length > 0 ? (
                transactions.map(transaction => (
                  <div key={transaction._id} className="border-b border-gray-300 py-4 openSans">
                    <p className="text-gray-700 text-lg font-semibold montserrat">{transaction.title}</p>
                    <p className="text-gray-500">Registration ID: {transaction.registrationId}</p>
                    <p className="text-gray-500">
                      Registration Date:{" "}
                      {new Date(transaction.registrationDate).toLocaleString("en-IN", {
                        timeZone: "Asia/Kolkata",
                      })}
                    </p>
                    <p className="text-gray-500">Status: {transaction.status}</p>
                    {transaction.ticketType === "Paid" ? (
                      <>
                        <p className="text-gray-500">Ticket Price: ${transaction.ticketPrice}</p>
                        <p className="text-gray-500">Billing Address: {transaction.billingAddress}</p>
                        <p className="text-gray-500">Payment Method: {transaction.paymentMethod}</p>
                      </>
                    ) : (
                      <p className="text-gray-500">Ticket Type: FREE</p>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-gray-600">No transactions found.</p>
              )}

            </div>
          </div>
        )}
      </div>
      <DeleteAccount isOpen={isDeleteModalOpen} onClose={() => setDeleteModalOpen(false)} />
    </div>
  );
};

export default Settings;