import React, { useContext, useState, useCallback } from 'react';
import { WalletContext } from './WalletContext';
import { Chart, ArcElement } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import Balance from '../../../functions/useBalances';

Chart.register(ArcElement);

const Stats = ({ contractAddresses }) => {
  const { walletInfo } = useContext(WalletContext);
  const [balances, setBalances] = useState({});


  const handleBalanceFetch = useCallback((contractAddress, balance) => {
    setBalances(prevBalances => ({ ...prevBalances, [contractAddress]: balance }));
  }, []);

  // Generate a color palette
  const generateColors = (numColors) => {
    const colors = [];
    for (let i = 0; i < numColors; i++) {
      const color = `hsl(${(i * 360) / numColors}, 70%, 50%)`;
      colors.push(color);
    }
    return colors;
  };

  const colors = generateColors(contractAddresses.length);

  const data = {
    labels: Object.keys(balances),
    datasets: [
      {
        label: 'Wallet Balances',
        data: Object.values(balances),
        backgroundColor: colors,
        hoverOffset: 4
      }
    ]
  };

  return (
    <div>
      {walletInfo.isConnected ? (
        <div>
          <h4>Token Balances</h4>
          {contractAddresses.map((address) => (

            <Balance
              key={address}
              contractAddress={address}
              onBalanceFetch={handleBalanceFetch}
            />
          )) }
          <Doughnut data={data} />
          <p>Total Balance: {Object.values(balances).reduce((acc, balance) => acc + parseFloat(balance), 0)} <b>tRBTC</b></p>
        </div>
      ) : (
        <p></p>
      )}
    </div>
  );
};

export default Stats;
