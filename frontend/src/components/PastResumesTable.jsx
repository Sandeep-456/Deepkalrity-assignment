import React, { useState, useEffect } from 'react';
import { resumeAPI } from '../services/api';
import { toast } from 'react-toastify';
import { FaHistory, FaFileAlt, FaStar, FaRedo, FaTrash } from 'react-icons/fa';
import { FaX } from 'react-icons/fa6';
import ResumeDetails from './ResumeDetails';

const PastResumesTable = () => {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedResume, setSelectedResume] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      setLoading(true);
      const result = await resumeAPI.getAllResumes();
      setResumes(result.data);
    } catch (error) {
      console.error('Error fetching resumes:', error);
      toast.error('Failed to fetch resumes');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (resumeId) => {
    try {
      setModalLoading(true);
      const result = await resumeAPI.getResumeById(resumeId);
      setSelectedResume(result.data);
      setShowModal(true);
    } catch (error) {
      console.error('Error fetching resume details:', error);
      toast.error('Failed to fetch resume details');
    } finally {
      setModalLoading(false);
    }
  };

  const handleResumeImproved = (improvedData) => {
    setSelectedResume(improvedData);
    // Refresh the resumes list to show updated rating
    fetchResumes();
  };

  const handleDeleteResume = async (resumeId, resumeName) => {
    if (window.confirm(`Are you sure you want to delete "${resumeName}"? This action cannot be undone.`)) {
      try {
        await resumeAPI.deleteResume(resumeId);
        toast.success('Resume deleted successfully');
        // Refresh the resumes list
        fetchResumes();
      } catch (error) {
        console.error('Error deleting resume:', error);
        toast.error('Failed to delete resume');
      }
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedResume(null);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderRating = (rating) => {
    if (!rating) return <span style={{ color: '#6b7280' }}>Not rated</span>;
    
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={i} style={{ color: '#FFD700', fontSize: '16px' }} />);
    }
    if (hasHalfStar) {
      stars.push(<FaStar key="half" style={{ color: '#FFD700', fontSize: '16px' }} />);
    }
    
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>{stars}</div>
        <span style={{ fontWeight: 'bold' }}>{rating}/10</span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="card">
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <FaHistory style={{ fontSize: '24px' }} />
          Resume History
        </h2>
        <div className="loading">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <FaHistory style={{ fontSize: '24px' }} />
            Resume History
          </h2>
          <button className="btn btn-secondary" onClick={fetchResumes} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FaRedo /> Refresh
          </button>
        </div>

        {resumes.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
            <div style={{ marginBottom: '16px' }}>
              <FaFileAlt style={{ fontSize: '48px', color: '#6b7280' }} />
            </div>
            <h3>No resumes uploaded yet</h3>
            <p>Upload your first resume to see it appear here.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f9fafb' }}>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>File Name</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>Name</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>Email</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>Rating</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>Uploaded</th>
                  <th style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #e5e7eb' }}>Actions</th>
                  <th style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #e5e7eb' }}>Delete</th>
                </tr>
              </thead>
              <tbody>
                {resumes.map((resume) => (
                  <tr key={resume.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                    <td style={{ padding: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FaFileAlt style={{ fontSize: '16px', color: '#6b7280' }} />
                        <span style={{ fontWeight: '500' }}>{resume.file_name}</span>
                      </div>
                    </td>
                    <td style={{ padding: '12px' }}>
                      {resume.name || <span style={{ color: '#6b7280' }}>Not available</span>}
                    </td>
                    <td style={{ padding: '12px' }}>
                      {resume.email || <span style={{ color: '#6b7280' }}>Not available</span>}
                    </td>
                    <td style={{ padding: '12px' }}>
                      {renderRating(resume.resume_rating)}
                    </td>
                    <td style={{ padding: '12px', color: '#6b7280' }}>
                      {formatDate(resume.uploaded_at)}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      <button
                        className="btn btn-primary"
                        onClick={() => handleViewDetails(resume.id)}
                        style={{ padding: '8px 16px', fontSize: '14px' }}
                      >
                        View Details
                      </button>
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDeleteResume(resume.id, resume.file_name)}
                        style={{ 
                          padding: '8px 12px', 
                          fontSize: '14px',
                          backgroundColor: '#dc3545',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          margin: '0 auto'
                        }}
                        title="Delete Resume"
                      >
                        <FaTrash style={{ fontSize: '12px' }} />
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}><FaX/></button>
            
            {modalLoading ? (
              <div className="loading">
                <div className="spinner"></div>
                <p style={{ marginTop: '16px', color: '#6b7280' }}>Loading resume details...</p>
              </div>
            ) : (
              <div>
                <h2 style={{ marginBottom: '24px', color: '#1f2937' }}>
                  Resume Analysis Details
                </h2>
                <ResumeDetails 
                  analysis={selectedResume} 
                  resumeId={selectedResume?.id}
                  onResumeImproved={handleResumeImproved}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default PastResumesTable;

