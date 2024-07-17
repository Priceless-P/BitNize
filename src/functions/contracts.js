import { ethers, BigNumber } from 'ethers';

const getContract = async (tokenAddress) => {
    if (!window.ethereum) {
        throw new Error("No wallet found");
    }

    await window.ethereum.request({ method: 'eth_requestAccounts' });
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    return new ethers.Contract(
        tokenAddress,
        require("../components/User/Dashboard/Tokenization/BusinessSharesToken.json").abi,
        signer
    );
};

export const buyTokens = async (tokenAddress, amount, account) => {
    const contract = await getContract(tokenAddress);

    const tokenPrice = await contract.tokenPrice();
    const decimals = await contract.decimals();
    const adjustedAmount = BigNumber.from(amount)
    const requiredValue = BigNumber.from(amount).mul(tokenPrice);
    const gasLimit = await contract.estimateGas.buyTokens(adjustedAmount, account);
    const gasPrice = (await contract.provider.getFeeData()).gasPrice;
    const tx = await contract.buyTokens(adjustedAmount, account, {
        value: requiredValue,
        gasLimit: gasLimit.mul(10),
        gasPrice: gasPrice
    });
    await tx.wait();
    return tx;
};

export const mintTokens = async (tokenAddress, initialSupply) => {
    const contract = await getContract(tokenAddress);
    const amount = BigNumber.from(initialSupply);
    const gasLimit = await contract.estimateGas.mintTokens(amount);
    const gasPrice = await contract.provider.getGasPrice();

    const tx = await contract.mintTokens(amount, {
        gasLimit: ethers.BigNumber.from(gasLimit).mul(ethers.BigNumber.from(10)),
        gasPrice: gasPrice
    });
    await tx.wait()
}
export const requestTransfer = async (from, to, amount, tokenAddress) => {
    const contract = await getContract(tokenAddress);
    const amount_ = BigNumber.from(amount).mul(BigNumber.from(10).pow(18));
    //const gasPrice = (await provider.getFeeData()).gasPrice;
    const gasLimit = await contract.estimateGas.requestTransfer(from, to, amount_);
    const gasPrice = await contract.provider.getGasPrice();

    const transaction = await contract.requestTransfer(from, to, amount_, {
        gasLimit: ethers.BigNumber.from(gasLimit).mul(ethers.BigNumber.from(10)),
        gasPrice: gasPrice
    });

    const tex = await transaction.wait();
    // console.log("Here", tex)
};
export const approveTransfer = async (transferId, documentsURI, tokenAddress) => {
    const contract = await getContract(tokenAddress);
    const gasLimit = await contract.estimateGas.approveTransfer(transferId, documentsURI);
    const gasPrice = await contract.provider.getGasPrice();

    const transaction = await contract.approveTransfer(transferId, documentsURI, {
        gasLimit: ethers.BigNumber.from(gasLimit),
        gasPrice: gasPrice
    });

    const tx = await transaction.wait();
    console.log(tx)
};

export const claimTokens = async (toAddress, amount, tokenAddress) => {
    const contract = await getContract(tokenAddress);
    console.log(BigNumber.from(amount).mul(BigNumber.from("10").pow(18)))
    const transferId = await contract.getTransferId(toAddress, BigNumber.from(amount).mul(BigNumber.from("10").pow(18)));
    console.log("Transfer Id", transferId.toString());
    const transfer = await contract.shareTransfers(transferId.toString());
    const tokenPrice = await contract.tokenPrice();
    const transferAmount = BigNumber.from(transfer.amount);

    const amount_ = BigNumber.from(transferAmount);
    const amount__ = amount_.div(BigNumber.from("10").pow(18));
    const payableAmount = (BigNumber.from(tokenPrice)) * BigNumber.from(amount);

    console.log(transfer)

    const gasLimit = await contract.estimateGas.buyAndTransferTokens(transferId);
    const gasPrice = await contract.provider.getGasPrice();

    const transaction = await contract.buyAndTransferTokens(transferId, {
      value: payableAmount,
      gasLimit: gasLimit * BigNumber.from(30),
    gasPrice: gasPrice
    });

    await transaction.wait();
};

export const getTokenForSale = async (tokenAddress) => {
    const contract = await getContract(tokenAddress);
    return await contract.totalAvailableToBuy();
}

export const getTransferId = async (to, amount, tokenAddress) => {
    const contract = await getContract(tokenAddress);
    return  await contract.getTransferId(to, BigNumber.from(amount).mul(BigNumber.from("10").pow(18)));
}