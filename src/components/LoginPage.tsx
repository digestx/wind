import React from 'react';

interface LoginPageProps {
  onLogin: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      {/* Add your login form here */}
      <button 
        onClick={onLogin}
        className="p-button p-component"
      >
        Simulate Login
      </button>
    </div>
  );
};

export default LoginPage; 