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

    BusinessDetails public businessDetails;
    uint256 public tokenPrice; // Price per token in wei
    uint256 public constant TOTAL_SUPPLY = 10000 * 10**18; // 100 tokens = 1% shares

    // Indicate whether the token can still be issued by the issuer or not anymore
    bool internal _isIssuable;

    // Modifier to verify if token is issuable
    modifier issuableToken() {
        require(_isIssuable, "Token issuance is disabled");
        _;
    }

    /**
     * @dev Constructor to initialize BusinessSharesToken
     * @param businessName Name of the business.
     * @param location Business location.
     * @param yearStarted Year the business started.
     * @param legalDocumentsURI URI for legal documents.
     */
    constructor(
        string memory businessName,
        string memory location,
        uint256 yearStarted,
        string memory legalDocumentsURI
    ) ERC20("BusinessSharesToken", "BST") {
        _isIssuable = true; // By default, the token is issuable
        businessDetails = BusinessDetails({
            name: businessName,
            location: location,
            yearStarted: yearStarted,
            legalDocumentsURI: legalDocumentsURI
        });
        _mint(msg.sender, TOTAL_SUPPLY); // Mint the initial supply to the owner
    }

    /**
     * @dev Set token price
     * @param price Price per token in wei
     */
    function setTokenPrice(uint256 price) external onlyOwner {
        tokenPrice = price;
    }

    /**
     * @dev Buy tokens
     * @param amount Number of tokens to buy
     */
    function buyTokens(uint256 amount) external payable issuableToken {
        require(msg.value >= amount * tokenPrice, "Insufficient funds");
        _mint(msg.sender, amount);
    }

    /**
     * @dev Get business details
     */
    function getBusinessDetails() external view returns (string memory, string memory, uint256, string memory) {
        return (businessDetails.name, businessDetails.location, businessDetails.yearStarted, businessDetails.legalDocumentsURI);
    }

    /**
     * @dev Set issuability of the token
     * @param issuable Boolean indicating if the token should be issuable or not
     */
    function setIssuable(bool issuable) external onlyOwner {
        _isIssuable = issuable;
    }
}
