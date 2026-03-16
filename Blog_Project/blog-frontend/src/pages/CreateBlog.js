import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';
import '../styles/Blog.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function CreateBlog() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Technology');
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [previewType, setPreviewType] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setImage(file || null);
    setPreviewUrl(file ? URL.createObjectURL(file) : '');
    setPreviewType(file?.type || '');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
      formData.append('category', category);
      if (image) {
        formData.append('image', image);
      }

      await api.post(
        '/blogs',
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess('Blog created successfully!');
      setTimeout(() => navigate('/home'), 2000);
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Error creating blog');
    }
  };

  return (
    <div>
      <Navbar />
      <div className="create-blog-container">
        <div className="create-blog-box">
          <h2>Create New Blog</h2>
          {error && <p className="error">{error}</p>}
          {success && <p className="success">{success}</p>}
          
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Blog Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            <select 
              value={category} 
              onChange={(e) => setCategory(e.target.value)}
            >
              <option>Technology</option>
              <option>Lifestyle</option>
              <option>Travel</option>
              <option>Food</option>
              <option>Business</option>
            </select>

            <textarea
              placeholder="Blog Content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows="10"
              required
            />

            <div className="image-upload-group">
              <label htmlFor="blog-image">Blog Image/Video (optional, max 1GB)</label>
              <input
                id="blog-image"
                type="file"
                accept="image/*,video/*"
                onChange={handleImageChange}
              />
              {previewUrl && (
                previewType.startsWith('video/')
                  ? (
                    <video className="image-preview" src={previewUrl} controls />
                    )
                  : (
                    <img className="image-preview" src={previewUrl} alt="Selected blog preview" />
                    )
              )}
            </div>

            <button type="submit">Publish Blog</button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default CreateBlog;
