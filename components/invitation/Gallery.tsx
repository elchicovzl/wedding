"use client";

import { motion } from 'framer-motion';
import './Gallery.css';

const MEDIA = [
  {
    src: '/images/gallery-1.jpg',
    alt: 'Jair y Yaneth',
    span: 'tall',
  },
  {
    src: '/images/gallery-2.jpg',
    alt: 'Save the date',
    span: 'wide',
  },
  {
    src: '/images/gallery-3.jpg',
    alt: 'Juntos',
    span: 'tall',
  },
  {
    src: '/images/gallery-4.jpg',
    alt: 'Momento especial',
    span: 'normal',
  },
  {
    src: '/images/gallery-5.jpg',
    alt: 'Jair y Yaneth',
    span: 'wide',
  },
  {
    src: '/images/gallery-6.jpg',
    alt: 'Yaneth',
    span: 'tall',
  },
  {
    src: '/images/gallery-7.jpg',
    alt: 'Jair',
    span: 'tall',
  },
  {
    src: '/images/gallery-8.jpg',
    alt: 'Juntos',
    span: 'normal',
  },
  {
    src: '/images/gallery-9.jpg',
    alt: 'Anillos',
    span: 'normal',
  },
  {
    src: '/images/gallery-10.jpg',
    alt: 'Bailando',
    span: 'wide',
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
          <h2 className="script-font gallery-title">Estás invitado</h2>
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
                <img
                  src={item.src}
                  alt={item.alt}
                  loading="lazy"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Gallery;
