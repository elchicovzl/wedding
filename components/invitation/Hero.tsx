"use client";

import { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { FaHeart } from 'react-icons/fa';
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import './Hero.css';

interface HeroProps {
  brideName: string;
  groomName: string;
  weddingDate: string;
  locationDetails: string;
}

/* Inline SVG botanical branch for decorative corners */
const OliveBranch = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 200 120"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M10 100 Q 60 90, 100 60 T 190 20"
      stroke="currentColor"
      strokeWidth="1.5"
      fill="none"
      strokeLinecap="round"
    />
    {/* Leaves along the branch */}
    <ellipse cx="50" cy="88" rx="12" ry="6" transform="rotate(-30 50 88)" fill="currentColor" opacity="0.5" />
    <ellipse cx="70" cy="78" rx="10" ry="5" transform="rotate(-40 70 78)" fill="currentColor" opacity="0.4" />
    <ellipse cx="95" cy="62" rx="13" ry="6" transform="rotate(-25 95 62)" fill="currentColor" opacity="0.5" />
    <ellipse cx="120" cy="48" rx="11" ry="5" transform="rotate(-35 120 48)" fill="currentColor" opacity="0.4" />
    <ellipse cx="145" cy="36" rx="12" ry="6" transform="rotate(-20 145 36)" fill="currentColor" opacity="0.5" />
    <ellipse cx="170" cy="26" rx="10" ry="5" transform="rotate(-30 170 26)" fill="currentColor" opacity="0.4" />
    {/* Opposite side leaves */}
    <ellipse cx="40" cy="96" rx="10" ry="5" transform="rotate(20 40 96)" fill="currentColor" opacity="0.35" />
    <ellipse cx="80" cy="72" rx="11" ry="5" transform="rotate(25 80 72)" fill="currentColor" opacity="0.3" />
    <ellipse cx="110" cy="54" rx="10" ry="5" transform="rotate(30 110 54)" fill="currentColor" opacity="0.35" />
    <ellipse cx="155" cy="30" rx="10" ry="5" transform="rotate(20 155 30)" fill="currentColor" opacity="0.3" />
  </svg>
);

const LeafSprig = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 80 160"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M40 150 Q 38 100, 40 50 T 42 10"
      stroke="currentColor"
      strokeWidth="1.2"
      fill="none"
      strokeLinecap="round"
    />
    <ellipse cx="30" cy="120" rx="14" ry="6" transform="rotate(-50 30 120)" fill="currentColor" opacity="0.45" />
    <ellipse cx="52" cy="100" rx="13" ry="5" transform="rotate(40 52 100)" fill="currentColor" opacity="0.4" />
    <ellipse cx="28" cy="80" rx="12" ry="5" transform="rotate(-45 28 80)" fill="currentColor" opacity="0.45" />
    <ellipse cx="54" cy="60" rx="11" ry="5" transform="rotate(50 54 60)" fill="currentColor" opacity="0.4" />
    <ellipse cx="32" cy="40" rx="10" ry="4" transform="rotate(-40 32 40)" fill="currentColor" opacity="0.35" />
  </svg>
);

const Hero = ({ brideName, groomName, weddingDate, locationDetails }: HeroProps) => {
  const [init, setInit] = useState(false);
  const heroRef = useRef<HTMLElement>(null);

  // Parallax scroll
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const decorY = useTransform(scrollYProgress, [0, 1], [0, -40]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 20]);

  // Mouse/touch tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { stiffness: 50, damping: 20 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // Parallax transforms based on mouse position (different depths)
  const decorMoveX = useTransform(smoothX, [-1, 1], [-15, 15]);
  const decorMoveY = useTransform(smoothY, [-1, 1], [-10, 10]);
  const farMoveX = useTransform(smoothX, [-1, 1], [-8, 8]);
  const farMoveY = useTransform(smoothY, [-1, 1], [-5, 5]);

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (!heroRef.current) return;
      const rect = heroRef.current.getBoundingClientRect();
      // Normalize to -1..1
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      mouseX.set(nx);
      mouseY.set(ny);
    };

    const el = heroRef.current;
    el?.addEventListener('pointermove', handlePointerMove);
    return () => el?.removeEventListener('pointermove', handlePointerMove);
  }, [mouseX, mouseY]);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const particlesOptions = {
    background: { color: { value: "transparent" } },
    fpsLimit: 60,
    interactivity: {
      events: {
        onHover: {
          enable: true,
          mode: "grab" as const,
        },
        onClick: {
          enable: true,
          mode: "push" as const,
        },
      },
      modes: {
        grab: {
          distance: 140,
          links: {
            opacity: 0.4,
            color: "#D4AF37",
          },
        },
        push: {
          quantity: 3,
        },
      },
    },
    particles: {
      color: { value: "#EBD999" },
      links: {
        enable: false,
      },
      move: {
        direction: "top" as const,
        enable: true,
        outModes: { default: "out" as const },
        random: true,
        speed: 0.8,
        straight: false,
      },
      number: {
        density: { enable: true },
        value: 55,
      },
      opacity: {
        value: { min: 0.1, max: 0.6 },
      },
      shape: { type: "circle" },
      size: {
        value: { min: 1, max: 5 },
      },
    },
    detectRetina: true,
  };

  return (
    <section className="hero-section" ref={heroRef}>
      {/* Background layer — slowest parallax */}
      <motion.div className="hero-bg-layer" style={{ y: bgY }} />

      {/* Particles */}
      {init && (
        <Particles
          id="tsparticles"
          options={particlesOptions}
          className="particles-container"
        />
      )}

      <div className="hero-overlay"></div>

      {/* Decorative botanical layer — medium parallax + mouse */}
      <motion.div
        className="hero-botanical-layer"
        style={{
          y: decorY,
          x: decorMoveX,
          translateY: decorMoveY,
        }}
      >
        <OliveBranch className="botanical botanical-top-left" />
        <OliveBranch className="botanical botanical-top-right" />
        <LeafSprig className="botanical botanical-left" />
        <LeafSprig className="botanical botanical-right" />
        <OliveBranch className="botanical botanical-bottom-left" />
        <OliveBranch className="botanical botanical-bottom-right" />
      </motion.div>

      {/* Far decorative elements — subtle mouse only */}
      <motion.div
        className="hero-far-botanical-layer"
        style={{
          x: farMoveX,
          y: farMoveY,
        }}
      >
        <LeafSprig className="botanical botanical-far-left" />
        <LeafSprig className="botanical botanical-far-right" />
      </motion.div>

      {/* Content layer — minimal parallax */}
      <motion.div className="hero-content" style={{ y: contentY }}>
        <motion.div
          className="save-the-date sans-font"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          Reserva la fecha
        </motion.div>

        <motion.div
          className="couple-names script-font"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          <span>{brideName}</span>
          <span className="name-separator">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <FaHeart className="heart-icon" />
            </motion.div>
          </span>
          <span>{groomName}</span>
        </motion.div>

        <motion.div
          className="wedding-date"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
        >
          {weddingDate}
        </motion.div>

        <motion.div
          className="wedding-location sans-font"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
        >
          {locationDetails}
        </motion.div>

        <motion.div
          className="scroll-indicator"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2 }}
        >
          <motion.div
            className="mouse"
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
          >
            <div className="wheel"></div>
          </motion.div>
          <span className="sans-font">Deslizar para ver más</span>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
