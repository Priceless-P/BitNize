## BitNize

## Introduction
**BitNize** is a tokenization platform specifically built for tokenizing equity for small and medium-sized businesses. It provides a way for businesses to get liquidity and attract investors, offering them an opportunity to invest and gain returns. Investors can also sell the equity they buy to other investors on the platform or back to the company if they wish. It's a win-win for everybody.
Built on Rootstock, a Bitcoin sidechain, BitNize is secure, reliable, and efficient. Created tokens represent real-world equity of real existing businesses, allowing you to manage your investment without any third party directly.


## Features
### Registration and Tokenization Process

1. **Company Registration**: Companies indicate their business name, location, and start date, among other details.
2. **Document Submission**: Before equity is tokenized, business owners must provide documents about the business, including its valuation and expected profits.
3. **Token Value Update**: The value of tokens is updated as specified in the documents or whenever agreed upon.

### Investment and Ownership

1. **Buying Equity Tokens**: When an investor wants to buy equity tokens, the company provides a document outlining the terms of the agreement. If both parties agree, the equity tokens are transferred to the investor’s wallet, and the value of tokens bought is transferred to the company’s wallet.
2. **Selling Equity Tokens**: Documents indicating the transfer/proof of ownership are provided when investors want to sell their equity. Companies are notified of the change in ownership and must give their consent. These documents are stored on the blockchain, making them indestructible.
3. **Restricted Transfers**: Assets cannot be moved from wallet to wallet outside of the platform.

## Requirement
You need to have Redis installed. Click [here](https://redis.io/docs/latest/operate/oss_and_stack/install/install-redis/) to get it if you don't have it already.

## Installation

Clone the repository:

```bash
git clone https://github.com/Priceless-P/BitNize.git
cd BitNize
```
#### Install Frontend dependencies:

```bash
npm install
```

#### Install Backend dependencies:

```bash
cd backend
npm install
```

#### Set up environment variables

Copy .env-sample file to .env in the backend directory.

#### Start backend with
```bash
npm start
```
Backend will be running on `http://localhost:5000`

Start frontend
```bash
cd ../
npm start
```
Frontend will be running on `http://localhost:3000`

#### Stacks used:
- Solidity
- Rootstock
- Reactjs
- Nodejs
- MongoDB
- Redis
- Etherjs
- Prime React (For styling)

#### Stacks that we intend to integrate
- Anduro Alys
- Maybe lightning



