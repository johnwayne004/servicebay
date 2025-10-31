import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useContext(AuthContext);
    const location = useLocation();

    if (loading) {
        return <div>Loading authentication...</div>;
    }

    if (!user && location.pathname !== '/login') {
        // Only redirect if we're NOT already on the login page
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;
