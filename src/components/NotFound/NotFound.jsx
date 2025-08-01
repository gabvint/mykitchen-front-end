import React from 'react'

const NotFound = () => {
    return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow text-center">
        <h1 className="text-4xl font-bold text-yellow-600 mb-2">404 Not Found</h1>
        <p className="text-gray-600">The page you are looking for does not exist.</p>
      </div>
    </div>
  );
}

export default NotFound
