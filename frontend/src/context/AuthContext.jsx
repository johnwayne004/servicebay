import React, { createContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosConfig';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();

    const [authTokens, setAuthTokens] = useState(() => {
        const tokens = localStorage.getItem('authTokens');
        return tokens ? JSON.parse(tokens) : null;
    });
    
    const [user, setUser] = useState(() => {
        const tokens = localStorage.getItem('authTokens');
        if (tokens) {
            try {
                return jwtDecode(JSON.parse(tokens).access);
            } catch (e) {
                console.error("Invalid token in localStorage:", e);
                localStorage.removeItem('authTokens');
                return null;
            }
        }
        return null;
    });

    const [loading, setLoading] = useState(true);

    const loginUser = async (email, password) => {
        try {
            const response = await axiosInstance.post('/token/', {
                email,
                password
            });

            if (response.status === 200) {
                const data = response.data;
                const decodedUser = jwtDecode(data.access);

                setAuthTokens(data);
                setUser(decodedUser);
                localStorage.setItem('authTokens', JSON.stringify(data));

                const userRole = decodedUser.user_role;
                localStorage.setItem('userRole', userRole);

                if (userRole === 'customer') navigate('/dashboard/customer');
                else if (userRole === 'technician') navigate('/dashboard/mechanic');
                else if (userRole === 'admin') navigate('/dashboard/admin');
                else navigate('/'); 

                return { success: true };
            }
        } catch (error) {
            console.error('Login error in AuthContext:', error);
            throw error;
        }
    };

    const logoutUser = useCallback(() => {
        setAuthTokens(null);
        setUser(null);
        localStorage.removeItem('authTokens');
        localStorage.removeItem('userRole');
        navigate('/login');
    }, [navigate]);

    // --- THIS IS THE DEFINITIVE FIX ---
    const updateToken = useCallback(async () => {
        const currentAuthTokens = JSON.parse(localStorage.getItem('authTokens'));
        if (!currentAuthTokens?.refresh) {
            console.log("No refresh token, logging out.");
            logoutUser();
            return;
        }

        try {
            console.log("Attempting to refresh token...");
            const response = await axiosInstance.post('/token/refresh/', {
                refresh: currentAuthTokens.refresh
            });

            if (response.status === 200) {
                const data = response.data; // This contains { "access": "..." }
                const decodedUser = jwtDecode(data.access);
                
                // Create a new token object that keeps the old refresh token
                const newAuthTokens = {
                    access: data.access,
                    refresh: currentAuthTokens.refresh // Persist the old refresh token
                };
                
                setAuthTokens(newAuthTokens);
                setUser(decodedUser);
                localStorage.setItem('authTokens', JSON.stringify(newAuthTokens));
                console.log("Token refreshed successfully.");
            } else {
                logoutUser();
            }
        } catch (error) {
            console.error("Token refresh failed:", error);
            logoutUser();
        }
    }, [logoutUser]);
    // --- END FIX ---

    useEffect(() => {
        if (loading) {
            setLoading(false);
        }

        // Proactive refresh: 4 minutes
        const fourMinutes = 1000 * 60 * 4; 
        
        let interval = setInterval(() => {
            if (authTokens) {
                updateToken();
            }
        }, fourMinutes);

        return () => clearInterval(interval);

    }, [authTokens, loading, updateToken]);

    const contextData = {
        user,
        authTokens,
        loginUser,
        logoutUser,
    };

    return (
        <AuthContext.Provider value={contextData}>
            {loading ? null : children} 
        </AuthContext.Provider>
    );
};

