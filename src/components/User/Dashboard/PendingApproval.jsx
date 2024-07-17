import React, { useState, useEffect, useRef } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { FileUpload } from 'primereact/fileupload';
import { Toast } from 'primereact/toast';
import { useNavigate } from 'react-router-dom';
import { Dialog } from 'primereact/dialog';
import { fetchPendingTransfers, approveTransfer, saveFile } from '../../../functions/api';
import { approveTransfer as smartApproveTransfer, getTransferId } from '../../../functions/contracts';
import { convertToBase64 } from '../../../functions/utils';
import Layout from './Layout/Layout';

const PendingApproval = () => {
    const [transfers, setTransfers] = useState([]);
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(false);

    const toast = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPendingTransfersData = async () => {
            const userString = sessionStorage.getItem("user");
            if (userString) {
                const userObject = JSON.parse(userString);
                const userId = userObject._id;
                const response = await fetchPendingTransfers(userId);
                if (response.success) {
                    setTransfers(response.result);
                }
            }
        };

        fetchPendingTransfersData();
    }, []);

    const onFileSelect = async (e, fileKey) => {
        const file = e.files[0];
        const base64 = await convertToBase64(file);
        setFormData((prevState) => ({
            ...prevState,
            [fileKey]: base64,
        }));
    };

    const handleApprove = async (transfer) => {
        try {
            setLoading(true)
            const documentURISave = await saveFile({ file: formData.documentsURI });
            const documentURI = documentURISave.result;
            console.log(documentURI)
            const transferId = await getTransferId(transfer.to.wallets[0], transfer.amount, transfer.asset.assetContractAddress)
            console.log(transferId.toString())
            const tx = await smartApproveTransfer(transferId, documentURI, transfer.asset.assetContractAddress);
            console.log(tx)
            const response = await approveTransfer(transfer._id, formData.documentsURI);
            if (response.success) {
                const updatedTransfers = transfers.filter(t => t._id !== transfer._id);
                setTransfers(updatedTransfers);
                toast.current.show({
                    severity: "success",
                    summary: "Success",
                    detail: "Transfer approved",
                });

                navigate('/dashboard')
            }
        } catch (error) {
            console.error("Error approving transfer:", error);
            toast.current.show({
                severity: "error",
                summary: "Error",
                detail: "Error approving transfer",
            });
        } finally{
            setLoading(false)
        }
    };

    return (
        <Layout>
            <div className="p-grid">
            <Dialog
          header="Approving Request"
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
                {transfers.map(transfer => (
                    <div key={transfer._id} className="p-col-12">
                        <Card title={`${transfer.to.firstName} ${transfer.to.lastName} wants to buy your token`} style={{ marginBottom: '20px' }}>
                            <p><strong>Email:</strong> {transfer.to.email}</p>
                            <p><strong>Amount:</strong> {transfer.amount} {transfer.asset.tokenSymbol} token</p>
                            <div className="p-field p-col-12 p-md-6">
                                <label htmlFor="documentsURI" className="block text-900 font-medium mb-2">Ownership Documents</label>
                                <FileUpload
                                    mode="basic"
                                    name="documents"
                                    accept="application/pdf"
                                    className="document"
                                    maxFileSize={1000000}
                                    onSelect={(e) => onFileSelect(e, "documentsURI")}
                                />
                                <small className="block text-600">{`Attach documents showing transfer of asset ownership to ${transfer.to.firstName} ${transfer.to.lastName}`}</small>
                            </div>
                            <Button label="Approve" onClick={() => handleApprove(transfer)} className='mt-5'/>
                        </Card>
                    </div>
                ))}
            </div>
            <Toast ref={toast} />
        </Layout>
    );
};

export default PendingApproval;
