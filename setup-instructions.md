# 🚀 Quick Setup Guide

## Prerequisites
- Node.js (v16+)
- PostgreSQL (v12+)
- Google Gemini API Key

## Setup Steps

### 1. Database Setup
```bash
createdb resume_analyzer
```

### 2. Backend Setup
```bash
cd backend
npm install
cp env.example .env
# Edit .env with your database credentials and Gemini API key
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm start
```

### 4. Access Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Environment Variables (.env)
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=resume_analyzer
DB_USER=your_username
DB_PASSWORD=your_password
GEMINI_API_KEY=your_gemini_api_key
PORT=5000
NODE_ENV=development
```

## Testing
1. Upload a PDF resume
2. View analysis results
3. Check resume history
4. Test modal functionality

## Troubleshooting
- Check database connection
- Verify Gemini API key
- Ensure file is PDF format
- Check server logs for errors
