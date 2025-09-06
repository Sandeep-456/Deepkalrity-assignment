# 🎯 Resume Analyzer

A full-stack web application that uses AI to analyze PDF resumes and provide detailed insights, ratings, and improvement suggestions.

## 🚀 Features

- **PDF Resume Upload**: Drag-and-drop or click to upload PDF resumes
- **AI-Powered Analysis**: Uses Google Gemini AI to extract and analyze resume content
- **Structured Data Extraction**: Extracts personal details, work experience, education, skills, projects, and certifications
- **Resume Rating**: Provides a 1-10 rating with detailed feedback
- **Improvement Suggestions**: AI-generated recommendations for resume enhancement
- **Historical View**: View all previously analyzed resumes in a searchable table
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## 🛠️ Tech Stack

### Backend
- **Node.js** with Express.js
- **PostgreSQL** database with JSONB fields
- **Google Gemini AI** for resume analysis
- **pdf-parse** for PDF text extraction
- **Multer** for file upload handling

### Frontend
- **React.js** with modern hooks
- **Axios** for API communication
- **React Toastify** for notifications
- **Styled Components** for responsive design

## 📋 Prerequisites

Before running the application, ensure you have:

1. **Node.js** (v16 or higher)
2. **PostgreSQL** (v12 or higher)
3. **Google Gemini API Key** ([Get one here](https://makersuite.google.com/app/apikey))

## 🚀 Quick Start

### 1. Clone and Setup

```bash
# Clone the repository
git clone <your-repo-url>
cd resume-analyzer

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Database Setup

```bash
# Create PostgreSQL database
createdb resume_analyzer

# The application will automatically create the required table on first run
```

### 3. Environment Configuration

Create a `.env` file in the `backend` directory:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=resume_analyzer
DB_USER=your_username
DB_PASSWORD=your_password

# Google Gemini API
GEMINI_API_KEY=your_gemini_api_key_here

# Server Configuration
PORT=5000
NODE_ENV=development
```

### 4. Start the Application

```bash
# Terminal 1: Start the backend server
cd backend
npm run dev

# Terminal 2: Start the frontend development server
cd frontend
npm start
```

The application will be available at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

## 📁 Project Structure

```
resume-analyzer/
├── backend/
│   ├── controllers/
│   │   └── resumeController.js      # Request handling logic
│   ├── db/
│   │   └── index.js                 # PostgreSQL connection
│   ├── routes/
│   │   └── resumeRoutes.js         # API routes
│   ├── services/
│   │   └── analysisService.js      # PDF parsing + Gemini AI
│   ├── package.json
│   ├── server.js                   # Express server entry point
│   └── env.example                 # Environment variables template
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── ResumeUploader.js   # File upload component
│   │   │   ├── ResumeDetails.js    # Analysis display component
│   │   │   └── PastResumesTable.js # History table component
│   │   ├── services/
│   │   │   └── api.js              # API service layer
│   │   ├── App.js                  # Main app component
│   │   ├── App.css                 # App styles
│   │   ├── index.js                # React entry point
│   │   └── index.css               # Global styles
│   └── package.json
├── sample_data/                    # Sample resumes for testing
└── README.md
```

## 🗄️ Database Schema

The application uses a single PostgreSQL table with JSONB fields for flexible data storage:

```sql
CREATE TABLE resumes (
    id SERIAL PRIMARY KEY,
    file_name VARCHAR(255) NOT NULL,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    name VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(50),
    linkedin_url VARCHAR(255),
    portfolio_url VARCHAR(255),
    summary TEXT,
    work_experience JSONB,
    education JSONB,
    technical_skills JSONB,
    soft_skills JSONB,
    projects JSONB,
    certifications JSONB,
    resume_rating INTEGER,
    improvement_areas TEXT,
    upskill_suggestions JSONB
);
```

## 🔌 API Endpoints

### POST `/api/resumes/upload`
Upload and analyze a PDF resume.

**Request**: Multipart form data with `resume` field (PDF file)
**Response**: 
```json
{
  "success": true,
  "message": "Resume analyzed and saved successfully",
  "data": {
    "id": 1,
    "fileName": "resume.pdf",
    "uploadedAt": "2024-01-01T00:00:00.000Z",
    "analysis": { /* structured analysis data */ }
  }
}
```

### GET `/api/resumes`
Get all uploaded resumes (for history table).

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "file_name": "resume.pdf",
      "uploaded_at": "2024-01-01T00:00:00.000Z",
      "name": "John Doe",
      "email": "john@example.com",
      "resume_rating": 8
    }
  ]
}
```

### GET `/api/resumes/:id`
Get detailed analysis of a specific resume.

**Response**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "file_name": "resume.pdf",
    "name": "John Doe",
    "analysis": { /* complete analysis data */ }
  }
}
```

