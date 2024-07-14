import React, { useContext, useEffect, useState } from 'react';
import { Menubar } from 'primereact/menubar';
import { ConnectWallet, useAddress } from "@thirdweb-dev/react";
import { WalletContext } from './WalletContext';
import NotificationBell from './NotificationBell';
import { addWallet } from '../../../functions/api';
import './TopBar.css';

const TopBar = () => {
    const { walletInfo, setWalletInfo } = useContext(WalletContext);
    const address = useAddress();
    const [userName, setUserName] = useState("");
    const [userId, setUserId] = useState("");
    const [notificationCount, setNotificationCount] = useState(0);

    useEffect(() => {
        const userString = sessionStorage.getItem("user");
        if (userString) {
            const userObject = JSON.parse(userString);
            setUserName(userObject.firstName);
            setUserId(userObject._id);
        }
    }, []);

    useEffect(() => {
        const checkAndAddWallet = async () => {
            if (address) {
                setWalletInfo({ isConnected: true, account: address });
                const userString = sessionStorage.getItem("user");
                if (userString) {
                    const userObject = JSON.parse(userString);
                    const userId = userObject._id;
                    if (!userObject.wallets.includes(address)) {
                        try {
                            const updatedUser = await addWallet(userId, address);
                            sessionStorage.setItem("user", JSON.stringify(updatedUser.result));
                        } catch (error) {
                            console.error(error);
                        }
                    }
                }
            } else {
                setWalletInfo({ isConnected: false, account: null });
            }
        };

        checkAndAddWallet();
    }, [address, setWalletInfo]);

    const connectWalletTemplate = () => {
        return (
            <div>
                <ConnectWallet />
            </div>
        );
    };

    const welcomeMessage = () => {
        return (
            userName && <div className="welcome-message mr-5">Hi, {userName}!</div>
        );
    };

    const items = [
        { template: welcomeMessage },
        {
            template: () => (
                <NotificationBell count={notificationCount} setNotificationCount={setNotificationCount} />
            ),
        },
        { template: connectWalletTemplate }
    ];

    const start = (
        <img
            alt="logo"
            src="/images/logo-white.png"
            height="50"
            width="150"
            className="logo"
        />
    );

    return (
        <div className="surface-0 w-full">
            <Menubar model={items} start={start} className='surface-0 border-none custom-menubar' />
        </div>
    );
};

export default TopBar;
