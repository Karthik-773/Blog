const Blog = require('../models/Blog');

exports.createBlog = async (req, res) => {
  try {
    const { title, content, category } = req.body;
    const userId = req.user.userId;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }

    await Blog.create(userId, title, content, category, imageUrl);
    res.status(201).json({ message: 'Blog created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error creating blog', error: error.message });
  }
};

exports.getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.getAllBlogs();
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching blogs', error: error.message });
  }
};

exports.getTrendingBlogs = async (req, res) => {
  try {
    const blogs = await Blog.getTrendingBlogs();
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching trending blogs', error: error.message });
  }
};

exports.getBlogById = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.getBlogById(id);
    
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    
    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching blog', error: error.message });
  }
};

exports.trackView = async (req, res) => {
  try {
    const { id } = req.params;
    await Blog.incrementViews(id);
    res.json({ message: 'View counted' });
  } catch (error) {
    res.status(500).json({ message: 'Error counting view', error: error.message });
  }
};

exports.likeBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    const liked = await Blog.addLikeOnce(id, userId);
    if (!liked) {
      return res.status(200).json({ message: 'You already liked this blog', liked: false });
    }
    res.json({ message: 'Blog liked', liked: true });
  } catch (error) {
    res.status(500).json({ message: 'Error liking blog', error: error.message });
  }
};

exports.getBlogsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const blogs = await Blog.getBlogsByCategory(category);
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching blogs', error: error.message });
  }
};
