import React, { useState, useEffect, useContext } from "react";
import { Card } from "primereact/card";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import Stats from "./Stats";
import { getPortfolio, fetchBoughtTokens } from "../../../functions/api";
import { WalletContext } from "./WalletContext";
import "./List.css";

const List = () => {
  const { walletInfo } = useContext(WalletContext);
  const [assets, setAssets] = useState([]);
  const [boughtTokens, setBoughtTokens] = useState([]);
  const [loadingAssets, setLoadingAssets] = useState(true);
  const [loadingBoughtTokens, setLoadingBoughtTokens] = useState(true);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const response = await getPortfolio();
        if (response.success) {
          setAssets(response.result);
        }
      } catch (error) {
        console.error("Error fetching user assets:", error);
      } finally {
        setLoadingAssets(false);
      }
    };

    const fetchBoughtTokensData = async () => {
      try {
        const userString = sessionStorage.getItem("user");
        const userObject = JSON.parse(userString);
        const userId = userObject._id;
        const response = await fetchBoughtTokens(userId);
        if (response.success) {
          setBoughtTokens(response.result);
        }
      } catch (error) {
        console.error("Error fetching bought tokens:", error);
      } finally {
        setLoadingBoughtTokens(false);
      }
    };

    fetchPortfolio();
    fetchBoughtTokensData();
  }, []);

  const renderIcon = (rowData) => {
    return (
      <img
        src={`https://bitnize.onrender.com/${rowData.assetIcon}`}
        className="border-round"
        alt={rowData.tokenName}
        style={{ width: "50px", height: "50px", borderRadius: "50%" }}
      />
    );
  };

  const renderPrice = (rowData) => {
    return `$${rowData.tokenPrice}`;
  };

  const renderTotalMinted = (rowData) => {
    return (
      ((rowData.totalAvailableForPurchase / 100) * 1000).toFixed(0) + " / 1,000"
    );
  };

  const renderForSale = (rowData) => {
    return rowData.isForSale ? "Yes" : "No";
  };

  const renderBoughtTokenIcon = (rowData) => {
    return (
      <img
        src={`http://localhost:5000/${rowData.asset.assetIcon}`}
        className="border-round"
        alt={rowData.asset.tokenName}
        style={{ width: "50px", height: "50px", borderRadius: "50%" }}
      />
    );
  };

  const renderBoughtTokenPrice = (rowData) => {
    return `$${rowData.price}`;
  };

  const renderBoughtTokenName = (rowData) => {
    return rowData.asset.tokenName;
  };

  const renderBoughtTokenSymbol = (rowData) => {
    return rowData.asset.tokenSymbol;
  };

  const renderTransactionHash = (rowData) => {
    const explorerUrl = `https://explorer.testnet.rsk.co/tx/${rowData.transactionHash}`;
    return (
      <a href={explorerUrl} target="_blank" rel="noopener noreferrer">
        View Transaction
      </a>
    );
  };

  const assetContractAddresses = assets.map((asset) => asset.contractAddress);
  const boughtTokenContractAddresses = boughtTokens.map(
    (token) => token.asset.contractAddress
  );
  const allContractAddresses = [
    ...assetContractAddresses,
    ...boughtTokenContractAddresses,
  ];

  return (
    <>
      {walletInfo.isConnected ? (
        <div className="grid">
          <div className="col-4 sm:col-4 lg:col-3">
            <Stats contractAddresses={allContractAddresses} />
          </div>
          <div className="col-4 sm:col-4 lg:col-4">
            <Card title="Total Tokenized" headerClassName="small-header">
              {loadingAssets ? "Loading..." : assets.length}
            </Card>
          </div>
          <div className="col-4 sm:col-4 lg:col-4">
            <Card title="Total Bought" headerClassName="small-header">
              {loadingBoughtTokens ? "Loading..." : boughtTokens.length}
            </Card>
          </div>
          <div className="col-12">
            <Card title="Your Assets" headerClassName="small-header">
              {loadingAssets ? (
                <p>Loading...</p>
              ) : assets.length === 0 ? (
                <p>You have no assets currently.</p>
              ) : (
                <DataTable
                  value={assets}
                  paginator
                  rows={5}
                  rowsPerPageOptions={[5, 10, 25, 50]}
                  responsiveLayout="scroll"
                >
                  <Column
                    field="assetIcon"
                    header="Icon"
                    body={renderIcon}
                  ></Column>
                  <Column field="tokenName" header="Token Name"></Column>
                  <Column field="tokenSymbol" header="Token Symbol"></Column>
                  <Column
                    field="isForSale"
                    header="For Sale"
                    body={renderForSale}
                  ></Column>
                  <Column
                    field="totalAvailableForPurchase"
                    header="Total Minted"
                    body={renderTotalMinted}
                  ></Column>
                  <Column
                    field="tokenPrice"
                    header="Price Per Token"
                    body={renderPrice}
                  ></Column>
                  <Column
                    field="assetContractAddress"
                    header="Contract Address"
                  ></Column>
                </DataTable>
              )}
            </Card>
          </div>
          <div className="col-12">
            <Card title="Bought Tokens" headerClassName="small-header">
              {loadingBoughtTokens ? (
                <p>Loading...</p>
              ) : boughtTokens.length === 0 ? (
                <p>You have no bought tokens currently.</p>
              ) : (
                <DataTable
                  value={boughtTokens}
                  paginator
                  rows={5}
                  rowsPerPageOptions={[5, 10, 25, 50]}
                  responsiveLayout="scroll"
                >
                  <Column
                    field="asset.assetIcon"
                    header="Icon"
                    body={renderBoughtTokenIcon}
                  ></Column>
                  <Column
                    field="asset.tokenName"
                    header="Token Name"
                    body={renderBoughtTokenName}
                  ></Column>
                  <Column
                    field="asset.tokenSymbol"
                    header="Token Symbol"
                    body={renderBoughtTokenSymbol}
                  ></Column>
                  <Column field="amount" header="Amount"></Column>
                  <Column
                    field="price"
                    header="Price Per Token"
                    body={renderBoughtTokenPrice}
                  ></Column>
                  <Column
                    field="asset.assetContractAddress"
                    header="Contract Address"
                  ></Column>
                  <Column
                    field="transactionHash"
                    header="Transaction"
                    body={renderTransactionHash}
                  ></Column>
                </DataTable>
              )}
            </Card>
          </div>
        </div>
      ) : (
        <h2>Please connect your wallet to continue</h2>
      )}
    </>
  );
};

export default List;
