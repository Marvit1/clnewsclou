export const suppressMetaMaskErrors = () => {
  if (typeof window === "undefined") return;

  // Suppress MetaMask console errors
  const originalError = console.error;
  console.error = (...args: any[]) => {
    const message = args[0]?.toString() || "";
    
    // Filter out MetaMask related errors
    if (
      message.includes("MetaMask") ||
      message.includes("chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn") ||
      message.includes("Failed to connect to MetaMask")
    ) {
      return;
    }
    
    originalError.apply(console, args);
  };

  // Suppress unhandled promise rejections from MetaMask
  window.addEventListener("unhandledrejection", (event) => {
    const reason = event.reason?.message || event.reason?.toString() || "";
    
    if (
      reason.includes("MetaMask") ||
      reason.includes("chrome-extension") ||
      reason.includes("Failed to connect")
    ) {
      event.preventDefault();
    }
  });
};
