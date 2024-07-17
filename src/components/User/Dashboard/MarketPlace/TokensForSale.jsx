import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useNavigate } from "react-router-dom";
import Layout from "../Layout/Layout";
import { Toast } from "primereact/toast";
import { fetchBoughtTokensForSale } from "../../../../functions/api";

const TokensForSale = () => {
  const [tokens, setTokens] = useState([]);
  const navigate = useNavigate();
  const toast = useRef(null);

  useEffect(() => {
    const fetchTokens = async () => {
      try {
        // Fetch tokens available for sale
        const response = await fetchBoughtTokensForSale();
        if (response.success) {
          // Map the fetched data to the expected format
          const mappedTokens = response.result.map((token) => ({
            _id: token._id,
            tokenName: token.asset.tokenName,
            tokenSymbol: token.asset.tokenSymbol,
            assetIcon: token.asset.assetIcon,
            owner: {
              businessName: token.buyer.firstName,
            },
            tokenPrice: token.price,
            amount: token.amount,
          }));
          setTokens(mappedTokens);
        } else {
          console.log("Failed to fetch", response.message);
        }
      } catch (error) {
        console.log("An error occurred", error);
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Error fetching token details",
        });
      }
    };
    fetchTokens();
  }, []);

  const onRowSelect = (e) => {
    navigate(`/buy-token/${e.data._id}`);
  };

  const renderIcon = (rowData) => {
    return (
      <img
        src={`https://bitnize.onrender.com/${rowData.assetIcon}`}
        className="border-round"
        alt={rowData.tokenName}
        style={{ width: "50px", height: "50px" }}
      />
    );
  };

  const renderPrice = (rowData) => {
    return `$${rowData.tokenPrice}`;
  };

  return (
    <Layout>
      <div>
        <h1>Shares Token Available for Sale</h1>
        <DataTable
          value={tokens}
          selectionMode="single"
          onRowSelect={onRowSelect}
        >
          <Column field="assetIcon" header="Icon" body={renderIcon} />
          <Column field="tokenName" header="Name" />
          <Column field="tokenSymbol" header="Token Symbol" />
          <Column field="amount" header="Total for Sale" />
          <Column field="owner.businessName" header="Seller" />
          <Column field="tokenPrice" header="Price" body={renderPrice} />
        </DataTable>
      </div>
      <Toast ref={toast} />
    </Layout>
  );
};

export default TokensForSale;
