// src/components/Layout.tsx
import React, { ReactNode } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import 'assets/css/layout.css';
import 'assets/scss/layout.scss';
import LightSpot from 'components/LightSpot';
import StaticLightSpot from 'components/StaticLightSpot';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1">
        <div className='main-container container'>
          {children}
        </div>
        <Footer />
      </main>

      {/* Add light spots */}
      <StaticLightSpot size={200} x="50%" y="40%" color="rgba(63, 172, 90, 0.3)" intensity={1}/>
      <LightSpot size={300} x="10%" y="70%" color="rgba(63, 172, 90, 0.2)" blur={5}/>
      <LightSpot size={250} x="85%" y="30%" color="rgba(63, 172, 90, 0.15)" />

    </div>
  );
};

export default Layout;
