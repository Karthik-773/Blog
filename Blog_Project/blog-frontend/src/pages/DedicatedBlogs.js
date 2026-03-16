import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/client';
import '../styles/DedicatedBlog.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { isVideoMedia, resolveMediaUrl } from '../utils/media';

function DedicatedBlog() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likeMessage, setLikeMessage] = useState('');

  useEffect(() => {
    const loadBlog = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/blogs/${id}`);
        setBlog(response.data);

        const viewKey = `viewed_blog_${id}`;
        if (!sessionStorage.getItem(viewKey)) {
          try {
            await api.put(`/blogs/${id}/view`);
            sessionStorage.setItem(viewKey, 'true');
          } catch (err) {
            console.error('Error counting view', err);
          }
        }
      } catch (err) {
        console.error('Error fetching blog', err);
      } finally {
        setLoading(false);
      }
    };

    loadBlog();
  }, [id]);

  const fetchBlog = async () => {
    try {
      const response = await api.get(`/blogs/${id}`);
      setBlog(response.data);
    } catch (err) {
      console.error('Error fetching blog', err);
    }
  };

  const handleLike = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.put(`/blogs/${id}/like`, {}, { headers: { Authorization: `Bearer ${token}` } });
      setLiked(true);
      setLikeMessage(response.data?.message || 'Liked');
      fetchBlog();
    } catch (err) {
      console.error('Error liking blog', err);
    }
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="blog-container">
          <article className="blog-detail skeleton-detail">
            <div className="skeleton skeleton-title" />
            <div className="skeleton skeleton-chip-row" />
            <div className="skeleton skeleton-image" />
            <div className="skeleton skeleton-line" />
            <div className="skeleton skeleton-line" />
            <div className="skeleton skeleton-line short" />
          </article>
        </div>
        <Footer />
      </div>
    );
  }

  if (!blog) {
    return <div>Blog not found</div>;
  }

  return (
    <div>
      <Navbar />
      <div className="blog-container">
        <article className="blog-detail">
          <h1>{blog.title}</h1>
          <div className="blog-header">
            <span>By {blog.username}</span>
            <span>{new Date(blog.created_at).toLocaleDateString()}</span>
            <span>Category: {blog.category}</span>
          </div>
          {blog.image_url && (
            isVideoMedia(blog.image_url)
              ? (
                <video className="blog-hero-image" src={resolveMediaUrl(blog.image_url)} controls />
                )
              : (
                <img className="blog-hero-image" src={resolveMediaUrl(blog.image_url)} alt={blog.title} />
                )
          )}
          <div className="blog-content">{blog.content}</div>
          <div className="blog-footer">
            <button onClick={handleLike} disabled={liked}>
              {liked ? '❤️ Liked' : '🤍 Like'} ({blog.likes})
            </button>
            <span>Views: {blog.views}</span>
          </div>
          {likeMessage && <p className="blog-note">{likeMessage}</p>}
        </article>
      </div>
      <Footer />
    </div>
  );
}

export default DedicatedBlog;
