import React, { useState, useEffect } from "react";
import Layout from "./Layout/Layout";
import List from "./List";
import Card from "./Card";
import CreateToken from "./Tokenization/CreateToken";
import Stats from "./Stats";
import { walletDetails } from "../../../functions/getWalletDetails";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const [content, setContent] = useState("list");
  const [cardsData, setCardsData] = useState([]);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [connectedAddress, setConnectedAddress] = useState(null);

  const handleConnectedWalletClick = async () => {
    const data = await walletDetails();
    setCardsData(data);
    setContent("cards");
  };

  const handleCreateTokenClick = () => {
    setContent("createToken");
    navigate("/create-token");
  };

  return (
    <Layout
      onConnectedWalletClick={handleConnectedWalletClick}
      onCreateTokenClick={handleCreateTokenClick}
      isWalletConnected={isWalletConnected}
      connectedAddress={connectedAddress}
    >
      <div className="grid">
        {content === "list" && <List />}
        {content === "cards" &&
          cardsData.map((data, index) => (
            <Card
              key={index}
              title={data.walletName}
              subTitle={data.walletAddress}
              body={data.walletBalance}
              onButtonClick={() => alert("Disconnected")}
            />
          ))}
      </div>
      {content === "createToken" && <CreateToken />}
      {/* <ConnectWallet
                setIsWalletConnected={setIsWalletConnected}
                setConnectedAddress={setConnectedAddress}
            /> */}
    </Layout>
  );
};

export default Dashboard;
