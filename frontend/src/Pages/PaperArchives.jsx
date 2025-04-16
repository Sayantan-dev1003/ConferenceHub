import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import Axios
import Navbar from '../Components/Navbar';

const PaperArchives = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [papers, setPapers] = useState([]); // State to store fetched papers
  const [loading, setLoading] = useState(true); // State to manage loading state
  const [error, setError] = useState(""); // State to manage error messages

  // Fetch published papers from the server
  useEffect(() => {
    const fetchPapers = async () => {
      try {
        const response = await axios.get('/api/archives/papers', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}` // Include token if needed
          }
        });
        setPapers(response.data); // Set the fetched papers
      } catch (err) {
        console.error("Error fetching papers:", err);
        setError("Failed to fetch papers. Please try again later.");
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchPapers();
  }, []); // Empty dependency array to run only on mount

  // Filter papers based on search term
  const filteredPapers = papers.filter(paper =>
    paper.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    paper.speakerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    paper.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const downloadPaper = (paper) => {
    try {
      // Extract the raw byte array
      const byteArray = new Uint8Array(paper.file.data.data);

      // Create a Blob using the contentType
      const blob = new Blob([byteArray], { type: paper.file.contentType });

      // Determine file extension from contentType
      const mimeToExtension = {
        'application/pdf': 'pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
        'application/msword': 'doc',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'pptx',
        'application/vnd.ms-powerpoint': 'ppt'
      };

      const extension = mimeToExtension[paper.file.contentType] || 'file';

      // Generate filename
      const filename = `${paper.title || 'paper'}.${extension}`;

      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error while downloading the file:', error);
      alert('Something went wrong while downloading the file.');
    }
  };

  return (
    <>
      <div className="w-full min-h-screen flex justify-center items-start openSans bg-gray-100">
        <div className='w-full min-h-screen flex flex-col items-center p-6 overflow-y-auto'>
          {/* Hero Section */}
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-gray-800 mb-2 montserrat">Papers Presented at Our Conferences</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore our archive of peer-reviewed papers from previous conferences. Open for all and free to download.
            </p>
          </div>

          {/* Search Bar */}
          <div className="flex justify-center mb-16 pb-6 w-full border-b border-gray-500">
            <input
              type="text"
              placeholder="Search by title, author, or category..."
              className="w-1/2 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Loading and Error Handling */}
          {loading && <p className="text-gray-500">Loading papers...</p>}
          {error && <p className="text-red-500">{error}</p>}

          {/* Paper Cards */}
          <div className="grid gap-6 grid-cols-2 w-4/5">
            {filteredPapers.length > 0 ? (
              filteredPapers.map(paper => (
                <div key={paper._id} className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
                  <h2 className="text-xl font-semibold text-blue-800 mb-1">{paper.title}</h2>
                  <p className="text-gray-600 text-sm mb-2">By {paper.speakerName}</p>
                  <div className="text-sm text-gray-500 mb-2">{new Date(paper.submissionDate).getFullYear()} • {paper.conferenceName}</div>

                  <p className="text-gray-700 text-sm mb-4">{paper.abstract}</p>
                  <button onClick={() => downloadPaper(paper)} className='bg-gradient-to-r from-blue-500 to-purple-600 hover:scale-105 transition-transform duration-300 shadow-lg text-white text-base px-[1rem] py-2 rounded-lg font-medium cursor-pointer'>Download Paper</button>
                </div>
              ))
            ) : (
              <p className="text-gray-500 col-span-full text-center">No papers found matching your search.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default PaperArchives;