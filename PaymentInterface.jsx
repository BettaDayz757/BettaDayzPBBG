import React, { useState, useEffect } from 'react';
import { PaymentProcessor, PaymentStatus } from '../utils/payment-processor';
import { motion } from 'framer-motion';

export const PaymentInterface = ({ userId, onSuccess }) => {
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [amount, setAmount] = useState(0);
  const [instructions, setInstructions] = useState(null);
  const [verificationFile, setVerificationFile] = useState(null);
  const [bitcoinTxHash, setBitcoinTxHash] = useState('');
  const [status, setStatus] = useState('idle');
  const [statusMessage, setStatusMessage] = useState('');
  const [transactionId, setTransactionId] = useState(null);

  const packages = [
    { id: 'starter', name: 'Starter Business', amount: 10, coins: 1000, perks: ['Basic Business License', 'Small Shop Location'] },
    { id: 'entrepreneur', name: 'Entrepreneur Pack', amount: 25, coins: 3000, perks: ['Premium Location', 'Business Connections', 'Marketing Boost'] },
    { id: 'mogul', name: 'Business Mogul', amount: 50, coins: 7000, perks: ['Multiple Locations', 'Investment Opportunities', 'VIP Status'] },
    { id: 'empire', name: 'Norfolk Empire', amount: 100, coins: 15000, perks: ['City-wide Influence', 'Business Empire Status', 'Special Events Access'] }
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
      
      if (selectedMethod === 'bitcoin') {
        // For Bitcoin, we need to await the BTC amount calculation
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
      
      if (method === 'bitcoin') {
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
    setStatus('processing');
    setStatusMessage('Processing payment verification...');
    
    try {
      if (selectedMethod === 'cashapp') {
        if (!verificationFile) {
          setStatus('error');
          setStatusMessage('Please upload a screenshot of your Cash App payment.');
          return;
        }
        
        const result = await PaymentProcessor.verifyCashAppPayment(
          verificationFile,
          amount,
          userId
        );
        
        setTransactionId(result.transactionId);
        
        if (result.status === PaymentStatus.VERIFICATION_REQUIRED) {
          setStatus('awaiting_verification');
          setStatusMessage(result.message);
        } else if (result.status === PaymentStatus.FAILED) {
          setStatus('error');
          setStatusMessage(result.error);
        }
      } else if (selectedMethod === 'bitcoin') {
        if (!bitcoinTxHash) {
          setStatus('error');
          setStatusMessage('Please enter your Bitcoin transaction hash.');
          return;
        }
        
        const result = await PaymentProcessor.verifyBitcoinPayment(
          bitcoinTxHash,
          amount,
          userId
        );
        
        setTransactionId(result.transactionId);
        
        if (result.status === PaymentStatus.COMPLETED) {
          setStatus('completed');
          setStatusMessage(result.message);
          onSuccess(selectedPackage);
        } else if (result.status === PaymentStatus.PENDING) {
          setStatus('pending');
          setStatusMessage(result.message);
        } else if (result.status === PaymentStatus.FAILED) {
          setStatus('error');
          setStatusMessage(result.error);
        }
      }
    } catch (error) {
      setStatus('error');
      setStatusMessage('An error occurred while processing your payment. Please try again.');
      console.error('Payment submission error:', error);
    }
  };

  const checkTransactionStatus = async () => {
    if (!transactionId) return;
    
    try {
      const result = await PaymentProcessor.getTransactionStatus(transactionId);
      
      if (result.status === PaymentStatus.COMPLETED) {
        setStatus('completed');
        setStatusMessage(result.message || 'Payment confirmed successfully!');
        onSuccess(selectedPackage);
      } else if (result.status === PaymentStatus.PENDING) {
        setStatusMessage(result.message || `Waiting for confirmations... (${result.confirmations || 0}/2)`);
      }
    } catch (error) {
      console.error('Error checking transaction status:', error);
    }
  };

  // Poll for Bitcoin transaction updates
  useEffect(() => {
    if (status === 'pending' && transactionId && selectedMethod === 'bitcoin') {
      const interval = setInterval(checkTransactionStatus, 30000); // Check every 30 seconds
      return () => clearInterval(interval);
    }
  }, [status, transactionId, selectedMethod]);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl shadow-xl">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Grow Your Norfolk Empire</h2>
      
      {/* Payment Method Selection */}
      {!selectedMethod && (
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Choose Payment Method</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              onClick={() => handleMethodSelect('cashapp')}
              className="bg-green-500 text-white p-6 rounded-lg shadow-md hover:bg-green-600 transition-colors"
            >
              <div className="text-2xl mb-2">💰</div>
              <h4 className="text-lg font-bold">Cash App</h4>
              <p className="text-sm opacity-90">Quick verification with screenshot</p>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              onClick={() => handleMethodSelect('bitcoin')}
              className="bg-orange-500 text-white p-6 rounded-lg shadow-md hover:bg-orange-600 transition-colors"
            >
              <div className="text-2xl mb-2">₿</div>
              <h4 className="text-lg font-bold">Bitcoin</h4>
              <p className="text-sm opacity-90">Secure blockchain payment</p>
            </motion.button>
          </div>
        </div>
      )}

      {/* Package Selection */}
      {selectedMethod && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {packages.map((pkg) => (
            <motion.div
              key={pkg.id}
              whileHover={{ scale: 1.02 }}
              className={`bg-white p-6 rounded-lg shadow-md border-2 ${
                selectedPackage?.id === pkg.id ? 'border-amber-500' : 'border-transparent'
              }`}
            >
              <h3 className="text-xl font-bold text-gray-800">{pkg.name}</h3>
              <p className="text-2xl font-bold text-amber-600">${pkg.amount}</p>
              <p className="text-gray-600">{pkg.coins} Coins</p>
              <ul className="mt-4">
                {pkg.perks.map((perk, index) => (
                  <li key={index} className="flex items-center text-gray-700">
                    <span className="mr-2 text-green-500">✓</span> {perk}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handlePackageSelect(pkg)}
                className={`mt-4 w-full py-2 rounded-md transition-colors ${
                  selectedPackage?.id === pkg.id
                    ? 'bg-amber-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-amber-500 hover:text-white'
                }`}
              >
                {selectedPackage?.id === pkg.id ? 'Selected' : 'Select Package'}
              </button>
            </motion.div>
          ))}
        </div>
      )}

      {/* Payment Instructions */}
      {instructions && selectedPackage && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h3 className="text-xl font-bold mb-4 text-gray-800">Payment Instructions</h3>
          
          {selectedMethod === 'cashapp' ? (
            <div className="space-y-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="font-semibold text-green-800">Send ${amount} to: {instructions.cashtag}</p>
                <p className="text-green-700">Include note: {instructions.note}</p>
                <p className="text-sm text-green-600 mt-2">{instructions.instructions}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Payment Screenshot
                </label>
                <input
                  type="file"
                  onChange={(e) => setVerificationFile(e.target.files[0])}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  accept="image/*"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Please upload a clear screenshot showing the completed payment
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-orange-50 p-4 rounded-lg">
                <p className="font-semibold text-orange-800">Send {instructions.amountBTC} BTC to:</p>
                <code className="block bg-gray-100 p-2 rounded mt-2 text-sm break-all">
                  {instructions.address}
                </code>
                <p className="text-sm text-orange-600 mt-2">{instructions.instructions}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bitcoin Transaction Hash
                </label>
                <input
                  type="text"
                  value={bitcoinTxHash}
                  onChange={(e) => setBitcoinTxHash(e.target.value)}
                  placeholder="Enter your transaction hash after sending Bitcoin"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  You can find this in your Bitcoin wallet after sending the payment
                </p>
              </div>
            </div>
          )}
          
          <button
            onClick={handlePaymentSubmit}
            disabled={status === 'processing'}
            className={`mt-6 w-full py-3 rounded-md font-semibold transition-colors ${
              status === 'processing'
                ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                : 'bg-green-500 text-white hover:bg-green-600'
            }`}
          >
            {status === 'processing' ? 'Processing...' : 'Verify Payment'}
          </button>
        </div>
      )}

      {/* Status Messages */}
      {status !== 'idle' && statusMessage && (
        <div className={`p-4 rounded-lg mb-4 ${
          status === 'completed' ? 'bg-green-100 text-green-800' :
          status === 'error' ? 'bg-red-100 text-red-800' :
          status === 'awaiting_verification' ? 'bg-yellow-100 text-yellow-800' :
          'bg-blue-100 text-blue-800'
        }`}>
          <div className="flex items-center">
            <div className="mr-3">
              {status === 'completed' && '✅'}
              {status === 'error' && '❌'}
              {status === 'awaiting_verification' && '⏳'}
              {status === 'pending' && '🔄'}
              {status === 'processing' && '⏳'}
            </div>
            <p>{statusMessage}</p>
          </div>
          
          {status === 'pending' && transactionId && (
            <div className="mt-2">
              <button
                onClick={checkTransactionStatus}
                className="text-sm bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
              >
                Check Status
              </button>
            </div>
          )}
        </div>
      )}

      {/* Reset Button */}
      {(selectedMethod || status === 'error') && (
        <button
          onClick={() => {
            setSelectedMethod(null);
            setSelectedPackage(null);
            setInstructions(null);
            setStatus('idle');
            setStatusMessage('');
            setTransactionId(null);
            setVerificationFile(null);
            setBitcoinTxHash('');
          }}
          className="w-full mt-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
        >
          Start Over
        </button>
      )}
    </div>
  );
};