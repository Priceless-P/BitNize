import React, { useState, useContext } from "react";
import { ethers } from "ethers";
import { createToken, saveFile, convertPriceToWei } from "../../../../functions/api";
import { convertToBase64 } from "../../../../functions/utils";
import { FileUpload } from "primereact/fileupload";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { InputNumber } from "primereact/inputnumber";
import { WalletContext } from "../WalletContext";
import Layout from "../Layout/Layout";
import { Dialog } from "primereact/dialog";
import { Tooltip } from "primereact/tooltip";
import { toast } from "react-toastify";
import { mintTokens } from "../../../../functions/contracts";
import { useNavigate } from "react-router-dom";


const factoryAbi = require("./BusinessSharesTokenFactory.json").abi;
const factoryAddress = "0x53874c20E995bcbbC05cB6bAC61CaAe4A30C4fcD";

const CreateToken = () => {
    const navigate = useNavigate();
  const { walletInfo } = useContext(WalletContext);
  const [formData, setFormData] = useState({
    tokenDescription: "",
    tokenName: "",
    tokenSymbol: "",
    tokenIcon: "",
    documentsURI: "",
    initialSupply: "",
    tokenPrice: "",
    from: walletInfo.account,
  });
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const onInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  const onFileSelect = async (e, fileKey) => {
    const file = e.files[0];
    const base64 = await convertToBase64(file);
    setFormData((prevState) => ({
      ...prevState,
      [fileKey]: base64,
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const documentURISave = await saveFile({ file: formData.documentsURI });
      const documentURI = documentURISave.result;
      const priceInWei = await convertPriceToWei(formData.tokenPrice);
      //console.log(priceInWei);

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      await provider.send("eth_requestAccounts", []);

      const from = await signer.getAddress();

      const contract = new ethers.Contract(factoryAddress, factoryAbi, signer);

      const gasEstimate = await contract.estimateGas.createBusinessSharesToken(
        formData.tokenName,
        formData.tokenSymbol,
        documentURI,
        0,
        priceInWei
      );

      const gasPrice = await provider.getGasPrice();

      const tx = await contract.createBusinessSharesToken(
        formData.tokenName,
        formData.tokenSymbol,
        documentURI,
        0,
        priceInWei,
        {
          gasLimit: gasEstimate,
          gasPrice: gasPrice
        }
      );

      await tx.wait();

      const receipt = await provider.getTransactionReceipt(tx.hash);
      const tokenAddress = receipt.logs[0].address;

      await mintTokens(tokenAddress, formData.initialSupply);

      const updatedFormData = {
        ...formData,
        transactionHash: tx.hash,
        tokenAddress: tokenAddress,
      };

      setLoading(false);
      setSubmitting(false);
      const response = await createToken(updatedFormData);
      toast.success(response.message);
      navigate('/dashboard')
    } catch (error) {
      console.log(error);
      toast.error(error.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="">
        <Dialog
          header="Creating Token"
          visible={loading || submitting}
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
        {walletInfo.isConnected ? (
          <Card title="Create New Token" className="p-col-12 p-md-8 p-lg-6">
            <div className="p-fluid p-grid">
              <div className="p-field p-col-12 p-md-6">
                <label htmlFor="tokenIcon" className="block text-900 font-medium mb-2">Icon</label>
                <FileUpload
                  mode="basic"
                  name="icon"
                  accept="image/*"
                  maxFileSize={1000000}
                  onSelect={(e) => onFileSelect(e, "tokenIcon")}
                />
              </div>
              <div className="p-field p-col-12 p-md-6">
                <label htmlFor="tokenName" className="block text-900 font-medium mb-2">Token Name</label>
                <InputText
                  id="tokenName"
                  value={formData.tokenName}
                  onChange={onInputChange}
                />
              </div>
              <div className="p-field p-col-12 p-md-6">
                <label htmlFor="tokenSymbol" className="block text-900 font-medium mb-2">Token Symbol</label>
                <InputText
                  id="tokenSymbol"
                  value={formData.tokenSymbol}
                  onChange={onInputChange}
                />
              </div>
              <div className="p-field p-col-12 p-md-6">
                <label htmlFor="tokenDescription" className="block text-900 font-medium mb-2">Description</label>
                <InputTextarea
                  id="tokenDescription"
                  rows={4}
                  value={formData.tokenDescription}
                  onChange={onInputChange}
                />
              </div>
              <div className="p-field p-col-12 p-md-6">
                <label htmlFor="initialSupply" className="block text-900 font-medium mb-2">Initial Supply</label>
                <small className="block text-600">Initial supply refers to the percentage of shares initially available. The max total supply is 1,000 (100%).</small>
                <InputText
                  id="initialSupply"
                  value={formData.initialSupply}
                  onChange={onInputChange}
                />
              </div>
              <div className="p-field p-col-12 p-md-6">
                <label htmlFor="tokenPrice" className="block text-900 font-medium mb-2">Token Price</label>
                <small className="block text-600">The price is in USD and represents the cost of a single share.</small>
                <InputNumber
                  id="tokenPrice"
                  mode="decimal"
                  maxFractionDigits={17}
                  value={formData.tokenPrice}
                  onValueChange={(e) =>
                    onInputChange({
                      target: { id: "tokenPrice", value: e.value },
                    })
                  }
                />
              </div>
              <div className="p-field p-col-12 p-md-6">
                <label htmlFor="documentsURI" className="block text-900 font-medium mb-2">Documents</label>
                <FileUpload
                  mode="basic"
                  name="documents"
                  accept="application/pdf"
                  className="document"
                  maxFileSize={1000000}
                  onSelect={(e) => onFileSelect(e, "documentsURI")}
                />
                <small className="block text-600">Any legal documents concerning the shares and how it works.</small>
              </div>
              <div className="p-field p-col-12">
                <Button
                  label="Create"
                  onClick={handleSubmit}
                  className="p-button-raised p-button-primary"
                  disabled={loading || submitting}
                />
              </div>
            </div>
          </Card>
        ) : (
          <h2>Connect Wallet to Proceed</h2>
        )}
      </div>
    </Layout>
  );
};

export default CreateToken;
