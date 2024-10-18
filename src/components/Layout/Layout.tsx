// src/components/Layout.tsx
import React, { ReactNode } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import 'assets/css/layout.css';
import 'assets/scss/layout.scss';

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


    </div>
  );
};

export default Layout;
