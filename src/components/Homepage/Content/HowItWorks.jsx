import React from "react";
import { Button } from "primereact/button";
import { Card } from "primereact/card";

const HowItWorks = () => {
    return (
        <div className="text-center">
            <div className="mb-3 font-bold text-3xl mt-5 mb-4">
                <span className="text-900">How It Works</span>
            </div>
            <div className="text-700 mb-6">Our platform simplifies asset tokenization and investment.</div>
            <div className="grid">
                <div className="col-12 md:col-4 mb-4 px-5">
                    <Card title="Step 1: Register" style={{ borderRadius: '10px' }}>
                        <p className="text-700 line-height-3">
                            Sign up and create an account on our platform.
                        </p>
                    </Card>
                </div>
                <div className="col-12 md:col-4 mb-4 px-5">
                    <Card title="Step 2: Tokenize" style={{ borderRadius: '10px' }}>
                        <p className="text-700 line-height-3">
                            Tokenize your real-world assets using our easy-to-use interface.
                        </p>
                    </Card>
                </div>
                <div className="col-12 md:col-4 mb-4 px-5">
                    <Card title="Step 3: Invest" style={{ borderRadius: '10px' }}>
                        <p className="text-700 line-height-3">
                            Invest in tokenized assets and manage your portfolio.
                        </p>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default HowItWorks;
