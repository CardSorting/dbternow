import React from 'react';
import Navbar from './Navbar';
import { Outlet } from 'react-router-dom';

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
      <footer className="bg-blue-600 text-white p-4">
        <div className="container mx-auto text-center">
          <p className="text-sm">
            DBT Journey - Gamified Learning Experience. © {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
