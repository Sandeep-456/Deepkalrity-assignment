import React, { useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaFileAlt, FaChartBar, FaHistory, FaBullseye } from 'react-icons/fa';
import ResumeUploader from './components/ResumeUploader';
import ResumeDetails from './components/ResumeDetails';
import PastResumesTable from './components/PastResumesTable';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('upload');
  const [currentAnalysis, setCurrentAnalysis] = useState(null);
  const [currentResumeId, setCurrentResumeId] = useState(null);

  const handleUploadSuccess = (analysisData) => {
    setCurrentAnalysis(analysisData.analysis);
    setCurrentResumeId(analysisData.id);
    setActiveTab('results');
  };

  const handleResumeImproved = (improvedData) => {
    setCurrentAnalysis(improvedData);
  };

  const tabs = [
    { id: 'upload', label: 'Upload Resume', icon: FaFileAlt },
    { id: 'results', label: 'Analysis Results', icon: FaChartBar },
    { id: 'history', label: 'Resume History', icon: FaHistory }
  ];

  return (
    <div className="App">
      <header className="app-header">
        <div className="heading-container">
          <h1><FaBullseye  /> Resume Analyzer</h1>
          <p>AI-powered resume analysis and insights</p>
        </div>
      </header>

      <nav className="app-nav">
        <div className="container">
          <div className="nav-tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className="tab-icon">
                  <tab.icon style={{ fontSize: '18px' }} />
                </span>
                <span className="tab-label">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main className="app-main">
        <div className="container">
          {activeTab === 'upload' && (
            <ResumeUploader onUploadSuccess={handleUploadSuccess} />
          )}
          
          {activeTab === 'results' && (
            <ResumeDetails 
              analysis={currentAnalysis} 
              resumeId={currentResumeId}
              onResumeImproved={handleResumeImproved}
            />
          )}
          
          {activeTab === 'history' && (
            <PastResumesTable />
          )}
        </div>
      </main>

      <footer className="app-footer">
        <div className="container">
          <p>&copy; 2024 Resume Analyzer. Built with React, Vite, Node.js, and Google Gemini AI.</p>
        </div>
      </footer>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}

export default App
