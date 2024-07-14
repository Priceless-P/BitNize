import React, { useEffect, useState } from 'react';
import { Button } from 'primereact/button';
import { Panel } from 'primereact/panel';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { fetchPendingSettle } from '../../../functions/api';
import { claimTokens } from '../../../functions/contracts';
import Layout from './Layout/Layout';

const PendingSettle = () => {
  const [pendingSettles, setPendingSettles] = useState([]);

  useEffect(() => {
    const fetchPendingSettles = async () => {
      const userString = sessionStorage.getItem("user");
      if (userString) {
        const userObject = JSON.parse(userString);
        const userId = userObject._id;
        const response = await fetchPendingSettle(userId);
        if (response.success) {
          setPendingSettles(response.result);
        }
      }
    };

    fetchPendingSettles();
  }, []);

  const handleClaimTokens = async (settle) => {
    try {
    console.log(settle)
      await claimTokens(settle.to.wallets[0], settle.amount, settle.asset.assetContractAddress);

    } catch (error) {
      console.error("Error claiming tokens:", error);
    }
  };

  const calculateCost = (amount, tokenPrice) => {
    const total =  amount * tokenPrice;
    return `$${total}`
  };

  const price = (rowData) => {
    return `$${rowData.asset.tokenPrice}`
  };

  const amountTemplate = (rowData) => {
    return `${rowData.amount} ${rowData.asset.tokenSymbol} tokens`;
  };

  const costTemplate = (rowData) => {
    return calculateCost(rowData.amount, rowData.asset.tokenPrice);
  };

  return (
    <Layout>
      <Panel header="Pending Settlements">
        {pendingSettles.length > 0 ? (
          <DataTable value={pendingSettles}>
            <Column field="from.name" header="Seller" body={rowData => `${rowData.from.firstName} ${rowData.from.lastName}`} />
            <Column field="amount" header="Amount" body={amountTemplate} />
                      <Column field="asset.tokenPrice" header="Token Price" body={ price} />
            <Column field="asset.tokenName" header="Asset" body={rowData => rowData.asset.tokenName} />
            <Column field="cost" header="Cost" body={costTemplate} />
            <Column
              header="Actions"
              body={(rowData) => (
                <Button label="Claim Tokens" onClick={() => handleClaimTokens(rowData)} />
              )}
            />
          </DataTable>
        ) : (
          <p>No pending settlements found.</p>
        )}
      </Panel>
    </Layout>
  );
};

export default PendingSettle;
