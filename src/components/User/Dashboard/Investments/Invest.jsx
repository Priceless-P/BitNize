import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useNavigate } from "react-router-dom";
import Layout from "../Layout/Layout";
import { Toast } from "primereact/toast";
import { fetchTokensForSale } from "../../../../functions/api";

const Invest = () => {
  const [tokens, setTokens] = useState([]);
  const navigate = useNavigate();
  const toast = useRef(null);

  useEffect(() => {
    const fetchTokens = async () => {
      try {
        const response = await fetchTokensForSale();
        if (response.success) {
          const userString = sessionStorage.getItem("user");
          const userObject = JSON.parse(userString);

          // Filter out tokens where the owner's business name matches the user's business name
          const filteredTokens = response.result.filter(
            (token) => token.owner.businessName !== userObject.businessName
          );

          setTokens(filteredTokens);
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
    navigate(`/equity/${e.data._id}`);
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
        <h1>Open Equity Investment (Buy Directly from Companies)</h1>
        <DataTable
          value={tokens}
          selectionMode="single"
          onRowSelect={onRowSelect}
        >
          <Column field="assetIcon" header="Icon" body={renderIcon} />
          <Column field="tokenName" header="Name" />
          <Column field="tokenSymbol" header="Token Symbol" />
          <Column field="owner.businessName" header="Company" />
          <Column field="tokenPrice" header="Price" body={renderPrice} />
        </DataTable>
      </div>
      <Toast ref={toast} />
    </Layout>
  );
};

export default Invest;
