import React, { useEffect, useState } from 'react';
import Sidebar1 from './Sidebar1';
import { useParams } from 'react-router-dom';

const AttendeeData = () => {
    const { id } = useParams();
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRegistrations = async () => {
            try {
                const response = await fetch(`/api/conference/${id}/registrations`);
                if (!response.ok) {
                    throw new Error('Failed to fetch registrations');
                }
                const data = await response.json();
                console.log(data); // Log the data to see its structure
        
                if (Array.isArray(data)) {
                    setRegistrations(data);
                } else {
                    setError("Unexpected response format");
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchRegistrations();
    }, [id]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className='w-full min-h-screen flex justify-end items-start openSans'>
            <Sidebar1 />

            <div className='w-4/5 min-h-screen flex flex-col overflow-y-auto p-6'>
                <div className='w-full sticky top-0 right-0 z-50 border-b-2 pb-4 mb-4 border-b-gray-300'>
                    <h1 className="text-3xl font-bold mb-1 montserrat text-center">Manage Attendees</h1>
                    <p className='text-lg font-medium montserrat text-gray-500 text-center'>Effortlessly handle attendee registrations, track participation, and enhance engagement with smart management tools!</p>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full border-collapse border border-gray-300">
                        <thead>
                            <tr>
                                <th className="border border-gray-300 p-2 text-left">Registration ID</th>
                                <th className="border border-gray-300 p-2 text-left">Attendee Name</th>
                                <th className="border border-gray-300 p-2 text-left">Registration Date</th>
                                <th className="border border-gray-300 p-2 text-left">Dietary Preference</th>
                                <th className="border border-gray-300 p-2 text-left">Payment Method</th>
                                <th className="border border-gray-300 p-2 text-left">Billing Address</th>
                                <th className="border border-gray-300 p-2 text-left">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {registrations.map((registration) => (
                                <tr key={registration._id} className="hover:bg-gray-100">
                                    <td className="border border-gray-300 p-2">{registration.registrationId}</td>
                                    <td className="border border-gray-300 p-2">{registration.attendeeName}</td>
                                    <td className="border border-gray-300 p-2">{new Date(registration.registrationDate).toLocaleString()}</td>
                                    <td className="border border-gray-300 p-2">{registration.dietaryPreference || 'N/A'}</td>
                                    <td className="border border-gray-300 p-2">{registration.paymentMethod || 'N/A'}</td>
                                    <td className="border border-gray-300 p-2">{registration.billingAddress || 'N/A'}</td>
                                    <td className="border border-gray-300 p-2">{registration.status}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default AttendeeData;