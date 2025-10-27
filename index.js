import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import { RemixServer, Meta, Links, Outlet, ScrollRestoration, Scripts, LiveReload } from '@remix-run/react';
import { renderToString } from 'react-dom/server';
import { useState, useEffect, useRef, Suspense, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFrame, Canvas, useThree } from '@react-three/fiber';
import { Html, Plane, Cylinder, Box, Sky, Environment, Text, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

function handleRequest(request, responseStatusCode, responseHeaders, remixContext) {
  const markup = renderToString(
    /* @__PURE__ */ jsx(RemixServer, { context: remixContext, url: request.url })
  );
  responseHeaders.set("Content-Type", "text/html");
  return new Response("<!DOCTYPE html>" + markup, {
    status: responseStatusCode,
    headers: responseHeaders
  });
}

const entryServer = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: handleRequest
}, Symbol.toStringTag, { value: 'Module' }));

const tailwindStyles = "/assets/tailwind-DfKbB7Ia.css";

const links = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous"
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap"
  },
  { rel: "stylesheet", href: tailwindStyles }
];
function App() {
  return /* @__PURE__ */ jsxs("html", { lang: "en", className: "h-full", children: [
    /* @__PURE__ */ jsxs("head", { children: [
      /* @__PURE__ */ jsx("meta", { charSet: "utf-8" }),
      /* @__PURE__ */ jsx("meta", { name: "viewport", content: "width=device-width,initial-scale=1" }),
      /* @__PURE__ */ jsx("meta", { name: "description", content: "BettaDayz - Norfolk Business Empire PBBG" }),
      /* @__PURE__ */ jsx("meta", { name: "theme-color", content: "#1f2937" }),
      /* @__PURE__ */ jsx(Meta, {}),
      /* @__PURE__ */ jsx(Links, {})
    ] }),
    /* @__PURE__ */ jsxs("body", { className: "h-full bg-gray-50", children: [
      /* @__PURE__ */ jsx(Outlet, {}),
      /* @__PURE__ */ jsx(ScrollRestoration, {}),
      /* @__PURE__ */ jsx(Scripts, {}),
      /* @__PURE__ */ jsx(LiveReload, {})
    ] })
  ] });
}
function ErrorBoundary({ error }) {
  console.error(error);
  return /* @__PURE__ */ jsxs("html", { lang: "en", className: "h-full", children: [
    /* @__PURE__ */ jsxs("head", { children: [
      /* @__PURE__ */ jsx("title", { children: "Oh no!" }),
      /* @__PURE__ */ jsx(Meta, {}),
      /* @__PURE__ */ jsx(Links, {})
    ] }),
    /* @__PURE__ */ jsxs("body", { className: "h-full bg-gray-50", children: [
      /* @__PURE__ */ jsx("div", { className: "min-h-full flex items-center justify-center", children: /* @__PURE__ */ jsxs("div", { className: "max-w-md w-full bg-white shadow-lg rounded-lg p-6", children: [
        /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full", children: /* @__PURE__ */ jsx("svg", { className: "w-6 h-6 text-red-600", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" }) }) }),
        /* @__PURE__ */ jsxs("div", { className: "mt-3 text-center", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-lg font-medium text-gray-900", children: "Application Error" }),
          /* @__PURE__ */ jsx("div", { className: "mt-2 text-sm text-gray-500", children: /* @__PURE__ */ jsx("p", { children: "Something went wrong. Please try refreshing the page." }) }),
          /* @__PURE__ */ jsx("div", { className: "mt-4", children: /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => window.location.reload(),
              className: "inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500",
              children: "Refresh Page"
            }
          ) })
        ] })
      ] }) }),
      /* @__PURE__ */ jsx(Scripts, {})
    ] })
  ] });
}

const route0 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  ErrorBoundary,
  default: App,
  links
}, Symbol.toStringTag, { value: 'Module' }));

/**
 * Cryptocurrency utilities for Bitcoin price fetching and validation
 */

/**
 * Fetch current Bitcoin price from a reliable API
 * @returns {Promise<number>} Current Bitcoin price in USD
 */
async function fetchBitcoinPrice() {
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
 * Payment processing utilities for Cash App and Bitcoin transactions
 */


const PaymentStatus = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
  VERIFICATION_REQUIRED: 'verification_required'
};

class PaymentProcessor {
  /**
   * Generate payment instructions for the user
   */
  static generatePaymentInstructions(method, amount, userId) {
    if (method === 'cashapp') {
      return {
        cashtag: process.env.CASHAPP_CASHTAG || '$BettaDayzGame',
        amount: amount,
        note: `BettaDayz User: ${userId}`,
        instructions: 'Please include your user ID in the payment note for faster processing'
      };
    } else if (method === 'bitcoin') {
      return {
        address: process.env.BITCOIN_ADDRESS || 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
        amountUSD: amount,
        amountBTC: async () => {
          const btcPrice = await fetchBitcoinPrice();
          return (amount / btcPrice).toFixed(8);
        },
        instructions: 'Send the exact BTC amount to complete your purchase. Minimum 2 confirmations required.'
      };
    }
    throw new Error('Unsupported payment method');
  }

  /**
   * Verify a Cash App payment
   */
  static async verifyCashAppPayment(screenshot, amount, userId) {
    try {
      // Store screenshot for manual verification
      await storeVerificationDocument(screenshot, userId, 'cashapp');
      
      // Create pending transaction record
      const transactionId = await createTransactionRecord({
        type: 'cashapp',
        userId,
        amount,
        status: PaymentStatus.VERIFICATION_REQUIRED,
        metadata: {
          screenshotStored: true,
          submittedAt: new Date().toISOString()
        }
      });

      return {
        status: PaymentStatus.VERIFICATION_REQUIRED,
        transactionId,
        estimatedVerificationTime: '2-24 hours',
        message: 'Screenshot uploaded successfully. Our team will verify your payment within 24 hours.'
      };
    } catch (error) {
      console.error('Cash App verification error:', error);
      return {
        status: PaymentStatus.FAILED,
        error: 'Failed to process verification request'
      };
    }
  }

  /**
   * Verify a Bitcoin payment
   */
  static async verifyBitcoinPayment(txHash, amount, userId) {
    try {
      // Check blockchain confirmations
      const confirmations = await checkBitcoinConfirmations(txHash);
      
      if (confirmations >= 2) {
        const transactionId = await createTransactionRecord({
          type: 'bitcoin',
          userId,
          amount,
          status: PaymentStatus.COMPLETED,
          txHash,
          confirmations,
          completedAt: new Date().toISOString()
        });

        return {
          status: PaymentStatus.COMPLETED,
          transactionId,
          confirmations,
          message: 'Bitcoin payment confirmed successfully!'
        };
      } else if (confirmations > 0) {
        const transactionId = await createTransactionRecord({
          type: 'bitcoin',
          userId,
          amount,
          status: PaymentStatus.PENDING,
          txHash,
          confirmations
        });

        return {
          status: PaymentStatus.PENDING,
          transactionId,
          confirmations,
          requiredConfirmations: 2,
          message: `Payment detected! Waiting for ${2 - confirmations} more confirmation(s).`
        };
      }

      return {
        status: PaymentStatus.FAILED,
        error: 'Transaction not found or invalid'
      };
    } catch (error) {
      console.error('Bitcoin verification error:', error);
      return {
        status: PaymentStatus.FAILED,
        error: 'Failed to verify Bitcoin transaction'
      };
    }
  }

  /**
   * Get transaction status
   */
  static async getTransactionStatus(transactionId) {
    try {
      const transaction = await getTransactionRecord(transactionId);
      if (!transaction) {
        return { status: PaymentStatus.FAILED, error: 'Transaction not found' };
      }

      // For Bitcoin transactions, check for updated confirmations
      if (transaction.type === 'bitcoin' && transaction.status === PaymentStatus.PENDING) {
        const confirmations = await checkBitcoinConfirmations(transaction.txHash);
        
        if (confirmations >= 2) {
          await updateTransactionRecord(transactionId, {
            status: PaymentStatus.COMPLETED,
            confirmations,
            completedAt: new Date().toISOString()
          });
          
          return {
            status: PaymentStatus.COMPLETED,
            confirmations,
            message: 'Bitcoin payment confirmed!'
          };
        }
        
        // Update confirmation count
        await updateTransactionRecord(transactionId, { confirmations });
        
        return {
          status: PaymentStatus.PENDING,
          confirmations,
          requiredConfirmations: 2
        };
      }

      return {
        status: transaction.status,
        ...transaction.metadata
      };
    } catch (error) {
      console.error('Error getting transaction status:', error);
      return { status: PaymentStatus.FAILED, error: 'Failed to get transaction status' };
    }
  }
}

// Helper functions
async function storeVerificationDocument(screenshot, userId, paymentType) {
  // In a real implementation, this would store to a secure file system or cloud storage
  const filename = `verification_${userId}_${paymentType}_${Date.now()}.png`;
  
  // For now, we'll simulate storing the document
  console.log(`Storing verification document: ${filename}`);
  
  // TODO: Implement actual file storage (AWS S3, Google Cloud Storage, etc.)
  return filename;
}

async function createTransactionRecord(data) {
  // In a real implementation, this would save to a database
  const transactionId = `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  const transaction = {
    id: transactionId,
    ...data,
    createdAt: new Date().toISOString()
  };
  
  console.log('Creating transaction record:', transaction);
  
  // TODO: Implement actual database storage (MongoDB, PostgreSQL, etc.)
  // For now, we'll store in memory (this would be lost on server restart)
  if (!global.transactions) {
    global.transactions = new Map();
  }
  global.transactions.set(transactionId, transaction);
  
  return transactionId;
}

async function getTransactionRecord(transactionId) {
  // TODO: Implement actual database retrieval
  if (!global.transactions) {
    return null;
  }
  return global.transactions.get(transactionId);
}

async function updateTransactionRecord(transactionId, updates) {
  // TODO: Implement actual database update
  if (!global.transactions) {
    return false;
  }
  
  const existing = global.transactions.get(transactionId);
  if (existing) {
    global.transactions.set(transactionId, {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString()
    });
    return true;
  }
  return false;
}

async function checkBitcoinConfirmations(txHash) {
  try {
    // Using BlockCypher API for Bitcoin transaction verification
    const response = await fetch(`https://api.blockcypher.com/v1/btc/main/txs/${txHash}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.confirmations || 0;
  } catch (error) {
    console.error('Error checking Bitcoin confirmations:', error);
    
    // Fallback: return 0 confirmations if API fails
    return 0;
  }
}

const PaymentInterface = ({ userId, onSuccess }) => {
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [amount, setAmount] = useState(0);
  const [instructions, setInstructions] = useState(null);
  const [verificationFile, setVerificationFile] = useState(null);
  const [bitcoinTxHash, setBitcoinTxHash] = useState("");
  const [status, setStatus] = useState("idle");
  const [statusMessage, setStatusMessage] = useState("");
  const [transactionId, setTransactionId] = useState(null);
  const packages = [
    { id: "starter", name: "Starter Business", amount: 10, coins: 1e3, perks: ["Basic Business License", "Small Shop Location"] },
    { id: "entrepreneur", name: "Entrepreneur Pack", amount: 25, coins: 3e3, perks: ["Premium Location", "Business Connections", "Marketing Boost"] },
    { id: "mogul", name: "Business Mogul", amount: 50, coins: 7e3, perks: ["Multiple Locations", "Investment Opportunities", "VIP Status"] },
    { id: "empire", name: "Norfolk Empire", amount: 100, coins: 15e3, perks: ["City-wide Influence", "Business Empire Status", "Special Events Access"] }
  ];
  const handlePackageSelect = async (pkg) => {
    setSelectedPackage(pkg);
    setAmount(pkg.amount);
    if (selectedMethod) {
      const paymentInstructions = PaymentProcessor.generatePaymentInstructions(
        selectedMethod,
        pkg.amount,
        userId
      );
      if (selectedMethod === "bitcoin") {
        const btcAmount = await paymentInstructions.amountBTC();
        setInstructions({
          ...paymentInstructions,
          amountBTC: btcAmount
        });
      } else {
        setInstructions(paymentInstructions);
      }
    }
  };
  const handleMethodSelect = async (method) => {
    setSelectedMethod(method);
    if (selectedPackage) {
      const paymentInstructions = PaymentProcessor.generatePaymentInstructions(
        method,
        selectedPackage.amount,
        userId
      );
      if (method === "bitcoin") {
        const btcAmount = await paymentInstructions.amountBTC();
        setInstructions({
          ...paymentInstructions,
          amountBTC: btcAmount
        });
      } else {
        setInstructions(paymentInstructions);
      }
    }
  };
  const handlePaymentSubmit = async () => {
    setStatus("processing");
    setStatusMessage("Processing payment verification...");
    try {
      if (selectedMethod === "cashapp") {
        if (!verificationFile) {
          setStatus("error");
          setStatusMessage("Please upload a screenshot of your Cash App payment.");
          return;
        }
        const result = await PaymentProcessor.verifyCashAppPayment(
          verificationFile,
          amount,
          userId
        );
        setTransactionId(result.transactionId);
        if (result.status === PaymentStatus.VERIFICATION_REQUIRED) {
          setStatus("awaiting_verification");
          setStatusMessage(result.message);
        } else if (result.status === PaymentStatus.FAILED) {
          setStatus("error");
          setStatusMessage(result.error);
        }
      } else if (selectedMethod === "bitcoin") {
        if (!bitcoinTxHash) {
          setStatus("error");
          setStatusMessage("Please enter your Bitcoin transaction hash.");
          return;
        }
        const result = await PaymentProcessor.verifyBitcoinPayment(
          bitcoinTxHash,
          amount,
          userId
        );
        setTransactionId(result.transactionId);
        if (result.status === PaymentStatus.COMPLETED) {
          setStatus("completed");
          setStatusMessage(result.message);
          onSuccess(selectedPackage);
        } else if (result.status === PaymentStatus.PENDING) {
          setStatus("pending");
          setStatusMessage(result.message);
        } else if (result.status === PaymentStatus.FAILED) {
          setStatus("error");
          setStatusMessage(result.error);
        }
      }
    } catch (error) {
      setStatus("error");
      setStatusMessage("An error occurred while processing your payment. Please try again.");
      console.error("Payment submission error:", error);
    }
  };
  const checkTransactionStatus = async () => {
    if (!transactionId) return;
    try {
      const result = await PaymentProcessor.getTransactionStatus(transactionId);
      if (result.status === PaymentStatus.COMPLETED) {
        setStatus("completed");
        setStatusMessage(result.message || "Payment confirmed successfully!");
        onSuccess(selectedPackage);
      } else if (result.status === PaymentStatus.PENDING) {
        setStatusMessage(result.message || `Waiting for confirmations... (${result.confirmations || 0}/2)`);
      }
    } catch (error) {
      console.error("Error checking transaction status:", error);
    }
  };
  useEffect(() => {
    if (status === "pending" && transactionId && selectedMethod === "bitcoin") {
      const interval = setInterval(checkTransactionStatus, 3e4);
      return () => clearInterval(interval);
    }
  }, [status, transactionId, selectedMethod]);
  return /* @__PURE__ */ jsxs("div", { className: "max-w-4xl mx-auto p-6 bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl shadow-xl", children: [
    /* @__PURE__ */ jsx("h2", { className: "text-3xl font-bold text-gray-800 mb-6", children: "Grow Your Norfolk Empire" }),
    !selectedMethod && /* @__PURE__ */ jsxs("div", { className: "mb-8", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold text-gray-800 mb-4", children: "Choose Payment Method" }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxs(
          motion.button,
          {
            whileHover: { scale: 1.02 },
            onClick: () => handleMethodSelect("cashapp"),
            className: "bg-green-500 text-white p-6 rounded-lg shadow-md hover:bg-green-600 transition-colors",
            children: [
              /* @__PURE__ */ jsx("div", { className: "text-2xl mb-2", children: "💰" }),
              /* @__PURE__ */ jsx("h4", { className: "text-lg font-bold", children: "Cash App" }),
              /* @__PURE__ */ jsx("p", { className: "text-sm opacity-90", children: "Quick verification with screenshot" })
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          motion.button,
          {
            whileHover: { scale: 1.02 },
            onClick: () => handleMethodSelect("bitcoin"),
            className: "bg-orange-500 text-white p-6 rounded-lg shadow-md hover:bg-orange-600 transition-colors",
            children: [
              /* @__PURE__ */ jsx("div", { className: "text-2xl mb-2", children: "₿" }),
              /* @__PURE__ */ jsx("h4", { className: "text-lg font-bold", children: "Bitcoin" }),
              /* @__PURE__ */ jsx("p", { className: "text-sm opacity-90", children: "Secure blockchain payment" })
            ]
          }
        )
      ] })
    ] }),
    selectedMethod && /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6 mb-8", children: packages.map((pkg) => /* @__PURE__ */ jsxs(
      motion.div,
      {
        whileHover: { scale: 1.02 },
        className: `bg-white p-6 rounded-lg shadow-md border-2 ${selectedPackage?.id === pkg.id ? "border-amber-500" : "border-transparent"}`,
        children: [
          /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold text-gray-800", children: pkg.name }),
          /* @__PURE__ */ jsxs("p", { className: "text-2xl font-bold text-amber-600", children: [
            "$",
            pkg.amount
          ] }),
          /* @__PURE__ */ jsxs("p", { className: "text-gray-600", children: [
            pkg.coins,
            " Coins"
          ] }),
          /* @__PURE__ */ jsx("ul", { className: "mt-4", children: pkg.perks.map((perk, index) => /* @__PURE__ */ jsxs("li", { className: "flex items-center text-gray-700", children: [
            /* @__PURE__ */ jsx("span", { className: "mr-2 text-green-500", children: "✓" }),
            " ",
            perk
          ] }, index)) }),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => handlePackageSelect(pkg),
              className: `mt-4 w-full py-2 rounded-md transition-colors ${selectedPackage?.id === pkg.id ? "bg-amber-500 text-white" : "bg-gray-200 text-gray-700 hover:bg-amber-500 hover:text-white"}`,
              children: selectedPackage?.id === pkg.id ? "Selected" : "Select Package"
            }
          )
        ]
      },
      pkg.id
    )) }),
    instructions && selectedPackage && /* @__PURE__ */ jsxs("div", { className: "bg-white p-6 rounded-lg shadow-md mb-6", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold mb-4 text-gray-800", children: "Payment Instructions" }),
      selectedMethod === "cashapp" ? /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "bg-green-50 p-4 rounded-lg", children: [
          /* @__PURE__ */ jsxs("p", { className: "font-semibold text-green-800", children: [
            "Send $",
            amount,
            " to: ",
            instructions.cashtag
          ] }),
          /* @__PURE__ */ jsxs("p", { className: "text-green-700", children: [
            "Include note: ",
            instructions.note
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-green-600 mt-2", children: instructions.instructions })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Upload Payment Screenshot" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "file",
              onChange: (e) => setVerificationFile(e.target.files[0]),
              className: "w-full p-2 border border-gray-300 rounded-md",
              accept: "image/*",
              required: true
            }
          ),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500 mt-1", children: "Please upload a clear screenshot showing the completed payment" })
        ] })
      ] }) : /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "bg-orange-50 p-4 rounded-lg", children: [
          /* @__PURE__ */ jsxs("p", { className: "font-semibold text-orange-800", children: [
            "Send ",
            instructions.amountBTC,
            " BTC to:"
          ] }),
          /* @__PURE__ */ jsx("code", { className: "block bg-gray-100 p-2 rounded mt-2 text-sm break-all", children: instructions.address }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-orange-600 mt-2", children: instructions.instructions })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Bitcoin Transaction Hash" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              value: bitcoinTxHash,
              onChange: (e) => setBitcoinTxHash(e.target.value),
              placeholder: "Enter your transaction hash after sending Bitcoin",
              className: "w-full p-2 border border-gray-300 rounded-md",
              required: true
            }
          ),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500 mt-1", children: "You can find this in your Bitcoin wallet after sending the payment" })
        ] })
      ] }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: handlePaymentSubmit,
          disabled: status === "processing",
          className: `mt-6 w-full py-3 rounded-md font-semibold transition-colors ${status === "processing" ? "bg-gray-400 text-gray-200 cursor-not-allowed" : "bg-green-500 text-white hover:bg-green-600"}`,
          children: status === "processing" ? "Processing..." : "Verify Payment"
        }
      )
    ] }),
    status !== "idle" && statusMessage && /* @__PURE__ */ jsxs("div", { className: `p-4 rounded-lg mb-4 ${status === "completed" ? "bg-green-100 text-green-800" : status === "error" ? "bg-red-100 text-red-800" : status === "awaiting_verification" ? "bg-yellow-100 text-yellow-800" : "bg-blue-100 text-blue-800"}`, children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
        /* @__PURE__ */ jsxs("div", { className: "mr-3", children: [
          status === "completed" && "✅",
          status === "error" && "❌",
          status === "awaiting_verification" && "⏳",
          status === "pending" && "🔄",
          status === "processing" && "⏳"
        ] }),
        /* @__PURE__ */ jsx("p", { children: statusMessage })
      ] }),
      status === "pending" && transactionId && /* @__PURE__ */ jsx("div", { className: "mt-2", children: /* @__PURE__ */ jsx(
        "button",
        {
          onClick: checkTransactionStatus,
          className: "text-sm bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600",
          children: "Check Status"
        }
      ) })
    ] }),
    (selectedMethod || status === "error") && /* @__PURE__ */ jsx(
      "button",
      {
        onClick: () => {
          setSelectedMethod(null);
          setSelectedPackage(null);
          setInstructions(null);
          setStatus("idle");
          setStatusMessage("");
          setTransactionId(null);
          setVerificationFile(null);
          setBitcoinTxHash("");
        },
        className: "w-full mt-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors",
        children: "Start Over"
      }
    )
  ] });
};

