const asyncHandler = require("express-async-handler");
const Transaction = require("../models/transactionModel");
const Asset = require("../models/assetModel");

class TransactionController {
    createTransaction = asyncHandler(async (req, res) => {
        const { asset, buyer, seller, amount, price, transactionHash, isForSale } = req.body;

        if (!asset || !buyer || !amount || !price || !transactionHash) {
            return res.status(400).send({
                success: false,
                message: "Incomplete details. Asset, buyer, amount, price or transactionHash is missing",
                result: "",
            });
        }

        const transaction = new Transaction({
            asset,
            buyer,
            seller,
            amount,
            price,
            transactionHash,
            isForSale,
        });

        const savedTransaction = await transaction.save();
        const asset_ = await Asset.findById(asset);
        //console.log(amount)
        //asset_.totalAvailableForPurchase -= amount;
        await asset_.save();
        return res.status(201).send({
            success: true,
            message: "Transaction stored successfully",
            result: savedTransaction,
        });
    });
    getForUserTransactions = asyncHandler(async (req, res) => {
        try {
            const transactions = await Transaction.find({ buyer: req.params.userId }).populate({
                path: 'asset',
                populate: {
                    path: 'owner',
                    model: 'User'
                }
            }).populate('buyer');
            return res.status(200).send({
                success: true,
                message: "User Transactions retrieved successfully",
                result: transactions,
            });
        } catch (error) {
            return res.status(500).send({
                success: false,
                message: "Error retrieving user transactions",
                result: error.message,
            });
        }
    });

    getForSaleTransactions = asyncHandler(async (req, res) => {
        try {
            const transactions = await Transaction.find({ isForSale: true }).populate({
                path: 'asset',
                populate: {
                    path: 'owner',
                    model: 'User'
                }
            }).populate('buyer');
            return res.status(200).send({
                success: true,
                message: "For sale transactions retrieved successfully",
                result: transactions,
            });
        } catch (error) {
            return res.status(500).send({
                success: false,
                message: "Error retrieving for sale transactions",
                result: error.message,
            });
        }
    });

    getTokenTransactions = asyncHandler(async (req, res) => {
        try {
            const {id} = req.params;
            const transactions = await Transaction.findById(id).populate({
                path: 'asset',
                populate: {
                    path: 'owner',
                    model: 'User'
                }
            }).populate('buyer');
            return res.status(200).send({
                success: true,
                message: "Transactions retrieved successfully",
                result: transactions,
            });
        } catch (error) {
            return res.status(500).send({
                success: false,
                message: "Error retrieving transactions",
                result: error.message,
            });
        }
    });
}
module.exports = new TransactionController();
