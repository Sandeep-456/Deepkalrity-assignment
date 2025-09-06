const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");
const { GoogleGenerativeAI } = require("@google/generative-ai");

class AnalysisService {
  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  }

  async parsePDF(buffer) {
    try {
      const data = await pdfParse(buffer);
      return data.text;
    } catch (error) {
      throw new Error(`PDF parsing failed: ${error.message}`);
    }
  }

  async parseDOCX(buffer) {
    try {
      const result = await mammoth.extractRawText({ buffer });
      return result.value;
    } catch (error) {
      throw new Error(`DOCX parsing failed: ${error.message}`);
    }
  }

  async analyzeResume(resumeText) {
    try {
      const prompt = `
        You are an expert technical recruiter and career coach. 
        Analyze the following resume text and extract the details into a valid JSON object.

        Important Instructions:
        - Only output the JSON object. Do not include any text, explanation, or markdown.
        - Ensure all fields are included, even if they are null or empty arrays.
        - Keep the JSON strictly valid (double quotes, no trailing commas).
        - Summaries should be concise but meaningful.
        - For skills, separate technical and soft skills clearly.
        - Resume rating should be a number from 1 to 10.

        Resume Text:
        """
        ${resumeText}
        """

        JSON Schema:
        {
          "name": "string | null",
          "email": "string | null",
          "phone": "string | null",
          "linkedin_url": "string | null",
          "portfolio_url": "string | null",
          "summary": "string | null",
          "work_experience": [
            {
              "role": "string",
              "company": "string",
              "duration": "string",
              "description": ["string"]
            }
          ],
          "education": [
            {
              "degree": "string",
              "institution": "string",
              "graduation_year": "string"
            }
          ],
          "technical_skills": ["string"],
          "soft_skills": ["string"],
          "projects": [
            {
              "title": "string",
              "description": "string",
              "technologies": ["string"]
            }
          ],
          "certifications": ["string"],
          "resume_rating": "number (1-10)",
          "improvement_areas": "string",
          "upskill_suggestions": ["string"]
        }
      `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Clean the response to extract JSON
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("No valid JSON found in Gemini response");
      }

      const analysisData = JSON.parse(jsonMatch[0]);
      return analysisData;
    } catch (error) {
      throw new Error(`Resume analysis failed: ${error.message}`);
    }
  }

  async processResume(buffer, fileName) {
    try {
      let resumeText;
      if (fileName.endsWith(".pdf")) {
        resumeText = await this.parsePDF(buffer);
      } else if (fileName.endsWith(".docx")) {
        resumeText = await this.parseDOCX(buffer);
      } else {
        throw new Error("Unsupported file type");
      }

      if (!resumeText || resumeText.trim().length === 0) {
        throw new Error("No text could be extracted from the file");
      }

      // Analyze with Gemini
      const analysisData = await this.analyzeResume(resumeText);

      return {
        fileName,
        analysisData,
        extractedText: resumeText,
      };
    } catch (error) {
      throw new Error(`Resume processing failed: ${error.message}`);
    }
  }

  async improveResumeContent(currentData) {
    try {
      const prompt = `
        You are an expert technical recruiter and career coach. 
        Based on the current resume data and improvement suggestions, provide an improved version of the resume content.

        Important Instructions:
        - Only output the JSON object. Do not include any text, explanation, or markdown.
        - Keep the JSON strictly valid (double quotes, no trailing commas).
        - Improve the content based on the current improvement areas and upskill suggestions.
        - Enhance descriptions, add missing skills, improve project descriptions.
        - Increase the resume rating if improvements are made.
        - Provide new improvement areas and upskill suggestions for the improved version.

        Current Resume Data:
        ${JSON.stringify(currentData, null, 2)}

        JSON Schema (return improved version):
        {
          "name": "string | null",
          "email": "string | null",
          "phone": "string | null",
          "linkedin_url": "string | null",
          "portfolio_url": "string | null",
          "summary": "string | null",
          "work_experience": [
            {
              "role": "string",
              "company": "string",
              "duration": "string",
              "description": ["string"]
            }
          ],
          "education": [
            {
              "degree": "string",
              "institution": "string",
              "graduation_year": "string"
            }
          ],
          "technical_skills": ["string"],
          "soft_skills": ["string"],
          "projects": [
            {
              "title": "string",
              "description": "string",
              "technologies": ["string"]
            }
          ],
          "certifications": ["string"],
          "resume_rating": "number (1-10)",
          "improvement_areas": "string",
          "upskill_suggestions": ["string"]
        }
      `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Clean the response to extract JSON
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("No valid JSON found in Gemini response");
      }

      const improvedData = JSON.parse(jsonMatch[0]);
      return improvedData;
    } catch (error) {
      throw new Error(`Resume improvement failed: ${error.message}`);
    }
  }
}

module.exports = new AnalysisService();