## 🎨 UI Components

### ResumeUploader
- Drag-and-drop file upload
- PDF validation
- Progress indicators
- Error handling

### ResumeDetails
- Structured display of analysis results
- Rating visualization with stars
- Skills tags
- Responsive layout

### PastResumesTable
- Sortable table with all resumes
- Modal for detailed view
- Search and filter capabilities

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DB_HOST` | PostgreSQL host | localhost |
| `DB_PORT` | PostgreSQL port | 5432 |
| `DB_NAME` | Database name | resume_analyzer |
| `DB_USER` | Database username | - |
| `DB_PASSWORD` | Database password | - |
| `GEMINI_API_KEY` | Google Gemini API key | - |
| `PORT` | Server port | 5000 |
| `NODE_ENV` | Environment | development |

### File Upload Limits
- Maximum file size: 10MB
- Allowed file types: PDF only
- Supported formats: PDF documents

## 🧪 Testing

### Sample Data
The `sample_data/` folder contains sample PDF resumes for testing the application.

### Manual Testing Steps
1. Upload a sample PDF resume
2. Verify the analysis results are displayed correctly
3. Check that the resume appears in the history table
4. Test the modal functionality for viewing details
5. Verify responsive design on different screen sizes

## 🚨 Error Handling

The application includes comprehensive error handling for:

- **File Upload Errors**: Invalid file types, size limits
- **PDF Parsing Errors**: Corrupted or unreadable PDFs
- **API Errors**: Gemini API failures, network issues
- **Database Errors**: Connection issues, query failures
- **Frontend Errors**: Network timeouts, invalid responses

## 🔒 Security Considerations

- File type validation (PDF only)
- File size limits (10MB max)
- CORS configuration for frontend-backend communication
- Environment variables for sensitive data
- Input sanitization and validation

## 🚀 Deployment

### Production Setup

1. **Environment Variables**: Set production values in `.env`
2. **Database**: Use a production PostgreSQL instance
3. **API Keys**: Ensure Gemini API key has appropriate quotas
4. **Build**: Run `npm run build` in the frontend directory
5. **Server**: Use PM2 or similar for process management

### Docker Deployment (Optional)

```dockerfile
# Backend Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Troubleshooting

### Common Issues

**Database Connection Error**
- Verify PostgreSQL is running
- Check database credentials in `.env`
- Ensure database exists

**Gemini API Error**
- Verify API key is correct
- Check API quotas and limits
- Ensure internet connectivity

**File Upload Issues**
- Check file size (max 10MB)
- Verify file is a valid PDF
- Check server logs for detailed errors

**Frontend Not Loading**
- Verify backend server is running on port 5000
- Check browser console for errors
- Ensure CORS is properly configured

## 📞 Support

For issues and questions:
1. Check the troubleshooting section
2. Review server logs for error details
3. Create an issue in the repository
4. Contact the development team

---

**Built with ❤️ using React, Node.js, PostgreSQL, and Google Gemini AI**
