import React, { useEffect, useState } from 'react';
import { Button } from 'primereact/button';
import { Panel } from 'primereact/panel';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { fetchPendingSettle, createBuyTransaction } from '../../../functions/api';
import { claimTokens } from '../../../functions/contracts';
import Layout from './Layout/Layout';
import { toast } from 'react-toastify';

const PendingSettle = () => {
  const [pendingSettles, setPendingSettles] = useState([]);
  const [loading, setLoading] = useState(false);

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
        setLoading(true)
        const userString = sessionStorage.getItem("user");
      const userObject = JSON.parse(userString);
      const userId = userObject._id;

      const transactionData = {
        asset: settle._id,
        buyer: userId,
        seller: settle.to,
        amount: settle.amount,
        price: settle.tokenPrice,
        // transactionHash,
        isForSale: false,
      };
      console.log("Transaction Data", transactionData)
    console.log(settle.to.wallets[0], settle.amount)
      const transactionHash = await claimTokens(settle.to.wallets[0], settle.amount, settle.asset.assetContractAddress);
      const response = await createBuyTransaction(transactionData);

    toast.success("Token claimed")
    } catch (error) {
      console.error("Error claiming tokens:", error);
      toast.error("An error occurred", error.message)
    } finally {
        setLoading(false)}
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
     <Dialog
          header="Claiming Token"
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
