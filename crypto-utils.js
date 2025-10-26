/**
 * Cryptocurrency utilities for Bitcoin price fetching and validation
 */

/**
 * Fetch current Bitcoin price from a reliable API
 * @returns {Promise<number>} Current Bitcoin price in USD
 */
export async function fetchBitcoinPrice() {
  try {
    // Using CoinGecko API as it's free and reliable
    const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.bitcoin.usd;
  } catch (error) {
    console.error('Error fetching Bitcoin price:', error);
    
    // Fallback to a reasonable default price if API fails
    // This should be updated periodically or use a backup API
    return 45000; // Fallback price in USD
  }
}

/**
 * Validate Bitcoin address format
 * @param {string} address - Bitcoin address to validate
 * @returns {boolean} True if address format is valid
 */
export function validateBitcoinAddress(address) {
  if (!address || typeof address !== 'string') {
    return false;
  }

  // Basic Bitcoin address validation (Legacy, SegWit, and Bech32)
  const legacyPattern = /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/;
  const segwitPattern = /^3[a-km-zA-HJ-NP-Z1-9]{25,34}$/;
  const bech32Pattern = /^bc1[a-z0-9]{39,59}$/;

  return legacyPattern.test(address) || 
         segwitPattern.test(address) || 
         bech32Pattern.test(address);
}

/**
 * Convert USD amount to Bitcoin
 * @param {number} usdAmount - Amount in USD
 * @param {number} btcPrice - Current Bitcoin price in USD
 * @returns {number} Amount in Bitcoin
 */
export function convertUSDToBTC(usdAmount, btcPrice) {
  if (!usdAmount || !btcPrice || btcPrice <= 0) {
    throw new Error('Invalid USD amount or Bitcoin price');
  }
  
  return parseFloat((usdAmount / btcPrice).toFixed(8)); // Bitcoin has 8 decimal places
}

/**
 * Format Bitcoin amount for display
 * @param {number} btcAmount - Amount in Bitcoin
 * @returns {string} Formatted Bitcoin amount
 */
export function formatBitcoinAmount(btcAmount) {
  if (typeof btcAmount !== 'number' || isNaN(btcAmount)) {
    return '0.00000000 BTC';
  }
  
  return `${btcAmount.toFixed(8)} BTC`;
}

/**
 * Get Bitcoin transaction fee estimate (simplified)
 * @returns {number} Estimated transaction fee in BTC
 */
export function getEstimatedTransactionFee() {
  // This is a simplified estimate
  // In a real application, you'd fetch current network fees
  return 0.0001; // ~$4-5 at $45k BTC
}