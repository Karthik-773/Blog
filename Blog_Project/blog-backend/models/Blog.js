const pool = require('../config/db');

class Blog {
  static async create(userId, title, content, category, imageUrl) {
    const conn = await pool.getConnection();
    try {
      const [result] = await conn.execute(
        'INSERT INTO blogs (user_id, title, content, category, image_url) VALUES (?, ?, ?, ?, ?)',
        [userId, title, content, category, imageUrl]
      );
      return result;
    } finally {
      conn.release();
    }
  }

  static async getAllBlogs() {
    const conn = await pool.getConnection();
    try {
      const [rows] = await conn.execute(
        'SELECT b.*, u.username FROM blogs b JOIN users u ON b.user_id = u.id ORDER BY b.created_at DESC'
      );
      return rows;
    } finally {
      conn.release();
    }
  }

  static async getTrendingBlogs() {
    const conn = await pool.getConnection();
    try {
      const [rows] = await conn.execute(
        'SELECT b.*, u.username FROM blogs b JOIN users u ON b.user_id = u.id ORDER BY (b.views + b.likes) DESC LIMIT 10'
      );
      return rows;
    } finally {
      conn.release();
    }
  }

  static async getBlogById(id) {
    const conn = await pool.getConnection();
    try {
      const [rows] = await conn.execute(
        'SELECT b.*, u.username FROM blogs b JOIN users u ON b.user_id = u.id WHERE b.id = ?',
        [id]
      );
      return rows[0];
    } finally {
      conn.release();
    }
  }

  static async incrementViews(blogId) {
    const conn = await pool.getConnection();
    try {
      await conn.execute(
        'UPDATE blogs SET views = views + 1 WHERE id = ?',
        [blogId]
      );
    } finally {
      conn.release();
    }
  }

  static async incrementLikes(blogId) {
    const conn = await pool.getConnection();
    try {
      await conn.execute(
        'UPDATE blogs SET likes = likes + 1 WHERE id = ?',
        [blogId]
      );
    } finally {
      conn.release();
    }
  }

  static async addLikeOnce(blogId, userId) {
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      const [insertResult] = await conn.execute(
        'INSERT IGNORE INTO blog_likes (blog_id, user_id) VALUES (?, ?)',
        [blogId, userId]
      );

      if (insertResult.affectedRows > 0) {
        await conn.execute(
          'UPDATE blogs SET likes = likes + 1 WHERE id = ?',
          [blogId]
        );
      }

      await conn.commit();
      return insertResult.affectedRows > 0;
    } catch (error) {
      await conn.rollback();
      throw error;
    } finally {
      conn.release();
    }
  }

  static async getBlogsByCategory(category) {
    const conn = await pool.getConnection();
    try {
      const [rows] = await conn.execute(
        'SELECT b.*, u.username FROM blogs b JOIN users u ON b.user_id = u.id WHERE b.category = ? ORDER BY b.created_at DESC',
        [category]
      );
      return rows;
    } finally {
      conn.release();
    }
  }
}

module.exports = Blog;
