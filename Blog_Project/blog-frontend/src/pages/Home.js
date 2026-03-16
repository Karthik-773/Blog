import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';
import '../styles/Home.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { isVideoMedia, resolveMediaUrl } from '../utils/media';

function Home() {
  const [trendingBlogs, setTrendingBlogs] = useState([]);
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
      setTrendingBlogs(response.data);
    } catch (err) {
      console.error('Error fetching trending blogs', err);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['All', ...new Set(trendingBlogs.map((blog) => blog.category).filter(Boolean))];
  const visibleBlogs = activeCategory === 'All'
    ? trendingBlogs
    : trendingBlogs.filter((blog) => blog.category === activeCategory);
  const totalViews = trendingBlogs.reduce((sum, blog) => sum + (blog.views || 0), 0);
  const totalLikes = trendingBlogs.reduce((sum, blog) => sum + (blog.likes || 0), 0);

  return (
    <div>
      <Navbar />
      <section className="banner">
        <p className="banner-kicker">CREATOR HUB</p>
        <h1>Stories that move people, ideas that scale.</h1>
        <p>Explore trending voices, fresh insights, and media-rich blogs from your community.</p>
        <div className="banner-stats">
          <div className="banner-stat">
            <strong>{trendingBlogs.length}</strong>
            <span>Trending Posts</span>
          </div>
          <div className="banner-stat">
            <strong>{totalViews}</strong>
            <span>Total Views</span>
          </div>
          <div className="banner-stat">
            <strong>{totalLikes}</strong>
            <span>Total Likes</span>
          </div>
        </div>
      </section>
      
      <div className="container">
        <section className="categories">
          <h2>Filter By Category</h2>
          <div className="category-list">
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
        </section>

        <section className="trending">
          <h2>{activeCategory === 'All' ? 'Trending Blogs' : `${activeCategory} Blogs`}</h2>
          <div className="blog-grid">
            {loading && Array.from({ length: 6 }).map((_, index) => (
              <div key={`home-skeleton-${index}`} className="blog-card skeleton-card">
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
                className="blog-card"
                onClick={() => navigate(`/blog/${blog.id}`)}
                style={{ animationDelay: `${index * 60}ms` }}
              >
                {blog.image_url && (
                  isVideoMedia(blog.image_url)
                    ? (
                      <video className="blog-card-image" src={resolveMediaUrl(blog.image_url)} controls />
                      )
                    : (
                      <img className="blog-card-image" src={resolveMediaUrl(blog.image_url)} alt={blog.title} />
                      )
                )}
                <span className="blog-pill">{blog.category || 'General'}</span>
                <h3>{blog.title}</h3>
                <p>{blog.content.substring(0, 100)}...</p>
                <div className="blog-card-meta">
                  <small>By {blog.username}</small>
                  <small>{blog.views} views</small>
                  <small>{blog.likes} likes</small>
                </div>
              </div>
            ))}
          </div>
          {visibleBlogs.length === 0 && (
            <div className="empty-state">No blogs found for this category yet.</div>
          )}
        </section>
      </div>
      
      <Footer />
    </div>
  );
}

export default Home;
