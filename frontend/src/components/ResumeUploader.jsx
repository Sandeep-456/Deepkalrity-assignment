import React, { useState } from 'react';
import { resumeAPI } from '../services/api';
import { toast } from 'react-toastify';
import { FaFileAlt, FaFolder } from 'react-icons/fa';

const ResumeUploader = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (allowedTypes.includes(selectedFile.type)) {
        setFile(selectedFile);
        toast.success('File selected successfully');
      } else {
        toast.error('Please select a PDF or DOCX file only');
        e.target.value = '';
      }
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (allowedTypes.includes(droppedFile.type)) {
        setFile(droppedFile);
        toast.success('File selected successfully');
      } else {
        toast.error('Please drop a PDF or DOCX file only');
      }
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error('Please select a PDF file first');
      return;
    }

    setUploading(true);
    try {
      const result = await resumeAPI.uploadResume(file);
      toast.success('Resume analyzed successfully!');
      onUploadSuccess(result.data);
      setFile(null);
      // Reset file input
      const fileInput = document.getElementById('file-input');
      if (fileInput) fileInput.value = '';
    } catch (error) {
      console.error('Upload error:', error);
      const errorMessage = error.response?.data?.details || error.message || 'Upload failed';
      toast.error(`Upload failed: ${errorMessage}`);
    } finally {
      setUploading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="card">
      <h2><FaFileAlt /> Upload Resume</h2>
      <p style={{ marginBottom: '24px', color: '#6b7280' }}>
        Upload a PDF resume to get AI-powered analysis and insights.
      </p>

      <div
        className={`upload-area ${dragActive ? 'drag-active' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        style={{
          border: '2px dashed #d1d5db',
          borderRadius: '12px',
          padding: '40px',
          textAlign: 'center',
          backgroundColor: dragActive ? '#f3f4f6' : '#fafafa',
          transition: 'all 0.2s ease',
          cursor: 'pointer',
          marginBottom: '20px'
        }}
        onClick={() => document.getElementById('file-input').click()}
      >
        <input
          id="file-input"
          type="file"
          accept=".pdf,.docx"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
        
        {file ? (
          <div>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📄</div>
            <h3 style={{ marginBottom: '8px' }}>{file.name}</h3>
            <p style={{ color: '#6b7280' }}>{formatFileSize(file.size)}</p>
          </div>
        ) : (
          <div>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}><FaFolder /></div>
            <h3 style={{ marginBottom: '8px' }}>Drop your PDF here</h3>
            <p style={{ color: '#6b7280' }}>or click to browse files</p>
            <p style={{ fontSize: '14px', color: '#9ca3af', marginTop: '8px' }}>
              Only PDF and DOCX files are supported (max 10MB)
            </p>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
        <button
          className="btn btn-primary"
          onClick={handleUpload}
          disabled={!file || uploading}
          style={{ minWidth: '120px' }}
        >
          {uploading ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div className="spinner" style={{ width: '16px', height: '16px', borderWidth: '2px' }}></div>
              Analyzing...
            </div>
          ) : (
            'Analyze Resume'
          )}
        </button>
        
        {file && (
          <button
            className="btn btn-secondary"
            onClick={() => {
              setFile(null);
              document.getElementById('file-input').value = '';
            }}
            disabled={uploading}
          >
            Clear
          </button>
        )}
      </div>

      {uploading && (
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <p style={{ color: '#6b7280' }}>
            Processing your resume... This may take a few moments.
          </p>
        </div>
      )}
    </div>
  );
};

export default ResumeUploader;
