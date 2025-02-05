import React from "react";

const Features = () => {
    return (
        <div className="text-center" id="features-section">
            <div className="mb-3 font-bold text-3xl mt-5 mb-4">
                <span className="text-900">Tokenize Your Assets, </span>
                <span className="text-blue-600">Empower Your Business</span>
            </div>
            <div className="text-700 mb-6">Unlock the value of your real-world assets with our secure and efficient tokenization platform on the RSK network.</div>
            <div className="grid">
                <div className="col-12 md:col-4 mb-4 px-5">
                    <span className="p-3 shadow-2 mb-3 inline-block" style={{ borderRadius: '10px' }}>
                        <i className="pi pi-cog text-4xl text-blue-500"></i>
                    </span>
                    <div className="text-900 text-xl mb-3 font-medium">For Businesses</div>
                    <span className="text-700 line-height-3">Easily create and manage tokens representing your assets. Enhance liquidity and access new markets.</span>
                </div>
                <div className="col-12 md:col-4 mb-4 px-5">
                    <span className="p-3 shadow-2 mb-3 inline-block" style={{ borderRadius: '10px' }}>
                        <i className="pi pi-wallet text-4xl text-blue-500"></i>
                    </span>
                    <div className="text-900 text-xl mb-3 font-medium">For Investors</div>
                    <span className="text-700 line-height-3">Invest in real-world businesses with ease and security. Enjoy transparency and assurance with every transaction.</span>
                </div>
                <div className="col-12 md:col-4 mb-4 px-5">
                    <span className="p-3 shadow-2 mb-3 inline-block" style={{ borderRadius: '10px' }}>
                        <i className="pi pi-users text-4xl text-blue-500"></i>
                    </span>
                    <div className="text-900 text-xl mb-3 font-medium">Community Driven</div>
                    <span className="text-700 line-height-3">Join a growing community of like-minded individuals and businesses. Share, earn, and grow together.</span>
                </div>
                <div className="col-12 md:col-4 mb-4 px-5">
                    <span className="p-3 shadow-2 mb-3 inline-block" style={{ borderRadius: '10px' }}>
                        <i className="pi pi-shield text-4xl text-blue-500"></i>
                    </span>
                    <div className="text-900 text-xl mb-3 font-medium">Secure Transactions</div>
                    <span className="text-700 line-height-3">All transactions are secured by the RSK network, ensuring integrity and trust.</span>
                </div>
                <div className="col-12 md:col-4 mb-4 px-5">
                    <span className="p-3 shadow-2 mb-3 inline-block" style={{ borderRadius: '10px' }}>
                        <i className="pi pi-file text-4xl text-blue-500"></i>
                    </span>
                    <div className="text-900 text-xl mb-3 font-medium">Assurance</div>
                    <span className="text-700 line-height-3">Documents are provided and for you to verify before any sales, ensuring transparency and peace of mind.</span>
                </div>
                <div className="col-12 md:col-4 mb-4 px-5">
                    <span className="p-3 shadow-2 mb-3 inline-block" style={{ borderRadius: '10px' }}>
                        <i className="pi pi-globe text-4xl text-blue-500"></i>
                    </span>
                    <div className="text-900 text-xl mb-3 font-medium">Global Reach</div>
                    <span className="text-700 line-height-3">Expand your reach to global investors and markets, breaking geographical barriers.</span>
                </div>
            </div>
        </div>
    );
};

export default Features;
