"use client";

import { motion } from 'framer-motion';
import './Gallery.css';

const PHOTOS = [
  {
    src: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop',
    alt: 'Pareja en el campo',
    span: 'tall',
  },
  {
    src: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=80&w=800&auto=format&fit=crop',
    alt: 'Momento especial',
    span: 'normal',
  },
  {
    src: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?q=80&w=800&auto=format&fit=crop',
    alt: 'Detalles de boda',
    span: 'normal',
  },
  {
    src: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=800&auto=format&fit=crop',
    alt: 'Juntos',
    span: 'wide',
  },
  {
    src: 'https://images.unsplash.com/photo-1529634597503-139d3726fed5?q=80&w=800&auto=format&fit=crop',
    alt: 'Naturaleza y amor',
    span: 'normal',
  },
  {
    src: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=80&w=800&auto=format&fit=crop',
    alt: 'Atardecer romántico',
    span: 'tall',
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
          {PHOTOS.map((photo, index) => (
            <motion.div
              key={index}
              className={`gallery-item gallery-item--${photo.span}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className="gallery-img-wrap">
                <img
                  src={photo.src}
                  alt={photo.alt}
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
