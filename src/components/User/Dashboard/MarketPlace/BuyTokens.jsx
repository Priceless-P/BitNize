import React, { useState, useRef, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { Button } from "primereact/button";
import { InputNumber } from "primereact/inputnumber";
import { Card } from "primereact/card";
import { Fieldset } from "primereact/fieldset";
import { Panel } from "primereact/panel";
import { ethers, BigNumber } from "ethers";
import { fetchTokenDetails } from "../../../../functions/api";
import { Toast } from "primereact/toast";
import Layout from "../Layout/Layout";
import { WalletContext } from "../WalletContext";

const BuyTokens = () => {
  const { tokenId } = useParams();
  const [amount, setAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [tokenDetails, setTokenDetails] = useState(null);
  const { walletInfo } = useContext(WalletContext);
  const toast = useRef(null);

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();

  useEffect(() => {
    const getTokenDetails = async () => {
      try {
        const details = await fetchTokenDetails(tokenId);
        setTokenDetails(details);
      } catch (error) {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Error fetching token details",
        });
      }
    };

    getTokenDetails();
    //console.log(tokenDetails);
  }, [tokenId]);

  const storeTransactionDetails = async (transactionHash) => {
    if (!tokenDetails) return;
    const userString = sessionStorage.getItem("user");
    const userObject = JSON.parse(userString);
    const userId = userObject._id;

    const transactionData = {
      asset: tokenDetails.result._id,
      buyer: userId,
      seller: "",
      amount,
      price: tokenDetails.result.tokenPrice,
      transactionHash,
      isForSale: false,
    };

    try {
      const response = await fetch("/api/transaction/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(transactionData),
      });

      if (!response.ok) {
        throw new Error("Failed to store transaction details");
      }

      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: "Transaction details stored successfully",
      });
    } catch (error) {
      console.error("Error storing transaction details:", error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to store transaction details",
      });
    }
  };

  const buyTokens = async () => {
    if (!tokenDetails) return;

    setLoading(true);
    try {
      await provider.send("eth_requestAccounts", []);
      const account = await signer.getAddress();

      const contract = new ethers.Contract(
        tokenDetails.result.assetContractAddress,
        require("../Tokenization/BusinessSharesToken.json").abi,
        signer
      );

      const tokenPrice = await contract.tokenPrice();
      //console.log(tokenPrice);
      const decimals = await contract.decimals();
      const adjustedAmount = BigNumber.from(amount).mul(
        BigNumber.from(10).pow(decimals)
      );

      const requiredValue = BigNumber.from(amount).mul(tokenPrice);
      const gasLimit = await contract.estimateGas.buyTokens(
        adjustedAmount,
        account
      );
      const gasPrice = (await provider.getFeeData()).gasPrice;
      const tx = await contract.buyTokens(adjustedAmount, account, {
        value: requiredValue,
        gasLimit: gasLimit.mul(10),
        gasPrice: gasPrice,
      });

      await tx.wait();
      await storeTransactionDetails(tx.hash);

      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: "Tokens purchased successfully",
      });
    } catch (error) {
      console.log(error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: error.message || "An error occurred",
      });
    } finally {
      setLoading(false);
    }
  };

  const renderTokenDetails = () => {
    if (!tokenDetails) return null;

    const {
      tokenName,
      tokenSymbol,
      assetDescription,
      assetIcon,
      owner,
      tokenPrice,
      totalAvailableForPurchase,
    } = tokenDetails.result;
    return (
      <div className="p-grid">
        <div className="p-col-12 p-md-4">
          <Card>
            <img
              src={`https://bitnize.onrender.com/${assetIcon}`}
              className="border-round"
              alt={tokenName}
              width={50}
              height={50}
            />
          </Card>
        </div>
        <div className="p-col-12 p-md-8">
          <Panel header="tokenName Token Details">
            <p>
              <strong>Name:</strong> {tokenName}
            </p>
            <p>
              <strong>Symbol:</strong> {tokenSymbol}
            </p>
            <p>
              <strong>Description:</strong> {assetDescription}
            </p>
            <p>
              <strong>Price:</strong> ${tokenPrice}
            </p>
            <p>
              <strong>Total Available:</strong>{" "}
              {(totalAvailableForPurchase / 100) * 1000}
            </p>
          </Panel>
          <Fieldset legend="Owner Details">
            <p>
              <strong>Business Name:</strong> {owner.businessName}
            </p>
            <p>
              <strong>Location:</strong> {owner.location}
            </p>
            <p>
              <strong>Year Started:</strong> {owner.yearStarted}
            </p>
          </Fieldset>
        </div>
      </div>
    );
  };

  return (
    <Layout>
      <Card title="Buy Tokens">
        {renderTokenDetails()}
        <div className="p-field">
          <label htmlFor="amount">Amount</label>
          <InputNumber
            id="amount"
            value={amount}
            onValueChange={(e) => setAmount(e.value)}
          />
        </div>
        <div className="p-field">
          <Button
            label="Buy"
            onClick={buyTokens}
            className="p-button-raised"
            disabled={loading || !tokenDetails}
          />
        </div>
      </Card>
      <Toast ref={toast} />
    </Layout>
  );
};

export default BuyTokens;
