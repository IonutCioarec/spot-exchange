import { motion } from 'framer-motion';
import React, { useState, useEffect } from 'react';

interface ThunderProps {
  leftM: number;
}

const ThunderEffect: React.FC<ThunderProps> = ({leftM}) => {
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{
          opacity: [0, 1, 0],
          scaleX: [1, 1.3, 1.1],
          scaleY: [1, 1.2, 1.05],
        }}
        transition={{
          duration: 1,
          ease: 'easeInOut',
          repeat: Infinity,
          repeatDelay: 3,
        }}
        style={{
          position: 'absolute',
          top: 5 + Math.random() * window.innerHeight,
          left: `${leftM}%`,
          width: '50px',
          height: '50px',
          backgroundColor: 'rgba(63, 172, 90, 1)',
          filter: 'blur(60px)',
          borderRadius: '150px',
          zIndex: -1,
        }}
      />
    </>
  );
};

export default ThunderEffect;
