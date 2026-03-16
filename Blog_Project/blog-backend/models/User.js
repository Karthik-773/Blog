const pool = require('../config/db');
const bcrypt = require('bcryptjs');

class User {
  static async create(username, email, password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const conn = await pool.getConnection();
    try {
      const [result] = await conn.execute(
        'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
        [username, email, hashedPassword]
      );
      return result;
    } finally {
      conn.release();
    }
  }

  static async findByEmail(email) {
    const conn = await pool.getConnection();
    try {
      const [rows] = await conn.execute(
        'SELECT * FROM users WHERE email = ?',
        [email]
      );
      return rows[0];
    } finally {
      conn.release();
    }
  }

  static async findByUsername(username) {
    const conn = await pool.getConnection();
    try {
      const [rows] = await conn.execute(
        'SELECT * FROM users WHERE username = ?',
        [username]
      );
      return rows[0];
    } finally {
      conn.release();
    }
  }

  static async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
}

module.exports = User;