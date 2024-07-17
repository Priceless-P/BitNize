import React from "react";
import { Button } from "primereact/button";
import Features from "./Features";
import HowItWorks from "./HowItWorks";
import Footer from "../Footer/Footer";
const Content = () => {
    return (
        <div className="mb-5">
        <HowItWorks />
            <Features />

            <div className="text-700 text-center mt-5 ">
                <div className="text-blue-600 font-bold mb-3">
                    <i className="pi pi-users"></i>&nbsp;Discover the Future of Asset Tokenization
                </div>
                <div className="text-900 font-bold text-5xl mb-3">

                </div>
                <div className="text-700 text-2xl mb-5">
                    Connect, trade, and grow with a community of forward-thinking investors and businesses.
                </div>

            </div>
        </div>
    );
};

export default Content;
