import React, { useState, useRef, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { Button } from "primereact/button";
import { InputNumber } from "primereact/inputnumber";
import { Card } from "primereact/card";
import { Fieldset } from "primereact/fieldset";
import { Panel } from "primereact/panel";
import { ethers, BigNumber } from "ethers";
import { fetchTokenDetails } from "../../../../functions/api";
import { createBuyTransaction } from "../../../../functions/api";
import { Toast } from "primereact/toast";
import Layout from "../Layout/Layout";
import { Dialog } from "primereact/dialog";
import { WalletContext } from "../WalletContext";
import { buyTokens as buyTokensFromContract, getTokenForSale } from "../../../../functions/contracts"; // Import the function
import { useNavigate } from "react-router-dom";

const Equity = () => {
  const { tokenId } = useParams();
  const [amount, setAmount] = useState(0);
  const [amountForSale, setAmountForSale] = useState(null)
  const [loading, setLoading] = useState(false);
  const [tokenDetails, setTokenDetails] = useState(null);
  const { walletInfo } = useContext(WalletContext);

  const toast = useRef(null);
  const navigate = useNavigate();

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();

  useEffect(() => {
    const getTokenDetails = async () => {
      try {
        const details = await fetchTokenDetails(tokenId);

        // Fetch user information from session storage
        const userString = sessionStorage.getItem("user");
        const userObject = JSON.parse(userString);
          setAmountForSale(await getTokenForSale(details.result.assetContractAddress));
        if (details.result.owner.businessName !== userObject.businessName) {
          setTokenDetails(details);
        } else {
          toast.current.show({
            severity: "warn",
            summary: "Warning",
            detail: "Cannot invest in your own business assets",
          });
        }
      } catch (error) {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Error fetching token details",
        });
      }
    };

    getTokenDetails();
  }, [tokenId]);

  const storeTransactionDetails = async (transactionHash) => {
    if (!tokenDetails) return;
    const userString = sessionStorage.getItem("user");
    const userObject = JSON.parse(userString);
    const userId = userObject._id;

    const transactionData = {
      asset: tokenDetails.result._id,
      buyer: userId,
      seller: null,
      amount,
      price: tokenDetails.result.tokenPrice,
      transactionHash,
      isForSale: true,
    };

    try {
      const response = await createBuyTransaction(transactionData);
      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: "Tokens purchased successfully",
      });
      navigate("/dashboard");

      if (response.success) {
        console.log("saved");
      }
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
      const tx = await buyTokensFromContract(
        tokenDetails.result.assetContractAddress,
        amount,
        tokenDetails.result.owner.wallets[0]
      );

      const hash = await storeTransactionDetails(tx.hash);

      toast.current.show({
        severity: "success",
        summary: "Tokens purchased successfully",
        detail: "Transaction Hash", hash,
      });
      navigate("/dashboard");
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
      assetContractAddress,
      totalAvailableForPurchase,
      tokenDocument,
    } = tokenDetails.result;
    const handleOpenDocument = () => {
      window.open(`http://localhost:5000/${tokenDocument}`, "_blank");
    };
    const handleOpenLegalDocument = () => {
      window.open(`http://localhost:5000/${owner.legalDocumentsURI}`, "_blank");
    };
    return (
      <div className="p-grid">
       <Toast ref={toast} />
              <Dialog
          header="Buying Token"
          visible={loading}
          modal={true}
          onHide={() => {}}
          closable={false}
        >
          <div className="p-d-flex p-jc-center p-ai-center">
            <i
              className="pi pi-spin pi-spinner"
              style={{ fontSize: "2rem" }}
            ></i>
          </div>
        </Dialog>
        <div className="p-col-12 p-md-4">
          <Card>
            <img
              src={`http://localhost:5000/${assetIcon}`}
              className="border-round"
              alt={tokenName}
              width={50}
              height={50}
            />
          </Card>
        </div>
        <div className="p-col-12 p-md-8">
          <Panel header="Token Details">
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
              {(amountForSale / 1000000000000000000)}
            </p>
            <div className="p-col-12 p-md-6">
              <strong>Contract Address:</strong> {assetContractAddress}
            </div>
            <div className="p-col-12 p-md-6">
              <strong>Token Document:</strong>{" "}
              <Button
                icon="pi pi-external-link"
                className="p-button-text"
                onClick={handleOpenDocument}
              />
            </div>
          </Panel>
          <Fieldset legend="Company Details">
            <p>
              <strong>Business Name:</strong> {owner.businessName}
            </p>
            <p>
              <strong>Location:</strong> {owner.location}
            </p>
            <p>
              <strong>Year Started:</strong> {owner.yearStarted}
            </p>
            <p>
              <strong>Business WhitePaper:</strong>
              <Button
                icon="pi pi-external-link"
                className="p-button-text"
                onClick={handleOpenLegalDocument}
              />
            </p>
          </Fieldset>
        </div>
      </div>
    );
  };

  return (
    <Layout>
      <Card title="Invest">
        {renderTokenDetails()}
        <div className="p-field mt-5">
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

    </Layout>
  );
};

export default Equity;
