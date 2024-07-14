import React, { useState, useEffect, useRef, useContext } from "react";
import { useParams } from "react-router-dom";
import { Button } from "primereact/button";
import { Panel } from "primereact/panel";
import { InputNumber } from "primereact/inputnumber";
import { Toast } from "primereact/toast";
import { Divider } from "primereact/divider";
import { Fieldset } from "primereact/fieldset";
import Layout from "../Layout/Layout";
import { WalletContext } from "../WalletContext";

import { fetchBuyTransaction, saveTransferRequest } from "../../../../functions/api";
import { requestTransfer } from "../../../../functions/contracts";

const TokenDetails = () => {
  const { tokenId } = useParams();
  const { walletInfo, setWalletInfo } = useContext(WalletContext);
  const [token, setToken] = useState(null);
  const [amount, setAmount] = useState(0);
  const toast = useRef(null);

  useEffect(() => {
    const getTokenDetails = async () => {
      try {
        const details = await fetchBuyTransaction(tokenId);
        setToken(details.result);
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


  const handleRequestTransfer = async () => {
    try {
      const { buyer, asset } = token;
      const from = buyer.wallets[0];
      const to = walletInfo.account;
      const userString = sessionStorage.getItem("user");
          const userObject = JSON.parse(userString);
          console.log(token)

      await requestTransfer(from, to, amount, asset.assetContractAddress);
      await saveTransferRequest({
        from: buyer._id,
          to: userObject._id,
        amount,
        assetId: asset._id,
      });

      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: "Transfer request sent successfully",
      });
    } catch (error) {
    console.log(error)
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Error requesting transfer",
      });
    }
  };

  if (!token) {
    return <div>Loading...</div>;
  }

  return (
    <Layout>
      <div className="p-grid p-dir-col">
        <Toast ref={toast} />

        <Panel header={`Details`} className="p-mb-4">
          <Fieldset legend="Token Information" toggleable>
            <div className="p-grid">
            <div className="p-col-12 p-md-6">
                <strong>Issued By:</strong> {token.asset.owner.businessName}
              </div>
              <div className="p-col-12 p-md-6">
                <strong>Name:</strong> {token.asset.tokenName}
              </div>
              <div className="p-col-12 p-md-6">
                <strong>Symbol:</strong> {token.asset.tokenSymbol}
              </div>
              <div className="p-col-12 p-md-6">
                <strong>Description:</strong> {token.asset.assetDescription}
              </div>
              <div className="p-col-12 p-md-6">
                <strong>Price:</strong> {token.asset.tokenPrice}
              </div>
              <div className="p-col-12 p-md-6">
                <strong>Amount:</strong> {token.amount}
              </div>

              <div className="p-col-12 p-md-6">
                <strong>Contract Address:</strong> {token.asset.assetContractAddress}
              </div>
              <div className="p-col-12 p-md-6">
                <strong>Document:</strong> {token.asset.tokenDocument}
              </div>
              {/* <div className="p-col-12 p-md-6">
                <strong>For Sale:</strong> {token.isForSale ? "Yes" : "No"}
              </div> */}
            </div>
          </Fieldset>
        </Panel>

        <Panel header="Owner Details" className="p-mb-4">
          <Fieldset legend="Current Owner Information" toggleable>
            <div className="p-grid">
              <div className="p-col-12 p-md-6">
                <strong>Name:</strong> {token.buyer.firstName} {token.buyer.lastName}
              </div>
              <div className="p-col-12 p-md-6">
                <strong>Email:</strong> {token.buyer.email}
              </div>
              <div className="p-col-12 p-md-6">
                <strong>Company:</strong>{" "}
                {token.buyer.isCompany ? token.buyer.businessName : "N/A"}
              </div>
              <div className="p-col-12 p-md-6">
                <strong>Location:</strong> {token.buyer.location}
              </div>
              <div className="p-col-12 p-md-6">
                <strong>Year Started:</strong> {token.buyer.yearStarted}
              </div>
            </div>
          </Fieldset>
        </Panel>

        <Divider />

        <div className="p-field p-grid p-dir-col">
          <label htmlFor="amount" className="p-col-12 p-md-3">
            Number of Tokens to Buy:
          </label>
          <div className="p-col-12 p-md-3">
            <InputNumber
              id="amount"
              value={amount}
              onValueChange={(e) => setAmount(e.value)}
              showButtons
              min={0}
            />
          </div>
          <Button
            label="Request Ownership"
            onClick={handleRequestTransfer}
            className="p-col-12 p-md-3"
          />
        </div>
      </div>
    </Layout>
  );
};

export default TokenDetails;
