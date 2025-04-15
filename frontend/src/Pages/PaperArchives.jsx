import React, { useState } from 'react';
import Paper from '../assets/Paper.jpeg'; // Added import for Paper.jpeg
import Navbar from '../Components/Navbar';

const dummyPapers = [
  {
    id: 1,
    title: "AI in Modern Healthcare",
    authors: "Dr. A. Sharma, Prof. R. Mehta",
    year: "2023",
    conference: "TechFront 2023",
    category: "Artificial Intelligence",
    abstract: "This paper explores the integration of AI in modern healthcare practices...",
    fileUrl: "/papers/ai_healthcare.pdf"
  },
  {
    id: 2,
    title: "Green IoT for Smart Cities",
    authors: "S. Kumar, M. Ali",
    year: "2022",
    conference: "EnviroTech 2022",
    category: "IoT",
    abstract: "An overview of sustainable IoT implementations in smart city infrastructure...",
    fileUrl: "/papers/green_iot.pdf"
  },
  // Add more dummy data or fetch from API later
];

const PaperArchives = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPapers = dummyPapers.filter(paper =>
    paper.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    paper.authors.toLowerCase().includes(searchTerm.toLowerCase()) ||
    paper.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="h-screen w-full bg-cover bg-center flex flex-col items-center justify-center px-4 backdrop-blur-md brightness-90"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.5), rgba(0,0,0,0.9)), url(${Paper})`
        }}>
        {/* Hero Section */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Papers Presented at Our Conferences</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore our archive of peer-reviewed papers from previous conferences. Open for all and free to download.
          </p>
        </div>

        {/* Search Bar */}
        <div className="flex justify-center mb-8">
          <input
            type="text"
            placeholder="Search by title, author, or category..."
            className="w-full max-w-xl px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Paper Cards */}
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filteredPapers.length > 0 ? (
            filteredPapers.map(paper => (
              <div key={paper.id} className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
                <h2 className="text-xl font-semibold text-blue-800 mb-1">{paper.title}</h2>
                <p className="text-gray-600 text-sm mb-2">By {paper.authors}</p>
                <div className="text-sm text-gray-500 mb-2">{paper.year} • {paper.conference}</div>
                <span className="inline-block bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full mb-3">
                  {paper.category}
                </span>
                <p className="text-gray-700 text-sm mb-4">{paper.abstract}</p>
                <a
                  href={paper.fileUrl}
                  download
                  className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Download PDF
                </a>
              </div>
            ))
          ) : (
            <p className="text-gray-500 col-span-full text-center">No papers found matching your search.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default PaperArchives;