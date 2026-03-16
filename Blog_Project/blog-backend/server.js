const express = require('express');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
require('dotenv').config();
const pool = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const blogRoutes = require('./routes/blogRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/blogs', blogRoutes);

app.get('/', (req, res) => {
  res.json({
    message: 'Blog API Server Running',
    uploadLimit: '1GB',
    mediaTypes: ['image/*', 'video/*']
  });
});

app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File is too large. Max size is 1GB.' });
    }
    return res.status(400).json({ message: err.message });
  }

  if (err && err.message === 'Only image and video files are allowed') {
    return res.status(400).json({ message: err.message });
  }

  if (err) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }

  next();
});

const ensureBlogImageColumn = async () => {
  try {
    await pool.execute('ALTER TABLE blogs ADD COLUMN image_url VARCHAR(500) NULL');
  } catch (error) {
    if (error && error.code !== 'ER_DUP_FIELDNAME') {
      throw error;
    }
  }
};

const ensureBlogLikesTable = async () => {
  await pool.execute(`
    CREATE TABLE IF NOT EXISTS blog_likes (
      id INT AUTO_INCREMENT PRIMARY KEY,
      blog_id INT NOT NULL,
      user_id INT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE KEY unique_blog_user_like (blog_id, user_id),
      FOREIGN KEY (blog_id) REFERENCES blogs(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);
};

const PORT = process.env.PORT || 5000;
const startServer = async () => {
  await ensureBlogImageColumn();
  await ensureBlogLikesTable();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
