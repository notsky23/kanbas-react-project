import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import * as client from './client';
import LoadingScreen from '../Kanbas/LoadingScreen';

// Define the type for the authentication context state
type AuthContextType = {
    user: any;
    setUser: (user: any) => void;
    loading: boolean;
    checkUserSession: () => void;
    clearUserSession: () => void;
    isPublicRoute: () => boolean;
};

const defaultAuthContextValue: AuthContextType = {
    user: null,
    setUser: () => {},
    loading: true,
    checkUserSession: () => {},
    clearUserSession: () => {},
    isPublicRoute: () => false
};

export const AuthContext = createContext<AuthContextType>(defaultAuthContextValue);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();

    const isPublicRoute = useCallback(() => {
        // Make sure these paths are exactly as they should appear in the URL
        const publicPaths = ['/Kanbas/Account/Signin', '/Kanbas/Account/Signup'];
        return publicPaths.includes(location.pathname);
    }, [location.pathname]); 

    const checkUserSession = useCallback(async () => {
        setLoading(true);
        try {
            const data = await client.checkSession();
            setUser(data.user);
        } catch (error) {
            console.error('Error checking session:', error);
            setUser(null);
        }
        setTimeout(() => setLoading(false), 300);
    }, []);

    const clearUserSession = useCallback(() => {
        setLoading(true);
        setUser(null); // Reset user to null
        // setLoading(false); // Ensure loading is also reset
        setTimeout(() => setLoading(false), 300);
        localStorage.clear(); // Clears all local storage data
        sessionStorage.clear(); // Clears all session storage data
    }, []);
    
    useEffect(() => {
        if (!isPublicRoute()) {
            checkUserSession();
        }
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser, loading, checkUserSession, clearUserSession, isPublicRoute }}>
            {!loading ? children : <LoadingScreen /> }
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);