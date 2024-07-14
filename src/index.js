import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { WalletProvider } from './components/User/Dashboard/WalletContext';
import { ThirdwebProvider, metamaskWallet,
    coinbaseWallet,
    walletConnect, okxWallet, trustWallet, ChainId } from '@thirdweb-dev/react';
const activeChainId = ChainId.rskTestnet;

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
   <ThirdwebProvider supportedWallets={[
        metamaskWallet({
          recommended: true,
        }),
        trustWallet(),
        okxWallet(),
        coinbaseWallet(),
        walletConnect(),
      ]}
      activeChain={activeChainId}
      chainId={activeChainId}
      clientId={"df7aa090f80a0235adc4cebf6a37adce"}>

    <WalletProvider>
        <App />
    </WalletProvider>
    </ThirdwebProvider>,
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
