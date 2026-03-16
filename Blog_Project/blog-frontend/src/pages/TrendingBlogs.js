import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';
import '../styles/Blog.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { isVideoMedia, resolveMediaUrl } from '../utils/media';

function TrendingBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const navigate = useNavigate();

  useEffect(() => {
    fetchTrendingBlogs();
  }, []);

  const fetchTrendingBlogs = async () => {
    setLoading(true);
    try {
      const response = await api.get('/blogs/trending');
      setBlogs(response.data);
    } catch (err) {
      console.error('Error fetching trending blogs', err);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['All', ...new Set(blogs.map((blog) => blog.category).filter(Boolean))];
  const visibleBlogs = activeCategory === 'All'
    ? blogs
    : blogs.filter((blog) => blog.category === activeCategory);

  return (
    <div>
      <Navbar />
      <div className="container">
        <h1>Trending Blogs</h1>
        <p className="page-subtitle">Read what the community is engaging with right now.</p>
        <div className="category-list category-list-inline">
          {categories.map((category) => (
            <button
              key={category}
              className={activeCategory === category ? 'active' : ''}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
        <div className="blog-list">
          {loading && Array.from({ length: 4 }).map((_, index) => (
            <div key={`trending-skeleton-${index}`} className="blog-item skeleton-card">
              <div className="skeleton skeleton-image" />
              <div className="skeleton skeleton-pill" />
              <div className="skeleton skeleton-line" />
              <div className="skeleton skeleton-line short" />
              <div className="skeleton skeleton-chip-row" />
            </div>
          ))}
          {visibleBlogs.map((blog, index) => (
            <div
              key={blog.id}
              className="blog-item"
              onClick={() => navigate(`/blog/${blog.id}`)}
              style={{ animationDelay: `${index * 65}ms` }}
            >
              {blog.image_url && (
                isVideoMedia(blog.image_url)
                  ? (
                    <video className="blog-item-image" src={resolveMediaUrl(blog.image_url)} controls />
                    )
                  : (
                    <img className="blog-item-image" src={resolveMediaUrl(blog.image_url)} alt={blog.title} />
                    )
              )}
              <span className="blog-pill">{blog.category || 'General'}</span>
              <h2>{blog.title}</h2>
              <p>{blog.content.substring(0, 150)}...</p>
              <div className="blog-meta">
                <span>By {blog.username}</span>
                <span>Views: {blog.views}</span>
                <span>Likes: {blog.likes}</span>
              </div>
            </div>
          ))}
        </div>
        {visibleBlogs.length === 0 && (
          <div className="empty-state">No trending blogs in this category yet.</div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default TrendingBlogs;