const SKIN_TONES = [
  { id: "deep", name: "Deep", value: "#3E2723" },
  { id: "dark", name: "Dark", value: "#4E342E" },
  { id: "medium-dark", name: "Medium Dark", value: "#5D4037" },
  { id: "medium", name: "Medium", value: "#6D4C41" },
  { id: "medium-light", name: "Medium Light", value: "#795548" }
];
const FACIAL_FEATURES = {
  EYES: ["almond", "round", "narrow"],
  NOSE: ["broad", "narrow", "medium"],
  LIPS: ["full", "medium", "thin"],
  FACIAL_HAIR: ["clean", "beard", "goatee", "mustache"]
};
const HAIRSTYLES = [
  { id: "natural", name: "Natural", description: "Natural afro texture" },
  { id: "dreads", name: "Dreadlocks", description: "Classic dreadlocks" },
  { id: "fade", name: "Fade", description: "Clean fade cut" },
  { id: "waves", name: "Waves", description: "360 waves" },
  { id: "twist", name: "Twists", description: "Twisted style" }
];
const CLOTHING_STYLES = [
  { id: "business", name: "Business Professional", items: ["suit", "tie", "dress_shoes"] },
  { id: "casual", name: "Business Casual", items: ["blazer", "slacks", "loafers"] },
  { id: "creative", name: "Creative Professional", items: ["designer_shirt", "chinos", "sneakers"] },
  { id: "tech", name: "Tech Entrepreneur", items: ["premium_tee", "designer_jeans", "limited_sneakers"] }
];
const CharacterCustomization = ({ onCharacterCreated }) => {
  const [character, setCharacter] = useState({
    skinTone: SKIN_TONES[0].id,
    facialFeatures: {
      eyes: FACIAL_FEATURES.EYES[0],
      nose: FACIAL_FEATURES.NOSE[0],
      lips: FACIAL_FEATURES.LIPS[0],
      facialHair: FACIAL_FEATURES.FACIAL_HAIR[0]
    },
    hairstyle: HAIRSTYLES[0].id,
    clothing: CLOTHING_STYLES[0].id,
    attributes: {
      charisma: 5,
      business_acumen: 5,
      tech_savvy: 5,
      creativity: 5
    },
    background: {
      education: "Norfolk State University",
      hometown: "Norfolk",
      specialization: "Technology"
    }
  });
  const handleAttributeChange = (attribute, value) => {
    setCharacter((prev) => ({
      ...prev,
      attributes: {
        ...prev.attributes,
        [attribute]: value
      }
    }));
  };
  return /* @__PURE__ */ jsxs("div", { className: "max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-xl", children: [
    /* @__PURE__ */ jsx("h2", { className: "text-3xl font-bold mb-6", children: "Create Your Entrepreneur" }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
        /* @__PURE__ */ jsxs("section", { children: [
          /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold mb-4", children: "Appearance" }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium", children: "Skin Tone" }),
              /* @__PURE__ */ jsx("div", { className: "flex space-x-2 mt-2", children: SKIN_TONES.map((tone) => /* @__PURE__ */ jsx(
                motion.div,
                {
                  whileHover: { scale: 1.1 },
                  className: `w-8 h-8 rounded-full cursor-pointer ${character.skinTone === tone.id ? "ring-2 ring-blue-500" : ""}`,
                  style: { backgroundColor: tone.value },
                  onClick: () => setCharacter((prev) => ({ ...prev, skinTone: tone.id }))
                },
                tone.id
              )) })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium", children: "Hairstyle" }),
              /* @__PURE__ */ jsx(
                "select",
                {
                  className: "mt-1 block w-full rounded-md border-gray-300 shadow-sm",
                  value: character.hairstyle,
                  onChange: (e) => setCharacter((prev) => ({ ...prev, hairstyle: e.target.value })),
                  children: HAIRSTYLES.map((style) => /* @__PURE__ */ jsx("option", { value: style.id, children: style.name }, style.id))
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium", children: "Style" }),
              /* @__PURE__ */ jsx(
                "select",
                {
                  className: "mt-1 block w-full rounded-md border-gray-300 shadow-sm",
                  value: character.clothing,
                  onChange: (e) => setCharacter((prev) => ({ ...prev, clothing: e.target.value })),
                  children: CLOTHING_STYLES.map((style) => /* @__PURE__ */ jsx("option", { value: style.id, children: style.name }, style.id))
                }
              )
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("section", { children: [
          /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold mb-4", children: "Background" }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium", children: "Education" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  className: "mt-1 block w-full rounded-md border-gray-300 shadow-sm",
                  value: character.background.education,
                  onChange: (e) => setCharacter((prev) => ({
                    ...prev,
                    background: { ...prev.background, education: e.target.value }
                  }))
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium", children: "Specialization" }),
              /* @__PURE__ */ jsxs(
                "select",
                {
                  className: "mt-1 block w-full rounded-md border-gray-300 shadow-sm",
                  value: character.background.specialization,
                  onChange: (e) => setCharacter((prev) => ({
                    ...prev,
                    background: { ...prev.background, specialization: e.target.value }
                  })),
                  children: [
                    /* @__PURE__ */ jsx("option", { value: "Technology", children: "Technology" }),
                    /* @__PURE__ */ jsx("option", { value: "Real Estate", children: "Real Estate" }),
                    /* @__PURE__ */ jsx("option", { value: "Retail", children: "Retail" }),
                    /* @__PURE__ */ jsx("option", { value: "Food & Beverage", children: "Food & Beverage" }),
                    /* @__PURE__ */ jsx("option", { value: "Entertainment", children: "Entertainment" })
                  ]
                }
              )
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
        /* @__PURE__ */ jsxs("section", { children: [
          /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold mb-4", children: "Attributes" }),
          /* @__PURE__ */ jsx("div", { className: "space-y-4", children: Object.entries(character.attributes).map(([attr, value]) => /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium capitalize", children: attr.replace("_", " ") }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "range",
                min: "1",
                max: "10",
                value,
                onChange: (e) => handleAttributeChange(attr, parseInt(e.target.value)),
                className: "w-full"
              }
            ),
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-xs text-gray-500", children: [
              /* @__PURE__ */ jsx("span", { children: "Beginner" }),
              /* @__PURE__ */ jsx("span", { children: "Expert" })
            ] })
          ] }, attr)) })
        ] }),
        /* @__PURE__ */ jsxs("section", { children: [
          /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold mb-4", children: "Preview" }),
          /* @__PURE__ */ jsx("div", { className: "bg-gray-100 rounded-lg p-4 min-h-[200px]", children: /* @__PURE__ */ jsx("div", { className: "text-center text-gray-500", children: "Character Preview" }) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "mt-8 flex justify-end", children: /* @__PURE__ */ jsx(
      "button",
      {
        onClick: () => onCharacterCreated(character),
        className: "bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600",
        children: "Save & Continue"
      }
    ) })
  ] });
};

const NorfolkEvents = {
  COMMUNITY: [
    {
      id: 'norfolk_state',
      title: 'Norfolk State University Partnership',
      description: 'Opportunity to mentor students and recruit talent from NSU',
      requirements: { level: 3, reputation: 20 },
      rewards: {
        reputation: 15,
        skills: { leadership: 2, networking: 2 },
        connections: ['NSU Business Department', 'Student Entrepreneurs']
      }
    },
    {
      id: 'oceanview_festival',
      title: 'Ocean View Beach Festival',
      description: 'Showcase your business at the annual beachfront festival',
      requirements: { level: 2, money: 2000 },
      rewards: {
        money: 5000,
        reputation: 10,
        skills: { marketing: 2 }
      }
    },
    {
      id: 'berkley_initiative',
      title: 'Berkley Community Initiative',
      description: 'Lead a community development project in Berkley',
      requirements: { level: 4, reputation: 30 },
      rewards: {
        reputation: 25,
        skills: { leadership: 3, networking: 2 },
        propertyDiscount: 0.15
      }
    }
  ],

  BUSINESS: [
    {
      id: 'military_contract',
      title: 'Military Base Contract',
      description: 'Opportunity to service the Norfolk Naval Base',
      requirements: { level: 5, reputation: 40, money: 10000 },
      rewards: {
        money: 25000,
        reputation: 20,
        contractDuration: '1 year'
      }
    },
    {
      id: 'waterfront_development',
      title: 'Waterfront Development Project',
      description: 'Participate in Norfolk\'s waterfront renovation',
      requirements: { level: 6, money: 50000 },
      rewards: {
        propertyAccess: 'Premium Waterfront',
        reputation: 30,
        skills: { business: 3, networking: 2 }
      }
    }
  ]};

const NEIGHBORHOODS = {
  GHENT: {
    events: ['art_walk', 'food_festival', 'boutique_showcase'],
    businessTypes: ['art_gallery', 'restaurant', 'boutique'],
    propertyValues: { retail: 12000, office: 15000 }
  },
  DOWNTOWN: {
    events: ['first_fridays', 'restaurant_week', 'business_expo'],
    businessTypes: ['office', 'restaurant', 'entertainment'],
    propertyValues: { retail: 18000, office: 25000 }
  },
  MILITARY_CIRCLE: {
    events: ['trade_show', 'tech_meetup', 'business_network'],
    businessTypes: ['retail', 'service', 'technology'],
    propertyValues: { retail: 8000, office: 10000 }
  },
  PARK_PLACE: {
    events: ['community_market', 'street_fair', 'local_showcase'],
    businessTypes: ['retail', 'service', 'food'],
    propertyValues: { retail: 6000, office: 7500 }
  }
};

// Export norfolk neighborhoods for business dashboard
const norfolkNeighborhoods = NEIGHBORHOODS;

// Seasonal modifiers for business operations
const seasonalModifiers = {
  spring: { tourism: 1.2, retail: 1.1, food: 1.0, service: 1.0 },
  summer: { tourism: 1.5, retail: 1.2, food: 1.3, service: 1.1 },
  fall: { tourism: 1.1, retail: 1.0, food: 1.1, service: 1.0 },
  winter: { tourism: 0.8, retail: 1.3, food: 0.9, service: 1.0 }
};

// Norfolk-specific challenges
const norfolkChallenges = [
  {
    id: "hurricane_season",
    name: "Hurricane Season Preparation",
    description: "Prepare your business for potential hurricane impacts",
    season: "summer",
    severity: "high",
    duration: 90,
    impact: {
      revenue: -0.15,
      expenses: 0.1,
      customerBase: -0.1
    },
    responses: {
      mitigation: { cost: 2000, effectiveness: 0.8 },
      adaptation: { cost: 1000, effectiveness: 0.6 },
      strategies: [
        { name: "Emergency Supplies", cost: 500, effectiveness: 0.4 },
        { name: "Insurance Coverage", cost: 800, effectiveness: 0.7 }
      ]
    }
  },
  {
    id: "military_deployment",
    name: "Military Deployment Cycle",
    description: "Naval base deployment affects local customer base",
    season: "all",
    severity: "medium",
    duration: 180,
    impact: {
      revenue: -0.1,
      customerBase: -0.15
    },
    responses: {
      mitigation: { cost: 1500, effectiveness: 0.7 },
      adaptation: { cost: 800, effectiveness: 0.5 },
      strategies: [
        { name: "Military Discounts", cost: 200, effectiveness: 0.6 },
        { name: "Family Services", cost: 600, effectiveness: 0.8 }
      ]
    }
  }
];

// Get current season based on date
const getCurrentSeason = () => {
  const month = new Date().getMonth() + 1;
  if (month >= 3 && month <= 5) return 'spring';
  if (month >= 6 && month <= 8) return 'summer';
  if (month >= 9 && month <= 11) return 'fall';
  return 'winter';
};

// Get available events based on filters
const getAvailableEvents = (filters = {}) => {
  const allEvents = [...NorfolkEvents.COMMUNITY, ...NorfolkEvents.BUSINESS];
  
  return allEvents.filter(event => {
    if (filters.level && event.requirements.level > filters.level) return false;
    if (filters.location && event.location && event.location !== filters.location) return false;
    if (filters.businessType && event.businessTypes && !event.businessTypes.includes(filters.businessType)) return false;
    return true;
  });
};

// Calculate event impact on business
const calculateEventImpact = (event, business) => {
  const baseImpact = event.rewards || {};
  const locationMultiplier = business.location === event.location ? 1.2 : 1.0;
  const seasonMultiplier = seasonalModifiers[getCurrentSeason()][business.type] || 1.0;
  
  return {
    revenue: (baseImpact.revenue || 0) * locationMultiplier * seasonMultiplier,
    reputation: baseImpact.reputation || 0,
    customerBase: (baseImpact.customerBase || 0) * locationMultiplier
  };
};

class BusinessSimulation {
  constructor(player) {
    this.player = player;
    this.businesses = new Map();
    this.marketConditions = {
      economy: 1.0,
      competition: 1.0,
      opportunity: 1.0,
      seasonality: 1.0,
      tourism: 1.0
    };
    this.activeEvents = [];
    this.partnerships = new Map();
    this.challenges = new Map();
    this.lastUpdate = Date.now();
  }

  startBusiness(config) {
    const {
      type,
      location,
      initialInvestment,
      name
    } = config;

    const locationData = NEIGHBORHOODS[location];
    if (!locationData) throw new Error('Invalid location');

    const business = {
      id: Date.now(),
      name,
      type,
      location,
      level: 1,
      employees: [],
      revenue: 0,
      expenses: 0,
      reputation: 0,
      inventory: [],
      upgrades: [],
      lastUpdate: Date.now(),
      customerBase: 0,
      marketShare: 0,
      efficiency: 1.0,
      sustainability: 0,
      communityImpact: 0,
      partnerships: [],
      challenges: [],
      achievements: []
    };

    // Calculate initial metrics based on Norfolk location
    business.expenses = this.calculateExpenses(business);
    business.revenue = this.calculatePotentialRevenue(business);
    business.customerBase = this.calculateInitialCustomerBase(business);

    this.businesses.set(business.id, business);
    
    // Generate initial Norfolk-specific opportunities
    this.generateLocationOpportunities(business);
    
    return business;
  }

  calculateExpenses(business) {
    const baseExpenses = {
      rent: NEIGHBORHOODS[business.location].propertyValues[business.type] * 0.01,
      utilities: 500 + (business.level * 100),
      payroll: business.employees.length * 2500,
      maintenance: 300 + (business.level * 50),
      insurance: 200 + (business.level * 25),
      marketing: 400 + (business.level * 75),
      supplies: 600 + (business.level * 100)
    };

    // Norfolk-specific adjustments
    if (business.location === 'DOWNTOWN') {
      baseExpenses.rent *= 1.5; // Higher downtown costs
      baseExpenses.marketing *= 0.8; // Better visibility
    } else if (business.location === 'BERKLEY') {
      baseExpenses.rent *= 0.7; // Lower costs in developing area
      baseExpenses.marketing *= 1.2; // Need more marketing
    }

    return Object.values(baseExpenses).reduce((a, b) => a + b, 0);
  }

  calculatePotentialRevenue(business) {
    const baseRevenue = NEIGHBORHOODS[business.location].propertyValues[business.type] * 0.05;
    const locationMultiplier = this.getLocationMultiplier(business.location);
    const seasonalMultiplier = this.getSeasonalMultiplier(business.type);
    const reputationBonus = business.reputation * 10;
    
    return Math.floor(
      (baseRevenue * locationMultiplier * seasonalMultiplier * business.efficiency) + 
      reputationBonus + 
      (business.customerBase * 5)
    );
  }

  calculateInitialCustomerBase(business) {
    const locationData = NEIGHBORHOODS[business.location];
    const baseCustomers = locationData.propertyValues[business.type] / 100;
    
    // Adjust based on business type and location synergy
    let multiplier = 1.0;
    if (locationData.businessTypes.includes(business.type)) {
      multiplier = 1.3; // Good fit for location
    }
    
    return Math.floor(baseCustomers * multiplier);
  }

  getLocationMultiplier(location) {
    const multipliers = {
      'DOWNTOWN': 1.5,
      'GHENT': 1.3,
      'MILITARY_CIRCLE': 1.1,
      'OCEANVIEW': 1.0,
      'BERKLEY': 0.8,
      'PARK_PLACE': 0.9
    };
    return multipliers[location] || 1.0;
  }

  getSeasonalMultiplier(businessType) {
    const season = this.getCurrentSeason();
    const seasonalEffects = {
      'SPRING': { restaurant: 1.1, retail: 1.0, entertainment: 1.2 },
      'SUMMER': { restaurant: 1.3, retail: 1.1, entertainment: 1.4 },
      'FALL': { restaurant: 1.0, retail: 1.2, entertainment: 1.0 },
      'WINTER': { restaurant: 0.9, retail: 1.3, entertainment: 0.8 }
    };
    
    return seasonalEffects[season][businessType] || 1.0;
  }

  getCurrentSeason() {
    const month = new Date().getMonth();
    if (month >= 2 && month <= 4) return 'SPRING';
    if (month >= 5 && month <= 7) return 'SUMMER';
    if (month >= 8 && month <= 10) return 'FALL';
    return 'WINTER';
  }

  generateLocationOpportunities(business) {
    const locationData = NEIGHBORHOODS[business.location];
    const opportunities = [];

    // Generate events based on location
    locationData.events.forEach(eventType => {
      if (Math.random() < 0.3) { // 30% chance for each event
        opportunities.push({
          id: `${eventType}_${Date.now()}`,
          type: 'event',
          name: this.getEventName(eventType),
          description: this.getEventDescription(eventType),
          cost: Math.floor(Math.random() * 2000) + 500,
          potentialRevenue: Math.floor(Math.random() * 5000) + 1000,
          reputationGain: Math.floor(Math.random() * 10) + 5,
          duration: Math.floor(Math.random() * 7) + 1 // 1-7 days
        });
      }
    });

    business.opportunities = opportunities;
  }

  getEventName(eventType) {
    const eventNames = {
      'art_walk': 'Ghent Art Walk Participation',
      'food_festival': 'Norfolk Food & Wine Festival',
      'boutique_showcase': 'Local Boutique Showcase',
      'first_fridays': 'First Friday Downtown',
      'restaurant_week': 'Norfolk Restaurant Week',
      'business_expo': 'Hampton Roads Business Expo',
      'trade_show': 'Military Circle Trade Show',
      'tech_meetup': 'Norfolk Tech Meetup',
      'business_network': 'Business Networking Event',
      'community_market': 'Park Place Community Market',
      'street_fair': 'Neighborhood Street Fair',
      'local_showcase': 'Local Business Showcase'
    };
    return eventNames[eventType] || 'Community Event';
  }

  getEventDescription(eventType) {
    const descriptions = {
      'art_walk': 'Showcase your business during the monthly Ghent art walk',
      'food_festival': 'Participate in Norfolk\'s premier culinary event',
      'boutique_showcase': 'Feature your products in an exclusive boutique event',
      'first_fridays': 'Join the downtown monthly celebration',
      'restaurant_week': 'Special menu offerings during restaurant week',
      'business_expo': 'Network with regional business leaders',
      'trade_show': 'Display your services at the trade exhibition',
      'tech_meetup': 'Connect with Norfolk\'s tech community',
      'business_network': 'Build relationships with local entrepreneurs',
      'community_market': 'Engage with neighborhood residents',
      'street_fair': 'Participate in the local street festival',
      'local_showcase': 'Highlight your business to the community'
    };
    return descriptions[eventType] || 'Engage with the local community';
  }

  calculatePotentialRevenue(business) {
    const baseRevenue = NEIGHBORHOODS[business.location].propertyValues[business.type] * 0.05;
    const locationMultiplier = this.getLocationMultiplier(business.location);
    const seasonalMultiplier = this.getSeasonalMultiplier(business.type);
    const reputationBonus = business.reputation * 10;
    
    return Math.floor(
      (baseRevenue * locationMultiplier * seasonalMultiplier * business.efficiency) + 
      reputationBonus + 
      (business.customerBase * 5)
    );
  }

  hireEmployee(businessId, employee) {
    const business = this.businesses.get(businessId);
    if (!business) throw new Error('Business not found');

    business.employees.push({
      id: Date.now(),
      ...employee,
      hireDate: new Date(),
      salary: this.calculateSalary(employee.role)
    });

    business.expenses = this.calculateExpenses(business);
    return business;
  }

  calculateSalary(role) {
    const baseSalaries = {
      'manager': 4000,
      'staff': 2500,
      'specialist': 3500
    };
    return baseSalaries[role] || 2500;
  }

  upgradeProperty(businessId, upgradeType) {
    const business = this.businesses.get(businessId);
    if (!business) throw new Error('Business not found');

    const upgrades = {
      'renovation': {
        cost: 10000,
        reputationBoost: 10,
        revenueMultiplier: 1.2
      },
      'expansion': {
        cost: 25000,
        capacityIncrease: 50,
        revenueMultiplier: 1.5
      },
      'technology': {
        cost: 15000,
        efficiencyBoost: 20,
        revenueMultiplier: 1.3
      }
    };

    const upgrade = upgrades[upgradeType];
    if (!upgrade) throw new Error('Invalid upgrade type');

    business.upgrades.push({
      type: upgradeType,
      installDate: new Date(),
      ...upgrade
    });

    return business;
  }

  runDailyOperations(businessId) {
    const business = this.businesses.get(businessId);
    if (!business) throw new Error('Business not found');

    const dailyRevenue = this.calculateDailyRevenue(business);
    const dailyExpenses = this.calculateDailyExpenses(business);
    const profit = dailyRevenue - dailyExpenses;

    // Random events
    const event = this.generateRandomEvent(business);
    if (event) {
      this.handleBusinessEvent(business, event);
    }

    // Update business metrics
    business.revenue += dailyRevenue;
    business.expenses += dailyExpenses;
    business.lastUpdate = Date.now();

    return {
      revenue: dailyRevenue,
      expenses: dailyExpenses,
      profit,
      event
    };
  }

  generateRandomEvent(business) {
    const events = [
      {
        type: 'opportunity',
        name: 'Local Partnership',
        effect: { reputationBoost: 5, revenueBoost: 1000 }
      },
      {
        type: 'challenge',
        name: 'Equipment Breakdown',
        effect: { expense: 2000, reputationLoss: 2 }
      },
      {
        type: 'community',
        name: 'Community Event',
        effect: { reputationBoost: 3, expense: 500 }
      }
    ];

    // 10% chance of event
    if (Math.random() < 0.1) {
      return events[Math.floor(Math.random() * events.length)];
    }
    return null;
  }

  handleBusinessEvent(business, event) {
    switch (event.type) {
      case 'opportunity':
        business.reputation += event.effect.reputationBoost;
        business.revenue += event.effect.revenueBoost;
        break;
      case 'challenge':
        business.reputation = Math.max(0, business.reputation - event.effect.reputationLoss);
        business.expenses += event.effect.expense;
        break;
      case 'community':
        business.reputation += event.effect.reputationBoost;
        business.expenses += event.effect.expense;
        break;
    }
  }

  getBusinessMetrics(businessId) {
    const business = this.businesses.get(businessId);
    if (!business) throw new Error('Business not found');

    return {
      dailyRevenue: this.calculateDailyRevenue(business),
      monthlyRevenue: business.revenue,
      monthlyExpenses: business.expenses,
      profit: business.revenue - business.expenses,
      reputation: business.reputation,
      employees: business.employees.length,
      upgrades: business.upgrades.length
    };
  }
}

const BusinessDashboard = ({ player, onBusinessUpdate }) => {
  const [businesses, setBusinesses] = useState([]);
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [showNewBusinessForm, setShowNewBusinessForm] = useState(false);
  const [activeOpportunities, setActiveOpportunities] = useState([]);
  const [activeChallenges, setActiveChallenges] = useState([]);
  const [marketConditions, setMarketConditions] = useState({
    economy: "stable",
    competition: "moderate",
    seasonality: "normal",
    tourism: "average",
    season: getCurrentSeason()
  });
  const businessSim = new BusinessSimulation();
  useEffect(() => {
    if (player.businesses) {
      setBusinesses(player.businesses);
    }
    updateMarketConditions();
    generateDailyOpportunities();
    generateActiveChallenges();
  }, [player]);
  const updateMarketConditions = () => {
    const conditions = ["poor", "stable", "good", "excellent"];
    const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
    setMarketConditions((prev) => ({
      ...prev,
      economy: randomCondition,
      competition: Math.random() > 0.5 ? "high" : "moderate",
      seasonality: getCurrentSeasonalEffect(),
      tourism: Math.random() > 0.3 ? "high" : "average",
      season: getCurrentSeason()
    }));
  };
  const getCurrentSeasonalEffect = () => {
    const month = (/* @__PURE__ */ new Date()).getMonth();
    if (month >= 5 && month <= 7) return "summer_boost";
    if (month >= 11 || month <= 1) return "holiday_season";
    return "normal";
  };
  const generateActiveChallenges = () => {
    const currentSeason = getCurrentSeason();
    const availableChallenges = Object.entries(norfolkChallenges).filter(([key, challenge]) => {
      if (challenge.season && challenge.season !== currentSeason) return false;
      if (challenge.locations && businesses.length > 0) {
        return businesses.some((business) => challenge.locations.includes(business.location));
      }
      return true;
    });
    setActiveChallenges(availableChallenges.map(([key, challenge]) => ({ id: key, ...challenge })));
  };
  const generateDailyOpportunities = () => {
    getCurrentSeason();
    businesses.length > 0 ? businesses[0].location : "DOWNTOWN";
    const norfolkOpportunities = getAvailableEvents(
      player.reputation || 0,
      player.money || 0);
    const generalOpportunities = [
      {
        id: "community_event",
        title: "Local Community Event Sponsorship",
        description: "Sponsor a neighborhood community event to build local reputation",
        cost: 2500,
        duration: 7,
        rewards: {
          revenue: 5e3,
          reputation: 10,
          customerBase: 150
        },
        requirements: {
          minReputation: 5
        }
      },
      {
        id: "social_media_campaign",
        title: "Digital Marketing Campaign",
        description: "Launch a targeted social media campaign for Norfolk area",
        cost: 3e3,
        duration: 14,
        rewards: {
          revenue: 8e3,
          reputation: 8,
          customerBase: 200
        },
        requirements: {
          minReputation: 0
        }
      }
    ];
    const allOpportunities = [...norfolkOpportunities, ...generalOpportunities];
    const availableOpportunities = allOpportunities.filter((opp) => {
      const meetsReputation = player.reputation >= (opp.requirements?.minReputation || 0);
      const canAfford = player.money >= opp.cost;
      return meetsReputation && canAfford;
    });
    setActiveOpportunities(availableOpportunities);
  };
  const handleStartBusiness = (businessConfig) => {
    try {
      const newBusiness = businessSim.startBusiness(businessConfig);
      setBusinesses((prev) => [...prev, newBusiness]);
      setShowNewBusinessForm(false);
      if (onBusinessUpdate) {
        onBusinessUpdate({
          type: "BUSINESS_STARTED",
          business: newBusiness,
          cost: businessConfig.initialInvestment
        });
      }
    } catch (error) {
      console.error("Failed to start business:", error);
    }
  };
  const handleBusinessAction = (businessId, action, data) => {
    const business = businesses.find((b) => b.id === businessId);
    if (!business) return;
    switch (action) {
      case "HIRE_EMPLOYEE":
        businessSim.hireEmployee(businessId, data);
        break;
      case "UPGRADE_PROPERTY":
        businessSim.upgradeProperty(businessId, data.upgradeType);
        break;
      case "PARTICIPATE_EVENT":
        handleEventParticipation(businessId, data.eventId);
        break;
      case "RUN_OPERATIONS":
        businessSim.runDailyOperations(businessId);
        break;
    }
    const updatedBusinesses = Array.from(businessSim.businesses.values());
    setBusinesses(updatedBusinesses);
  };
  const handleEventParticipation = (businessId, eventId) => {
    const opportunity = activeOpportunities.find((o) => o.id === eventId);
    const business = businesses.find((b) => b.id === businessId);
    if (!opportunity || !business) return;
    const meetsRequirements = (!opportunity.requirements?.minReputation || player.reputation >= opportunity.requirements.minReputation) && (!opportunity.requirements?.businessTypes || opportunity.requirements.businessTypes.includes(business.type)) && player.money >= opportunity.cost;
    if (meetsRequirements) {
      const impact = calculateEventImpact(opportunity, business.type, business.location);
      const updatedBusiness = {
        ...business,
        revenue: business.revenue + (opportunity.rewards.revenue || 0),
        reputation: business.reputation + (impact.reputationGain || 0),
        customerBase: (business.customerBase || 0) + (impact.customerBaseGain || 0)
      };
      setBusinesses((prev) => prev.map((b) => b.id === businessId ? updatedBusiness : b));
      setActiveOpportunities((prev) => prev.filter((o) => o.id !== eventId));
      if (onBusinessUpdate) {
        onBusinessUpdate({
          type: "EVENT_PARTICIPATED",
          business: updatedBusiness,
          opportunity,
          cost: opportunity.cost
        });
      }
    }
  };
  const handleChallengeResponse = (challengeId, responseType, responseData) => {
    const challenge = activeChallenges.find((c) => c.id === challengeId);
    if (!challenge) return;
    let cost = 0;
    let effectiveness = 0;
    if (challenge.mitigation && challenge.mitigation[responseType]) {
      cost = challenge.mitigation[responseType].cost;
      effectiveness = challenge.mitigation[responseType].effectiveness;
    } else if (challenge.adaptation && challenge.adaptation[responseType]) {
      cost = challenge.adaptation[responseType].cost;
      effectiveness = challenge.adaptation[responseType].effectiveness;
    } else if (challenge.strategies && challenge.strategies[responseType]) {
      cost = challenge.strategies[responseType].cost;
      effectiveness = challenge.strategies[responseType].effectiveness || 0;
    }
    if (player.money >= cost) {
      const updatedBusinesses = businesses.map((business) => {
        let updatedBusiness = { ...business };
        if (challenge.impact) {
          if (challenge.impact.revenue) {
            const revenueImpact = challenge.impact.revenue * (1 - effectiveness);
            updatedBusiness.revenue = Math.max(0, business.revenue * (1 + revenueImpact));
          }
          if (challenge.impact.expenses) {
            const expenseImpact = challenge.impact.expenses * (1 - effectiveness);
            updatedBusiness.expenses = business.expenses * (1 + expenseImpact);
          }
          if (challenge.impact.customerBase) {
            const customerImpact = challenge.impact.customerBase * (1 - effectiveness);
            updatedBusiness.customerBase = Math.max(0, (business.customerBase || 0) * (1 + customerImpact));
          }
        }
        if (challenge.strategies && challenge.strategies[responseType]) {
          const strategy = challenge.strategies[responseType];
          if (strategy.reputation) {
            updatedBusiness.reputation = Math.min(100, business.reputation + strategy.reputation);
          }
          if (strategy.communitySupport) {
            updatedBusiness.communitySupport = (business.communitySupport || 0) + strategy.communitySupport;
          }
          if (strategy.revenue) {
            updatedBusiness.revenue = business.revenue * strategy.revenue;
          }
        }
        return updatedBusiness;
      });
      setBusinesses(updatedBusinesses);
      setActiveChallenges((prev) => prev.filter((c) => c.id !== challengeId));
      if (onBusinessUpdate) {
        onBusinessUpdate({
          type: "CHALLENGE_RESPONDED",
          challenge,
          responseType,
          cost,
          effectiveness
        });
      }
    }
  };
  const BusinessCard = ({ business }) => /* @__PURE__ */ jsxs(
    motion.div,
    {
      whileHover: { scale: 1.02 },
      className: "bg-white rounded-lg shadow-lg p-6 cursor-pointer",
      onClick: () => setSelectedBusiness(business),
      children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-4", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold text-gray-800", children: business.name }),
          /* @__PURE__ */ jsx("span", { className: "text-2xl", children: business.icon || "🏢" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4 mb-4", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600", children: "Monthly Revenue" }),
            /* @__PURE__ */ jsxs("p", { className: "text-lg font-semibold text-green-600", children: [
              "$",
              business.revenue.toLocaleString()
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600", children: "Monthly Expenses" }),
            /* @__PURE__ */ jsxs("p", { className: "text-lg font-semibold text-red-600", children: [
              "$",
              business.expenses.toLocaleString()
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-3 gap-2 text-sm", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-gray-600", children: "Level" }),
            /* @__PURE__ */ jsx("p", { className: "font-semibold", children: business.level })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-gray-600", children: "Reputation" }),
            /* @__PURE__ */ jsxs("p", { className: "font-semibold", children: [
              business.reputation,
              "/100"
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-gray-600", children: "Employees" }),
            /* @__PURE__ */ jsx("p", { className: "font-semibold", children: business.employees.length })
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "mt-4", children: /* @__PURE__ */ jsx("div", { className: "w-full bg-gray-200 rounded-full h-2", children: /* @__PURE__ */ jsx(
          "div",
          {
            className: "bg-blue-600 h-2 rounded-full",
            style: { width: `${Math.min(business.reputation / 100 * 100, 100)}%` }
          }
        ) }) })
      ]
    }
  );
  const OpportunityCard = ({ opportunity }) => /* @__PURE__ */ jsxs(
    motion.div,
    {
      whileHover: { scale: 1.02 },
      className: "bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4",
      children: [
        /* @__PURE__ */ jsx("h4", { className: "text-lg font-bold text-blue-800 mb-2", children: opportunity.title }),
        /* @__PURE__ */ jsx("p", { className: "text-gray-700 mb-3", children: opportunity.description }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4 mb-3", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600", children: "Cost" }),
            /* @__PURE__ */ jsxs("p", { className: "font-semibold text-red-600", children: [
              "$",
              opportunity.cost.toLocaleString()
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600", children: "Duration" }),
            /* @__PURE__ */ jsxs("p", { className: "font-semibold", children: [
              opportunity.duration,
              " days"
            ] })
          ] })
        ] }),
        opportunity.requirements && /* @__PURE__ */ jsxs("div", { className: "mb-3", children: [
          /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600 mb-1", children: "Requirements:" }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-2", children: [
            opportunity.requirements.level && /* @__PURE__ */ jsxs("span", { className: "bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs", children: [
              "Level ",
              opportunity.requirements.level,
              "+"
            ] }),
            opportunity.requirements.reputation && /* @__PURE__ */ jsxs("span", { className: "bg-green-100 text-green-800 px-2 py-1 rounded text-xs", children: [
              "Reputation ",
              opportunity.requirements.reputation,
              "+"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => handleEventParticipation(selectedBusiness?.id, opportunity.id),
            disabled: !selectedBusiness || player.money < opportunity.cost,
            className: `w-full py-2 rounded-lg font-medium transition-colors ${selectedBusiness && player.money >= opportunity.cost ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`,
            children: selectedBusiness ? "Participate" : "Select a Business First"
          }
        )
      ]
    }
  );
  const ChallengeCard = ({ challenge }) => /* @__PURE__ */ jsxs(
    motion.div,
    {
      whileHover: { scale: 1.02 },
      className: "bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-lg p-4",
      children: [
        /* @__PURE__ */ jsx("h4", { className: "text-lg font-bold text-red-800 mb-2", children: challenge.name }),
        /* @__PURE__ */ jsx("p", { className: "text-gray-700 mb-3", children: challenge.description }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4 mb-3", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600", children: "Impact Duration" }),
            /* @__PURE__ */ jsxs("p", { className: "font-semibold", children: [
              challenge.duration,
              " days"
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600", children: "Severity" }),
            /* @__PURE__ */ jsx("p", { className: "font-semibold text-red-600", children: challenge.impact?.revenue ? `${Math.abs(challenge.impact.revenue * 100)}% Revenue` : "Variable" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold text-gray-700", children: "Response Options:" }),
          challenge.mitigation && Object.entries(challenge.mitigation).map(([key, option]) => /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => handleChallengeResponse(challenge.id, key),
              disabled: player.money < option.cost,
              className: `w-full text-left p-2 rounded border text-sm ${player.money >= option.cost ? "border-blue-300 bg-blue-50 hover:bg-blue-100 text-blue-800" : "border-gray-300 bg-gray-50 text-gray-500 cursor-not-allowed"}`,
              children: [
                /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
                  /* @__PURE__ */ jsx("span", { className: "capitalize", children: key.replace("_", " ") }),
                  /* @__PURE__ */ jsxs("span", { children: [
                    "$",
                    option.cost.toLocaleString()
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "text-xs opacity-75", children: [
                  Math.round(option.effectiveness * 100),
                  "% effective"
                ] })
              ]
            },
            key
          )),
          challenge.adaptation && Object.entries(challenge.adaptation).map(([key, option]) => /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => handleChallengeResponse(challenge.id, key),
              disabled: player.money < option.cost,
              className: `w-full text-left p-2 rounded border text-sm ${player.money >= option.cost ? "border-green-300 bg-green-50 hover:bg-green-100 text-green-800" : "border-gray-300 bg-gray-50 text-gray-500 cursor-not-allowed"}`,
              children: [
                /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
                  /* @__PURE__ */ jsx("span", { className: "capitalize", children: key.replace("_", " ") }),
                  /* @__PURE__ */ jsxs("span", { children: [
                    "$",
                    option.cost.toLocaleString()
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "text-xs opacity-75", children: [
                  Math.round(option.effectiveness * 100),
                  "% effective"
                ] })
              ]
            },
            key
          )),
          challenge.strategies && Object.entries(challenge.strategies).map(([key, option]) => /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => handleChallengeResponse(challenge.id, key),
              disabled: player.money < option.cost,
              className: `w-full text-left p-2 rounded border text-sm ${player.money >= option.cost ? "border-purple-300 bg-purple-50 hover:bg-purple-100 text-purple-800" : "border-gray-300 bg-gray-50 text-gray-500 cursor-not-allowed"}`,
              children: [
                /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
                  /* @__PURE__ */ jsx("span", { className: "capitalize", children: key.replace("_", " ") }),
                  /* @__PURE__ */ jsxs("span", { children: [
                    "$",
                    option.cost.toLocaleString()
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "text-xs opacity-75", children: [
                  option.reputation && `+${option.reputation} reputation`,
                  option.communitySupport && ` +${option.communitySupport} community`,
                  option.revenue && ` ${Math.round((option.revenue - 1) * 100)}% revenue`
                ] })
              ]
            },
            key
          ))
        ] })
      ]
    }
  );
  return /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto p-6", children: [
    /* @__PURE__ */ jsxs("header", { className: "mb-8", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-4xl font-bold text-gray-800 mb-4", children: "Norfolk Business Empire" }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-5 gap-4 mb-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "bg-white p-4 rounded-lg shadow", children: [
          /* @__PURE__ */ jsx("h3", { className: "font-bold text-gray-700", children: "Economy" }),
          /* @__PURE__ */ jsx("p", { className: "text-xl font-semibold text-green-600 capitalize", children: marketConditions.economy })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-white p-4 rounded-lg shadow", children: [
          /* @__PURE__ */ jsx("h3", { className: "font-bold text-gray-700", children: "Competition" }),
          /* @__PURE__ */ jsx("p", { className: "text-xl font-semibold text-orange-600 capitalize", children: marketConditions.competition })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-white p-4 rounded-lg shadow", children: [
          /* @__PURE__ */ jsx("h3", { className: "font-bold text-gray-700", children: "Tourism" }),
          /* @__PURE__ */ jsx("p", { className: "text-xl font-semibold text-blue-600 capitalize", children: marketConditions.tourism })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-white p-4 rounded-lg shadow", children: [
          /* @__PURE__ */ jsx("h3", { className: "font-bold text-gray-700", children: "Season" }),
          /* @__PURE__ */ jsx("p", { className: "text-xl font-semibold text-purple-600 capitalize", children: marketConditions.season })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-white p-4 rounded-lg shadow", children: [
          /* @__PURE__ */ jsx("h3", { className: "font-bold text-gray-700", children: "Businesses" }),
          /* @__PURE__ */ jsx("p", { className: "text-xl font-semibold text-indigo-600", children: businesses.length })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "lg:col-span-2", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center mb-6", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-gray-800", children: "Your Businesses" }),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setShowNewBusinessForm(true),
              className: "bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium",
              children: "Start New Business"
            }
          )
        ] }),
        businesses.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-xl font-semibold text-gray-600 mb-2", children: "No Businesses Yet" }),
          /* @__PURE__ */ jsx("p", { className: "text-gray-500 mb-4", children: "Start your first business in Norfolk to begin building your empire!" }),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setShowNewBusinessForm(true),
              className: "bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium",
              children: "Start Your First Business"
            }
          )
        ] }) : /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: businesses.map((business) => /* @__PURE__ */ jsx(BusinessCard, { business }, business.id)) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-gray-800 mb-4", children: "Norfolk Opportunities" }),
          /* @__PURE__ */ jsx("div", { className: "space-y-4 max-h-96 overflow-y-auto", children: activeOpportunities.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "text-center py-8 text-gray-500", children: [
            /* @__PURE__ */ jsx("p", { children: "No opportunities available right now." }),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: generateDailyOpportunities,
                className: "mt-2 text-blue-600 hover:text-blue-800 underline",
                children: "Refresh Opportunities"
              }
            )
          ] }) : activeOpportunities.map((opportunity) => /* @__PURE__ */ jsx(OpportunityCard, { opportunity }, opportunity.id)) })
        ] }),
        activeChallenges.length > 0 && /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-gray-800 mb-4", children: "Active Challenges" }),
          /* @__PURE__ */ jsx("div", { className: "space-y-4 max-h-96 overflow-y-auto", children: activeChallenges.map((challenge) => /* @__PURE__ */ jsx(ChallengeCard, { challenge }, challenge.id)) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx(AnimatePresence, { children: showNewBusinessForm && /* @__PURE__ */ jsx(
      motion.div,
      {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50",
        onClick: () => setShowNewBusinessForm(false),
        children: /* @__PURE__ */ jsxs(
          motion.div,
          {
            initial: { scale: 0.9, opacity: 0 },
            animate: { scale: 1, opacity: 1 },
            exit: { scale: 0.9, opacity: 0 },
            className: "bg-white rounded-lg p-6 max-w-md w-full",
            onClick: (e) => e.stopPropagation(),
            children: [
              /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold text-gray-800 mb-4", children: "Start New Business" }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Business Name" }),
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "text",
                      className: "w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                      placeholder: "Enter business name"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Business Type" }),
                  /* @__PURE__ */ jsxs(
                    "select",
                    {
                      className: "w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                      children: [
                        /* @__PURE__ */ jsx("option", { value: "", children: "Select business type" }),
                        /* @__PURE__ */ jsx("option", { value: "restaurant", children: "Restaurant" }),
                        /* @__PURE__ */ jsx("option", { value: "retail", children: "Retail Store" }),
                        /* @__PURE__ */ jsx("option", { value: "service", children: "Service Business" }),
                        /* @__PURE__ */ jsx("option", { value: "tech", children: "Tech Company" }),
                        /* @__PURE__ */ jsx("option", { value: "manufacturing", children: "Manufacturing" }),
                        /* @__PURE__ */ jsx("option", { value: "consulting", children: "Consulting" }),
                        /* @__PURE__ */ jsx("option", { value: "entertainment", children: "Entertainment" }),
                        /* @__PURE__ */ jsx("option", { value: "healthcare", children: "Healthcare" })
                      ]
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Location" }),
                  /* @__PURE__ */ jsxs(
                    "select",
                    {
                      className: "w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                      children: [
                        /* @__PURE__ */ jsx("option", { value: "", children: "Select location" }),
                        Object.entries(norfolkNeighborhoods).map(([key, neighborhood]) => /* @__PURE__ */ jsxs("option", { value: key, children: [
                          neighborhood.name,
                          " - $",
                          neighborhood.rentMultiplier * 1e3,
                          "/month"
                        ] }, key))
                      ]
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Initial Investment" }),
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "number",
                      className: "w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                      placeholder: "Enter initial investment",
                      min: "1000",
                      max: player.money
                    }
                  ),
                  /* @__PURE__ */ jsxs("p", { className: "text-xs text-gray-500 mt-1", children: [
                    "Available funds: $",
                    player.money.toLocaleString()
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex justify-end space-x-3 mt-6", children: [
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: () => setShowNewBusinessForm(false),
                    className: "px-4 py-2 text-gray-600 hover:text-gray-800",
                    children: "Cancel"
                  }
                ),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: () => handleStartBusiness({}),
                    className: "bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium",
                    children: "Start Business"
                  }
                )
              ] })
            ]
          }
        )
      }
    ) }),
    /* @__PURE__ */ jsx(AnimatePresence, { children: selectedBusiness && /* @__PURE__ */ jsx(
      motion.div,
      {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50",
        onClick: () => setSelectedBusiness(null),
        children: /* @__PURE__ */ jsxs(
          motion.div,
          {
            initial: { scale: 0.9, opacity: 0 },
            animate: { scale: 1, opacity: 1 },
            exit: { scale: 0.9, opacity: 0 },
            className: "bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto",
            onClick: (e) => e.stopPropagation(),
            children: [
              /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center mb-6", children: [
                /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-gray-800", children: selectedBusiness.name }),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: () => setSelectedBusiness(null),
                    className: "text-gray-500 hover:text-gray-700 text-2xl",
                    children: "×"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-6 mb-6", children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold mb-3", children: "Financial Overview" }),
                  /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                    /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
                      /* @__PURE__ */ jsx("span", { children: "Monthly Revenue:" }),
                      /* @__PURE__ */ jsxs("span", { className: "font-semibold text-green-600", children: [
                        "$",
                        selectedBusiness.revenue.toLocaleString()
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
                      /* @__PURE__ */ jsx("span", { children: "Monthly Expenses:" }),
                      /* @__PURE__ */ jsxs("span", { className: "font-semibold text-red-600", children: [
                        "$",
                        selectedBusiness.expenses.toLocaleString()
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "flex justify-between border-t pt-2", children: [
                      /* @__PURE__ */ jsx("span", { children: "Net Profit:" }),
                      /* @__PURE__ */ jsxs("span", { className: "font-bold text-blue-600", children: [
                        "$",
                        (selectedBusiness.revenue - selectedBusiness.expenses).toLocaleString()
                      ] })
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold mb-3", children: "Business Stats" }),
                  /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                    /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
                      /* @__PURE__ */ jsx("span", { children: "Level:" }),
                      /* @__PURE__ */ jsx("span", { className: "font-semibold", children: selectedBusiness.level })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
                      /* @__PURE__ */ jsx("span", { children: "Reputation:" }),
                      /* @__PURE__ */ jsxs("span", { className: "font-semibold", children: [
                        selectedBusiness.reputation,
                        "/100"
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
                      /* @__PURE__ */ jsx("span", { children: "Employees:" }),
                      /* @__PURE__ */ jsx("span", { className: "font-semibold", children: selectedBusiness.employees.length })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
                      /* @__PURE__ */ jsx("span", { children: "Customer Base:" }),
                      /* @__PURE__ */ jsx("span", { className: "font-semibold", children: selectedBusiness.customerBase || 0 })
                    ] })
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-3 gap-4", children: [
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: () => handleBusinessAction(selectedBusiness.id, "RUN_OPERATIONS"),
                    className: "bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg",
                    children: "Run Operations"
                  }
                ),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: () => handleBusinessAction(selectedBusiness.id, "HIRE_EMPLOYEE", { role: "manager" }),
                    className: "bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg",
                    children: "Hire Employee"
                  }
                ),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: () => handleBusinessAction(selectedBusiness.id, "UPGRADE_PROPERTY", { upgradeType: "efficiency" }),
                    className: "bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg",
                    children: "Upgrade"
                  }
                )
              ] })
            ]
          }
        )
      }
    ) })
  ] });
};

