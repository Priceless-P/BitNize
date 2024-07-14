import React from 'react';
import { Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';


const ProtectedRoute = ({ children }) => {
  const user = JSON.parse(sessionStorage.getItem('user'));

  if (!user) {
    toast.error('You are not logged in');
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
