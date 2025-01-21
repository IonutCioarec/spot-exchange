// src/components/Layout.tsx
import React, { ReactNode } from 'react';
import 'react-awesome-button/dist/styles.css';
import { Header } from './Header';
import { Footer } from './Footer';
import 'assets/css/layout.css';
import 'assets/scss/layout.scss';
import LightSpot from 'components/LightSpot';
import StaticLightSpot from 'components/StaticLightSpot';
import aux1 from 'assets/img/aux1.png';
import aux2 from 'assets/img/aux2.png';
import { motion } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      {/* Animate the auxiliary elements */}
      <motion.img
        src={aux1}
        alt="Aux 1"
        className="absolute"
        initial={{ scale: 0.5 }}
        animate={{ scale: 0.8 }}
        transition={{
          duration: 3,
          ease: "easeInOut",
          repeatType: "mirror",
          repeat: Infinity,
        }}
        style={{
          width: '7vw',
          height: '7vw',
          top: '25%',
          left: '3%'
        }}
      />

      <main>
        <div className='main-container container'>
          {children}
        </div>
        <Footer />
      </main>

      <Toaster
        toastOptions={{
          position: 'top-right',
          style: {
            padding: '16px',
            color: '#fff',
            background: '#333',
          },
          error: {
            style: {
              border: '1px solid rgb(238, 60, 60)',
            },
          },
          success: {
            style: {
              border: '1px solid rgba(63, 172, 90, 0.5)',
            },
          },
        }}
      />

    </div>
  );
};

export default Layout;
