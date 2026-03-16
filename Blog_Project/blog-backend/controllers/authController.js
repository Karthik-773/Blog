const User = require('../models/User');
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.register = async (req, res) => {
  try {
    const { username, email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const existingUsername = await User.findByUsername(username);
    if (existingUsername) {
      return res.status(400).json({ message: 'Username already taken' });
    }

    await User.create(username, email, password);
    res.status(201).json({ message: 'User registered successfully. Please login.' });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(400).json({ message: 'User not found. Please register.' });
    }

    const validPassword = await User.verifyPassword(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });

    res.json({ 
      message: 'Login successful', 
      token, 
      user: { id: user.id, username: user.username, email: user.email } 
    });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
};
