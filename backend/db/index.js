const mysql = require('mysql2/promise');
require('dotenv').config();

// Create MySQL connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'resume_analyzer',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test the connection
pool.getConnection()
  .then(connection => {
    console.log('Connected to MySQL database');
    connection.release();
  })
  .catch(err => {
    console.error('Error connecting to MySQL:', err.message);
  });

// Create table if it doesn't exist
const createTable = async () => {
  const connection = await pool.getConnection();
  try {
    const query = `
      CREATE TABLE IF NOT EXISTS resumes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        file_name VARCHAR(255) NOT NULL,
        uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        name VARCHAR(255),
        email VARCHAR(255),
        phone VARCHAR(255),
        linkedin_url VARCHAR(255),
        portfolio_url VARCHAR(255),
        summary TEXT,
        work_experience JSON,
        education JSON,
        technical_skills JSON,
        soft_skills JSON,
        projects JSON,
        certifications JSON,
        resume_rating INT,
        improvement_areas TEXT,
        upskill_suggestions JSON
      );
    `;
    await connection.execute(query);
    console.log('Database table created/verified successfully');
  } catch (err) {
    console.error('Error creating table:', err.message);
  } finally {
    connection.release();
  }
};

// Initialize database
createTable();

module.exports = pool;