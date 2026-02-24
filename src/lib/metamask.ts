export const connectMetaMask = async () => {
  try {
    // Check if MetaMask is installed
    if (!window.ethereum) {
      throw new Error("MetaMask is not installed");
    }

    // Request account access
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    return accounts[0];
  } catch (error) {
    console.error("MetaMask connection failed:", error);
    throw error;
  }
};

declare global {
  interface Window {
    ethereum?: any;
  }
}