const challenges = [
  {
    id: "startup_capital",
    title: "Securing Startup Capital",
    description: "Navigate the challenges of raising initial funding through community support and strategic partnerships."
  },
  {
    id: "market_research",
    title: "Market Research",
    description: "Study the Norfolk market to identify underserved needs and opportunities."
  },
  {
    id: "community_support",
    title: "Building Community Support",
    description: "Engage with local community leaders and establish a strong network."
  }
];
const GameMain = ({ player, onBusinessAction }) => {
  const [playerState, setPlayerState] = useState(player || {
    level: 1,
    money: 1e4,
    businesses: [],
    reputation: 0,
    skills: {
      leadership: 1,
      marketing: 1,
      finance: 1,
      networking: 1
    },
    completedChallenges: []
  });
  const [currentView, setCurrentView] = useState("dashboard");
  const [currentChallenge, setCurrentChallenge] = useState(null);
  const [availableOpportunities, setAvailableOpportunities] = useState([]);
  useEffect(() => {
    if (player) {
      setPlayerState(player);
    }
    generateOpportunities();
  }, [player]);
  const loadPlayerState = async (userId) => {
    try {
      const response = await fetch(`/api/player/${userId}`);
      const data = await response.json();
      setPlayerState(data);
    } catch (error) {
      console.error("Error loading player state:", error);
    }
  };
  const generateOpportunities = () => {
    const opportunities = [
      {
        type: "investment",
        title: "Tech Startup Partnership",
        description: "Partner with local tech innovators",
        cost: 5e3,
        potentialReturn: 15e3
      },
      {
        type: "property",
        title: "Military Circle Retail Space",
        description: "Prime location becoming available",
        cost: 8e3,
        monthlyRevenue: 1200
      }
      // Add more dynamic opportunities
    ];
    setAvailableOpportunities(opportunities);
  };
  const handleBusinessUpdate = (updateData) => {
    switch (updateData.type) {
      case "BUSINESS_STARTED":
        setPlayerState((prev) => ({
          ...prev,
          money: prev.money - updateData.cost,
          businesses: [...prev.businesses, updateData.business]
        }));
        break;
      case "EVENT_PARTICIPATED":
        setPlayerState((prev) => ({
          ...prev,
          money: prev.money - updateData.cost,
          reputation: prev.reputation + (updateData.opportunity.rewards.reputation || 0)
        }));
        break;
    }
    if (onBusinessAction) {
      onBusinessAction(updateData.type, updateData);
    }
  };
  const handleBusinessAction = async (action, data) => {
    if (onBusinessAction) {
      await onBusinessAction(action, data);
    } else {
      switch (action) {
        case "START_BUSINESS":
          if (playerState.money >= data.cost) {
            setPlayerState((prev) => ({
              ...prev,
              money: prev.money - data.cost,
              businesses: [...prev.businesses, data]
            }));
          }
          break;
      }
    }
  };
  if (currentView === "business") {
    return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-gray-100", children: [
      /* @__PURE__ */ jsx("div", { className: "bg-white shadow-sm border-b", children: /* @__PURE__ */ jsx("div", { className: "max-w-7xl mx-auto px-6 py-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold text-gray-800", children: "Business Management" }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setCurrentView("dashboard"),
            className: "bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg",
            children: "Back to Dashboard"
          }
        )
      ] }) }) }),
      /* @__PURE__ */ jsx(
        BusinessDashboard,
        {
          player: playerState,
          onBusinessUpdate: handleBusinessUpdate
        }
      )
    ] });
  }
  return /* @__PURE__ */ jsxs("div", { className: "max-w-6xl mx-auto p-6", children: [
    /* @__PURE__ */ jsxs("header", { className: "mb-8", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-4xl font-bold text-gray-800", children: "Norfolk Business Empire" }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-4 gap-4 mt-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "bg-white p-4 rounded-lg shadow", children: [
          /* @__PURE__ */ jsx("h3", { className: "font-bold", children: "Cash" }),
          /* @__PURE__ */ jsxs("p", { className: "text-2xl", children: [
            "$",
            playerState.money.toLocaleString()
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-white p-4 rounded-lg shadow", children: [
          /* @__PURE__ */ jsx("h3", { className: "font-bold", children: "Businesses" }),
          /* @__PURE__ */ jsx("p", { className: "text-2xl", children: playerState.businesses.length })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-white p-4 rounded-lg shadow", children: [
          /* @__PURE__ */ jsx("h3", { className: "font-bold", children: "Reputation" }),
          /* @__PURE__ */ jsxs("p", { className: "text-2xl", children: [
            playerState.reputation,
            "/100"
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-white p-4 rounded-lg shadow", children: [
          /* @__PURE__ */ jsx("h3", { className: "font-bold", children: "Level" }),
          /* @__PURE__ */ jsx("p", { className: "text-2xl", children: playerState.level })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
      /* @__PURE__ */ jsxs("section", { className: "bg-white p-6 rounded-lg shadow", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold mb-4", children: "Quick Actions" }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => setCurrentView("business"),
              className: "bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-lg text-center",
              children: [
                /* @__PURE__ */ jsx("div", { className: "text-2xl mb-2", children: "🏢" }),
                /* @__PURE__ */ jsx("div", { className: "font-semibold", children: "Manage Businesses" })
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => generateOpportunities(),
              className: "bg-green-600 hover:bg-green-700 text-white p-4 rounded-lg text-center",
              children: [
                /* @__PURE__ */ jsx("div", { className: "text-2xl mb-2", children: "💡" }),
                /* @__PURE__ */ jsx("div", { className: "font-semibold", children: "Find Opportunities" })
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => setCurrentChallenge(challenges[0]),
              className: "bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-lg text-center",
              children: [
                /* @__PURE__ */ jsx("div", { className: "text-2xl mb-2", children: "🎯" }),
                /* @__PURE__ */ jsx("div", { className: "font-semibold", children: "Take Challenge" })
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => loadPlayerState(playerState.id),
              className: "bg-orange-600 hover:bg-orange-700 text-white p-4 rounded-lg text-center",
              children: [
                /* @__PURE__ */ jsx("div", { className: "text-2xl mb-2", children: "📊" }),
                /* @__PURE__ */ jsx("div", { className: "font-semibold", children: "View Analytics" })
              ]
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("section", { className: "bg-white p-6 rounded-lg shadow", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold mb-4", children: "Available Opportunities" }),
        availableOpportunities.map((opportunity, index) => /* @__PURE__ */ jsxs(
          motion.div,
          {
            whileHover: { scale: 1.02 },
            className: "border-b p-4 last:border-0",
            children: [
              /* @__PURE__ */ jsx("h3", { className: "font-bold", children: opportunity.title }),
              /* @__PURE__ */ jsx("p", { className: "text-gray-600", children: opportunity.description }),
              /* @__PURE__ */ jsxs("div", { className: "mt-2 flex justify-between items-center", children: [
                /* @__PURE__ */ jsxs("span", { className: "text-green-600", children: [
                  "Cost: $",
                  opportunity.cost
                ] }),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: () => handleBusinessAction("START_BUSINESS", opportunity),
                    className: "bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600",
                    children: "Take Action"
                  }
                )
              ] })
            ]
          },
          index
        ))
      ] })
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "mt-6 bg-white p-6 rounded-lg shadow", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold mb-4", children: "Your Empire" }),
      playerState.businesses.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "text-center py-8", children: [
        /* @__PURE__ */ jsx("p", { className: "text-gray-500 mb-4", children: "You haven't started any businesses yet." }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setCurrentView("business"),
            className: "bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg",
            children: "Start Your First Business"
          }
        )
      ] }) : /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", children: playerState.businesses.map((business, index) => /* @__PURE__ */ jsxs("div", { className: "border rounded-lg p-4", children: [
        /* @__PURE__ */ jsx("h3", { className: "font-bold", children: business.name }),
        /* @__PURE__ */ jsxs("p", { children: [
          "Location: ",
          business.location
        ] }),
        /* @__PURE__ */ jsxs("p", { children: [
          "Monthly Revenue: $",
          business.revenue
        ] }),
        /* @__PURE__ */ jsx("div", { className: "mt-2", children: /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setCurrentView("business"),
            className: "bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-sm",
            children: "Manage"
          }
        ) })
      ] }, index)) })
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "mt-6 bg-white p-6 rounded-lg shadow", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold mb-4", children: "Skills & Development" }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4", children: Object.entries(playerState.skills).map(([skill, level]) => /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
        /* @__PURE__ */ jsx("h3", { className: "font-bold capitalize", children: skill }),
        /* @__PURE__ */ jsx("div", { className: "w-full bg-gray-200 rounded-full h-2 mt-2", children: /* @__PURE__ */ jsx(
          "div",
          {
            className: "bg-blue-600 h-2 rounded-full",
            style: { width: `${level / 10 * 100}%` }
          }
        ) })
      ] }, skill)) })
    ] })
  ] });
};

