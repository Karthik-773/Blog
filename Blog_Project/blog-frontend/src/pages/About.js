import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/InfoPages.css';

function About() {
  return (
    <div>
      <Navbar />
      <main className="info-page">
        <section className="info-card">
          <h1>About BlogHub</h1>
          <p>
            BlogHub is a community-driven platform where creators can publish stories, tutorials,
            insights, and media-rich posts.
          </p>
          <p>
            Our goal is to make sharing knowledge simple while keeping the reading experience fast,
            clean, and engaging.
          </p>
          <h2>What You Can Do</h2>
          <ul>
            <li>Create blogs with text, images, and videos.</li>
            <li>Discover trending content from other writers.</li>
            <li>Like posts you enjoy and grow your profile.</li>
          </ul>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default About;
