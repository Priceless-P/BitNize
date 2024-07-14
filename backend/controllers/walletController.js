import { HDNodeWallet, Wallet, ethers, utils } from "ethers";
import {
  setEncryptedPrivateKey,
  getEncryptedPrivateKey,
  getStoredWalletAddresses,
  setWalletMnemonics,
  getWalletMnemonics,
} from "./indexedDBController";

export const createWallet = async (password, provider) => {
  const mnemonic = HDNodeWallet.createRandom().mnemonic;
  const newWallet = HDNodeWallet.fromPhrase(mnemonic.phrase);
  newWallet.connect(provider);
  const encryptedWallet = await newWallet.encrypt(password);
  await setEncryptedPrivateKey(newWallet.address, encryptedWallet);
  await setWalletMnemonics(newWallet.address, mnemonic.phrase);
  return newWallet;
};

export const loadWallet = async (password) => {
  const storedAddresses = await getStoredWalletAddresses();
  const loadedWallets = [];
  if (storedAddresses && storedAddresses.length > 0) {
    for (const storedAddress of storedAddresses) {
      try {
        const encryptedPrivateKey = await getEncryptedPrivateKey(storedAddress);
        if (encryptedPrivateKey) {
          const loadedWallet = await Wallet.fromEncryptedJson(
            encryptedPrivateKey,
            password
          );
          const mnemonic = await getWalletMnemonics(storedAddress);
          loadedWallet.mnemonic = { phrase: mnemonic };
          loadedWallets.push(loadedWallet);
        }
      } catch (err) {
        console.log("Load wallet Error:", err);
        return "Internal Server Error";
      }
    }
  }
  return loadedWallets;
};

export const importWalletFromMnemonics = async (phrase, provider) => {
  try {
    const wallet = HDNodeWallet.fromPhrase(phrase);
    wallet.connect(provider);
    return wallet;
  } catch (error) {
    console.error("Failed to import wallet from mnemonics:", error);
    return "Internal server error", error;
  }
};
