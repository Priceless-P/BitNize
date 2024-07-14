import React, { createContext, useState } from 'react';

export const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
    const [walletInfo, setWalletInfo] = useState({
        isConnected: false,
        account: null,
    });

    return (
        <WalletContext.Provider value={{ walletInfo, setWalletInfo }}>
            {children}
        </WalletContext.Provider>
    );
};
