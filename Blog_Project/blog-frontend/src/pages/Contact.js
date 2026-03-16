import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/InfoPages.css';

function Contact() {
  return (
    <div>
      <Navbar />
      <main className="info-page">
        <section className="info-card">
          <h1>Contact Us</h1>
          <p>If you have feedback, bug reports, or partnership inquiries, reach us here:</p>
          <div className="contact-list">
            <p><strong>Email:</strong> support@bloghub.com</p>
            <p><strong>Phone:</strong> +1 (555) 018-2026</p>
            <p><strong>Address:</strong> 101 Blog Street, San Francisco, CA</p>
          </div>
          <p>We typically respond within 24-48 hours.</p>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default Contact;
