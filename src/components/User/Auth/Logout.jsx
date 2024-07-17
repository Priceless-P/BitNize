import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


const Logout = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const logoutUser = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/auth/logout', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                });

                if (response.ok) {
                    // Clear session storage
                    sessionStorage.removeItem('user');

                    // Remove Z-Token cookie
                    document.cookie = 'Bit-Token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';

                    // Redirect to home page
                    navigate('/');
                } else {
                    console.error('Failed to log out');
                }
            } catch (error) {
                console.error('Error logging out:', error);
            }
        };

        logoutUser();
    }, [navigate]);

    return null;
};

export default Logout;