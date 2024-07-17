import { ethers } from "ethers";

const API_BASE_URL = 'http://localhost:5000';

const setCookie = (name, value, hours) => {
    const date = new Date();
    date.setTime(date.getTime() + (hours * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
  };

export const registerUser = async (userData) => {
  const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(userData)
  });

  const data = await response.json();
    setCookie('Bit-Token', data.token, 24);
    sessionStorage.setItem('user', JSON.stringify(data.result));
    return data;
};

export const loginUser = async (userData) => {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(userData)
  });
  const data = await response.json();
    setCookie('Bit-Token', data.token, 24);
    sessionStorage.setItem('user', JSON.stringify(data.result));
    return data;
};

export const createToken = async (tokenData) => {
    const response = await fetch(`${API_BASE_URL}/api/business-token/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(tokenData),
      withCredentials: true,
      credentials: 'include',

    });
    const data = await response.json();
      return data;
  };

  export const saveFile = async (file) => {
    const response = await fetch(`${API_BASE_URL}/api/business-token/save-file`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({file}),
      withCredentials: true,
      credentials: 'include',

    });
    const data = await response.json();
      return data;
  };

  export const getPortfolio = async () => {
    const response = await fetch(`${API_BASE_URL}/api/user/assets`, {
      method: 'GET',
      withCredentials: true,
      credentials: 'include',

    });
    const data = await response.json();
      return data;
  };

  export const fetchTokenDetails = async (tokenId) => {
    const response = await fetch(`${API_BASE_URL}/api/asset/${tokenId}`, {
      method: 'GET',
      withCredentials: true,
      credentials: 'include',

    });
    const data = await response.json();
      return data;
  };

  export const fetchBuyTransaction = async (tokenId) => {
    const response = await fetch(`${API_BASE_URL}/api/transaction/${tokenId}`, {
      method: 'GET',
      withCredentials: true,
      credentials: 'include',

    });
    const data = await response.json();
      return data;
  };

  export const fetchTokensForSale = async () => {
    const response = await fetch(`${API_BASE_URL}/api/asset/`, {
      method: 'GET',
      withCredentials: true,
      credentials: 'include',

    });
    const data = await response.json();
      return data;
  };

  export const fetchBoughtTokensForSale = async () => {
    const response = await fetch(`${API_BASE_URL}/api/transaction/`, {
      method: 'GET',
      withCredentials: true,
      credentials: 'include',

    });
    const data = await response.json();
      return data;
  };

  export const fetchBoughtTokens = async (userId) => {
    const response = await fetch(`${API_BASE_URL}/api/transaction/all/${userId}`, {
      method: 'GET',
      withCredentials: true,
      credentials: 'include',

    });
    const data = await response.json();
      return data;
  };

  export const convertPriceToWei = async (priceInUSD) => {
    try {
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd', {
            method: 'GET',
        });
        const data = await response.json();
        const ethToUsd = data.ethereum.usd;
        const parsedPriceInUSD = parseFloat(priceInUSD);
        if (isNaN(parsedPriceInUSD)) {
            throw new Error('Invalid price input');
        }
        const priceInEth = parsedPriceInUSD / ethToUsd;
        const priceInWei = ethers.utils.parseUnits(priceInEth.toFixed(18), 'ether');
        return priceInWei;
    } catch (error) {
        console.error("Error fetching conversion rate:", error);
        throw new Error("Failed to convert price to wei.");
    }
};

export const saveTransferRequest = async (transferDetails) => {
    const response = await fetch(`${API_BASE_URL}/api/transfer/request`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(transferDetails),
      withCredentials: true,
      credentials: 'include',
    });

    const data = await response.json();
    return data;
  };

export const addWallet = async (userId, address) => {
        const response = await fetch(`${API_BASE_URL}/api/user/addWallet`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            withCredentials: true,
      credentials: 'include',
            body: JSON.stringify({ userId, walletAddress: address }),
        });

        const data = await response.json();
    return data;
}

export const createBuyTransaction = async (transactionData) => {
    const response = await fetch(`${API_BASE_URL}/api/transaction/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      credentials: 'include',
        body: JSON.stringify({...transactionData}),
      });
      const data = await response.json();
    return data;
}

export const fetchPendingTransfers = async (userId) => {
    const response = await fetch(`${API_BASE_URL}/api/transfer/pending/${userId}`, {
        method: 'GET',

        withCredentials: true,
        credentials: 'include',

      });
    return await response.json();
};

export const fetchPendingSettle = async (userId) => {
    const response = await fetch(`${API_BASE_URL}/api/transfer/settle/${userId}`, {
        method: 'GET',

        withCredentials: true,
        credentials: 'include',

      });

    return await response.json();
};

export const approveTransfer = async (transferId, documentsURI) => {

    const response = await fetch(`${API_BASE_URL}/api/transfer/approve/${transferId}`, {
        method: 'POST',

        headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        credentials: 'include',
        body: JSON.stringify({documentsURI}),
    });
    return await response.json();
};
