import React from 'react'

const Forbidden = () => {

    return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow text-center">
        <h1 className="text-4xl font-bold text-red-600 mb-2">403 Forbidden</h1>
        <p className="text-gray-600">You do not have permission to access this page.</p>
      </div>
    </div>
  );
  
}

export default Forbidden
