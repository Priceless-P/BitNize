import React from 'react';
import { useBalance } from "@thirdweb-dev/react";

const Balance = ({ contractAddress, onBalanceFetch }) => {
  const { data: balance, isLoading } = useBalance(contractAddress);

  React.useEffect(() => {
    if (balance) {
      onBalanceFetch(contractAddress, balance.displayValue);
    }
  }, [balance, contractAddress, onBalanceFetch]);

  return (
    <div>
      {isLoading ? 'Loading...' : `${balance ? balance.displayValue : 0}`}
    </div>
  );
};

export default Balance;
