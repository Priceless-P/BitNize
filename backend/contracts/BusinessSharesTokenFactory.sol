// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./BusinessSharesToken.sol";

contract BusinessSharesTokenFactory {
    address[] public allTokens;

    event TokenCreated(address indexed tokenAddress);

    function createBusinessSharesToken(
        string memory tokenName,
        string memory tokenSymbol,
        string memory documentsURI,
        uint256 initialSupplyPercentage,
        uint256 _tokenPrice
    ) external returns (address) {
        BusinessSharesToken newToken = new BusinessSharesToken(
        tokenName,
        tokenSymbol,
        documentsURI,
        initialSupplyPercentage,
        _tokenPrice
        );
        newToken.transferOwnership(msg.sender);
        allTokens.push(address(newToken));
        emit TokenCreated(address(newToken));
        return address(newToken);
    }

    function getAllTokens() external view returns (address[] memory) {
        return allTokens;
    }
}
