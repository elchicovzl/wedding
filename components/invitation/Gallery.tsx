"use client";

import { motion } from 'framer-motion';
import './Gallery.css';

const MEDIA = [
  {
    src: '/images/gallery-4.jpg',
    alt: 'Milena y Miguel',
    span: 'tall',
    type: 'image' as const,
  },
  {
    src: '/images/gallery-2.jpg',
    alt: 'Momento especial',
    span: 'normal',
    type: 'image' as const,
  },
  {
    src: '/images/gallery-1.jpg',
    alt: 'Juntos',
    span: 'normal',
    type: 'image' as const,
  },
  {
    src: '/images/gallery-video.mp4',
    alt: 'Video',
    span: 'wide',
    type: 'video' as const,
  },
  {
    src: '/images/gallery-3.jpg',
    alt: 'Nuestra historia',
    span: 'wide',
    type: 'image' as const,
  },
  {
    src: '/images/gallery-5.jpg',
    alt: 'Amor',
    span: 'tall',
    type: 'image' as const,
  },
  {
    src: '/images/gallery-6.jpg',
    alt: 'Milena y Miguel',
    span: 'normal',
    type: 'image' as const,
  },
];

const Gallery = () => {
  return (
    <section className="section gallery-section" id="gallery">
      <div className="container">
        <motion.div
          className="gallery-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="script-font gallery-title">Nuestra Historia</h2>
          <p className="sans-font gallery-subtitle">Momentos que atesoramos</p>
        </motion.div>

        <div className="gallery-grid">
          {MEDIA.map((item, index) => (
            <motion.div
              key={index}
              className={`gallery-item gallery-item--${item.span}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className="gallery-img-wrap">
                {item.type === 'video' ? (
                  <video
                    src={item.src}
                    autoPlay
                    muted
                    loop
                    playsInline
                  />
                ) : (
                  <img
                    src={item.src}
                    alt={item.alt}
                    loading="lazy"
                  />
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Gallery;