const COMMUNITY_ORGANIZATIONS = [
  {
    id: "nsu_business",
    name: "Norfolk State University Business School",
    type: "education",
    influence: 8,
    connections: ["students", "professors", "alumni"]
  },
  {
    id: "civic_league",
    name: "Norfolk Civic League",
    type: "community",
    influence: 7,
    connections: ["community_leaders", "residents", "activists"]
  },
  {
    id: "black_chamber",
    name: "Black Chamber of Commerce",
    type: "business",
    influence: 9,
    connections: ["business_owners", "investors", "mentors"]
  },
  {
    id: "youth_center",
    name: "Norfolk Youth Development Center",
    type: "youth",
    influence: 6,
    connections: ["youth", "parents", "educators"]
  }
];
const CommunityHub = ({ player, onCommunityInteraction }) => {
  const [activeOrgs, setActiveOrgs] = useState([]);
  const [currentEvents, setCurrentEvents] = useState([]);
  const [relationships, setRelationships] = useState(/* @__PURE__ */ new Map());
  useEffect(() => {
    loadCommunityData();
    generateEvents();
  }, []);
  const loadCommunityData = () => {
    setActiveOrgs(COMMUNITY_ORGANIZATIONS);
    const initialRelationships = /* @__PURE__ */ new Map();
    COMMUNITY_ORGANIZATIONS.forEach((org) => {
      initialRelationships.set(org.id, {
        level: 1,
        trust: 0,
        lastInteraction: null
      });
    });
    setRelationships(initialRelationships);
  };
  const generateEvents = () => {
    const events = [
      {
        id: "mentorship",
        title: "Youth Mentorship Program",
        organization: "youth_center",
        requirement: { reputation: 20 },
        reward: {
          reputation: 15,
          connections: ["youth_leaders", "educators"],
          skills: { leadership: 2, communication: 1 }
        }
      },
      {
        id: "workshop",
        title: "Business Workshop Series",
        organization: "black_chamber",
        requirement: { level: 3 },
        reward: {
          reputation: 10,
          connections: ["business_mentors"],
          skills: { business: 2, networking: 2 }
        }
      }
    ];
    setCurrentEvents(events);
  };
  const handleEventParticipation = (eventId) => {
    const event = currentEvents.find((e) => e.id === eventId);
    if (!event) return;
    const orgRelationship = relationships.get(event.organization);
    if (orgRelationship) {
      relationships.set(event.organization, {
        ...orgRelationship,
        trust: orgRelationship.trust + 10,
        lastInteraction: /* @__PURE__ */ new Date()
      });
    }
    onCommunityInteraction({
      type: "event_completed",
      data: {
        eventId,
        rewards: event.reward
      }
    });
  };
  return /* @__PURE__ */ jsxs("div", { className: "max-w-6xl mx-auto p-6", children: [
    /* @__PURE__ */ jsx("h2", { className: "text-3xl font-bold mb-6", children: "Norfolk Community Hub" }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
      /* @__PURE__ */ jsxs("section", { className: "bg-white p-6 rounded-lg shadow", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold mb-4", children: "Community Organizations" }),
        activeOrgs.map((org) => {
          const relationship = relationships.get(org.id);
          return /* @__PURE__ */ jsx(
            motion.div,
            {
              whileHover: { scale: 1.02 },
              className: "border-b last:border-0 p-4",
              children: /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-start", children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("h4", { className: "font-bold", children: org.name }),
                  /* @__PURE__ */ jsxs("p", { className: "text-sm text-gray-600", children: [
                    "Influence Level: ",
                    org.influence
                  ] }),
                  relationship && /* @__PURE__ */ jsxs("div", { className: "mt-2", children: [
                    /* @__PURE__ */ jsxs("div", { className: "text-sm", children: [
                      "Trust Level: ",
                      relationship.trust,
                      "%"
                    ] }),
                    /* @__PURE__ */ jsx("div", { className: "w-full bg-gray-200 rounded-full h-2", children: /* @__PURE__ */ jsx(
                      "div",
                      {
                        className: "bg-green-500 h-2 rounded-full",
                        style: { width: `${relationship.trust}%` }
                      }
                    ) })
                  ] })
                ] }),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: () => onCommunityInteraction({
                      type: "connect_organization",
                      data: { orgId: org.id }
                    }),
                    className: "bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600",
                    children: "Connect"
                  }
                )
              ] })
            },
            org.id
          );
        })
      ] }),
      /* @__PURE__ */ jsxs("section", { className: "bg-white p-6 rounded-lg shadow", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold mb-4", children: "Community Events" }),
        currentEvents.map((event) => /* @__PURE__ */ jsxs(
          motion.div,
          {
            whileHover: { scale: 1.02 },
            className: "border-b last:border-0 p-4",
            children: [
              /* @__PURE__ */ jsx("h4", { className: "font-bold", children: event.title }),
              /* @__PURE__ */ jsxs("p", { className: "text-sm text-gray-600 mt-1", children: [
                "Hosted by: ",
                activeOrgs.find((org) => org.id === event.organization)?.name
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "mt-2", children: [
                /* @__PURE__ */ jsx("h5", { className: "font-semibold text-sm", children: "Rewards:" }),
                /* @__PURE__ */ jsxs("ul", { className: "text-sm text-gray-600", children: [
                  event.reward.reputation && /* @__PURE__ */ jsxs("li", { children: [
                    "• Reputation: +",
                    event.reward.reputation
                  ] }),
                  event.reward.skills && Object.entries(event.reward.skills).map(([skill, level]) => /* @__PURE__ */ jsxs("li", { children: [
                    "• ",
                    skill.charAt(0).toUpperCase() + skill.slice(1),
                    ": +",
                    level
                  ] }, skill))
                ] })
              ] }),
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => handleEventParticipation(event.id),
                  className: "mt-3 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600",
                  children: "Participate"
                }
              )
            ]
          },
          event.id
        ))
      ] })
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "mt-6 bg-white p-6 rounded-lg shadow", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold mb-4", children: "Community Impact" }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "bg-gray-50 p-4 rounded", children: [
          /* @__PURE__ */ jsx("h4", { className: "font-bold", children: "Local Employment" }),
          /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold text-green-600", children: player.businesses.reduce((total, b) => total + b.employees.length, 0) }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600", children: "Jobs Created" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-gray-50 p-4 rounded", children: [
          /* @__PURE__ */ jsx("h4", { className: "font-bold", children: "Community Events" }),
          /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold text-blue-600", children: player.eventHistory ? player.eventHistory.length : 0 }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600", children: "Events Participated" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-gray-50 p-4 rounded", children: [
          /* @__PURE__ */ jsx("h4", { className: "font-bold", children: "Youth Programs" }),
          /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold text-purple-600", children: player.youthPrograms ? player.youthPrograms : 0 }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600", children: "Programs Supported" })
        ] })
      ] })
    ] })
  ] });
};

const GameContainer = () => {
  const [gameState, setGameState] = useState("character");
  const [player, setPlayer] = useState(null);
  const [businessSim, setBusinessSim] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  useEffect(() => {
    if (player) {
      try {
        setLoading(true);
        const sim = new BusinessSimulation(player);
        setBusinessSim(sim);
        setError(null);
      } catch (err) {
        setError("Failed to initialize business simulation");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  }, [player]);
  const handleCharacterCreation = (character) => {
    setPlayer({
      ...character,
      money: 1e4,
      // Starting capital
      businesses: [],
      reputation: 0,
      level: 1,
      inventory: [],
      achievements: [],
      eventHistory: []
    });
    setGameState("main");
  };
  const handleBusinessAction = async (action, data) => {
    if (!businessSim) {
      setError("Business simulation not initialized");
      return;
    }
    try {
      setLoading(true);
      setError(null);
      switch (action) {
        case "START_BUSINESS":
          if (data.initialInvestment > player.money) {
            throw new Error("Insufficient funds");
          }
          const newBusiness = await businessSim.startBusiness(data);
          setPlayer((prev) => ({
            ...prev,
            businesses: [...prev.businesses, newBusiness],
            money: prev.money - data.initialInvestment
          }));
          break;
        case "UPGRADE_BUSINESS":
          const upgradedBusiness = await businessSim.upgradeProperty(data.businessId, data.upgradeType);
          updatePlayerBusinesses(upgradedBusiness);
          break;
        case "HIRE_EMPLOYEE":
          const updatedBusiness = await businessSim.hireEmployee(data.businessId, data.employee);
          updatePlayerBusinesses(updatedBusiness);
          break;
        default:
          throw new Error("Invalid business action");
      }
    } catch (err) {
      setError(err.message || "Failed to perform business action");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  const updatePlayerBusinesses = (updatedBusiness) => {
    setPlayer((prev) => ({
      ...prev,
      businesses: prev.businesses.map(
        (b) => b.id === updatedBusiness.id ? updatedBusiness : b
      )
    }));
  };
  const handleCommunityInteraction = async (interaction) => {
    try {
      setLoading(true);
      setError(null);
      switch (interaction.type) {
        case "event_completed":
          if (!interaction.data?.rewards) {
            throw new Error("Invalid event rewards");
          }
          const { reputation = 0, skills = {} } = interaction.data.rewards;
          setPlayer((prev) => ({
            ...prev,
            reputation: prev.reputation + reputation,
            skills: applySkillsUpdate(prev.skills, skills),
            eventHistory: [...prev.eventHistory, {
              ...interaction.data,
              timestamp: /* @__PURE__ */ new Date()
            }]
          }));
          break;
        case "connect_organization":
          setPlayer((prev) => ({
            ...prev,
            connections: [...prev.connections || [], {
              organizationId: interaction.data.organizationId,
              connectionType: interaction.data.type,
              timestamp: /* @__PURE__ */ new Date()
            }]
          }));
          break;
        default:
          throw new Error("Invalid community interaction type");
      }
    } catch (err) {
      setError(err.message || "Failed to process community interaction");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  const applySkillsUpdate = (currentSkills, newSkills) => {
    const updated = { ...currentSkills };
    Object.entries(newSkills).forEach(([skill, increase]) => {
      updated[skill] = (updated[skill] || 0) + increase;
    });
    return updated;
  };
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-gray-100", children: [
    error && /* @__PURE__ */ jsxs("div", { className: "bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative", role: "alert", children: [
      /* @__PURE__ */ jsx("strong", { className: "font-bold", children: "Error!" }),
      /* @__PURE__ */ jsxs("span", { className: "block sm:inline", children: [
        " ",
        error
      ] }),
      /* @__PURE__ */ jsxs(
        "button",
        {
          className: "absolute top-0 right-0 px-4 py-3",
          onClick: () => setError(null),
          children: [
            /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Close" }),
            /* @__PURE__ */ jsx("svg", { className: "h-6 w-6", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M6 18L18 6M6 6l12 12" }) })
          ]
        }
      )
    ] }),
    loading && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50", children: /* @__PURE__ */ jsx("div", { className: "animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500" }) }),
    gameState === "character" && /* @__PURE__ */ jsx(CharacterCustomization, { onSave: handleCharacterCreation }),
    gameState === "main" && player && /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("nav", { className: "bg-white shadow-md p-4", children: /* @__PURE__ */ jsxs("div", { className: "max-w-6xl mx-auto flex justify-between items-center", children: [
        /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold", children: "Norfolk Business Empire" }),
        /* @__PURE__ */ jsxs("div", { className: "flex space-x-4", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setGameState("main"),
              className: `px-4 py-2 rounded transition duration-200 ease-in-out ${gameState === "main" ? "bg-blue-500 text-white hover:bg-blue-600" : "bg-gray-200 hover:bg-gray-300"}`,
              disabled: loading,
              children: "Business"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setGameState("community"),
              className: `px-4 py-2 rounded transition duration-200 ease-in-out ${gameState === "community" ? "bg-blue-500 text-white hover:bg-blue-600" : "bg-gray-200 hover:bg-gray-300"}`,
              disabled: loading,
              children: "Community"
            }
          )
        ] })
      ] }) }),
      gameState === "main" && /* @__PURE__ */ jsx(
        GameMain,
        {
          player,
          onBusinessAction: handleBusinessAction
        }
      ),
      gameState === "community" && /* @__PURE__ */ jsx(
        CommunityHub,
        {
          player,
          onInteraction: handleCommunityInteraction
        }
      ),
      /* @__PURE__ */ jsx(
        PaymentInterface,
        {
          userId: player.id,
          onSuccess: (transaction) => {
            setPlayer((prev) => ({
              ...prev,
              money: prev.money + transaction.amount
            }));
          }
        }
      )
    ] })
  ] });
};

