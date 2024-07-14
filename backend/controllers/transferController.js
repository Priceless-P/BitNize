const asyncHandler = require("express-async-handler");
const Transfer = require("../models/transferModel");
const Asset = require("../models/assetModel");

class TransferController {
    requestTransfer = asyncHandler(async (req, res) => {
        const { from, to, amount, assetId } = req.body;

        if (!from || !to || !amount || !assetId) {
            return res.status(400).send({
                success: false,
                message: "Incomplete details. From, to, amount or assetId is missing",
                result: "",
            });
        }

        const asset = await Asset.findById(assetId);
        if (!asset) {
            return res.status(404).send({
                success: false,
                message: "Asset not found",
                result: "",
            });
        }

        const transfer = new Transfer({
            from,
            to,
            amount,
            asset: assetId,
        });

        const savedTransfer = await transfer.save();
        return res.status(201).send({
            success: true,
            message: "Transfer request created successfully",
            result: savedTransfer,
        });
    });

   pendingApproval = asyncHandler(async (req, res) => {
    try {
        const transfers = await Transfer.find({ from: req.params.userId, approved: false }).populate('to').populate('asset');
        res.json({ success: true, result: transfers });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
   })

   pendingSettle = asyncHandler(async (req, res) => {
    try {
        const transfers = await Transfer.find({ to: req.params.userId, approved: true, isSettled: false }).populate('from').populate('asset').populate("to");
        res.json({ success: true, result: transfers });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
   })

    approveTransfer = asyncHandler(async (req, res) => {
        const { documentsURI } = req.body;
        const { transferId } = req.params;console.log(req.body)
    console.log(transferId, documentsURI)
        if (!transferId || !documentsURI) {
            return res.status(400).send({
                success: false,
                message: "Incomplete details. TransferId or documentsURI is missing",
                result: "",
            });
        }

        const transfer = await Transfer.findById(transferId);
        if (!transfer) {
            return res.status(404).send({
                success: false,
                message: "Transfer request not found",
                result: "",
            });
        }

        transfer.documentsURI = documentsURI;
        transfer.approved = true;
        transfer.updatedAt = Date.now();

        const updatedTransfer = await transfer.save();
        return res.status(200).send({
            success: true,
            message: "Transfer approved successfully",
            result: updatedTransfer,
        });
    });

    // Claim/Payment
    claimTransfer = asyncHandler(async (req, res) => {
        const { transferId } = req.body;

        if (!transferId) {
            return res.status(400).send({
                success: false,
                message: "Incomplete details. TransferId is missing",
                result: "",
            });
        }

        const transfer = await Transfer.findById(transferId);
        if (!transfer) {
            return res.status(404).send({
                success: false,
                message: "Transfer request not found",
                result: "",
            });
        }

        if (!transfer.approved) {
            return res.status(400).send({
                success: false,
                message: "Transfer not approved",
                result: "",
            });
        }

        // Implement the payment logic here

        // After payment is successful
        await Transfer.findByIdAndDelete(transferId);
        return res.status(200).send({
            success: true,
            message: "Transfer claimed and completed successfully",
            result: "",
        });
    });
}
module.exports = new TransferController();
