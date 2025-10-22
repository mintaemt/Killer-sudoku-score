import React from 'react';

export const TestRoute: React.FC = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Test Route Works!</h1>
        <p className="text-muted-foreground">If you can see this, React routing is working.</p>
      </div>
    </div>
  );
};