function Character3D({
  position = [0, 0, 0],
  isPlayer = false,
  characterData,
  onInteract
}) {
  const group = useRef(null);
  const [hovered, setHovered] = useState(false);
  const [isWalking, setIsWalking] = useState(false);
  const [direction, setDirection] = useState(0);
  const [customization, setCustomization] = useState({
    skinTone: characterData?.skinTone || "#8B4513",
    hairColor: "#2C1810",
    outfitColor: "#1E40AF",
    accessoryColor: "#FFD700"
  });
  const bodyGeometry = new THREE.CapsuleGeometry(0.3, 1.2, 4, 8);
  const headGeometry = new THREE.SphereGeometry(0.25, 16, 16);
  const armGeometry = new THREE.CapsuleGeometry(0.1, 0.6, 4, 8);
  const legGeometry = new THREE.CapsuleGeometry(0.12, 0.8, 4, 8);
  const skinMaterial = new THREE.MeshLambertMaterial({ color: customization.skinTone });
  const outfitMaterial = new THREE.MeshLambertMaterial({ color: customization.outfitColor });
  const hairMaterial = new THREE.MeshLambertMaterial({ color: customization.hairColor });
  const [animationState, setAnimationState] = useState("idle");
  useFrame((state, delta) => {
    if (!group.current) return;
    if (isWalking) {
      const time = state.clock.elapsedTime;
      group.current.position.y = position[1] + Math.sin(time * 8) * 0.05;
      const leftArm = group.current.children.find((child) => child.userData.name === "leftArm");
      const rightArm = group.current.children.find((child) => child.userData.name === "rightArm");
      const leftLeg = group.current.children.find((child) => child.userData.name === "leftLeg");
      const rightLeg = group.current.children.find((child) => child.userData.name === "rightLeg");
      if (leftArm && rightArm && leftLeg && rightLeg) {
        leftArm.rotation.x = Math.sin(time * 8) * 0.5;
        rightArm.rotation.x = -Math.sin(time * 8) * 0.5;
        leftLeg.rotation.x = -Math.sin(time * 8) * 0.3;
        rightLeg.rotation.x = Math.sin(time * 8) * 0.3;
      }
    }
    if (isPlayer) {
      const time = state.clock.elapsedTime;
      group.current.rotation.y += Math.sin(time * 0.5) * 0.01;
    }
  });
  useEffect(() => {
    if (!isPlayer) return;
    const handleKeyDown = (event) => {
      switch (event.key.toLowerCase()) {
        case "w":
        case "arrowup":
          setIsWalking(true);
          setDirection(0);
          break;
        case "s":
        case "arrowdown":
          setIsWalking(true);
          setDirection(Math.PI);
          break;
        case "a":
        case "arrowleft":
          setIsWalking(true);
          setDirection(Math.PI / 2);
          break;
        case "d":
        case "arrowright":
          setIsWalking(true);
          setDirection(-Math.PI / 2);
          break;
        case " ":
          setAnimationState("jumping");
          break;
      }
    };
    const handleKeyUp = (event) => {
      if (["w", "s", "a", "d", "arrowup", "arrowdown", "arrowleft", "arrowright"].includes(event.key.toLowerCase())) {
        setIsWalking(false);
        setAnimationState("idle");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [isPlayer]);
  return /* @__PURE__ */ jsxs(
    "group",
    {
      ref: group,
      position,
      rotation: [0, direction, 0],
      onPointerOver: () => setHovered(true),
      onPointerOut: () => setHovered(false),
      onClick: onInteract,
      children: [
        /* @__PURE__ */ jsx("mesh", { position: [0, 0.6, 0], material: outfitMaterial, geometry: bodyGeometry }),
        /* @__PURE__ */ jsx("mesh", { position: [0, 1.5, 0], material: skinMaterial, geometry: headGeometry }),
        /* @__PURE__ */ jsx("mesh", { position: [0, 1.7, 0], material: hairMaterial, children: /* @__PURE__ */ jsx("sphereGeometry", { args: [0.28, 16, 8, 0, Math.PI * 2, 0, Math.PI * 0.6] }) }),
        /* @__PURE__ */ jsx(
          "mesh",
          {
            position: [-0.4, 0.8, 0],
            rotation: [0, 0, 0.2],
            material: skinMaterial,
            geometry: armGeometry,
            userData: { name: "leftArm" }
          }
        ),
        /* @__PURE__ */ jsx(
          "mesh",
          {
            position: [0.4, 0.8, 0],
            rotation: [0, 0, -0.2],
            material: skinMaterial,
            geometry: armGeometry,
            userData: { name: "rightArm" }
          }
        ),
        /* @__PURE__ */ jsx(
          "mesh",
          {
            position: [-0.15, -0.2, 0],
            material: outfitMaterial,
            geometry: legGeometry,
            userData: { name: "leftLeg" }
          }
        ),
        /* @__PURE__ */ jsx(
          "mesh",
          {
            position: [0.15, -0.2, 0],
            material: outfitMaterial,
            geometry: legGeometry,
            userData: { name: "rightLeg" }
          }
        ),
        !isPlayer && characterData && /* @__PURE__ */ jsx(Html, { position: [0, 2.2, 0], center: true, children: /* @__PURE__ */ jsxs("div", { className: `bg-black/80 text-white px-2 py-1 rounded text-xs transition-opacity ${hovered ? "opacity-100" : "opacity-70"}`, children: [
          /* @__PURE__ */ jsx("div", { className: "font-bold", children: characterData.name }),
          /* @__PURE__ */ jsxs("div", { className: "text-green-400", children: [
            "Level ",
            characterData.level
          ] }),
          /* @__PURE__ */ jsx("div", { className: "w-16 bg-gray-600 rounded-full h-1 mt-1", children: /* @__PURE__ */ jsx(
            "div",
            {
              className: "bg-red-500 h-1 rounded-full transition-all",
              style: { width: `${characterData.health}%` }
            }
          ) })
        ] }) }),
        isPlayer && /* @__PURE__ */ jsx(Html, { position: [0, 2.5, 0], center: true, children: /* @__PURE__ */ jsx("div", { className: "bg-blue-600/90 text-white px-3 py-1 rounded-full text-xs font-bold", children: "👤 YOU" }) }),
        hovered && !isPlayer && /* @__PURE__ */ jsx(Html, { position: [0, -1.2, 0], center: true, children: /* @__PURE__ */ jsx("div", { className: "bg-yellow-500 text-black px-2 py-1 rounded text-xs font-bold animate-bounce", children: "Press E to interact" }) }),
        /* @__PURE__ */ jsxs("mesh", { position: [0, -0.99, 0], rotation: [-Math.PI / 2, 0, 0], children: [
          /* @__PURE__ */ jsx("circleGeometry", { args: [0.5, 16] }),
          /* @__PURE__ */ jsx("meshBasicMaterial", { color: "black", opacity: 0.3, transparent: true })
        ] })
      ]
    }
  );
}

function Building({
  position,
  size,
  color = "#666666",
  type = "residential",
  name,
  onInteract
}) {
  const [hovered, setHovered] = useState(false);
  const buildingRef = useRef(null);
  const getBuildingIcon = () => {
    switch (type) {
      case "residential":
        return "🏠";
      case "commercial":
        return "🏪";
      case "office":
        return "🏢";
      case "special":
        return "🏛️";
      default:
        return "🏢";
    }
  };
  return /* @__PURE__ */ jsxs("group", { position, children: [
    /* @__PURE__ */ jsx(
      Box,
      {
        ref: buildingRef,
        args: size,
        position: [0, size[1] / 2, 0],
        onPointerOver: () => setHovered(true),
        onPointerOut: () => setHovered(false),
        onClick: onInteract,
        castShadow: true,
        receiveShadow: true,
        children: /* @__PURE__ */ jsx(
          "meshStandardMaterial",
          {
            color: hovered ? "#ff6b6b" : color,
            transparent: true,
            opacity: hovered ? 0.8 : 1
          }
        )
      }
    ),
    size[1] > 3 && /* @__PURE__ */ jsx(Fragment, { children: Array.from({ length: Math.floor(size[1] / 2) }).map((_, floor) => /* @__PURE__ */ jsx("group", { children: Array.from({ length: Math.floor(size[0] / 2) }).map((_2, window) => /* @__PURE__ */ jsx(
      Box,
      {
        args: [0.3, 0.4, 0.05],
        position: [
          -size[0] / 2 + 0.5 + window * 1.5,
          1 + floor * 2,
          size[2] / 2 + 0.03
        ],
        children: /* @__PURE__ */ jsx("meshStandardMaterial", { color: "#87CEEB", emissive: "#001122" })
      },
      `${floor}-${window}`
    )) }, floor)) }),
    hovered && name && /* @__PURE__ */ jsx(Html, { position: [0, size[1] + 1, 0], center: true, children: /* @__PURE__ */ jsxs("div", { className: "bg-black/80 text-white px-3 py-2 rounded-lg text-sm", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
        /* @__PURE__ */ jsx("span", { className: "text-lg", children: getBuildingIcon() }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("div", { className: "font-bold", children: name }),
          /* @__PURE__ */ jsx("div", { className: "text-xs text-gray-300 capitalize", children: type })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "text-xs text-yellow-400 mt-1", children: "Click to enter" })
    ] }) })
  ] });
}
function Vehicle({
  position,
  type = "car",
  color = "#ff0000",
  onInteract
}) {
  const [hovered, setHovered] = useState(false);
  const vehicleRef = useRef(null);
  useFrame((state) => {
    if (vehicleRef.current && hovered) {
      vehicleRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 2) * 0.05;
    }
  });
  const getVehicleSize = () => {
    switch (type) {
      case "car":
        return [2, 0.8, 4];
      case "truck":
        return [2.5, 1.5, 6];
      case "motorcycle":
        return [0.8, 1, 2];
      case "bus":
        return [2.5, 2, 8];
      default:
        return [2, 0.8, 4];
    }
  };
  const size = getVehicleSize();
  return /* @__PURE__ */ jsxs(
    "group",
    {
      ref: vehicleRef,
      position,
      onPointerOver: () => setHovered(true),
      onPointerOut: () => setHovered(false),
      onClick: onInteract,
      children: [
        /* @__PURE__ */ jsx(Box, { args: size, position: [0, size[1] / 2, 0], castShadow: true, children: /* @__PURE__ */ jsx("meshStandardMaterial", { color: hovered ? "#ffff00" : color, metalness: 0.8, roughness: 0.2 }) }),
        /* @__PURE__ */ jsx(Cylinder, { args: [0.3, 0.3, 0.2], position: [-0.8, 0.3, 1.2], rotation: [0, 0, Math.PI / 2], children: /* @__PURE__ */ jsx("meshStandardMaterial", { color: "#333333" }) }),
        /* @__PURE__ */ jsx(Cylinder, { args: [0.3, 0.3, 0.2], position: [0.8, 0.3, 1.2], rotation: [0, 0, Math.PI / 2], children: /* @__PURE__ */ jsx("meshStandardMaterial", { color: "#333333" }) }),
        /* @__PURE__ */ jsx(Cylinder, { args: [0.3, 0.3, 0.2], position: [-0.8, 0.3, -1.2], rotation: [0, 0, Math.PI / 2], children: /* @__PURE__ */ jsx("meshStandardMaterial", { color: "#333333" }) }),
        /* @__PURE__ */ jsx(Cylinder, { args: [0.3, 0.3, 0.2], position: [0.8, 0.3, -1.2], rotation: [0, 0, Math.PI / 2], children: /* @__PURE__ */ jsx("meshStandardMaterial", { color: "#333333" }) }),
        hovered && /* @__PURE__ */ jsx(Html, { position: [0, size[1] + 1, 0], center: true, children: /* @__PURE__ */ jsxs("div", { className: "bg-black/80 text-white px-2 py-1 rounded text-xs", children: [
          /* @__PURE__ */ jsx("div", { className: "font-bold capitalize", children: type }),
          /* @__PURE__ */ jsx("div", { className: "text-yellow-400", children: "Press F to drive" })
        ] }) })
      ]
    }
  );
}
function StreetLight({ position }) {
  return /* @__PURE__ */ jsxs("group", { position, children: [
    /* @__PURE__ */ jsx(Cylinder, { args: [0.1, 0.1, 4], position: [0, 2, 0], children: /* @__PURE__ */ jsx("meshStandardMaterial", { color: "#444444" }) }),
    /* @__PURE__ */ jsx(Box, { args: [0.3, 0.3, 0.3], position: [0, 4, 0], children: /* @__PURE__ */ jsx("meshStandardMaterial", { color: "#ffff88", emissive: "#ffff44" }) }),
    /* @__PURE__ */ jsx("pointLight", { position: [0, 4, 0], intensity: 0.5, distance: 10, color: "#ffff88" })
  ] });
}
function TrafficLight({ position }) {
  const [currentLight, setCurrentLight] = useState("red");
  useFrame((state) => {
    const time = Math.floor(state.clock.elapsedTime / 3) % 3;
    const lights = ["red", "yellow", "green"];
    setCurrentLight(lights[time]);
  });
  return /* @__PURE__ */ jsxs("group", { position, children: [
    /* @__PURE__ */ jsx(Cylinder, { args: [0.05, 0.05, 3], position: [0, 1.5, 0], children: /* @__PURE__ */ jsx("meshStandardMaterial", { color: "#333333" }) }),
    /* @__PURE__ */ jsx(Box, { args: [0.3, 0.8, 0.2], position: [0, 3.2, 0], children: /* @__PURE__ */ jsx("meshStandardMaterial", { color: "#222222" }) }),
    /* @__PURE__ */ jsx(Cylinder, { args: [0.08, 0.08, 0.05], position: [0, 3.5, 0.11], children: /* @__PURE__ */ jsx(
      "meshStandardMaterial",
      {
        color: currentLight === "red" ? "#ff0000" : "#440000",
        emissive: currentLight === "red" ? "#ff0000" : "#000000"
      }
    ) }),
    /* @__PURE__ */ jsx(Cylinder, { args: [0.08, 0.08, 0.05], position: [0, 3.2, 0.11], children: /* @__PURE__ */ jsx(
      "meshStandardMaterial",
      {
        color: currentLight === "yellow" ? "#ffff00" : "#444400",
        emissive: currentLight === "yellow" ? "#ffff00" : "#000000"
      }
    ) }),
    /* @__PURE__ */ jsx(Cylinder, { args: [0.08, 0.08, 0.05], position: [0, 2.9, 0.11], children: /* @__PURE__ */ jsx(
      "meshStandardMaterial",
      {
        color: currentLight === "green" ? "#00ff00" : "#004400",
        emissive: currentLight === "green" ? "#00ff00" : "#000000"
      }
    ) })
  ] });
}
function Road({ start, end, width = 4 }) {
  const length = Math.sqrt(Math.pow(end[0] - start[0], 2) + Math.pow(end[1] - start[1], 2));
  const angle = Math.atan2(end[1] - start[1], end[0] - start[0]);
  const midX = (start[0] + end[0]) / 2;
  const midZ = (start[1] + end[1]) / 2;
  return /* @__PURE__ */ jsxs("group", { position: [midX, 0.01, midZ], rotation: [0, angle, 0], children: [
    /* @__PURE__ */ jsx(Plane, { args: [length, width], rotation: [-Math.PI / 2, 0, 0], children: /* @__PURE__ */ jsx("meshStandardMaterial", { color: "#333333" }) }),
    /* @__PURE__ */ jsx(Plane, { args: [length, 0.2], rotation: [-Math.PI / 2, 0, 0], position: [0, 0.01, 0], children: /* @__PURE__ */ jsx("meshStandardMaterial", { color: "#ffff00" }) })
  ] });
}
function OpenWorld({ onBuildingInteract, onVehicleInteract }) {
  const buildings = [
    { name: "Norfolk City Hall", type: "special", position: [0, 0, 0], size: [4, 6, 4], color: "#8B4513" },
    { name: "BettaDayz HQ", type: "office", position: [10, 0, 5], size: [6, 8, 6], color: "#4169E1" },
    { name: "Corner Store", type: "commercial", position: [-8, 0, 3], size: [3, 4, 3], color: "#32CD32" },
    { name: "Apartment Complex", type: "residential", position: [15, 0, -10], size: [8, 12, 6], color: "#CD853F" },
    { name: "Police Station", type: "special", position: [-15, 0, -5], size: [5, 5, 5], color: "#000080" },
    { name: "Hospital", type: "special", position: [5, 0, -15], size: [7, 6, 8], color: "#FF6347" },
    { name: "Bank", type: "commercial", position: [-5, 0, 8], size: [4, 5, 4], color: "#FFD700" },
    { name: "Gym", type: "commercial", position: [12, 0, 12], size: [5, 4, 6], color: "#FF4500" }
  ];
  const vehicles = [
    { type: "car", position: [3, 0, 2], color: "#ff0000" },
    { type: "truck", position: [-10, 0, -2], color: "#0000ff" },
    { type: "motorcycle", position: [7, 0, -5], color: "#000000" },
    { type: "bus", position: [-3, 0, 10], color: "#ffff00" }
  ];
  return /* @__PURE__ */ jsxs("group", { children: [
    /* @__PURE__ */ jsx(Plane, { args: [100, 100], rotation: [-Math.PI / 2, 0, 0], position: [0, -1, 0], receiveShadow: true, children: /* @__PURE__ */ jsx("meshStandardMaterial", { color: "#2d5a27" }) }),
    /* @__PURE__ */ jsx(Road, { start: [-20, -20], end: [20, -20] }),
    /* @__PURE__ */ jsx(Road, { start: [-20, 0], end: [20, 0] }),
    /* @__PURE__ */ jsx(Road, { start: [-20, 20], end: [20, 20] }),
    /* @__PURE__ */ jsx(Road, { start: [-20, -20], end: [-20, 20] }),
    /* @__PURE__ */ jsx(Road, { start: [0, -20], end: [0, 20] }),
    /* @__PURE__ */ jsx(Road, { start: [20, -20], end: [20, 20] }),
    buildings.map((building, index) => /* @__PURE__ */ jsx(
      Building,
      {
        position: building.position,
        size: building.size,
        color: building.color,
        type: building.type,
        name: building.name,
        onInteract: () => onBuildingInteract?.(building.name)
      },
      index
    )),
    vehicles.map((vehicle, index) => /* @__PURE__ */ jsx(
      Vehicle,
      {
        position: vehicle.position,
        type: vehicle.type,
        color: vehicle.color,
        onInteract: () => onVehicleInteract?.(vehicle.type)
      },
      index
    )),
    /* @__PURE__ */ jsx(StreetLight, { position: [5, 0, 5] }),
    /* @__PURE__ */ jsx(StreetLight, { position: [-5, 0, 5] }),
    /* @__PURE__ */ jsx(StreetLight, { position: [5, 0, -5] }),
    /* @__PURE__ */ jsx(StreetLight, { position: [-5, 0, -5] }),
    /* @__PURE__ */ jsx(StreetLight, { position: [15, 0, 0] }),
    /* @__PURE__ */ jsx(StreetLight, { position: [-15, 0, 0] }),
    /* @__PURE__ */ jsx(TrafficLight, { position: [0, 0, 0] }),
    /* @__PURE__ */ jsx(TrafficLight, { position: [10, 0, 10] }),
    /* @__PURE__ */ jsx(TrafficLight, { position: [-10, 0, -10] }),
    Array.from({ length: 20 }).map((_, i) => /* @__PURE__ */ jsxs("group", { position: [
      (Math.random() - 0.5) * 80,
      0,
      (Math.random() - 0.5) * 80
    ], children: [
      /* @__PURE__ */ jsx(Cylinder, { args: [0.2, 0.3, 3], position: [0, 1.5, 0], children: /* @__PURE__ */ jsx("meshStandardMaterial", { color: "#8B4513" }) }),
      /* @__PURE__ */ jsx(Box, { args: [2, 2, 2], position: [0, 3.5, 0], children: /* @__PURE__ */ jsx("meshStandardMaterial", { color: "#228B22" }) })
    ] }, `tree-${i}`)),
    Array.from({ length: 8 }).map((_, i) => /* @__PURE__ */ jsxs("group", { position: [
      (Math.random() - 0.5) * 30,
      0,
      (Math.random() - 0.5) * 30
    ], children: [
      /* @__PURE__ */ jsx(Box, { args: [1.5, 0.1, 0.4], position: [0, 0.4, 0], children: /* @__PURE__ */ jsx("meshStandardMaterial", { color: "#8B4513" }) }),
      /* @__PURE__ */ jsx(Box, { args: [0.1, 0.4, 0.4], position: [-0.7, 0.2, 0], children: /* @__PURE__ */ jsx("meshStandardMaterial", { color: "#8B4513" }) }),
      /* @__PURE__ */ jsx(Box, { args: [0.1, 0.4, 0.4], position: [0.7, 0.2, 0], children: /* @__PURE__ */ jsx("meshStandardMaterial", { color: "#8B4513" }) })
    ] }, `bench-${i}`))
  ] });
}

const npcs = [
  {
    id: 1,
    name: "Marcus Johnson",
    level: 15,
    health: 100,
    position: [5, 0, 3],
    outfit: "business",
    skinTone: "#8B4513",
    hairStyle: "short",
    accessories: ["watch", "glasses"]
  },
  {
    id: 2,
    name: "Sarah Williams",
    level: 22,
    health: 85,
    position: [-3, 0, 5],
    outfit: "casual",
    skinTone: "#D2691E",
    hairStyle: "long",
    accessories: ["earrings"]
  },
  {
    id: 3,
    name: "DJ Rodriguez",
    level: 8,
    health: 95,
    position: [8, 0, -2],
    outfit: "street",
    skinTone: "#C68642",
    hairStyle: "fade",
    accessories: ["chain", "cap"]
  },
  {
    id: 4,
    name: "Officer Thompson",
    level: 30,
    health: 100,
    position: [-5, 0, -4],
    outfit: "uniform",
    skinTone: "#FDBCB4",
    hairStyle: "buzz",
    accessories: ["badge", "radio"]
  }
];
function GameHUD() {
  const [money, setMoney] = useState(1e3);
  const [level, setLevel] = useState(1);
  const [health, setHealth] = useState(100);
  return /* @__PURE__ */ jsxs("div", { className: "fixed inset-0 pointer-events-none z-10", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute top-4 left-4 bg-black/80 text-white p-4 rounded-lg pointer-events-auto", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col space-y-2", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
        /* @__PURE__ */ jsx("span", { className: "text-green-400", children: "💰" }),
        /* @__PURE__ */ jsxs("span", { children: [
          "$",
          money.toLocaleString()
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
        /* @__PURE__ */ jsx("span", { className: "text-blue-400", children: "⭐" }),
        /* @__PURE__ */ jsxs("span", { children: [
          "Level ",
          level
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
        /* @__PURE__ */ jsx("span", { className: "text-red-400", children: "❤️" }),
        /* @__PURE__ */ jsx("div", { className: "w-20 h-2 bg-gray-700 rounded", children: /* @__PURE__ */ jsx(
          "div",
          {
            className: "h-full bg-red-500 rounded transition-all",
            style: { width: `${health}%` }
          }
        ) })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "absolute top-4 right-4 w-32 h-32 bg-black/80 rounded-lg border-2 border-white/20 pointer-events-auto", children: /* @__PURE__ */ jsx("div", { className: "relative w-full h-full", children: /* @__PURE__ */ jsxs("div", { className: "absolute inset-2 bg-green-900 rounded", children: [
      /* @__PURE__ */ jsx("div", { className: "absolute top-1/2 left-1/2 w-2 h-2 bg-blue-400 rounded-full transform -translate-x-1/2 -translate-y-1/2" }),
      /* @__PURE__ */ jsx("div", { className: "absolute top-1/4 right-1/4 w-1 h-1 bg-red-400 rounded-full" }),
      /* @__PURE__ */ jsx("div", { className: "absolute bottom-1/4 left-1/4 w-1 h-1 bg-yellow-400 rounded-full" })
    ] }) }) }),
    /* @__PURE__ */ jsxs("div", { className: "absolute bottom-4 right-4 flex flex-col space-y-2 pointer-events-auto", children: [
      /* @__PURE__ */ jsx("button", { className: "bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors", children: "🏪 Shop" }),
      /* @__PURE__ */ jsx("button", { className: "bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors", children: "💼 Business" }),
      /* @__PURE__ */ jsx("button", { className: "bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors", children: "👥 Social" })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "absolute bottom-4 left-4 bg-black/80 text-white p-3 rounded-lg text-sm pointer-events-auto", children: /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
      /* @__PURE__ */ jsx("div", { children: "WASD - Move Camera" }),
      /* @__PURE__ */ jsx("div", { children: "Mouse - Look Around" }),
      /* @__PURE__ */ jsx("div", { children: "Click - Interact" })
    ] }) })
  ] });
}
function CameraController() {
  const { camera } = useThree();
  useEffect(() => {
    camera.position.set(0, 5, 10);
    camera.lookAt(0, 0, 0);
  }, [camera]);
  return null;
}
function Game3D({ gamepadControls }) {
  const [playerPosition, setPlayerPosition] = useState([0, 0, 0]);
  const [selectedNPC, setSelectedNPC] = useState(null);
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const handleNPCInteraction = (npcId) => {
    setSelectedNPC(npcId);
    console.log(`Interacting with NPC ${npcId}`);
  };
  const handleBuildingInteraction = (buildingName) => {
    setSelectedBuilding(buildingName);
    console.log(`Entering building: ${buildingName}`);
  };
  const handleVehicleInteraction = (vehicleType) => {
    setSelectedVehicle(vehicleType);
    console.log(`Interacting with vehicle: ${vehicleType}`);
  };
  return /* @__PURE__ */ jsxs("div", { className: "w-full h-screen relative bg-gradient-to-b from-blue-400 to-blue-600", children: [
    /* @__PURE__ */ jsx(GameHUD, {}),
    /* @__PURE__ */ jsxs(
      Canvas,
      {
        shadows: true,
        camera: { position: [0, 5, 10], fov: 75 },
        className: "w-full h-full",
        children: [
          /* @__PURE__ */ jsx(CameraController, {}),
          /* @__PURE__ */ jsx("ambientLight", { intensity: 0.4 }),
          /* @__PURE__ */ jsx(
            "directionalLight",
            {
              position: [10, 10, 5],
              intensity: 1,
              castShadow: true,
              "shadow-mapSize-width": 2048,
              "shadow-mapSize-height": 2048
            }
          ),
          /* @__PURE__ */ jsx("pointLight", { position: [0, 10, 0], intensity: 0.5 }),
          /* @__PURE__ */ jsx(
            Sky,
            {
              distance: 45e4,
              sunPosition: [0, 1, 0],
              inclination: 0,
              azimuth: 0.25
            }
          ),
          /* @__PURE__ */ jsxs(Suspense, { fallback: null, children: [
            /* @__PURE__ */ jsx(Environment, { preset: "city" }),
            /* @__PURE__ */ jsx(
              OpenWorld,
              {
                onBuildingInteract: handleBuildingInteraction,
                onVehicleInteract: handleVehicleInteraction
              }
            ),
            /* @__PURE__ */ jsx(
              Character3D,
              {
                position: playerPosition,
                isPlayer: true,
                characterData: {
                  name: "Player",
                  level: 1,
                  health: 100,
                  outfit: "casual",
                  skinTone: "#8B4513",
                  hairStyle: "medium",
                  accessories: []
                }
              }
            ),
            npcs.map((npc) => /* @__PURE__ */ jsx(
              Character3D,
              {
                position: npc.position,
                isPlayer: false,
                characterData: npc,
                onInteract: () => handleNPCInteraction(npc.id)
              },
              npc.id
            )),
            /* @__PURE__ */ jsx(
              Text,
              {
                position: [0, 6, -5],
                fontSize: 1,
                color: "#ffffff",
                anchorX: "center",
                anchorY: "middle",
                children: "Welcome to BettaDayz 3D!"
              }
            )
          ] }),
          /* @__PURE__ */ jsx(
            OrbitControls,
            {
              enablePan: true,
              enableZoom: true,
              enableRotate: true,
              minDistance: 3,
              maxDistance: 20,
              maxPolarAngle: Math.PI / 2,
              target: playerPosition
            }
          )
        ]
      }
    ),
    selectedNPC && /* @__PURE__ */ jsx("div", { className: "fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50", children: /* @__PURE__ */ jsxs("div", { className: "bg-black/90 backdrop-blur-sm p-6 rounded-lg border border-white/20 max-w-md", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-white font-bold text-xl mb-4", children: npcs.find((npc) => npc.id === selectedNPC)?.name }),
      /* @__PURE__ */ jsxs("p", { className: "text-gray-300 mb-4", children: [
        `"Hey there! Welcome to Norfolk. I'm level `,
        npcs.find((npc) => npc.id === selectedNPC)?.level,
        '. Want to do some business together?"'
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex space-x-2", children: [
        /* @__PURE__ */ jsx("button", { className: "bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors", children: "💼 Business" }),
        /* @__PURE__ */ jsx("button", { className: "bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition-colors", children: "🤝 Social" }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setSelectedNPC(null),
            className: "bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded transition-colors",
            children: "❌ Close"
          }
        )
      ] })
    ] }) }),
    selectedBuilding && /* @__PURE__ */ jsx("div", { className: "fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50", children: /* @__PURE__ */ jsxs("div", { className: "bg-black/90 backdrop-blur-sm p-6 rounded-lg border border-white/20 max-w-md", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-white font-bold text-xl mb-4", children: selectedBuilding }),
      /* @__PURE__ */ jsxs("p", { className: "text-gray-300 mb-4", children: [
        "Welcome to ",
        selectedBuilding,
        ". What would you like to do here?"
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-2", children: [
        /* @__PURE__ */ jsx("button", { className: "bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors", children: "🚪 Enter" }),
        /* @__PURE__ */ jsx("button", { className: "bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition-colors", children: "💰 Shop" }),
        /* @__PURE__ */ jsx("button", { className: "bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded transition-colors", children: "ℹ️ Info" }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setSelectedBuilding(null),
            className: "bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded transition-colors",
            children: "❌ Close"
          }
        )
      ] })
    ] }) }),
    selectedVehicle && /* @__PURE__ */ jsx("div", { className: "fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50", children: /* @__PURE__ */ jsxs("div", { className: "bg-black/90 backdrop-blur-sm p-6 rounded-lg border border-white/20 max-w-md", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-white font-bold text-xl mb-4 capitalize", children: selectedVehicle }),
      /* @__PURE__ */ jsxs("p", { className: "text-gray-300 mb-4", children: [
        "This ",
        selectedVehicle,
        " looks ready to drive. What would you like to do?"
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex space-x-2", children: [
        /* @__PURE__ */ jsx("button", { className: "bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors", children: "🚗 Drive" }),
        /* @__PURE__ */ jsx("button", { className: "bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition-colors", children: "💰 Buy" }),
        /* @__PURE__ */ jsx("button", { className: "bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded transition-colors", children: "🔧 Customize" }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setSelectedVehicle(null),
            className: "bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded transition-colors",
            children: "❌ Close"
          }
        )
      ] })
    ] }) })
  ] });
}

