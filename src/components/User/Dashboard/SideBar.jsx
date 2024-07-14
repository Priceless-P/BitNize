import React, { useState, useRef } from 'react';
import { Sidebar as PrimeSidebar } from 'primereact/sidebar';
import { Button } from 'primereact/button';
import { Ripple } from 'primereact/ripple';
import { StyleClass } from 'primereact/styleclass';
import './SideBar.css';

const SideBar = ({ isSmallScreen, onConnectedWalletClick, onCreateTokenClick }) => {
    const [visible, setVisible] = useState(false);
    const btnRef1 = useRef(null);
    const btnRef2 = useRef(null);
    const btnRef3 = useRef(null);

    const renderNavigation = () => (
        <ul className="list-none p-3 m-0 sidebar">
            <li>
                <a className="p-ripple flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full" href="/dashboard">
                    <i className="pi pi-home mr-2"></i>
                    <span className="font-medium">Home</span>
                    <Ripple />
                </a>
            </li>
            <li>
                <a onClick={onCreateTokenClick} className="p-ripple flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full" href="/create-token">
                    <i className="pi pi-plus-circle mr-2"></i>
                    <span className="font-medium">Tokenize New Asset</span>
                    <Ripple />
                </a>
            </li>
            <li>
                <a className="p-ripple flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full" href="/investments/equities">
                    <i className="pi pi-wallet mr-2"></i>
                    <span className="font-medium">Invest</span>
                    <Ripple />
                </a>
            </li>
            <li>
                <a className="p-ripple flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full" href="/verify">
                    <i className="pi pi-verified mr-2"></i>
                    <span className="font-medium">Verification</span>
                    <Ripple />
                </a>
            </li>
            <li>
                <a className="p-ripple flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full" href="/team">
                    <i className="pi pi-users mr-2"></i>
                    <span className="font-medium">Team</span>
                    <Ripple />
                </a>
            </li>
            <li>
                <a className="p-ripple flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full" href="/market/tokens">
                    <i className="pi pi-chart-line mr-2"></i>
                    <span className="font-medium">Buy Share Tokens</span>
                    <Ripple />
                </a>
            </li>
            <li>
                <a className="p-ripple flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full" href="https://explorer.testnet.rootstock.io/">
                    <i className="pi pi-globe mr-2"></i>
                    <span className="font-medium">Block Explorer</span>
                    <Ripple />
                </a>
            </li>
        </ul>
    );

    return (
        <>
            {isSmallScreen ? (
                <>
                    <Button icon="pi pi-arrow-right" onClick={() => setVisible(true)} className="m-2 surface-0 border-none white-icon" />
                    <PrimeSidebar visible={visible} onHide={() => setVisible(false)} className="surface-0 border-none">
                        <div className="surface-0 flex flex-column h-full p-3">
                            <div className="overflow-y-auto">{renderNavigation()}</div>
                        </div>
                    </PrimeSidebar>
                </>
            ) : (
                <div className="surface-0 flex flex-column lg:w-72 md:w-60 sm:w-20rem w-full h-full p-3 shadow-2">
                    <div className="overflow-y-auto">{renderNavigation()}</div>
                </div>
            )}
        </>
    );
};

export default SideBar;
