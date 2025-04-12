import React, { useEffect, useState } from 'react'
import Sidebar3 from './Sidebar3'
import axios from 'axios';

const PublishPaper = () => {
    const [title, setTitle] = useState('');
    const [abstract, setAbstract] = useState('');
    const [keywords, setKeywords] = useState('');
    const [file, setFile] = useState(null);
    const [sessionType, setSessionType] = useState('independent');
    const [selectedSession, setSelectedSession] = useState('');
    const [eventName, setEventName] = useState([]);
    const [eventId, setEventId] = useState();
    const [speakerId, setSpeakerId] = useState([]);
    // const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchConferences = async () => {
            try {
                const response = await axios.get('/api/speaker/events');
                setEventName(response.data.map(event => event.title));
                setSpeakerId(response.data.map(event => event.speaker));
                setEventId(response.data.map(event => event._id));
            } catch (error) {
                console.error("Error fetching conferences:", error);
            }
        };

        const fetchParticularConf = async () => {
            try {
                await axios.get(`/api/publish/${selectedSession}`);
            } catch (error) {
                console.error("Error fetching conferences:", error);
            }
        };

        fetchConferences();
        fetchParticularConf();
    }, [selectedSession]);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        const acceptedTypes = ['application/pdf', 'application/vnd.ms-powerpoint', 'application/msword'];
        if (selectedFile && acceptedTypes.includes(selectedFile.type) && selectedFile.size <= 100 * 1024 * 1024) {
            setFile(selectedFile);
            // setError('');
        } else {
            setFile(null);
            // setError('Please upload a valid PDF, PPT, or Word document file (max 100MB).');
        }
    };

    const isFormValid = title && abstract && file;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isFormValid) {
            // setError('Please fill in all required fields and upload a valid PDF, PPT, or Word document.');
            return;
        }
        setLoading(true);
    
        const selectedIndex = eventName.findIndex(event => event === selectedSession);
        const selectedEventId = selectedIndex !== -1 ? eventId[selectedIndex] : null;
        const selectedSpeakerId = selectedIndex !== -1 ? speakerId[selectedIndex] : null;
    
        const formData = new FormData();
        formData.append('title', title);
        formData.append('abstract', abstract);
        formData.append('speakerId', selectedSpeakerId);
        formData.append('conferenceId', sessionType === 'session' ? selectedEventId : null);
        formData.append('sessionType', sessionType === 'session' ? "Session Publication" : "Independent Publication");
        formData.append('keywords', keywords.split(',').map(keyword => keyword.trim()));
        formData.append('file', file);
    
        try {
            const response = await axios.post('/api/publish-paper', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            if (response.status === 201) {
                alert("Paper submitted successfully!");
                setLoading(false);
            } else {
                // setError('Failed to submit paper. Please try again.');
                setLoading(false);
            }
        } catch (error) {
            console.error("Submission error:", error);
            // setError('Failed to submit paper. Please try again.');
            setLoading(false);
        }
    };    

    return (
        <div className='w-full min-h-screen flex justify-end items-start openSans'>
            <Sidebar3 />

            <div className='w-4/5 min-h-screen flex flex-col items-center p-6 bg-gray-100 overflow-y-auto'>
                <div className='w-full sticky top-0 right-0 z-50 bg-white p-6 shadow-lg rounded-lg'>
                    <h1 className="text-2xl font-bold mb-1 montserrat text-center">Publish Your Paper</h1>
                    <p className='font-medium montserrat text-gray-500 text-center'>
                        Upload and publish your final research or conference paper to share your knowledge with the world — accessible to a wider audience beyond the conference!
                    </p>
                </div>

                <form onSubmit={handleSubmit} className='w-3/4 text-sm text-gray-600 mt-6 bg-white p-6 rounded-lg shadow-md space-y-5'>
                    <div>
                        <label className='block font-semibold mb-1 text-xs text-gray-600'>Upload Document (Max 100MB)</label>
                        <input type='file' name='file' accept='.pdf, .ppt, .doc' onChange={handleFileChange} className='w-full border p-2 rounded-md border-gray-300 focus:outline-blue-400 transition duration-200' />
                        {/* {file && <p className='text-sm text-green-600 mt-1'>Uploaded: {file.name}</p>} */}
                    </div>

                    <div>
                        <label className='block font-semibold mb-1 text-xs text-gray-600'>Paper Title</label>
                        <input type='text' name='title' value={title} onChange={(e) => setTitle(e.target.value)} className='w-full border p-2 rounded-md border-gray-300 focus:outline-blue-400 transition duration-200' />
                    </div>

                    <div>
                        <label className='block font-semibold mb-1 text-xs text-gray-600'>Abstract</label>
                        <textarea value={abstract} name='abstract' onChange={(e) => setAbstract(e.target.value)} className='w-full border p-2 rounded-md border-gray-300 focus:outline-blue-400 transition duration-200 ' rows='4' />
                    </div>

                    <div>
                        <label className='block font-semibold mb-1 text-xs text-gray-600'>Keywords (comma-separated)</label>
                        <input type='text' value={keywords} name='keywords' onChange={(e) => setKeywords(e.target.value)} className='w-full border p-2 rounded-md border-gray-300 focus:outline-blue-400 transition duration-200 ' />
                    </div>

                    <div>
                        <label className='block font-semibold mb-1 text-xs text-gray-600'>Attach to Session?</label>
                        <div className='flex items-center justify-start gap-5'>
                            <label className='flex items-center space-x-2'>
                                <input type='radio' name='sessionType' value='independent' checked={sessionType === 'independent'} onChange={(e) => setSessionType(e.target.value)} />
                                <span>Submit as independent publication</span>
                            </label>
                            <label className='flex items-center space-x-2'>
                                <input type='radio' name='sessionType' value='session' checked={sessionType === 'session'} onChange={(e) => setSessionType(e.target.value)} />
                                <span>Attach to one of my sessions</span>
                            </label>
                        </div>
                    </div>

                    {sessionType === 'session' && (
                        <div>
                            <label className='block font-semibold mb-1'>Select Session</label>
                            <select value={selectedSession} onChange={(e) => setSelectedSession(e.target.value)} className='w-full border p-2 rounded-md border-gray-300 focus:outline-blue-400 transition duration-200 '>
                                <option value=''>-- Select a session --</option>
                                {eventName.map((event, idx) => (
                                    <option key={idx} value={event}>{event}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* {error && <p className='text-red-500'>{error}</p>}  */}

                    <button type='submit' disabled={!isFormValid || loading} className={`px-4 py-2 text-sm rounded-md text-white ${isFormValid ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'} ${loading ? 'bg-gray-400 cursor-not-allowed' : ''}`}>
                        {loading ? 'Submitting...' : 'Publish Paper'}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default PublishPaper;