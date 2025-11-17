
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="text-center py-6 mb-6">
      <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
        Serene Sphere
      </h1>
      <p className="text-slate-400 mt-2">Your personal AI-powered meditation guide</p>
    </header>
  );
};

export default Header;
