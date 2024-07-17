import React from "react";
import { Link } from "react-router-dom";
import './Footer.css';

const Footer = () => {
    return (
        <footer className="mt-5 pt-5 surface-0 pb-5">
            <div className="grid">
                <div className="col-12 md:col-4">
                    <h3 className="footer-title">BitNize</h3>
                    <p>Tokenizing  small and medium businesses.</p>
                </div>
                <div className="col-12 md:col-4">
                    {/* <h3 className="footer-title">Quick Links</h3> */}
                    {/* <ul className="footer-links">
                        <li><Link to="/about">About Us</Link></li>
                        <li><Link to="/contact">Contact</Link></li>
                        <li><Link to="/faq">FAQ</Link></li>
                    </ul> */}
                </div>
                <div className="col-12 md:col-4">
                    <h3 className="footer-title">Connect with Us</h3>
                    <div className="footer-socials">
                        <i className="pi pi-facebook mr-3"></i>
                        <i className="pi pi-twitter mr-3"></i>
                        <i className="pi pi-linkedin"></i>
                    </div>
                </div>
            </div>
            <div className="footer-bottom text-center">
                <p>&copy; {new Date().getFullYear()} BitNize. All Rights Reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
