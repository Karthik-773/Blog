const express = require('express');
const blogController = require('../controllers/blogController');
const authenticateToken = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

router.post('/', authenticateToken, upload.single('image'), blogController.createBlog);
router.get('/', blogController.getAllBlogs);
router.get('/trending', blogController.getTrendingBlogs);
router.get('/category/:category', blogController.getBlogsByCategory);
router.get('/:id', blogController.getBlogById);
router.put('/:id/view', blogController.trackView);
router.put('/:id/like', authenticateToken, blogController.likeBlog);


module.exports = router;