function WantedLevel({ level }) {
  return /* @__PURE__ */ jsx("div", { className: "flex space-x-1", children: [...Array(6)].map((_, i) => /* @__PURE__ */ jsx(
    "div",
    {
      className: `w-4 h-4 ${i < level ? "text-red-500" : "text-gray-600"}`,
      children: "⭐"
    },
    i
  )) });
}
function CircularProgress({ value, max, color, size = 60 }) {
  const percentage = value / max * 100;
  const circumference = 2 * Math.PI * (size / 2 - 5);
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - percentage / 100 * circumference;
  return /* @__PURE__ */ jsxs("div", { className: "relative", style: { width: size, height: size }, children: [
    /* @__PURE__ */ jsxs("svg", { className: "transform -rotate-90", width: size, height: size, children: [
      /* @__PURE__ */ jsx(
        "circle",
        {
          cx: size / 2,
          cy: size / 2,
          r: size / 2 - 5,
          stroke: "rgba(255,255,255,0.2)",
          strokeWidth: "3",
          fill: "transparent"
        }
      ),
      /* @__PURE__ */ jsx(
        "circle",
        {
          cx: size / 2,
          cy: size / 2,
          r: size / 2 - 5,
          stroke: color,
          strokeWidth: "3",
          fill: "transparent",
          strokeDasharray,
          strokeDashoffset,
          className: "transition-all duration-300"
        }
      )
    ] }),
    /* @__PURE__ */ jsx("div", { className: "absolute inset-0 flex items-center justify-center text-white text-xs font-bold", children: value })
  ] });
}
function MainMenu({ isOpen, onClose, onMenuAction }) {
  const menuItems = [
    { icon: "🏪", label: "Shop", action: "shop", color: "bg-blue-600" },
    { icon: "💼", label: "Business", action: "business", color: "bg-green-600" },
    { icon: "🏠", label: "Properties", action: "properties", color: "bg-purple-600" },
    { icon: "🚗", label: "Garage", action: "garage", color: "bg-orange-600" },
    { icon: "👥", label: "Social", action: "social", color: "bg-pink-600" },
    { icon: "📊", label: "Stats", action: "stats", color: "bg-indigo-600" },
    { icon: "⚙️", label: "Settings", action: "settings", color: "bg-gray-600" },
    { icon: "❌", label: "Close", action: "close", color: "bg-red-600" }
  ];
  return /* @__PURE__ */ jsx(AnimatePresence, { children: isOpen && /* @__PURE__ */ jsx(
    motion.div,
    {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      className: "fixed inset-0 bg-black/80 flex items-center justify-center z-50",
      children: /* @__PURE__ */ jsxs(
        motion.div,
        {
          initial: { scale: 0.8, opacity: 0 },
          animate: { scale: 1, opacity: 1 },
          exit: { scale: 0.8, opacity: 0 },
          className: "bg-gray-900 rounded-lg p-8 max-w-2xl w-full mx-4",
          children: [
            /* @__PURE__ */ jsx("h2", { className: "text-3xl font-bold text-white mb-8 text-center", children: "BettaDayz Menu" }),
            /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4", children: menuItems.map((item) => /* @__PURE__ */ jsxs(
              motion.button,
              {
                whileHover: { scale: 1.05 },
                whileTap: { scale: 0.95 },
                onClick: () => {
                  if (item.action === "close") {
                    onClose();
                  } else {
                    onMenuAction(item.action);
                  }
                },
                className: `${item.color} hover:opacity-80 text-white p-4 rounded-lg transition-all flex flex-col items-center space-y-2`,
                children: [
                  /* @__PURE__ */ jsx("span", { className: "text-2xl", children: item.icon }),
                  /* @__PURE__ */ jsx("span", { className: "text-sm font-semibold", children: item.label })
                ]
              },
              item.action
            )) })
          ]
        }
      )
    }
  ) });
}
function ShopMenu({ isOpen, onClose }) {
  const shopItems = [
    { name: "Health Pack", price: 100, icon: "❤️", description: "Restore full health" },
    { name: "Armor Vest", price: 500, icon: "🛡️", description: "Increase armor protection" },
    { name: "Sports Car", price: 5e4, icon: "🏎️", description: "Fast and stylish vehicle" },
    { name: "Business Suit", price: 2e3, icon: "👔", description: "Increase respect +10" },
    { name: "Luxury Watch", price: 1e4, icon: "⌚", description: "Status symbol" },
    { name: "VIP Pass", price: 25e3, icon: "🎫", description: "Access exclusive areas" }
  ];
  return /* @__PURE__ */ jsx(AnimatePresence, { children: isOpen && /* @__PURE__ */ jsx(
    motion.div,
    {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      className: "fixed inset-0 bg-black/90 flex items-center justify-center z-50",
      children: /* @__PURE__ */ jsxs(
        motion.div,
        {
          initial: { y: 50, opacity: 0 },
          animate: { y: 0, opacity: 1 },
          exit: { y: 50, opacity: 0 },
          className: "bg-gray-900 rounded-lg p-8 max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto",
          children: [
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center mb-6", children: [
              /* @__PURE__ */ jsx("h2", { className: "text-3xl font-bold text-white", children: "Shop" }),
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: onClose,
                  className: "text-white hover:text-red-400 text-2xl",
                  children: "✕"
                }
              )
            ] }),
            /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", children: shopItems.map((item, index) => /* @__PURE__ */ jsxs(
              motion.div,
              {
                whileHover: { scale: 1.02 },
                className: "bg-gray-800 rounded-lg p-4 border border-gray-700",
                children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-3 mb-3", children: [
                    /* @__PURE__ */ jsx("span", { className: "text-2xl", children: item.icon }),
                    /* @__PURE__ */ jsxs("div", { children: [
                      /* @__PURE__ */ jsx("h3", { className: "text-white font-semibold", children: item.name }),
                      /* @__PURE__ */ jsxs("p", { className: "text-green-400 font-bold", children: [
                        "$",
                        item.price.toLocaleString()
                      ] })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsx("p", { className: "text-gray-300 text-sm mb-3", children: item.description }),
                  /* @__PURE__ */ jsx("button", { className: "w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded transition-colors", children: "Purchase" })
                ]
              },
              index
            )) })
          ]
        }
      )
    }
  ) });
}
function GTAStyleUI({
  playerStats,
  onMenuAction,
  gamepadConnected = false
}) {
  const [currentTime, setCurrentTime] = useState(/* @__PURE__ */ new Date());
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(/* @__PURE__ */ new Date());
    }, 1e3);
    return () => clearInterval(timer);
  }, []);
  const addNotification = (message) => {
    setNotifications((prev) => [...prev, message]);
    setTimeout(() => {
      setNotifications((prev) => prev.slice(1));
    }, 5e3);
  };
  const handleMenuAction = (action) => {
    if (action === "shop") {
      setIsShopOpen(true);
      setIsMenuOpen(false);
    } else {
      onMenuAction(action);
      addNotification(`Opened ${action}`);
    }
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("div", { className: "fixed top-4 left-4 z-40", children: /* @__PURE__ */ jsxs(
      motion.div,
      {
        initial: { x: -100, opacity: 0 },
        animate: { x: 0, opacity: 1 },
        className: "bg-black/90 backdrop-blur-sm rounded-lg p-4 border border-white/20",
        children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2 mb-3", children: [
            /* @__PURE__ */ jsx("span", { className: "text-green-400 text-xl", children: "💰" }),
            /* @__PURE__ */ jsxs("span", { className: "text-white font-bold text-lg", children: [
              "$",
              playerStats.money.toLocaleString()
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-4 mb-3", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-1", children: [
              /* @__PURE__ */ jsx("span", { className: "text-blue-400", children: "⭐" }),
              /* @__PURE__ */ jsxs("span", { className: "text-white text-sm", children: [
                "Lv.",
                playerStats.level
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-1", children: [
              /* @__PURE__ */ jsx("span", { className: "text-purple-400", children: "👑" }),
              /* @__PURE__ */ jsx("span", { className: "text-white text-sm", children: playerStats.respect })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex space-x-3 mb-3", children: [
            /* @__PURE__ */ jsx(
              CircularProgress,
              {
                value: playerStats.health,
                max: 100,
                color: "#ef4444",
                size: 50
              }
            ),
            /* @__PURE__ */ jsx(
              CircularProgress,
              {
                value: playerStats.armor,
                max: 100,
                color: "#3b82f6",
                size: 50
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "mb-2", children: [
            /* @__PURE__ */ jsx("div", { className: "text-white text-xs mb-1", children: "Wanted Level" }),
            /* @__PURE__ */ jsx(WantedLevel, { level: playerStats.wanted })
          ] })
        ]
      }
    ) }),
    /* @__PURE__ */ jsx("div", { className: "fixed top-4 right-4 z-40", children: /* @__PURE__ */ jsxs(
      motion.div,
      {
        initial: { x: 100, opacity: 0 },
        animate: { x: 0, opacity: 1 },
        className: "bg-black/90 backdrop-blur-sm rounded-lg p-4 border border-white/20 text-center",
        children: [
          /* @__PURE__ */ jsx("div", { className: "text-white font-bold text-lg", children: currentTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }),
          /* @__PURE__ */ jsx("div", { className: "text-gray-300 text-sm", children: currentTime.toLocaleDateString() }),
          /* @__PURE__ */ jsx("div", { className: "text-yellow-400 text-2xl mt-2", children: "☀️" })
        ]
      }
    ) }),
    /* @__PURE__ */ jsx("div", { className: "fixed top-20 right-4 z-40", children: /* @__PURE__ */ jsx(
      motion.div,
      {
        initial: { x: 100, opacity: 0 },
        animate: { x: 0, opacity: 1 },
        transition: { delay: 0.2 },
        className: "w-40 h-40 bg-black/90 backdrop-blur-sm rounded-lg border-2 border-white/20 p-2",
        children: /* @__PURE__ */ jsxs("div", { className: "relative w-full h-full bg-green-900 rounded overflow-hidden", children: [
          /* @__PURE__ */ jsx("div", { className: "absolute top-1/2 left-1/2 w-2 h-2 bg-blue-400 rounded-full transform -translate-x-1/2 -translate-y-1/2 z-10" }),
          /* @__PURE__ */ jsx("div", { className: "absolute top-1/4 right-1/4 w-3 h-3 bg-gray-600 rounded" }),
          /* @__PURE__ */ jsx("div", { className: "absolute bottom-1/4 left-1/4 w-2 h-4 bg-gray-600 rounded" }),
          /* @__PURE__ */ jsx("div", { className: "absolute top-3/4 right-1/3 w-4 h-2 bg-gray-600 rounded" }),
          /* @__PURE__ */ jsx("div", { className: "absolute top-1/2 left-0 right-0 h-1 bg-gray-400 transform -translate-y-1/2" }),
          /* @__PURE__ */ jsx("div", { className: "absolute left-1/2 top-0 bottom-0 w-1 bg-gray-400 transform -translate-x-1/2" }),
          /* @__PURE__ */ jsx("div", { className: "absolute top-1/3 right-1/5 w-1 h-1 bg-yellow-400 rounded-full animate-pulse" }),
          /* @__PURE__ */ jsx("div", { className: "absolute bottom-1/3 left-1/5 w-1 h-1 bg-red-400 rounded-full animate-pulse" })
        ] })
      }
    ) }),
    /* @__PURE__ */ jsx("div", { className: "fixed bottom-4 right-4 z-40", children: /* @__PURE__ */ jsxs(
      motion.div,
      {
        initial: { y: 100, opacity: 0 },
        animate: { y: 0, opacity: 1 },
        className: "flex flex-col space-y-2",
        children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setIsMenuOpen(true),
              className: "bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-all transform hover:scale-105 shadow-lg",
              children: "📱 Menu"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => handleMenuAction("phone"),
              className: "bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-all transform hover:scale-105 shadow-lg",
              children: "📞 Phone"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => handleMenuAction("map"),
              className: "bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-all transform hover:scale-105 shadow-lg",
              children: "🗺️ Map"
            }
          ),
          gamepadConnected && /* @__PURE__ */ jsx("div", { className: "bg-green-600/80 backdrop-blur-sm text-white p-2 rounded-full border border-white/20 text-sm", children: "🎮" })
        ]
      }
    ) }),
    /* @__PURE__ */ jsx("div", { className: "fixed bottom-4 left-4 z-40", children: /* @__PURE__ */ jsx(
      motion.div,
      {
        initial: { y: 100, opacity: 0 },
        animate: { y: 0, opacity: 1 },
        className: "bg-black/90 backdrop-blur-sm rounded-lg p-3 border border-white/20",
        children: /* @__PURE__ */ jsxs("div", { className: "text-white text-sm space-y-1", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("kbd", { className: "bg-gray-700 px-2 py-1 rounded text-xs", children: "WASD" }),
            " Move"
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("kbd", { className: "bg-gray-700 px-2 py-1 rounded text-xs", children: "Mouse" }),
            " Look"
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("kbd", { className: "bg-gray-700 px-2 py-1 rounded text-xs", children: "E" }),
            " Interact"
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("kbd", { className: "bg-gray-700 px-2 py-1 rounded text-xs", children: "TAB" }),
            " Menu"
          ] })
        ] })
      }
    ) }),
    /* @__PURE__ */ jsx("div", { className: "fixed top-1/4 right-4 z-50 space-y-2", children: /* @__PURE__ */ jsx(AnimatePresence, { children: notifications.map((notification, index) => /* @__PURE__ */ jsx(
      motion.div,
      {
        initial: { x: 300, opacity: 0 },
        animate: { x: 0, opacity: 1 },
        exit: { x: 300, opacity: 0 },
        className: "bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg max-w-xs",
        children: notification
      },
      index
    )) }) }),
    /* @__PURE__ */ jsx(
      MainMenu,
      {
        isOpen: isMenuOpen,
        onClose: () => setIsMenuOpen(false),
        onMenuAction: handleMenuAction
      }
    ),
    /* @__PURE__ */ jsx(
      ShopMenu,
      {
        isOpen: isShopOpen,
        onClose: () => setIsShopOpen(false)
      }
    )
  ] });
}

const purchaseItems = [
  // Currency Packs
  {
    id: "coins_1000",
    name: "1,000 Coins",
    description: "Basic coin pack for everyday purchases",
    price: 99,
    currency: "cash",
    category: "currency",
    icon: "🪙",
    rarity: "common"
  },
  {
    id: "coins_5000",
    name: "5,000 Coins",
    description: "Popular coin pack with bonus coins",
    price: 499,
    currency: "cash",
    category: "currency",
    icon: "💰",
    rarity: "rare",
    discount: 10
  },
  {
    id: "gems_100",
    name: "100 Gems",
    description: "Premium currency for exclusive items",
    price: 999,
    currency: "cash",
    category: "currency",
    icon: "💎",
    rarity: "epic"
  },
  // Vehicles
  {
    id: "sports_car",
    name: "Lightning Sports Car",
    description: "High-speed sports car with custom paint job",
    price: 15e3,
    currency: "coins",
    category: "vehicles",
    icon: "🏎️",
    rarity: "epic"
  },
  {
    id: "luxury_suv",
    name: "Executive SUV",
    description: "Luxury SUV perfect for business meetings",
    price: 25e3,
    currency: "coins",
    category: "vehicles",
    icon: "🚙",
    rarity: "legendary"
  },
  {
    id: "motorcycle",
    name: "Street Bike",
    description: "Fast motorcycle for quick city travel",
    price: 8e3,
    currency: "coins",
    category: "vehicles",
    icon: "🏍️",
    rarity: "rare"
  },
  // Properties
  {
    id: "penthouse",
    name: "Downtown Penthouse",
    description: "Luxury penthouse with city views",
    price: 50,
    currency: "gems",
    category: "properties",
    icon: "🏢",
    rarity: "legendary"
  },
  {
    id: "beach_house",
    name: "Beach House",
    description: "Relaxing beachfront property",
    price: 35e3,
    currency: "coins",
    category: "properties",
    icon: "🏖️",
    rarity: "epic"
  },
  // Clothing
  {
    id: "business_suit",
    name: "Executive Suit",
    description: "Professional attire for business meetings",
    price: 2500,
    currency: "coins",
    category: "clothing",
    icon: "👔",
    rarity: "rare"
  },
  {
    id: "street_outfit",
    name: "Street Style Set",
    description: "Trendy casual outfit for everyday wear",
    price: 1500,
    currency: "coins",
    category: "clothing",
    icon: "👕",
    rarity: "common"
  },
  // Premium Features
  {
    id: "vip_membership",
    name: "VIP Membership (30 days)",
    description: "Exclusive benefits and bonuses for 30 days",
    price: 1999,
    currency: "cash",
    category: "premium",
    icon: "👑",
    rarity: "legendary",
    limited: true
  }
];
function InGamePurchases({
  playerWallet,
  onPurchase,
  onClose
}) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedItem, setSelectedItem] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const categories = [
    { id: "all", name: "All Items", icon: "🛍️" },
    { id: "currency", name: "Currency", icon: "💰" },
    { id: "vehicles", name: "Vehicles", icon: "🚗" },
    { id: "properties", name: "Properties", icon: "🏠" },
    { id: "clothing", name: "Clothing", icon: "👔" },
    { id: "premium", name: "Premium", icon: "👑" }
  ];
  const filteredItems = selectedCategory === "all" ? purchaseItems : purchaseItems.filter((item) => item.category === selectedCategory);
  const getRarityColor = (rarity) => {
    switch (rarity) {
      case "common":
        return "border-gray-400 bg-gray-100";
      case "rare":
        return "border-blue-400 bg-blue-100";
      case "epic":
        return "border-purple-400 bg-purple-100";
      case "legendary":
        return "border-yellow-400 bg-yellow-100";
      default:
        return "border-gray-400 bg-gray-100";
    }
  };
  const getCurrencyIcon = (currency) => {
    switch (currency) {
      case "coins":
        return "🪙";
      case "gems":
        return "💎";
      case "cash":
        return "💵";
      default:
        return "💰";
    }
  };
  const canAfford = (item) => {
    return playerWallet[item.currency] >= item.price;
  };
  const handlePurchaseClick = (item) => {
    setSelectedItem(item);
    setShowConfirmation(true);
  };
  const confirmPurchase = () => {
    if (selectedItem) {
      onPurchase(selectedItem);
      setShowConfirmation(false);
      setSelectedItem(null);
    }
  };
  return /* @__PURE__ */ jsx("div", { className: "fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4", children: /* @__PURE__ */ jsxs("div", { className: "bg-gray-900 rounded-lg border border-white/20 max-w-6xl w-full max-h-[90vh] overflow-hidden", children: [
    /* @__PURE__ */ jsxs("div", { className: "bg-gradient-to-r from-purple-600 to-blue-600 p-4 flex justify-between items-center", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-white", children: "🛍️ BettaDayz Store" }),
        /* @__PURE__ */ jsx("p", { className: "text-purple-200", children: "Enhance your Norfolk experience" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex space-x-4 bg-black/30 rounded-lg p-3", children: [
        /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
          /* @__PURE__ */ jsxs("div", { className: "text-yellow-400 font-bold", children: [
            "🪙 ",
            playerWallet.coins.toLocaleString()
          ] }),
          /* @__PURE__ */ jsx("div", { className: "text-xs text-gray-300", children: "Coins" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
          /* @__PURE__ */ jsxs("div", { className: "text-blue-400 font-bold", children: [
            "💎 ",
            playerWallet.gems.toLocaleString()
          ] }),
          /* @__PURE__ */ jsx("div", { className: "text-xs text-gray-300", children: "Gems" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
          /* @__PURE__ */ jsxs("div", { className: "text-green-400 font-bold", children: [
            "💵 $",
            (playerWallet.cash / 100).toFixed(2)
          ] }),
          /* @__PURE__ */ jsx("div", { className: "text-xs text-gray-300", children: "Cash" })
        ] })
      ] }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: onClose,
          className: "text-white hover:text-red-400 text-2xl transition-colors",
          children: "❌"
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex h-[calc(90vh-120px)]", children: [
      /* @__PURE__ */ jsxs("div", { className: "w-48 bg-gray-800 p-4 border-r border-white/10", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-white font-bold mb-4", children: "Categories" }),
        categories.map((category) => /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => setSelectedCategory(category.id),
            className: `w-full text-left p-3 rounded-lg mb-2 transition-colors ${selectedCategory === category.id ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-gray-700"}`,
            children: [
              /* @__PURE__ */ jsx("span", { className: "mr-2", children: category.icon }),
              category.name
            ]
          },
          category.id
        ))
      ] }),
      /* @__PURE__ */ jsx("div", { className: "flex-1 p-4 overflow-y-auto", children: /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", children: filteredItems.map((item) => /* @__PURE__ */ jsxs(
        "div",
        {
          className: `bg-gray-800 rounded-lg border-2 p-4 transition-all hover:scale-105 ${getRarityColor(item.rarity)} ${!canAfford(item) ? "opacity-50" : "cursor-pointer hover:shadow-lg"}`,
          children: [
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-start mb-3", children: [
              /* @__PURE__ */ jsx("div", { className: "text-3xl", children: item.icon }),
              item.limited && /* @__PURE__ */ jsx("div", { className: "bg-red-600 text-white text-xs px-2 py-1 rounded-full", children: "LIMITED" }),
              item.discount && /* @__PURE__ */ jsxs("div", { className: "bg-green-600 text-white text-xs px-2 py-1 rounded-full", children: [
                "-",
                item.discount,
                "%"
              ] })
            ] }),
            /* @__PURE__ */ jsx("h4", { className: "text-white font-bold mb-2", children: item.name }),
            /* @__PURE__ */ jsx("p", { className: "text-gray-300 text-sm mb-3", children: item.description }),
            /* @__PURE__ */ jsx("div", { className: `inline-block px-2 py-1 rounded-full text-xs font-bold mb-3 capitalize ${item.rarity === "common" ? "bg-gray-600 text-white" : item.rarity === "rare" ? "bg-blue-600 text-white" : item.rarity === "epic" ? "bg-purple-600 text-white" : "bg-yellow-600 text-black"}`, children: item.rarity }),
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center", children: [
              /* @__PURE__ */ jsxs("div", { className: "text-lg font-bold", children: [
                /* @__PURE__ */ jsx("span", { className: "mr-1", children: getCurrencyIcon(item.currency) }),
                item.currency === "cash" ? `$${(item.price / 100).toFixed(2)}` : item.price.toLocaleString()
              ] }),
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => handlePurchaseClick(item),
                  disabled: !canAfford(item),
                  className: `px-4 py-2 rounded-lg font-bold transition-colors ${canAfford(item) ? "bg-green-600 hover:bg-green-700 text-white" : "bg-gray-600 text-gray-400 cursor-not-allowed"}`,
                  children: canAfford(item) ? "Buy Now" : "Insufficient Funds"
                }
              )
            ] })
          ]
        },
        item.id
      )) }) })
    ] }),
    showConfirmation && selectedItem && /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-black/80 flex items-center justify-center", children: /* @__PURE__ */ jsxs("div", { className: "bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 border border-white/20", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-white font-bold text-xl mb-4", children: "Confirm Purchase" }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-4 mb-4", children: [
        /* @__PURE__ */ jsx("div", { className: "text-4xl", children: selectedItem.icon }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("div", { className: "text-white font-bold", children: selectedItem.name }),
          /* @__PURE__ */ jsx("div", { className: "text-gray-300 text-sm", children: selectedItem.description })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-gray-700 rounded-lg p-3 mb-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center", children: [
          /* @__PURE__ */ jsx("span", { className: "text-gray-300", children: "Price:" }),
          /* @__PURE__ */ jsxs("span", { className: "text-white font-bold", children: [
            getCurrencyIcon(selectedItem.currency),
            selectedItem.currency === "cash" ? `$${(selectedItem.price / 100).toFixed(2)}` : selectedItem.price.toLocaleString()
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center mt-2", children: [
          /* @__PURE__ */ jsx("span", { className: "text-gray-300", children: "Your Balance:" }),
          /* @__PURE__ */ jsxs("span", { className: "text-white", children: [
            getCurrencyIcon(selectedItem.currency),
            selectedItem.currency === "cash" ? `$${(playerWallet[selectedItem.currency] / 100).toFixed(2)}` : playerWallet[selectedItem.currency].toLocaleString()
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex space-x-3", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: confirmPurchase,
            className: "flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors",
            children: "✅ Confirm Purchase"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setShowConfirmation(false),
            className: "flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition-colors",
            children: "❌ Cancel"
          }
        )
      ] })
    ] }) })
  ] }) });
}
function PurchaseSuccess({
  item,
  onClose
}) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3e3);
    return () => clearTimeout(timer);
  }, [onClose]);
  return /* @__PURE__ */ jsx("div", { className: "fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center", children: /* @__PURE__ */ jsxs("div", { className: "bg-gradient-to-br from-green-600 to-blue-600 rounded-lg p-8 max-w-md w-full mx-4 text-center border border-white/20", children: [
    /* @__PURE__ */ jsx("div", { className: "text-6xl mb-4", children: "🎉" }),
    /* @__PURE__ */ jsx("h2", { className: "text-white font-bold text-2xl mb-2", children: "Purchase Successful!" }),
    /* @__PURE__ */ jsxs("p", { className: "text-green-100 mb-4", children: [
      "You've successfully purchased ",
      /* @__PURE__ */ jsx("strong", { children: item.name })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "text-4xl mb-4", children: item.icon }),
    /* @__PURE__ */ jsx(
      "button",
      {
        onClick: onClose,
        className: "bg-white/20 hover:bg-white/30 text-white font-bold py-2 px-6 rounded-lg transition-colors",
        children: "Continue Playing"
      }
    )
  ] }) });
}

const STANDARD_MAPPING = {
  A: 0,
  B: 1,
  X: 2,
  Y: 3,
  LB: 4,
  RB: 5,
  SELECT: 8,
  START: 9};
