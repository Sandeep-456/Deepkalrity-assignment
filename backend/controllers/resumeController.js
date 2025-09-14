const db = require("../db/index");
const analysisService = require("../services/analysisService");

// Helper function to safely parse JSON
const safeJSONParse = (data) => {
  try {
    return JSON.parse(data);
  } catch (error) {
    return []; // Return empty array on parsing error
  }
};


class ResumeController {
  async uploadResume(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const allowedMimeTypes = [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];

      if (!allowedMimeTypes.includes(req.file.mimetype)) {
        return res
          .status(400)
          .json({ error: "Only PDF and DOCX files are allowed" });
      }

      // Process the resume
      const result = await analysisService.processResume(
        req.file.buffer,
        req.file.originalname
      );
      const analysisData = result.analysisData;
      // Save to database
      const query = `
        INSERT INTO resumes (
          file_name, name, email, phone, linkedin_url, portfolio_url,
          summary, work_experience, education, technical_skills, soft_skills,
          projects, certifications, resume_rating, improvement_areas, upskill_suggestions
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const values = [
        result.fileName,
        analysisData.name || null,
        analysisData.email || null,
        analysisData.phone || null,
        analysisData.linkedin_url || null,
        analysisData.portfolio_url || null,
        analysisData.summary || null,
        JSON.stringify(analysisData.work_experience || []),
        JSON.stringify(analysisData.education || []),
        JSON.stringify(analysisData.technical_skills || []),
        JSON.stringify(analysisData.soft_skills || []),
        JSON.stringify(analysisData.projects || []),
        JSON.stringify(analysisData.certifications || []),
        analysisData.resume_rating || null,
        analysisData.improvement_areas || null,
        JSON.stringify(analysisData.upskill_suggestions || []),
      ];

      const [dbResult] = await db.execute(query, values);
      const resumeId = dbResult.insertId;

      // Get the uploaded timestamp
      const [timestampResult] = await db.execute(
        "SELECT uploaded_at FROM resumes WHERE id = ?",
        [resumeId]
      );

      res.status(201).json({
        success: true,
        message: "Resume analyzed and saved successfully",
        data: {
          id: resumeId,
          fileName: result.fileName,
          uploadedAt: timestampResult[0].uploaded_at,
          analysis: analysisData,
        },
      });
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({
        error: "Failed to process resume",
        details: error.message,
      });
    }
  }

  async getAllResumes(req, res) {
    try {
      const query = `
        SELECT id, file_name, uploaded_at, name, email, resume_rating
        FROM resumes
        ORDER BY uploaded_at DESC
      `;

      const [result] = await db.execute(query);

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      console.error("Get all resumes error:", error);
      res.status(500).json({
        error: "Failed to fetch resumes",
        details: error.message,
      });
    }
  }

  async getResumeById(req, res) {
    try {
      const { id } = req.params;

      const query = `
        SELECT * FROM resumes WHERE id = ?
      `;

      const [result] = await db.execute(query, [id]);

      if (result.length === 0) {
        return res.status(404).json({
          error: "Resume not found",
        });
      }

      const resume = result[0];

      // Parse JSON fields
      const processedResume = {
        ...resume,
        work_experience: safeJSONParse(resume.work_experience),
        education: safeJSONParse(resume.education),
        technical_skills: safeJSONParse(resume.technical_skills),
        soft_skills: safeJSONParse(resume.soft_skills),
        projects: safeJSONParse(resume.projects),
        certifications: safeJSONParse(resume.certifications),
        upskill_suggestions: safeJSONParse(resume.upskill_suggestions),
      };

      res.json({
        success: true,
        data: processedResume,
      });
    } catch (error) {
      console.error("Get resume by ID error:", error);
      res.status(500).json({
        error: "Failed to fetch resume",
        details: error.message,
      });
    }
  }

  async improveResume(req, res) {
    try {
      const { id } = req.params;

      // Get the current resume data
      const query = `
        SELECT * FROM resumes WHERE id = ?
      `;

      const [result] = await db.execute(query, [id]);

      if (result.length === 0) {
        return res.status(404).json({
          error: "Resume not found",
        });
      }

      const resume = result[0];

      // Parse JSON fields
      const currentData = {
        ...resume,
        work_experience: safeJSONParse(resume.work_experience),
        education: safeJSONParse(resume.education),
        technical_skills: safeJSONParse(resume.technical_skills),
        soft_skills: safeJSONParse(resume.soft_skills),
        projects: safeJSONParse(resume.projects),
        certifications: safeJSONParse(resume.certifications),
        upskill_suggestions: safeJSONParse(resume.upskill_suggestions),
      };

      // Use the analysis service to improve the resume
      const improvedData = await analysisService.improveResumeContent(
        currentData
      );

      // Update the database with improved content
      const updateQuery = `
        UPDATE resumes SET
          summary = ?,
          work_experience = ?,
          education = ?,
          technical_skills = ?,
          soft_skills = ?,
          projects = ?,
          certifications = ?,
          resume_rating = ?,
          improvement_areas = ?,
          upskill_suggestions = ?
        WHERE id = ?
      `;

      const updateValues = [
        improvedData.summary || currentData.summary,
        JSON.stringify(
          improvedData.work_experience || currentData.work_experience
        ),
        JSON.stringify(improvedData.education || currentData.education),
        JSON.stringify(
          improvedData.technical_skills || currentData.technical_skills
        ),
        JSON.stringify(improvedData.soft_skills || currentData.soft_skills),
        JSON.stringify(improvedData.projects || currentData.projects),
        JSON.stringify(
          improvedData.certifications || currentData.certifications
        ),
        improvedData.resume_rating || currentData.resume_rating,
        improvedData.improvement_areas || currentData.improvement_areas,
        JSON.stringify(
          improvedData.upskill_suggestions || currentData.upskill_suggestions
        ),
        id,
      ];

      await db.execute(updateQuery, updateValues);

      res.json({
        success: true,
        message: "Resume improved successfully",
        data: improvedData,
      });
    } catch (error) {
      console.error("Improve resume error:", error);
      res.status(500).json({
        error: "Failed to improve resume",
        details: error.message,
      });
    }
  }

  async deleteResume(req, res) {
    try {
      const { id } = req.params;

      // Check if resume exists
      const [existingResume] = await db.execute(
        "SELECT id FROM resumes WHERE id = ?",
        [id]
      );

      if (existingResume.length === 0) {
        return res.status(404).json({
          error: "Resume not found",
        });
      }

      // Delete the resume
      const deleteQuery = `DELETE FROM resumes WHERE id = ?`;
      const [result] = await db.execute(deleteQuery, [id]);

      if (result.affectedRows === 0) {
        return res.status(404).json({
          error: "Resume not found or already deleted",
        });
      }

      res.json({
        success: true,
        message: "Resume deleted successfully",
      });
    } catch (error) {
      console.error("Delete resume error:", error);
      res.status(500).json({
        error: "Failed to delete resume",
        details: error.message,
      });
    }
  }
}

module.exports = new ResumeController();
