import React from 'react';

const BackgroundEffects: React.FC = () => {
  return (
    <>
      {/* Subtle blue gradient from top left */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-transparent to-transparent"></div>

      {/* Very subtle static background elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/2 rounded-full blur-3xl"></div>
      <div className="absolute top-20 left-20 w-64 h-64 bg-blue-400/1 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-20 w-80 h-80 bg-purple-500/1 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-blue-300/1 rounded-full blur-3xl"></div>
    </>
  );
};

export default BackgroundEffects; 