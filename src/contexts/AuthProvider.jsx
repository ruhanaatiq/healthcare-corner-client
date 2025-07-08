import React, { useState, useEffect } from 'react';
import { AuthContext } from './AuthContext'; // Import your AuthContext
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, updateProfile, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../../src/firebase/firebase.init'; // Import your Firebase initialization
import useAuth from '../hooks/useAuth';
const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); // User state to manage the current user
    const [loading, setLoading] = useState(true); // Loading state to show loading indicators

    const createUser = (email, password) => {
        setLoading(true);
        return createUserWithEmailAndPassword(auth, email, password);
    };

    const signIn = (email, password) => {
        setLoading(true);
        return signInWithEmailAndPassword(auth, email, password);
    };

    const signInWithGoogle = () => {
        setLoading(true);
        return signInWithPopup(auth, googleProvider);
    };

    const updateUserProfile = (profileInfo) => {
        return updateProfile(auth.currentUser, profileInfo);
    };

    const logOut = () => {
        setLoading(true);
        return signOut(auth);
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser); // Set user data when authentication state changes
            setLoading(false);
        });

        return () => {
            unsubscribe();
        };
    }, []);

    // Expose functions and user data via context
    const authInfo = {
        user,
        loading,
        createUser,
        signIn,
        signInWithGoogle,
        updateUserProfile,
        logOut
    };

    return (
        <AuthContext.Provider value={authInfo}> {/* Use .Provider */}
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider; // Ensure AuthProvider is exported as default
export { useAuth }; // Export useAuth for use in other components
