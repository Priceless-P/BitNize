import React from "react";
import { Button } from "primereact/button";
import Features from "./Features";

const Content = () => {
    return (
        <div>
            <Features />
            <div className="text-700 text-center">
                <div className="text-blue-600 font-bold mb-3">
                    <i className="pi pi-users"></i>&nbsp;JOIN OUR COMMUNITY
                </div>
                <div className="text-900 font-bold text-5xl mb-3">
                    Discover the Future of Asset Tokenization
                </div>
                <div className="text-700 text-2xl mb-5">
                    Connect, trade, and grow with a community of forward-thinking investors and businesses.
                </div>
                <Button label="Join Now" icon="pi pi-users" className="font-bold px-5 py-3 p-button-raised p-button-rounded white-space-nowrap" />
            </div>
        </div>
    );
};

export default Content;
