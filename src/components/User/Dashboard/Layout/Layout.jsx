import React, { useState, useEffect } from 'react';
import TopBar from "../TopBar";
import SideBar from "../SideBar";
import { useNavigate } from 'react-router-dom';

const Layout = ({ children, onConnectedWalletClick, onCreateTokenClick }) => {
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [activeLink, setActiveLink] = useState('dashboard');
    const navigate = useNavigate();
  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 700);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

//   const handleCreateTokenClick = () => {
//     setActiveLink('createToken'); // Update active link state
//     // Navigate to a different route using navigate
//      // Replace '/create-token' with your desired route
//   };

  return (
    <div className="flex flex-column h-screen">
      <TopBar />
      <div className="flex flex-1">
        <SideBar isSmallScreen={isSmallScreen} onConnectedWalletClick={onConnectedWalletClick} onCreateTokenClick={onCreateTokenClick} />
        <div className="flex flex-column flex-1 p-4">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
