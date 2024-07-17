import React from "react";
import { Menubar } from "primereact/menubar";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
    const navigate = useNavigate();

    const items = [
        {
            label: "Features",
            command: () => {
                document.getElementById("features-section").scrollIntoView({ behavior: 'smooth' });
            },
        },
        {
            label: "How It Works",
            command: () => {
                document.getElementById("how-it-works-section").scrollIntoView({ behavior: 'smooth' });
            },
        },
    ];

    const start = (
        <img
            alt="logo"
            src="/images/logo-white.png"
            style={{ height: '40px', cursor: 'pointer', width:'100px' }}
            onClick={() => navigate('/')}
        />
    );

    return (
        <div className="card navbar-container surface-0" style={{ background: 'transparent', border: 'none' }}>
            <Menubar model={items} start={start} className="surface-0" />
        </div>
    );
};

export default Navbar;
