import React, { useState } from 'react';
import { resumeAPI } from '../services/api';
import { toast } from 'react-toastify';
import { 
  FaRobot, 
  FaStar, 
  FaFileAlt, 
  FaChartLine, 
  FaBullseye,
  FaRocket, 
  FaMagic,
  FaUser, 
  FaBriefcase, 
  FaGraduationCap, 
  FaCogs, 
  FaHandshake, 
  FaProjectDiagram, 
  FaAward,
  FaSpinner,
  FaChartBar,
} from 'react-icons/fa';

const ResumeDetails = ({ analysis, resumeId, onResumeImproved }) => {
  const [isImproving, setIsImproving] = useState(false);

  const handleImproveResume = async () => {
    if (!resumeId) {
      toast.error('Resume ID not available');
      return;
    }

    try {
      setIsImproving(true);
      const result = await resumeAPI.improveResume(resumeId);
      
      toast.success('Resume improved successfully!');
      
      // Call the callback to refresh the resume data
      if (onResumeImproved) {
        onResumeImproved(result.data);
      }
    } catch (error) {
      console.error('Error improving resume:', error);
      toast.error('Failed to improve resume. Please try again.');
    } finally {
      setIsImproving(false);
    }
  };

  if (!analysis) {
    return (
      <div className="card">
        <h2><FaChartBar style={{color: 'green', fontSize: '34px',}}/> Resume Analysis</h2>
        <p style={{ color: '#6b7280', textAlign: 'center', padding: '40px' }}>
          Upload a resume to see the analysis results here.
        </p>
      </div>
    );
  }

  const renderRating = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={i} style={{ color: '#FFD700', fontSize: '20px' }} />);
    }
    if (hasHalfStar) {
      stars.push(<FaStar key="half" style={{ color: '#FFD700', fontSize: '20px' }} />);
    }
    
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>{stars}</div>
        <span style={{ fontWeight: 'bold', fontSize: '18px' }}>{rating}/10</span>
      </div>
    );
  };

  const renderSkills = (skills) => {
    if (!skills || skills.length === 0) return <p style={{ color: '#6b7280' }}>No skills listed</p>;
    
    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        {skills.map((skill, index) => (
          <span
            key={index}
            style={{
              backgroundColor: '#e5e7eb',
              padding: '4px 12px',
              borderRadius: '20px',
              fontSize: '14px',
              color: '#374151'
            }}
          >
            {skill}
          </span>
        ))}
      </div>
    );
  };

  const renderList = (items, renderItem) => {
    if (!items || items.length === 0) {
      return <p style={{ color: '#6b7280' }}>No items listed</p>;
    }
    
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {items.map((item, index) => (
          <div key={index} style={{ padding: '16px', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
            {renderItem ? renderItem(item) : <p>{item}</p>}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* AI Analysis Results Card */}
      <div className="card" style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        border: 'none',
        boxShadow: '0 10px 25px rgba(102, 126, 234, 0.3)'
      }}>
        <h2 style={{ color: 'white', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <FaRobot style={{ fontSize: '24px' }} />
          AI Analysis Results
        </h2>
        
        {/* Resume Rating */}
        {analysis.resume_rating && (
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ marginBottom: '16px', color: 'rgba(255, 255, 255, 0.9)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FaStar style={{ fontSize: '18px' }} />
              Resume Rating
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
              {renderRating(analysis.resume_rating)}
            </div>
          </div>
        )}

        {/* Summary */}
        {analysis.summary && (
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ marginBottom: '16px', color: 'rgba(255, 255, 255, 0.9)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FaFileAlt style={{ fontSize: '18px' }} />
              Professional Summary
            </h3>
            <p style={{ 
              lineHeight: '1.6', 
              backgroundColor: 'rgba(255, 255, 255, 0.1)', 
              padding: '16px', 
              borderRadius: '8px',
              color: 'rgba(255, 255, 255, 0.95)'
            }}>
              {analysis.summary}
            </p>
          </div>
        )}
      </div>

      {/* Areas for Improvement Card */}
      {(analysis.improvement_areas || (analysis.upskill_suggestions && analysis.upskill_suggestions.length > 0)) && (
        <div className="card" style={{ 
          backgroundColor: '#fef3c7',
          border: '2px solid #f59e0b',
          boxShadow: '0 4px 12px rgba(245, 158, 11, 0.2)'
        }}>
          <h2 style={{ color: '#92400e', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <FaChartLine style={{ fontSize: '24px' }} />
            Areas for Improvement
          </h2>

          {/* Improvement Areas */}
          {analysis.improvement_areas && (
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ marginBottom: '16px', color: '#92400e', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FaBullseye style={{ fontSize: '18px' }} />
                Key Areas to Focus On
              </h3>
              <p style={{ 
                lineHeight: '1.6', 
                backgroundColor: 'rgba(245, 158, 11, 0.1)', 
                padding: '16px', 
                borderRadius: '8px',
                color: '#92400e',
                border: '1px solid rgba(245, 158, 11, 0.3)'
              }}>
                {analysis.improvement_areas}
              </p>
            </div>
          )}

          {/* Upskill Suggestions */}
          {analysis.upskill_suggestions && analysis.upskill_suggestions.length > 0 && (
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ marginBottom: '16px', color: '#92400e', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FaRocket style={{ fontSize: '18px' }} />
                Recommended Actions
              </h3>
              <ul style={{ paddingLeft: '20px' }}>
                {analysis.upskill_suggestions.map((suggestion, index) => (
                  <li key={index} style={{ marginBottom: '8px', lineHeight: '1.5', color: '#92400e' }}>
                    {suggestion}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Improve Resume Button */}
          {resumeId && (
            <div style={{ textAlign: 'center', marginTop: '24px' }}>
              <button
                className="btn btn-primary"
                onClick={handleImproveResume}
                disabled={isImproving}
                style={{
                  padding: '12px 24px',
                  fontSize: '16px',
                  fontWeight: '600',
                  backgroundColor: isImproving ? '#9ca3af' : '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: isImproving ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  margin: '0 auto'
                }}
              >
                {isImproving ? (
                  <>
                    <FaSpinner className="spinner" style={{ width: '16px', height: '16px' }} />
                    Improving Resume...
                  </>
                ) : (
                  <>
                    <FaMagic style={{ fontSize: '16px' }} />
                    Improve Resume Content
                  </>
                )}
              </button>
              <p style={{ marginTop: '8px', color: '#92400e', fontSize: '14px' }}>
                Click to enhance your resume based on the suggestions above
              </p>
            </div>
          )}
        </div>
      )}

      {/* Resume Content Card */}
      <div className="card">
        <h2 style={{ marginBottom: '24px', color: '#374151', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <FaFileAlt style={{ fontSize: '24px' }} />
          Resume Content
        </h2>
        
        {/* Personal Details */}
        {(analysis.name || analysis.email || analysis.phone || analysis.linkedin_url || analysis.portfolio_url) && (
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ marginBottom: '16px', color: '#374151', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FaUser style={{ fontSize: '18px' }} />
              Personal Details
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
              {analysis.name && (
                <div>
                  <strong>Name:</strong> {analysis.name}
                </div>
              )}
              {analysis.email && (
                <div>
                  <strong>Email:</strong> {analysis.email}
                </div>
              )}
              {analysis.phone && (
                <div>
                  <strong>Phone:</strong> {analysis.phone}
                </div>
              )}
              {analysis.linkedin_url && (
                <div>
                  <strong>LinkedIn:</strong> 
                  <a href={analysis.linkedin_url} target="_blank" rel="noopener noreferrer" style={{ marginLeft: '8px', color: '#3b82f6' }}>
                    View Profile
                  </a>
                </div>
              )}
              {analysis.portfolio_url && (
                <div>
                  <strong>Portfolio:</strong> 
                  <a href={analysis.portfolio_url} target="_blank" rel="noopener noreferrer" style={{ marginLeft: '8px', color: '#3b82f6' }}>
                    View Portfolio
                  </a>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Work Experience */}
        {analysis.work_experience && analysis.work_experience.length > 0 && (
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ marginBottom: '16px', color: '#374151', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FaBriefcase style={{ fontSize: '18px' }} />
              Work Experience
            </h3>
            {renderList(analysis.work_experience, (exp) => (
              <div>
                <h4 style={{ marginBottom: '8px', color: '#1f2937' }}>{exp.role}</h4>
                <p style={{ marginBottom: '4px', fontWeight: '600', color: '#3b82f6' }}>{exp.company}</p>
                {exp.duration && <p style={{ marginBottom: '8px', color: '#6b7280' }}>{exp.duration}</p>}
                {exp.description && exp.description.length > 0 && (
                  <div style={{ marginTop: '8px' }}>
                    {exp.description.map((desc, index) => (
                      <p key={index} style={{ marginBottom: '4px', lineHeight: '1.5' }}>• {desc}</p>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Education */}
        {analysis.education && analysis.education.length > 0 && (
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ marginBottom: '16px', color: '#374151', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FaGraduationCap style={{ fontSize: '18px' }} />
              Education
            </h3>
            {renderList(analysis.education, (edu) => (
              <div>
                <h4 style={{ marginBottom: '8px', color: '#1f2937' }}>{edu.degree}</h4>
                <p style={{ marginBottom: '4px', fontWeight: '600', color: '#3b82f6' }}>{edu.institution}</p>
                {edu.graduation_year && <p style={{ color: '#6b7280' }}>{edu.graduation_year}</p>}
              </div>
            ))}
          </div>
        )}

        {/* Technical Skills */}
        {analysis.technical_skills && analysis.technical_skills.length > 0 && (
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ marginBottom: '16px', color: '#374151', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FaCogs style={{ fontSize: '18px' }} />
              Technical Skills
            </h3>
            {renderSkills(analysis.technical_skills)}
          </div>
        )}

        {/* Soft Skills */}
        {analysis.soft_skills && analysis.soft_skills.length > 0 && (
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ marginBottom: '16px', color: '#374151', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FaHandshake style={{ fontSize: '18px' }} />
              Soft Skills
            </h3>
            {renderSkills(analysis.soft_skills)}
          </div>
        )}

        {/* Projects */}
        {analysis.projects && analysis.projects.length > 0 && (
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ marginBottom: '16px', color: '#374151', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FaProjectDiagram style={{ fontSize: '18px' }} />
              Projects
            </h3>
            {renderList(analysis.projects, (project) => (
              <div>
                <h4 style={{ marginBottom: '8px', color: '#1f2937' }}>{project.title}</h4>
                {project.description && <p style={{ marginBottom: '8px', lineHeight: '1.5' }}>{project.description}</p>}
                {project.technologies && project.technologies.length > 0 && (
                  <div style={{ marginBottom: '8px' }}>
                    <strong>Technologies:</strong> {project.technologies.join(', ')}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Certifications */}
        {analysis.certifications && analysis.certifications.length > 0 && (
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ marginBottom: '16px', color: '#374151', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FaAward style={{ fontSize: '18px' }} />
              Certifications
            </h3>
            {renderSkills(analysis.certifications)}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeDetails;

