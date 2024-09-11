
import React from 'react';

const ForbiddenPage: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">403 Forbidden</h1>
        <p className="text-lg">You do not have access to this page.</p>
      </div>
    </div>
  );
};

export default ForbiddenPage;
