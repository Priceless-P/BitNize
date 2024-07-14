import React from "react";
import { Button } from "primereact/button";
import { Link } from "react-router-dom";
import Navbar from "../Navigation/Navbar";
import './Hero.css';

const Hero = () => {
    return (
        <div className="hero-container">
            <div className="surface-0 flex justify-content-center align-items-center min-h-screen text-800">
                <div className="text-center p-8">
                    <section>
                        <span className="block text-6xl font-bold mb-1">
                            Tokenize Your Assets
                        </span>
                        <div className="text-6xl text-primary font-bold mb-3">
                            Discover the Power of Digitalizing Real-World Assets
                        </div>
                        <p className="mt-0 mb-4 text-750 line-height-3">
                            Convert your real-world assets into digital tokens and leverage the efficiency and security of the RSK network.
                        </p>
                        <Link to="/connect">
                            <Button
                                label="Connect your Wallet to Get Started"
                                type="button"
                                className="mr-3 p-button-raised"
                            />
                        </Link>
                        <Button
                            label="Live Demo"
                            type="button"
                            className="p-button-outlined"
                        />
                    </section>
                </div>
            </div>
        </div>
    );
};

export default Hero;
