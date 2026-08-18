"use client";

import { useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FaPlay, FaVolumeMute, FaVolumeUp } from 'react-icons/fa';
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
  {
    src: '/images/gallery-11.jpg',
    alt: 'Jair y Yaneth',
    span: 'normal',
  },
];

const Gallery = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoBlockRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // Sound starts ON: the play tap is the user gesture browsers require
  const handlePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = isMuted;
    video.play();
    setIsPlaying(true);
  };

  const togglePause = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  // Cinematic reveal: the video grows and sharpens as it scrolls into view
  const { scrollYProgress } = useScroll({
    target: videoBlockRef,
    offset: ["start end", "center center"],
  });
  const videoScale = useTransform(scrollYProgress, [0, 1], [0.85, 1]);
  const videoOpacity = useTransform(scrollYProgress, [0, 0.5], [0.35, 1]);
  const videoRadius = useTransform(scrollYProgress, [0, 1], [32, 12]);

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

        <motion.div
          ref={videoBlockRef}
          className="gallery-video"
          style={{
            scale: videoScale,
            opacity: videoOpacity,
            borderRadius: videoRadius,
          }}
        >
          <div className="gallery-img-wrap">
            <video
              ref={videoRef}
              src="/images/gallery-video.mp4"
              poster="/images/gallery-video-poster.jpg"
              preload="metadata"
              playsInline
              onClick={isPlaying ? togglePause : handlePlay}
              onEnded={() => setIsPlaying(false)}
            />
            {!isPlaying && (
              <button
                onClick={handlePlay}
                className="video-play-btn"
                aria-label="Reproducir video"
              >
                <FaPlay />
              </button>
            )}
            {isPlaying && (
              <button
                onClick={toggleMute}
                className="video-mute-btn"
                aria-label={isMuted ? 'Activar sonido' : 'Silenciar'}
              >
                {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
              </button>
            )}
          </div>
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
