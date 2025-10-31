import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import styled from 'styled-components';
import tokens from '../styles/tokens';

// A simple loading component to show while auth state is being checked
const LoadingWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100vh - 60px);
  background-color: ${tokens.colors.pageBg};
  color: ${tokens.colors.textPrimary};
`;

const RoleProtectedRoute = ({ children, allowedRoles }) => {
    const { user, loading } = useContext(AuthContext);
    const location = useLocation();

    // --- THIS IS THE FIX ---
    // The key MUST be 'technician' to match the user role from the database.
    const roleDashboardMap = {
        admin: '/dashboard/admin',
        technician: '/dashboard/mechanic', // Was 'mechanic'
        customer: '/dashboard/customer',
    };
    // --- END FIX ---

    // 1. Wait for the AuthContext to finish loading
    if (loading) {
        return <LoadingWrapper><p>Loading authentication...</p></LoadingWrapper>;
    }

    // 2. If not loading and no user, redirect to login
    if (!user) {
        // We pass the current location so the user can be redirected back after login.
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // 3. The user is logged in, now check their role.
    const userRole = user.user_role;

    // 4. Check if the user's role is in the list of allowed roles for this route.
    if (allowedRoles && !allowedRoles.includes(userRole)) {
        // Access Denied: Redirect them to their *own* dashboard, not the homepage.
        const homePath = roleDashboardMap[userRole] || '/';
        console.warn(`Access denied for role '${userRole}' on path '${location.pathname}'. Redirecting to ${homePath}.`);
        return <Navigate to={homePath} replace />;
    }

    // 5. Access Granted: Render the component.
    return children;
};

export default RoleProtectedRoute;

