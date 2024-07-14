// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


contract BusinessSharesToken is ERC20, Ownable(msg.sender) {
    struct BusinessDetails {
        string name;
        string location;
        uint256 yearStarted;
        string legalDocumentsURI;
    }
    struct TokenDetails {
        string tokenName;
        string tokenSymbol;
        string documentsURI;
        uint256 tokenPrice;
    }

    struct ShareTransfer {
        address from;
        address to;
        uint256 amount;
        string documentsURI;
        bool approved;
    }

    BusinessDetails public businessDetails;
    TokenDetails public tokenDetails;
    uint256 public tokenPrice;
    uint256 public constant MAX_TOTAL_SUPPLY = 1000 * 10 ** 18;
    bool internal _isIssuable;
    uint256 public totalMintedSupply;
    uint256 public totalAvailableToBuy;
    event BuyTokensDebug(string message);


    mapping (uint256 => ShareTransfer) public shareTransfers;
    uint256 public transferCount;

    // Address that can approve transfers
    address public approvingAddress;


    modifier onlyApproved(uint256 transferId) {
        require(shareTransfers[transferId].approved, "Transfer not approved");
        _;
    }

    modifier onlyTransferable() {
        require(msg.sender == approvingAddress, "Transfer not allowed");
        _;
    }

    // Modifier to verify if token is issuable
    modifier issuableToken() {
        require(_isIssuable, "Token issuance is disabled");
        _;
    }


    constructor(
        string memory tokenName,
        string memory tokenSymbol,
        string memory documentsURI,
        uint256 initialSupplyPercentage,
        uint256 _tokenPrice
    ) ERC20(tokenName, tokenSymbol) {
    require(initialSupplyPercentage <= 100, "Initial supply percentage must be between 0 and 100");

        _isIssuable = true; // By default, the token is issuable

        tokenDetails = TokenDetails({
            tokenName: tokenName,
            tokenSymbol: tokenSymbol,
            documentsURI: documentsURI,
            tokenPrice: _tokenPrice
        });
        uint256 initialSupply = (initialSupplyPercentage * MAX_TOTAL_SUPPLY) / 100;
        _mint(address(this), initialSupply);

        tokenPrice = _tokenPrice;
        totalMintedSupply = initialSupply;
        totalAvailableToBuy = initialSupply;
        approvingAddress = address(this);
    }

    /**
     * @dev Set token price
     * @param price Price per token in wei
     */
    function setTokenPrice(uint256 price) external onlyOwner {
        tokenDetails.tokenPrice = price;
    }

    function mintTokens(uint256 amount) external onlyOwner issuableToken {
        uint256 _amount = (amount * MAX_TOTAL_SUPPLY) / 100;
        require(totalMintedSupply + _amount <= MAX_TOTAL_SUPPLY, "Cannot exceed max total supply");
        _mint(address(this), _amount);
        totalMintedSupply += _amount;
        totalAvailableToBuy += _amount;
    }

    /**
     * @dev Buy tokens
     * @param amount Number of tokens to buy
     */
/**
     * @dev Buy tokens
     * @param amount Number of tokens to buy
     */
function buyTokens(uint256 amount, address receiving_address) external payable issuableToken {
    emit BuyTokensDebug("Just started");
    uint256 requiredValue = amount * tokenPrice;
    require(msg.value >= requiredValue, "Insufficient funds");
    require(totalAvailableToBuy >= amount, "Not enough shares available");

    emit BuyTokensDebug("Before transfer to company's wallet");

    // Transfer payment to the company's wallet
    payable(receiving_address).transfer(requiredValue);

    emit BuyTokensDebug("After transfer to company's wallet");

    // Refund excess ETH to the buyer
    if (msg.value > requiredValue) {
        payable(msg.sender).transfer(msg.value - requiredValue);
    }

    emit BuyTokensDebug("After refunding excess ETH");

    // Transfer tokens from contract to the buyer
    totalAvailableToBuy -= amount;
    _transfer(address(this), msg.sender, amount * 10**decimals());

    emit BuyTokensDebug("After transferring tokens");
}


    /**
     * @dev Get business details
     */
    function getBusinessDetails() external view returns (string memory, string memory, uint256, string memory) {
        return (
            businessDetails.name,
            businessDetails.location,
            businessDetails.yearStarted,
            businessDetails.legalDocumentsURI
        );
    }

    /**
     * @dev Set issuability of the token
     * @param issuable Boolean indicating if the token should be issuable or not
     */
    function setIssuable(bool issuable) external onlyOwner {
        _isIssuable = issuable;
    }

function requestTransfer(address from, address to, uint256 amount) external {
        transferCount++;
        shareTransfers[transferCount] = ShareTransfer({
            from: from,
            to: to,
            amount: amount,
            documentsURI: "",
            approved: false
        });
    }

    function getTransferId(address to, uint256 amount) public view returns (uint256) {
        for (uint256 i = 1; i <= transferCount; i++) {
            if (
                shareTransfers[i].to == to &&
                shareTransfers[i].amount == amount
                // shareTransfers[i].approved
            ) {
                return i;
            }
        }
        return 0;
    }

    function approveTransfer(uint256 transferId, string memory documentsURI) public {
        ShareTransfer storage transfer_ = shareTransfers[transferId];
        require(transfer_.from != address(0), "Invalid transfer request");
        require(transfer_.to != address(0), "Invalid transfer request");
        transfer_.documentsURI = documentsURI;
        transfer_.approved = true;
    }

    function buyAndTransferTokens(uint256 transferId) external payable onlyApproved(transferId){
        ShareTransfer storage transfer_ = shareTransfers[transferId];
        require(transfer_.to == msg.sender, "Only the buyer can complete the transfer");
        require(bytes(transfer_.documentsURI).length > 0, "Documents not present");

        uint256 payableAmount = transfer_.amount * tokenPrice;
        require(msg.value >= payableAmount, "Insufficient rBTC sent");

        // Transfer tokens from seller to buyer
        _transfer(transfer_.from, transfer_.to, transfer_.amount * 10**decimals());

        // Transfer Ether from buyer to seller
        payable(transfer_.from).transfer(payableAmount);

        // Refund excess Ether if any
        if (msg.value > payableAmount) {
            payable(msg.sender).transfer(msg.value - payableAmount);
        }

        // Remove transfer request from mapping
        delete shareTransfers[transferId];
    }

    function verifyAndTransferTokens(uint256 transferId) public {
    ShareTransfer storage transfer_ = shareTransfers[transferId];
    require(transfer_.to == msg.sender, "Only the buyer can complete the transfer");
    require(bytes(transfer_.documentsURI).length > 0, "Documents not present");
    _transfer(transfer_.from, transfer_.to, transfer_.amount * 10**decimals());
}

function transferAndRefund(uint256 transferId) public payable{
    ShareTransfer storage transfer_ = shareTransfers[transferId];
    uint256 payableAmount = transfer_.amount * tokenPrice;
require(msg.value >= payableAmount, "Insufficient rBTC sent");
    payable(transfer_.from).transfer(payableAmount);

    if (msg.value > payableAmount) {
        payable(msg.sender).transfer(msg.value - payableAmount);
    }

    delete shareTransfers[transferId];
}

    function transfer(address recipient, uint256 amount) public override returns (bool) {
        uint256 transferId = getTransferId(recipient, amount);
        require(transferId != 0, "Transfer not requested");
        ShareTransfer storage transfer_ = shareTransfers[transferId];
        require(bytes(transfer_.documentsURI).length > 0, "Documents not present");
        approveTransfer(transferId, transfer_.documentsURI);
        return super.transfer(recipient, amount);
    }

    function transferFrom(address sender, address recipient, uint256 amount) public override returns (bool) {
        uint256 transferId = getTransferId(recipient, amount);
        require(transferId != 0, "Transfer not requested");
        ShareTransfer storage transfer_ = shareTransfers[transferId];
        require(bytes(transfer_.documentsURI).length > 0, "Documents not present");
        approveTransfer(transferId, transfer_.documentsURI);
        return super.transferFrom(sender, recipient, amount);
    }

    /**
     * @dev Set the address of the approving contract.
     * @param _approvingAddress The address of the approving contract.
     */
    function setApprovingAddress(address _approvingAddress) external onlyOwner {
        approvingAddress = _approvingAddress;
    }

    function getTransferDetails(uint256 transferId) external view returns (address, address, uint256, string memory, bool) {
        ShareTransfer memory transfer_ = shareTransfers[transferId];
        return (transfer_.from, transfer_.to, transfer_.amount, transfer_.documentsURI, transfer_.approved);
    }

    function burnTokens(address from, uint256 amount) external onlyOwner {
        _burn(from, amount);
    }

    /**
     * @dev Fallback function to receive Ether
     */
    receive() external payable {}

    /**
     * @dev Withdraw Ether from the contract
     * @param amount Amount of Ether to withdraw
     */
    function withdrawEther(uint256 amount) external onlyOwner {
        payable(owner()).transfer(amount);
    }
}
