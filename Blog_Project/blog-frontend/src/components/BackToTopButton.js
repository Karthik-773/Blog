import React, { useEffect, useState } from 'react';
import '../styles/BackToTop.css';

function BackToTopButton() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setShow(window.scrollY > 280);
    };

    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!show) {
    return null;
  }

  return (
    <button
      type="button"
      className="back-to-top"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Back to top"
    >
      ↑
    </button>
  );
}

export default BackToTopButton;