function GamepadSupport({
  onControlsUpdate,
  onGamepadConnect,
  onGamepadDisconnect
}) {
  const [gamepads, setGamepads] = useState([]);
  const [showGamepadUI, setShowGamepadUI] = useState(false);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  useEffect(() => {
    const handleGamepadConnected = (e) => {
      console.log("Gamepad connected:", e.gamepad.id);
      const gamepadState = {
        connected: true,
        id: e.gamepad.id,
        buttons: Array.from(e.gamepad.buttons).map((b) => b.pressed),
        axes: Array.from(e.gamepad.axes),
        vibration: "vibrationActuator" in e.gamepad
      };
      setGamepads((prev) => {
        const newGamepads = [...prev];
        newGamepads[e.gamepad.index] = gamepadState;
        return newGamepads;
      });
      onGamepadConnect(gamepadState);
      setShowGamepadUI(true);
      setTimeout(() => setShowGamepadUI(false), 3e3);
    };
    const handleGamepadDisconnected = (e) => {
      console.log("Gamepad disconnected:", e.gamepad.id);
      setGamepads((prev) => {
        const newGamepads = [...prev];
        delete newGamepads[e.gamepad.index];
        return newGamepads;
      });
      onGamepadDisconnect();
    };
    window.addEventListener("gamepadconnected", handleGamepadConnected);
    window.addEventListener("gamepaddisconnected", handleGamepadDisconnected);
    return () => {
      window.removeEventListener("gamepadconnected", handleGamepadConnected);
      window.removeEventListener("gamepaddisconnected", handleGamepadDisconnected);
    };
  }, [onGamepadConnect, onGamepadDisconnect]);
  const pollGamepads = useCallback(() => {
    const gamepadList = navigator.getGamepads();
    for (let i = 0; i < gamepadList.length; i++) {
      const gamepad = gamepadList[i];
      if (!gamepad) continue;
      const gamepadState = {
        connected: gamepad.connected,
        id: gamepad.id,
        buttons: Array.from(gamepad.buttons).map((b) => b.pressed),
        axes: Array.from(gamepad.axes),
        vibration: "vibrationActuator" in gamepad
      };
      setGamepads((prev) => {
        const newGamepads = [...prev];
        newGamepads[i] = gamepadState;
        return newGamepads;
      });
      const controls = {
        movement: {
          x: Math.abs(gamepad.axes[0]) > 0.1 ? gamepad.axes[0] : 0,
          y: Math.abs(gamepad.axes[1]) > 0.1 ? gamepad.axes[1] : 0
        },
        camera: {
          x: Math.abs(gamepad.axes[2]) > 0.1 ? gamepad.axes[2] : 0,
          y: Math.abs(gamepad.axes[3]) > 0.1 ? gamepad.axes[3] : 0
        },
        actions: {
          jump: gamepad.buttons[STANDARD_MAPPING.A]?.pressed || false,
          run: gamepad.buttons[STANDARD_MAPPING.RB]?.pressed || false,
          interact: gamepad.buttons[STANDARD_MAPPING.X]?.pressed || false,
          menu: gamepad.buttons[STANDARD_MAPPING.START]?.pressed || false,
          map: gamepad.buttons[STANDARD_MAPPING.SELECT]?.pressed || false,
          phone: gamepad.buttons[STANDARD_MAPPING.Y]?.pressed || false,
          vehicle: gamepad.buttons[STANDARD_MAPPING.B]?.pressed || false,
          weapon: gamepad.buttons[STANDARD_MAPPING.LB]?.pressed || false
        }
      };
      onControlsUpdate(controls);
      if (vibrationEnabled && gamepad.vibrationActuator) {
        if (controls.actions.jump || controls.actions.weapon) {
          gamepad.vibrationActuator.playEffect("dual-rumble", {
            duration: 100,
            strongMagnitude: 0.3,
            weakMagnitude: 0.1
          });
        }
      }
    }
  }, [onControlsUpdate, vibrationEnabled]);
  useEffect(() => {
    const interval = setInterval(pollGamepads, 16);
    return () => clearInterval(interval);
  }, [pollGamepads]);
  const getControllerType = (id) => {
    if (id.toLowerCase().includes("xbox")) return "Xbox";
    if (id.toLowerCase().includes("playstation") || id.toLowerCase().includes("dualshock") || id.toLowerCase().includes("dualsense")) return "PlayStation";
    return "Generic";
  };
  const getControllerIcon = (id) => {
    const type = getControllerType(id);
    switch (type) {
      case "Xbox":
        return "🎮";
      case "PlayStation":
        return "🕹️";
      default:
        return "🎯";
    }
  };
  const connectedGamepads = gamepads.filter((g) => g && g.connected);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    showGamepadUI && connectedGamepads.length > 0 && /* @__PURE__ */ jsxs("div", { className: "fixed top-4 right-4 z-50 bg-gray-900/90 backdrop-blur-sm rounded-lg p-4 border border-white/20", children: [
      /* @__PURE__ */ jsx("div", { className: "text-green-400 font-bold mb-2", children: "🎮 Controller Connected" }),
      connectedGamepads.map((gamepad, index) => /* @__PURE__ */ jsxs("div", { className: "text-white text-sm", children: [
        /* @__PURE__ */ jsx("span", { className: "mr-2", children: getControllerIcon(gamepad.id) }),
        getControllerType(gamepad.id),
        " Controller",
        gamepad.vibration && /* @__PURE__ */ jsx("span", { className: "ml-2 text-purple-400", children: "📳" })
      ] }, index))
    ] }),
    connectedGamepads.length > 0 && /* @__PURE__ */ jsxs("div", { className: "fixed bottom-4 left-4 z-40", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => setShowGamepadUI(!showGamepadUI),
          className: "bg-gray-900/80 backdrop-blur-sm text-white p-2 rounded-lg border border-white/20 hover:bg-gray-800/80 transition-colors",
          children: "🎮 Controls"
        }
      ),
      showGamepadUI && /* @__PURE__ */ jsxs("div", { className: "absolute bottom-12 left-0 bg-gray-900/95 backdrop-blur-sm rounded-lg p-4 border border-white/20 min-w-80", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-white font-bold mb-3", children: "🎮 Controller Layout" }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4 text-sm", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("div", { className: "text-blue-400 font-semibold mb-2", children: "Movement" }),
            /* @__PURE__ */ jsxs("div", { className: "text-gray-300 space-y-1", children: [
              /* @__PURE__ */ jsx("div", { children: "🕹️ Left Stick: Move" }),
              /* @__PURE__ */ jsx("div", { children: "🕹️ Right Stick: Camera" }),
              /* @__PURE__ */ jsx("div", { children: "🔘 A/X: Jump" }),
              /* @__PURE__ */ jsx("div", { children: "🔘 RB/R1: Run" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("div", { className: "text-green-400 font-semibold mb-2", children: "Actions" }),
            /* @__PURE__ */ jsxs("div", { className: "text-gray-300 space-y-1", children: [
              /* @__PURE__ */ jsx("div", { children: "🔘 X/□: Interact" }),
              /* @__PURE__ */ jsx("div", { children: "🔘 B/○: Vehicle" }),
              /* @__PURE__ */ jsx("div", { children: "🔘 Y/△: Phone" }),
              /* @__PURE__ */ jsx("div", { children: "🔘 LB/L1: Weapon" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("div", { className: "text-purple-400 font-semibold mb-2", children: "Menu" }),
            /* @__PURE__ */ jsxs("div", { className: "text-gray-300 space-y-1", children: [
              /* @__PURE__ */ jsx("div", { children: "⏸️ Start/Options: Menu" }),
              /* @__PURE__ */ jsx("div", { children: "⏹️ Select/Share: Map" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("div", { className: "text-yellow-400 font-semibold mb-2", children: "Settings" }),
            /* @__PURE__ */ jsx("div", { className: "text-gray-300 space-y-1", children: /* @__PURE__ */ jsxs("label", { className: "flex items-center space-x-2", children: [
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "checkbox",
                  checked: vibrationEnabled,
                  onChange: (e) => setVibrationEnabled(e.target.checked),
                  className: "rounded"
                }
              ),
              /* @__PURE__ */ jsx("span", { children: "Vibration" })
            ] }) })
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "mt-4 pt-3 border-t border-white/10", children: /* @__PURE__ */ jsx("div", { className: "text-xs text-gray-400", children: "Supports Xbox and PlayStation controllers" }) })
      ] })
    ] }),
    connectedGamepads.length === 0 && /* @__PURE__ */ jsx("div", { className: "fixed bottom-4 left-4 z-40", children: /* @__PURE__ */ jsx("div", { className: "bg-gray-900/80 backdrop-blur-sm text-gray-400 p-2 rounded-lg border border-white/10 text-sm", children: "🎮 Connect a controller for enhanced gameplay" }) })
  ] });
}
function useGamepadControls() {
  const [controls, setControls] = useState({
    movement: { x: 0, y: 0 },
    camera: { x: 0, y: 0 },
    actions: {
      jump: false,
      run: false,
      interact: false,
      menu: false,
      map: false,
      phone: false,
      vehicle: false,
      weapon: false
    }
  });
  const [gamepadConnected, setGamepadConnected] = useState(false);
  const handleControlsUpdate = useCallback((newControls) => {
    setControls(newControls);
  }, []);
  const handleGamepadConnect = useCallback((gamepad) => {
    setGamepadConnected(true);
    console.log("Gamepad connected in hook:", gamepad.id);
  }, []);
  const handleGamepadDisconnect = useCallback(() => {
    setGamepadConnected(false);
    setControls({
      movement: { x: 0, y: 0 },
      camera: { x: 0, y: 0 },
      actions: {
        jump: false,
        run: false,
        interact: false,
        menu: false,
        map: false,
        phone: false,
        vehicle: false,
        weapon: false
      }
    });
  }, []);
  return {
    controls,
    gamepadConnected,
    handleControlsUpdate,
    handleGamepadConnect,
    handleGamepadDisconnect
  };
}

const StatsTab = ({ player = {} }) => {
  const {
    level = 1,
    experience = 0,
    money = 1e3,
    reputation = 0,
    health = 100,
    energy = 100
  } = player;
  return /* @__PURE__ */ jsxs("div", { className: "p-6 bg-gray-900 text-white rounded-lg", children: [
    /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold mb-6", children: "Player Statistics" }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "bg-gray-800 p-4 rounded-lg", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold mb-3", children: "Character Stats" }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
            /* @__PURE__ */ jsx("span", { children: "Level:" }),
            /* @__PURE__ */ jsx("span", { className: "text-blue-400", children: level })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
            /* @__PURE__ */ jsx("span", { children: "Experience:" }),
            /* @__PURE__ */ jsx("span", { className: "text-green-400", children: experience.toLocaleString() })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
            /* @__PURE__ */ jsx("span", { children: "Health:" }),
            /* @__PURE__ */ jsxs("span", { className: "text-red-400", children: [
              health,
              "%"
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
            /* @__PURE__ */ jsx("span", { children: "Energy:" }),
            /* @__PURE__ */ jsxs("span", { className: "text-yellow-400", children: [
              energy,
              "%"
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-gray-800 p-4 rounded-lg", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold mb-3", children: "Financial Stats" }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
            /* @__PURE__ */ jsx("span", { children: "Money:" }),
            /* @__PURE__ */ jsxs("span", { className: "text-green-400", children: [
              "$",
              money.toLocaleString()
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
            /* @__PURE__ */ jsx("span", { children: "Reputation:" }),
            /* @__PURE__ */ jsx("span", { className: "text-purple-400", children: reputation })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mt-6 bg-gray-800 p-4 rounded-lg", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold mb-3", children: "Progress Bars" }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between mb-1", children: [
            /* @__PURE__ */ jsx("span", { children: "Health" }),
            /* @__PURE__ */ jsxs("span", { children: [
              health,
              "%"
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "w-full bg-gray-700 rounded-full h-2", children: /* @__PURE__ */ jsx(
            "div",
            {
              className: "bg-red-500 h-2 rounded-full transition-all duration-300",
              style: { width: `${health}%` }
            }
          ) })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between mb-1", children: [
            /* @__PURE__ */ jsx("span", { children: "Energy" }),
            /* @__PURE__ */ jsxs("span", { children: [
              energy,
              "%"
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "w-full bg-gray-700 rounded-full h-2", children: /* @__PURE__ */ jsx(
            "div",
            {
              className: "bg-yellow-500 h-2 rounded-full transition-all duration-300",
              style: { width: `${energy}%` }
            }
          ) })
        ] })
      ] })
    ] })
  ] });
};

const careers = [
  { title: "Teacher", salary: 3e4, smartsRequired: 60, icon: "📚" },
  { title: "Doctor", salary: 8e4, smartsRequired: 85, icon: "⚕️" },
  { title: "Artist", salary: 2e4, smartsRequired: 40, icon: "🎨" },
  { title: "Engineer", salary: 75e3, smartsRequired: 80, icon: "⚙️" },
  { title: "Lawyer", salary: 9e4, smartsRequired: 90, icon: "⚖️" },
  { title: "Chef", salary: 35e3, smartsRequired: 50, icon: "👨‍🍳" },
  { title: "Programmer", salary: 85e3, smartsRequired: 75, icon: "💻" },
  { title: "Musician", salary: 25e3, smartsRequired: 30, icon: "🎵" }
];
function CareerTab({ character, updateCharacter }) {
  const [message, setMessage] = useState("");
  const applyCareer = (career) => {
    if (character.stats.smarts >= career.smartsRequired) {
      updateCharacter({ ...character, career });
      setMessage(`🎉 Congratulations! You are now a ${career.title}!`);
      setTimeout(() => setMessage(""), 3e3);
    } else {
      setMessage(`❌ You need ${career.smartsRequired} smarts to become a ${career.title}. You currently have ${character.stats.smarts}.`);
      setTimeout(() => setMessage(""), 3e3);
    }
  };
  const quitJob = () => {
    updateCharacter({ ...character, career: void 0 });
    setMessage("You have quit your job. Time to find a new career!");
    setTimeout(() => setMessage(""), 3e3);
  };
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-yellow-400 mb-4", children: "Career" }),
    character.career ? /* @__PURE__ */ jsx("div", { className: "bg-green-900/30 border border-green-500 rounded-lg p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h3", { className: "text-xl font-semibold text-green-400", children: "Current Job" }),
        /* @__PURE__ */ jsxs("p", { className: "text-lg", children: [
          character.career.title,
          " ",
          careers.find((c) => c.title === character.career?.title)?.icon
        ] }),
        /* @__PURE__ */ jsxs("p", { className: "text-green-300", children: [
          "Salary: $",
          character.career.salary.toLocaleString(),
          "/year"
        ] })
      ] }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: quitJob,
          className: "bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors duration-200",
          children: "Quit Job"
        }
      )
    ] }) }) : /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "bg-blue-900/30 border border-blue-500 rounded-lg p-4", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-xl font-semibold text-blue-400 mb-2", children: "Available Careers" }),
        /* @__PURE__ */ jsxs("p", { className: "text-gray-300 mb-4", children: [
          "Your current smarts: ",
          character.stats.smarts
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: careers.map((career) => /* @__PURE__ */ jsxs(
        "div",
        {
          className: `border rounded-lg p-4 transition-all duration-200 ${character.stats.smarts >= career.smartsRequired ? "border-green-500 bg-green-900/20 hover:bg-green-900/30" : "border-red-500 bg-red-900/20"}`,
          children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-2", children: [
              /* @__PURE__ */ jsxs("h4", { className: "text-lg font-semibold flex items-center gap-2", children: [
                /* @__PURE__ */ jsx("span", { className: "text-2xl", children: career.icon }),
                career.title
              ] }),
              /* @__PURE__ */ jsxs("span", { className: "text-sm text-gray-400", children: [
                career.smartsRequired,
                " smarts"
              ] })
            ] }),
            /* @__PURE__ */ jsxs("p", { className: "text-yellow-400 mb-3", children: [
              "$",
              career.salary.toLocaleString(),
              "/year"
            ] }),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => applyCareer(career),
                disabled: character.stats.smarts < career.smartsRequired,
                className: `w-full py-2 px-4 rounded-md font-medium transition-colors duration-200 ${character.stats.smarts >= career.smartsRequired ? "bg-green-600 hover:bg-green-700 text-white" : "bg-gray-600 text-gray-400 cursor-not-allowed"}`,
                children: character.stats.smarts >= career.smartsRequired ? "Apply" : "Not Qualified"
              }
            )
          ]
        },
        career.title
      )) })
    ] }),
    message && /* @__PURE__ */ jsx("div", { className: `p-4 rounded-lg border ${message.includes("❌") ? "bg-red-900/30 border-red-500 text-red-300" : "bg-green-900/30 border-green-500 text-green-300"}`, children: /* @__PURE__ */ jsx("p", { className: "font-medium", children: message }) })
  ] });
}

const relationshipIcons = {
  friend: "👥",
  partner: "💕",
  sibling: "👫",
  family: "👨‍👩‍👧‍👦"
};
function RelationshipsTab({ character, updateCharacter }) {
  const [newName, setNewName] = useState("");
  const [newType, setNewType] = useState("friend");
  const [sortBy, setSortBy] = useState("name");
  const [message, setMessage] = useState("");
  const addRelationship = () => {
    if (!newName.trim()) {
      setMessage("❌ Please enter a name");
      setTimeout(() => setMessage(""), 2e3);
      return;
    }
    const existingRelationship = character.relationships.find(
      (rel) => rel.name.toLowerCase() === newName.toLowerCase()
    );
    if (existingRelationship) {
      setMessage("❌ This person is already in your relationships");
      setTimeout(() => setMessage(""), 2e3);
      return;
    }
    const newRelationship = {
      name: newName.trim(),
      type: newType,
      happiness: 50,
      dateAdded: (/* @__PURE__ */ new Date()).toLocaleDateString()
    };
    const updated = {
      ...character,
      relationships: [...character.relationships, newRelationship]
    };
    updateCharacter(updated);
    setNewName("");
    setMessage(`✅ Added ${newName} as a ${newType}!`);
    setTimeout(() => setMessage(""), 2e3);
  };
  const interact = (index, action) => {
    const updated = { ...character };
    const rel = updated.relationships[index];
    switch (action) {
      case "gift":
        rel.happiness = Math.min(100, rel.happiness + 15);
        setMessage(`🎁 You gave ${rel.name} a gift! (+15 happiness)`);
        break;
      case "argue":
        rel.happiness = Math.max(0, rel.happiness - 20);
        setMessage(`😠 You argued with ${rel.name}! (-20 happiness)`);
        break;
      case "hangout":
        rel.happiness = Math.min(100, rel.happiness + 10);
        setMessage(`🎉 You spent quality time with ${rel.name}! (+10 happiness)`);
        break;
      case "breakup":
        if (rel.type === "partner") {
          rel.type = "friend";
          rel.happiness = Math.max(0, rel.happiness - 30);
          setMessage(`💔 You broke up with ${rel.name}. They're now just a friend.`);
        }
        break;
      case "makeup":
        if (rel.type === "friend" && rel.happiness > 70) {
          rel.type = "partner";
          rel.happiness = Math.min(100, rel.happiness + 20);
          setMessage(`💕 You and ${rel.name} are now partners!`);
        } else {
          setMessage(`❌ ${rel.name} needs to be happier to become your partner.`);
        }
        break;
    }
    updateCharacter(updated);
    setTimeout(() => setMessage(""), 3e3);
  };
  const removeRelationship = (index) => {
    const updated = { ...character };
    const removedName = updated.relationships[index].name;
    updated.relationships.splice(index, 1);
    updateCharacter(updated);
    setMessage(`👋 Removed ${removedName} from your relationships`);
    setTimeout(() => setMessage(""), 2e3);
  };
  const sortedRelationships = [...character.relationships].sort((a, b) => {
    switch (sortBy) {
      case "happiness":
        return b.happiness - a.happiness;
      case "type":
        return a.type.localeCompare(b.type);
      case "name":
      default:
        return a.name.localeCompare(b.name);
    }
  });
  const getHappinessColor = (happiness) => {
    if (happiness >= 80) return "text-green-400";
    if (happiness >= 60) return "text-yellow-400";
    if (happiness >= 40) return "text-orange-400";
    return "text-red-400";
  };
  const getHappinessLabel = (happiness) => {
    if (happiness >= 90) return "Ecstatic";
    if (happiness >= 80) return "Very Happy";
    if (happiness >= 70) return "Happy";
    if (happiness >= 60) return "Content";
    if (happiness >= 50) return "Neutral";
    if (happiness >= 40) return "Unhappy";
    if (happiness >= 30) return "Sad";
    if (happiness >= 20) return "Very Sad";
    return "Miserable";
  };
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-yellow-400 mb-4", children: "Relationships" }),
    /* @__PURE__ */ jsxs("div", { className: "bg-blue-900/30 border border-blue-500 rounded-lg p-4", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-blue-400 mb-3", children: "Add New Relationship" }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row gap-3", children: [
        /* @__PURE__ */ jsx(
          "input",
          {
            value: newName,
            onChange: (e) => setNewName(e.target.value),
            placeholder: "Enter person's name",
            className: "flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-blue-500",
            onKeyPress: (e) => e.key === "Enter" && addRelationship()
          }
        ),
        /* @__PURE__ */ jsxs(
          "select",
          {
            value: newType,
            onChange: (e) => setNewType(e.target.value),
            className: "px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:border-blue-500",
            children: [
              /* @__PURE__ */ jsx("option", { value: "friend", children: "Friend 👥" }),
              /* @__PURE__ */ jsx("option", { value: "partner", children: "Partner 💕" }),
              /* @__PURE__ */ jsx("option", { value: "sibling", children: "Sibling 👫" }),
              /* @__PURE__ */ jsx("option", { value: "family", children: "Family 👨‍👩‍👧‍👦" })
            ]
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: addRelationship,
            className: "px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200",
            children: "Add"
          }
        )
      ] })
    ] }),
    character.relationships.length > 0 && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
      /* @__PURE__ */ jsx("span", { className: "text-gray-300", children: "Sort by:" }),
      /* @__PURE__ */ jsxs(
        "select",
        {
          value: sortBy,
          onChange: (e) => setSortBy(e.target.value),
          className: "px-3 py-1 bg-gray-700 border border-gray-600 rounded-md text-white text-sm focus:outline-none focus:border-yellow-500",
          children: [
            /* @__PURE__ */ jsx("option", { value: "name", children: "Name" }),
            /* @__PURE__ */ jsx("option", { value: "happiness", children: "Happiness" }),
            /* @__PURE__ */ jsx("option", { value: "type", children: "Type" })
          ]
        }
      )
    ] }),
    sortedRelationships.length > 0 ? /* @__PURE__ */ jsx("div", { className: "space-y-3", children: sortedRelationships.map((rel, i) => {
      const originalIndex = character.relationships.findIndex((r) => r === rel);
      return /* @__PURE__ */ jsxs("div", { className: "bg-gray-800 border border-gray-600 rounded-lg p-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsx("span", { className: "text-2xl", children: relationshipIcons[rel.type] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h4", { className: "text-lg font-semibold text-white", children: rel.name }),
              /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-400 capitalize", children: rel.type })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "text-right", children: [
            /* @__PURE__ */ jsxs("div", { className: `text-lg font-bold ${getHappinessColor(rel.happiness)}`, children: [
              rel.happiness,
              "/100"
            ] }),
            /* @__PURE__ */ jsx("div", { className: `text-sm ${getHappinessColor(rel.happiness)}`, children: getHappinessLabel(rel.happiness) })
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "w-full bg-gray-700 rounded-full h-2 mb-4", children: /* @__PURE__ */ jsx(
          "div",
          {
            className: `h-2 rounded-full transition-all duration-300 ${rel.happiness >= 80 ? "bg-green-500" : rel.happiness >= 60 ? "bg-yellow-500" : rel.happiness >= 40 ? "bg-orange-500" : "bg-red-500"}`,
            style: { width: `${rel.happiness}%` }
          }
        ) }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-2", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => interact(originalIndex, "gift"),
              className: "px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded-md transition-colors duration-200",
              children: "🎁 Gift"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => interact(originalIndex, "hangout"),
              className: "px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md transition-colors duration-200",
              children: "🎉 Hang Out"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => interact(originalIndex, "argue"),
              className: "px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded-md transition-colors duration-200",
              children: "😠 Argue"
            }
          ),
          rel.type === "partner" && /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => interact(originalIndex, "breakup"),
              className: "px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-md transition-colors duration-200",
              children: "💔 Break Up"
            }
          ),
          rel.type === "friend" && rel.happiness > 70 && /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => interact(originalIndex, "makeup"),
              className: "px-3 py-1 bg-pink-600 hover:bg-pink-700 text-white text-sm rounded-md transition-colors duration-200",
              children: "💕 Become Partners"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => removeRelationship(originalIndex),
              className: "px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white text-sm rounded-md transition-colors duration-200",
              children: "🗑️ Remove"
            }
          )
        ] })
      ] }, `${rel.name}-${i}`);
    }) }) : /* @__PURE__ */ jsxs("div", { className: "text-center py-8 text-gray-400", children: [
      /* @__PURE__ */ jsx("p", { className: "text-lg", children: "No relationships yet." }),
      /* @__PURE__ */ jsx("p", { className: "text-sm", children: "Add someone above to get started!" })
    ] }),
    message && /* @__PURE__ */ jsx("div", { className: `p-3 rounded-lg border ${message.includes("❌") ? "bg-red-900/30 border-red-500 text-red-300" : message.includes("💔") ? "bg-purple-900/30 border-purple-500 text-purple-300" : "bg-green-900/30 border-green-500 text-green-300"}`, children: /* @__PURE__ */ jsx("p", { className: "font-medium", children: message }) }),
    character.relationships.length > 0 && /* @__PURE__ */ jsxs("div", { className: "bg-gray-800 border border-gray-600 rounded-lg p-4", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-yellow-400 mb-3", children: "Relationship Summary" }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4 text-center", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold text-blue-400", children: character.relationships.length }),
          /* @__PURE__ */ jsx("div", { className: "text-sm text-gray-400", children: "Total" })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold text-green-400", children: character.relationships.filter((r) => r.happiness >= 70).length }),
          /* @__PURE__ */ jsx("div", { className: "text-sm text-gray-400", children: "Happy" })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold text-pink-400", children: character.relationships.filter((r) => r.type === "partner").length }),
          /* @__PURE__ */ jsx("div", { className: "text-sm text-gray-400", children: "Partners" })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold text-yellow-400", children: Math.round(character.relationships.reduce((sum, r) => sum + r.happiness, 0) / character.relationships.length) || 0 }),
          /* @__PURE__ */ jsx("div", { className: "text-sm text-gray-400", children: "Avg Happiness" })
        ] })
      ] })
    ] })
  ] });
}

