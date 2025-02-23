import React, { createContext, useState, useEffect } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const userCookie = document.cookie.split('; ').find(row => row.startsWith('user='));
        if (userCookie) {
            try {
                const userData = JSON.parse(decodeURIComponent(userCookie.split('=')[1]));
                setUser(userData);
            } catch (error) {
                console.error('Failed to parse user cookie:', error);
            }
        }
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserProvider;
