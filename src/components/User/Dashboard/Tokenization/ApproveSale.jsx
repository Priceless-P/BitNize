import React, { useState, useEffect, useRef, useContext } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { ethers } from 'ethers';
import { WalletContext } from '../WalletContext';
import Layout from '../Layout/Layout';
import { approveTransfer } from '../../../../functions/contracts'; // Import from contracts.js

const Approve = () => {
    const [requests, setRequests] = useState([]);
    const [filteredRequests, setFilteredRequests] = useState([]);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [documentsURI, setDocumentsURI] = useState('');
    const toast = useRef(null);
    const { walletInfo } = useContext(WalletContext);
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    useEffect(() => {
        const fetchRequests = async () => {
            const response = await fetch('/api/transfer-requests');
            const data = await response.json();
            setRequests(data);
            filterRequests(data);
        };
        fetchRequests();
    }, [walletInfo.account]);

    const filterRequests = (requests) => {
        if (walletInfo && walletInfo.account) {
            const filtered = requests.filter(request => request.owner === walletInfo.account && !request.approved);
            setFilteredRequests(filtered);
        }
    };

    useEffect(() => {
        filterRequests(requests);
    }, [requests, walletInfo.account]);

    const openModal = (request) => {
        setSelectedRequest(request);
        setShowModal(true);
    };

    const closeModal = () => {
        setSelectedRequest(null);
        setShowModal(false);
    };

    const handleApproveRequest = async () => {
        if (!selectedRequest) return;

        try {
            await approveTransfer(selectedRequest.requestId, documentsURI, selectedRequest.tokenContractAddress);

            await fetch(`/api/approve-transfer`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ requestId: selectedRequest.requestId, documentsURI }),
            });

            toast.current.show({ severity: 'success', summary: 'Success', detail: 'Transfer approved successfully' });
            closeModal();
            setRequests(prev => prev.map(req => req.requestId === selectedRequest.requestId ? { ...req, approved: true } : req));
        } catch (error) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: error.message || 'An error occurred' });
        }
    };

    return (
        <Layout>
            <Toast ref={toast} />
            <h1>Owner Dashboard</h1>
            <Dialog header="Pending Transfer Requests" visible={showModal} style={{ width: '50vw' }} onHide={closeModal}>
                <DataTable value={filteredRequests} selectionMode="single" onSelectionChange={e => openModal(e.value)}>
                    <Column field="requestId" header="Request ID" />
                    <Column field="tokenId" header="Token ID" />
                    <Column field="buyer" header="Buyer" />
                    <Column header="Actions" body={(rowData) => <Button label="Approve" onClick={() => openModal(rowData)} />} />
                </DataTable>
                {selectedRequest && (
                    <div>
                        <div className="p-field">
                            <label htmlFor="documentsURI">Documents URI</label>
                            <InputText id="documentsURI" value={documentsURI} onChange={(e) => setDocumentsURI(e.target.value)} />
                        </div>
                        <Button label="Submit" onClick={handleApproveRequest} />
                    </div>
                )}
            </Dialog>
        </Layout>
    );
};

export default Approve;