function AchievementsTab({ character }) {
  const calculateAchievements = () => {
    const achievements2 = [
      // Life Achievements
      {
        id: "age_18",
        title: "Coming of Age",
        description: "Reach 18 years old",
        icon: "🎂",
        unlocked: character.age >= 18,
        dateUnlocked: character.age >= 18 ? (/* @__PURE__ */ new Date()).toLocaleDateString() : void 0,
        progress: Math.min(character.age, 18),
        maxProgress: 18,
        category: "life"
      },
      {
        id: "age_30",
        title: "Thirty and Thriving",
        description: "Reach 30 years old",
        icon: "🎉",
        unlocked: character.age >= 30,
        dateUnlocked: character.age >= 30 ? (/* @__PURE__ */ new Date()).toLocaleDateString() : void 0,
        progress: Math.min(character.age, 30),
        maxProgress: 30,
        category: "life"
      },
      {
        id: "age_50",
        title: "Half Century",
        description: "Reach 50 years old",
        icon: "🏆",
        unlocked: character.age >= 50,
        dateUnlocked: character.age >= 50 ? (/* @__PURE__ */ new Date()).toLocaleDateString() : void 0,
        progress: Math.min(character.age, 50),
        maxProgress: 50,
        category: "life"
      },
      {
        id: "perfect_health",
        title: "Peak Performance",
        description: "Maintain 100% health",
        icon: "💪",
        unlocked: character.stats.health >= 100,
        dateUnlocked: character.stats.health >= 100 ? (/* @__PURE__ */ new Date()).toLocaleDateString() : void 0,
        progress: character.stats.health,
        maxProgress: 100,
        category: "life"
      },
      // Wealth Achievements
      {
        id: "first_thousand",
        title: "First Grand",
        description: "Earn your first $1,000",
        icon: "💵",
        unlocked: character.stats.money >= 1e3,
        dateUnlocked: character.stats.money >= 1e3 ? (/* @__PURE__ */ new Date()).toLocaleDateString() : void 0,
        progress: Math.min(character.stats.money, 1e3),
        maxProgress: 1e3,
        category: "wealth"
      },
      {
        id: "ten_thousand",
        title: "Five Figures",
        description: "Accumulate $10,000",
        icon: "💰",
        unlocked: character.stats.money >= 1e4,
        dateUnlocked: character.stats.money >= 1e4 ? (/* @__PURE__ */ new Date()).toLocaleDateString() : void 0,
        progress: Math.min(character.stats.money, 1e4),
        maxProgress: 1e4,
        category: "wealth"
      },
      {
        id: "hundred_thousand",
        title: "Six-Figure Club",
        description: "Reach $100,000 in wealth",
        icon: "🏦",
        unlocked: character.stats.money >= 1e5,
        dateUnlocked: character.stats.money >= 1e5 ? (/* @__PURE__ */ new Date()).toLocaleDateString() : void 0,
        progress: Math.min(character.stats.money, 1e5),
        maxProgress: 1e5,
        category: "wealth"
      },
      {
        id: "millionaire",
        title: "Millionaire Status",
        description: "Become a millionaire",
        icon: "💎",
        unlocked: character.stats.money >= 1e6,
        dateUnlocked: character.stats.money >= 1e6 ? (/* @__PURE__ */ new Date()).toLocaleDateString() : void 0,
        progress: Math.min(character.stats.money, 1e6),
        maxProgress: 1e6,
        category: "wealth"
      },
      // Career Achievements
      {
        id: "first_job",
        title: "Career Starter",
        description: "Get your first job",
        icon: "👔",
        unlocked: !!character.career,
        dateUnlocked: character.career ? (/* @__PURE__ */ new Date()).toLocaleDateString() : void 0,
        category: "career"
      },
      {
        id: "doctor",
        title: "Medical Marvel",
        description: "Become a doctor",
        icon: "⚕️",
        unlocked: character.career?.title === "Doctor",
        dateUnlocked: character.career?.title === "Doctor" ? (/* @__PURE__ */ new Date()).toLocaleDateString() : void 0,
        category: "career"
      },
      {
        id: "high_salary",
        title: "Big Earner",
        description: "Get a job paying $75,000+",
        icon: "💼",
        unlocked: (character.career?.salary || 0) >= 75e3,
        dateUnlocked: (character.career?.salary || 0) >= 75e3 ? (/* @__PURE__ */ new Date()).toLocaleDateString() : void 0,
        progress: Math.min(character.career?.salary || 0, 75e3),
        maxProgress: 75e3,
        category: "career"
      },
      // Social Achievements
      {
        id: "first_friend",
        title: "Social Starter",
        description: "Make your first friend",
        icon: "👋",
        unlocked: character.relationships.length >= 1,
        dateUnlocked: character.relationships.length >= 1 ? (/* @__PURE__ */ new Date()).toLocaleDateString() : void 0,
        progress: Math.min(character.relationships.length, 1),
        maxProgress: 1,
        category: "social"
      },
      {
        id: "social_butterfly",
        title: "Social Butterfly",
        description: "Have 5 or more relationships",
        icon: "🦋",
        unlocked: character.relationships.length >= 5,
        dateUnlocked: character.relationships.length >= 5 ? (/* @__PURE__ */ new Date()).toLocaleDateString() : void 0,
        progress: Math.min(character.relationships.length, 5),
        maxProgress: 5,
        category: "social"
      },
      {
        id: "loved_one",
        title: "True Love",
        description: "Find a partner",
        icon: "💕",
        unlocked: character.relationships.some((r) => r.type === "partner"),
        dateUnlocked: character.relationships.some((r) => r.type === "partner") ? (/* @__PURE__ */ new Date()).toLocaleDateString() : void 0,
        category: "social"
      },
      {
        id: "popular",
        title: "Mr./Ms. Popular",
        description: "Have 10 relationships with 80+ happiness",
        icon: "⭐",
        unlocked: character.relationships.filter((r) => r.happiness >= 80).length >= 10,
        dateUnlocked: character.relationships.filter((r) => r.happiness >= 80).length >= 10 ? (/* @__PURE__ */ new Date()).toLocaleDateString() : void 0,
        progress: Math.min(character.relationships.filter((r) => r.happiness >= 80).length, 10),
        maxProgress: 10,
        category: "social"
      },
      // Special Achievements
      {
        id: "genius",
        title: "Genius Level",
        description: "Reach 95+ smarts",
        icon: "🧠",
        unlocked: character.stats.smarts >= 95,
        dateUnlocked: character.stats.smarts >= 95 ? (/* @__PURE__ */ new Date()).toLocaleDateString() : void 0,
        progress: Math.min(character.stats.smarts, 95),
        maxProgress: 95,
        category: "special"
      },
      {
        id: "perfect_happiness",
        title: "Pure Bliss",
        description: "Achieve 100% happiness",
        icon: "😊",
        unlocked: character.stats.happiness >= 100,
        dateUnlocked: character.stats.happiness >= 100 ? (/* @__PURE__ */ new Date()).toLocaleDateString() : void 0,
        progress: character.stats.happiness,
        maxProgress: 100,
        category: "special"
      },
      {
        id: "well_rounded",
        title: "Well Rounded",
        description: "Have all stats above 75",
        icon: "🌟",
        unlocked: Object.values(character.stats).every((stat) => stat >= 75),
        dateUnlocked: Object.values(character.stats).every((stat) => stat >= 75) ? (/* @__PURE__ */ new Date()).toLocaleDateString() : void 0,
        category: "special"
      }
    ];
    return achievements2;
  };
  const achievements = calculateAchievements();
  const unlockedAchievements = achievements.filter((a) => a.unlocked);
  const lockedAchievements = achievements.filter((a) => !a.unlocked);
  const getCategoryColor = (category) => {
    switch (category) {
      case "life":
        return "border-green-500 bg-green-900/20";
      case "career":
        return "border-blue-500 bg-blue-900/20";
      case "wealth":
        return "border-yellow-500 bg-yellow-900/20";
      case "social":
        return "border-pink-500 bg-pink-900/20";
      case "special":
        return "border-purple-500 bg-purple-900/20";
      default:
        return "border-gray-500 bg-gray-900/20";
    }
  };
  const getCategoryIcon = (category) => {
    switch (category) {
      case "life":
        return "🌱";
      case "career":
        return "💼";
      case "wealth":
        return "💰";
      case "social":
        return "👥";
      case "special":
        return "✨";
      default:
        return "🏆";
    }
  };
  const categories = ["life", "career", "wealth", "social", "special"];
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-yellow-400", children: "Achievements" }),
      /* @__PURE__ */ jsxs("div", { className: "text-right", children: [
        /* @__PURE__ */ jsxs("div", { className: "text-lg font-semibold text-green-400", children: [
          unlockedAchievements.length,
          " / ",
          achievements.length
        ] }),
        /* @__PURE__ */ jsx("div", { className: "text-sm text-gray-400", children: "Unlocked" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "bg-gray-800 border border-gray-600 rounded-lg p-4", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-yellow-400 mb-3", children: "Progress Overview" }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 md:grid-cols-5 gap-4", children: categories.map((category) => {
        const categoryAchievements = achievements.filter((a) => a.category === category);
        const unlockedInCategory = categoryAchievements.filter((a) => a.unlocked).length;
        const percentage = Math.round(unlockedInCategory / categoryAchievements.length * 100);
        return /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
          /* @__PURE__ */ jsx("div", { className: "text-2xl mb-1", children: getCategoryIcon(category) }),
          /* @__PURE__ */ jsx("div", { className: "text-sm font-medium text-white capitalize", children: category }),
          /* @__PURE__ */ jsxs("div", { className: "text-lg font-bold text-yellow-400", children: [
            unlockedInCategory,
            "/",
            categoryAchievements.length
          ] }),
          /* @__PURE__ */ jsx("div", { className: "w-full bg-gray-700 rounded-full h-2 mt-1", children: /* @__PURE__ */ jsx(
            "div",
            {
              className: "bg-yellow-500 h-2 rounded-full transition-all duration-300",
              style: { width: `${percentage}%` }
            }
          ) })
        ] }, category);
      }) })
    ] }),
    unlockedAchievements.length > 0 && /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h3", { className: "text-xl font-semibold text-green-400 mb-4", children: "🏆 Unlocked Achievements" }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: unlockedAchievements.map((achievement) => /* @__PURE__ */ jsxs(
        "div",
        {
          className: `border rounded-lg p-4 ${getCategoryColor(achievement.category)} border-opacity-50`,
          children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between mb-2", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsx("span", { className: "text-3xl", children: achievement.icon }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("h4", { className: "text-lg font-semibold text-white", children: achievement.title }),
                  /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-300", children: achievement.description })
                ] })
              ] }),
              /* @__PURE__ */ jsx("span", { className: "text-xs text-green-400 font-medium", children: "✓ UNLOCKED" })
            ] }),
            achievement.dateUnlocked && /* @__PURE__ */ jsxs("div", { className: "text-xs text-gray-400 mt-2", children: [
              "Unlocked: ",
              achievement.dateUnlocked
            ] })
          ]
        },
        achievement.id
      )) })
    ] }),
    lockedAchievements.length > 0 && /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h3", { className: "text-xl font-semibold text-gray-400 mb-4", children: "🔒 Locked Achievements" }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: lockedAchievements.map((achievement) => /* @__PURE__ */ jsxs(
        "div",
        {
          className: "border border-gray-600 bg-gray-800/50 rounded-lg p-4 opacity-75",
          children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between mb-2", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsx("span", { className: "text-3xl grayscale", children: achievement.icon }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("h4", { className: "text-lg font-semibold text-gray-300", children: achievement.title }),
                  /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-400", children: achievement.description })
                ] })
              ] }),
              /* @__PURE__ */ jsx("span", { className: "text-xs text-gray-500 font-medium", children: "🔒 LOCKED" })
            ] }),
            achievement.progress !== void 0 && achievement.maxProgress !== void 0 && /* @__PURE__ */ jsxs("div", { className: "mt-3", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-xs text-gray-400 mb-1", children: [
                /* @__PURE__ */ jsx("span", { children: "Progress" }),
                /* @__PURE__ */ jsxs("span", { children: [
                  achievement.progress,
                  " / ",
                  achievement.maxProgress
                ] })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "w-full bg-gray-700 rounded-full h-2", children: /* @__PURE__ */ jsx(
                "div",
                {
                  className: "bg-gray-500 h-2 rounded-full transition-all duration-300",
                  style: { width: `${achievement.progress / achievement.maxProgress * 100}%` }
                }
              ) })
            ] })
          ]
        },
        achievement.id
      )) })
    ] }),
    achievements.length === 0 && /* @__PURE__ */ jsxs("div", { className: "text-center py-8 text-gray-400", children: [
      /* @__PURE__ */ jsx("p", { className: "text-lg", children: "No achievements available yet." }),
      /* @__PURE__ */ jsx("p", { className: "text-sm", children: "Keep playing to unlock achievements!" })
    ] })
  ] });
}

const tabs = ["Stats", "Career", "Relationships", "Achievements"];
function Dashboard({ character, updateCharacter }) {
  const [activeTab, setActiveTab] = useState("Stats");
  const renderTab = () => {
    switch (activeTab) {
      case "Stats":
        return /* @__PURE__ */ jsx(StatsTab, { character });
      case "Career":
        return /* @__PURE__ */ jsx(CareerTab, { character, updateCharacter });
      case "Relationships":
        return /* @__PURE__ */ jsx(RelationshipsTab, { character, updateCharacter });
      case "Achievements":
        return /* @__PURE__ */ jsx(AchievementsTab, { character });
      default:
        return null;
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "bg-gray-900 text-white p-6 rounded-lg shadow-2xl max-w-4xl mx-auto", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold mb-6 text-center text-yellow-400", children: "Character Dashboard" }),
    /* @__PURE__ */ jsx("nav", { className: "mb-6", children: /* @__PURE__ */ jsx("div", { className: "flex space-x-2 bg-gray-800 p-2 rounded-lg", children: tabs.map((tab) => /* @__PURE__ */ jsx(
      "button",
      {
        onClick: () => setActiveTab(tab),
        className: `px-4 py-2 rounded-md font-medium transition-all duration-200 ${activeTab === tab ? "bg-yellow-500 text-black shadow-lg" : "bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white"}`,
        children: tab
      },
      tab
    )) }) }),
    /* @__PURE__ */ jsx("div", { className: "bg-gray-800 p-6 rounded-lg min-h-96", children: renderTab() })
  ] });
}

const meta = () => {
  return [
    { title: "BettaDayz - 3D Life Simulation Game" },
    { name: "description", content: "Experience immersive 3D life simulation like never before with BettaDayz PBBG" },
    { property: "og:title", content: "BettaDayz - 3D Life Simulation Game" },
    { property: "og:description", content: "Experience immersive 3D life simulation like never before with BettaDayz PBBG" },
    { property: "og:image", content: "/og-image.jpg" },
    { property: "og:url", content: "https://bettadayz.shop" },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: "BettaDayz - 3D Life Simulation Game" },
    { name: "twitter:description", content: "Experience immersive 3D life simulation like never before with BettaDayz PBBG" },
    { name: "twitter:image", content: "/og-image.jpg" }
  ];
};
function Index() {
  const [gameMode, setGameMode] = useState("3d");
  const [isLoading, setIsLoading] = useState(true);
  const [showPurchases, setShowPurchases] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [showBusiness, setShowBusiness] = useState(false);
  const [showProperties, setShowProperties] = useState(false);
  const [showGarage, setShowGarage] = useState(false);
  const [showSocial, setShowSocial] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState(null);
  const [playerStats, setPlayerStats] = useState({
    level: 15,
    respect: 75,
    health: 100,
    armor: 80,
    wanted: 2,
    money: 125e3,
    experience: 8500,
    maxExperience: 1e4
  });
  const [playerWallet, setPlayerWallet] = useState({
    coins: 25e3,
    gems: 150,
    cash: 1999
    // in cents
  });
  const [character, setCharacter] = useState({
    name: "Player",
    age: 25,
    stats: {
      health: playerStats.health,
      happiness: 75,
      smarts: 65,
      looks: 70,
      money: playerStats.money
    },
    career: {
      title: "Software Developer",
      salary: 75e3,
      requirements: { smarts: 60 }
    },
    relationships: [
      { id: "1", name: "Alex", type: "friend", happiness: 85 },
      { id: "2", name: "Sarah", type: "partner", happiness: 92 },
      { id: "3", name: "Mike", type: "friend", happiness: 70 }
    ]
  });
  const {
    controls,
    gamepadConnected,
    handleControlsUpdate,
    handleGamepadConnect,
    handleGamepadDisconnect
  } = useGamepadControls();
  const handlePurchase = (item) => {
    if (playerWallet[item.currency] >= item.price) {
      setPlayerWallet((prev) => ({
        ...prev,
        [item.currency]: prev[item.currency] - item.price
      }));
      console.log("Purchased:", item.name);
      setPurchaseSuccess(item);
      setShowPurchases(false);
      if (item.category === "currency") {
        if (item.id.includes("coins")) {
          const coinsToAdd = parseInt(item.name.replace(/[^0-9]/g, ""));
          setPlayerWallet((prev) => ({
            ...prev,
            coins: prev.coins + coinsToAdd
          }));
        }
      }
    }
  };
  useEffect(() => {
    if (controls.actions.menu && !showPurchases) {
      setShowPurchases(true);
    }
  }, [controls.actions.menu, showPurchases]);
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3e3);
    return () => clearTimeout(timer);
  }, []);
  const handleMenuAction = (action) => {
    console.log("Menu action:", action);
    switch (action) {
      case "shop":
        setShowPurchases(true);
        break;
      case "dashboard":
      case "stats":
        setShowDashboard(true);
        break;
      case "business":
        setShowBusiness(true);
        break;
      case "properties":
        setShowProperties(true);
        break;
      case "garage":
        setShowGarage(true);
        break;
      case "social":
        setShowSocial(true);
        break;
      case "settings":
        setShowSettings(true);
        break;
      default:
        console.log("Unknown action:", action);
    }
  };
  if (isLoading) {
    return /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center", children: /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsx("div", { className: "animate-spin rounded-full h-32 w-32 border-b-2 border-white mx-auto mb-8" }),
        /* @__PURE__ */ jsx("div", { className: "absolute inset-0 flex items-center justify-center", children: /* @__PURE__ */ jsx("div", { className: "text-white text-2xl", children: "🎮" }) })
      ] }),
      /* @__PURE__ */ jsx("h1", { className: "text-5xl font-bold text-white mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent", children: "BettaDayz 3D" }),
      /* @__PURE__ */ jsx("p", { className: "text-xl text-gray-300 mb-4", children: "Loading your immersive world..." }),
      /* @__PURE__ */ jsxs("div", { className: "flex justify-center space-x-2", children: [
        /* @__PURE__ */ jsx("div", { className: "w-2 h-2 bg-blue-400 rounded-full animate-bounce" }),
        /* @__PURE__ */ jsx("div", { className: "w-2 h-2 bg-purple-400 rounded-full animate-bounce", style: { animationDelay: "0.1s" } }),
        /* @__PURE__ */ jsx("div", { className: "w-2 h-2 bg-pink-400 rounded-full animate-bounce", style: { animationDelay: "0.2s" } })
      ] })
    ] }) });
  }
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-gray-900 relative", children: [
    /* @__PURE__ */ jsx("div", { className: "fixed top-4 left-1/2 transform -translate-x-1/2 z-50", children: /* @__PURE__ */ jsx("div", { className: "bg-black/80 backdrop-blur-sm rounded-lg p-2 border border-white/20", children: /* @__PURE__ */ jsxs("div", { className: "flex space-x-2", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => setGameMode("3d"),
          className: `px-4 py-2 rounded transition-all ${gameMode === "3d" ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"}`,
          children: "🌍 3D Mode"
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => setGameMode("classic"),
          className: `px-4 py-2 rounded transition-all ${gameMode === "classic" ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"}`,
          children: "📱 Classic Mode"
        }
      )
    ] }) }) }),
    gameMode === "3d" ? /* @__PURE__ */ jsxs("div", { className: "relative w-full h-full", children: [
      /* @__PURE__ */ jsx(Game3D, { gamepadControls: controls }),
      /* @__PURE__ */ jsx(
        GTAStyleUI,
        {
          playerStats,
          onMenuAction: handleMenuAction,
          gamepadConnected
        }
      ),
      /* @__PURE__ */ jsx(
        GamepadSupport,
        {
          onControlsUpdate: handleControlsUpdate,
          onGamepadConnect: handleGamepadConnect,
          onGamepadDisconnect: handleGamepadDisconnect
        }
      ),
      showPurchases && /* @__PURE__ */ jsx(
        InGamePurchases,
        {
          playerWallet,
          onPurchase: handlePurchase,
          onClose: () => setShowPurchases(false)
        }
      ),
      purchaseSuccess && /* @__PURE__ */ jsx(
        PurchaseSuccess,
        {
          item: purchaseSuccess,
          onClose: () => setPurchaseSuccess(null)
        }
      ),
      showDashboard && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4", children: /* @__PURE__ */ jsxs("div", { className: "bg-gray-900 border border-gray-600 rounded-lg w-full max-w-6xl max-h-[90vh] overflow-hidden", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between p-4 border-b border-gray-600", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-yellow-400", children: "Character Dashboard" }),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setShowDashboard(false),
              className: "text-gray-400 hover:text-white text-2xl",
              children: "×"
            }
          )
        ] }),
        /* @__PURE__ */ jsx("div", { className: "overflow-y-auto max-h-[calc(90vh-80px)]", children: /* @__PURE__ */ jsx(Dashboard, { character }) })
      ] }) })
    ] }) : /* @__PURE__ */ jsx("div", { className: "min-h-screen", children: /* @__PURE__ */ jsx(GameContainer, {}) })
  ] });
}

const route1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: Index,
  meta
}, Symbol.toStringTag, { value: 'Module' }));

const serverManifest = {'entry':{'module':'/assets/entry.client-D0uTqQvD.js','imports':['/assets/index-CgYkI0WL.js','/assets/client-B7_6Uz0H.js','/assets/components-DLgDYPcF.js'],'css':[]},'routes':{'root':{'id':'root','parentId':undefined,'path':'','index':undefined,'caseSensitive':undefined,'hasAction':false,'hasLoader':false,'hasClientAction':false,'hasClientLoader':false,'hasErrorBoundary':true,'module':'/assets/root-BFKGjgFD.js','imports':['/assets/index-CgYkI0WL.js','/assets/client-B7_6Uz0H.js','/assets/components-DLgDYPcF.js'],'css':[]},'routes/_index':{'id':'routes/_index','parentId':'root','path':undefined,'index':true,'caseSensitive':undefined,'hasAction':false,'hasLoader':false,'hasClientAction':false,'hasClientLoader':false,'hasErrorBoundary':false,'module':'/assets/_index-Clus-2QJ.js','imports':['/assets/index-CgYkI0WL.js','/assets/client-B7_6Uz0H.js'],'css':[]}},'url':'/assets/manifest-29e042f5.js','version':'29e042f5'};

/**
       * `mode` is only relevant for the old Remix compiler but
       * is included here to satisfy the `ServerBuild` typings.
       */
      const mode = "production";
      const assetsBuildDirectory = "build\\client";
      const basename = "/";
      const future = {"v3_fetcherPersist":true,"v3_relativeSplatPath":true,"v3_throwAbortReason":true,"v3_routeConfig":false,"v3_singleFetch":false,"v3_lazyRouteDiscovery":false,"unstable_optimizeDeps":false};
      const isSpaMode = false;
      const publicPath = "/";
      const entry = { module: entryServer };
      const routes = {
        "root": {
          id: "root",
          parentId: undefined,
          path: "",
          index: undefined,
          caseSensitive: undefined,
          module: route0
        },
  "routes/_index": {
          id: "routes/_index",
          parentId: "root",
          path: undefined,
          index: true,
          caseSensitive: undefined,
          module: route1
        }
      };

export { serverManifest as assets, assetsBuildDirectory, basename, entry, future, isSpaMode, mode, publicPath, routes };
