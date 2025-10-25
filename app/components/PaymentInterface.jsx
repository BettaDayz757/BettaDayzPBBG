import React, { useState } from 'react';
// eslint-disable-next-line no-restricted-imports
import { PaymentProcessor, PaymentStatus } from '../utils/payment-processor';
import { motion } from 'framer-motion';

export const PaymentInterface = ({ userId, onSuccess }) => {
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [amount, setAmount] = useState(0);
  const [instructions, setInstructions] = useState(null);
  const [verificationFile, setVerificationFile] = useState(null);
  const [status, setStatus] = useState('idle');

  const packages = [
    {
      id: 'starter',
      name: 'Starter Business',
      amount: 10,
      coins: 1000,
      perks: ['Basic Business License', 'Small Shop Location'],
    },
    {
      id: 'entrepreneur',
      name: 'Entrepreneur Pack',
      amount: 25,
      coins: 3000,
      perks: ['Premium Location', 'Business Connections', 'Marketing Boost'],
    },
    {
      id: 'mogul',
      name: 'Business Mogul',
      amount: 50,
      coins: 7000,
      perks: ['Multiple Locations', 'Investment Opportunities', 'VIP Status'],
    },
    {
      id: 'empire',
      name: 'Norfolk Empire',
      amount: 100,
      coins: 15000,
      perks: ['City-wide Influence', 'Business Empire Status', 'Special Events Access'],
    },
  ];

  const handlePackageSelect = async (pkg) => {
    setAmount(pkg.amount);

    const paymentInstructions = await PaymentProcessor.generatePaymentInstructions(selectedMethod, pkg.amount, userId);
    setInstructions(paymentInstructions);
  };

  const handlePaymentSubmit = async () => {
    setStatus('processing');

    try {
      if (selectedMethod === 'cashapp') {
        const result = await PaymentProcessor.verifyCashAppPayment(verificationFile, amount, userId);

        if (result.status === PaymentStatus.VERIFICATION_REQUIRED) {
          setStatus('awaiting_verification');
        }
      } else if (selectedMethod === 'bitcoin') {
        // Monitor BTC address for payment
        const result = await PaymentProcessor.verifyBitcoinPayment(instructions.txHash, amount, userId);

        if (result.status === PaymentStatus.COMPLETED) {
          onSuccess();
        }
      }
    } catch (error) {
      setStatus('error');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl shadow-xl">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Grow Your Norfolk Empire</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {packages.map((pkg) => (
          <motion.div key={pkg.id} whileHover={{ scale: 1.02 }} className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold text-gray-800">{pkg.name}</h3>
            <p className="text-2xl font-bold text-amber-600">${pkg.amount}</p>
            <p className="text-gray-600">{pkg.coins} Coins</p>
            <ul className="mt-4">
              {pkg.perks.map((perk, index) => (
                <li key={index} className="flex items-center text-gray-700">
                  <span className="mr-2">✓</span> {perk}
                </li>
              ))}
            </ul>
            <button
              onClick={() => handlePackageSelect(pkg)}
              className="mt-4 w-full bg-amber-500 text-white py-2 rounded-md hover:bg-amber-600"
            >
              Select Package
            </button>
          </motion.div>
        ))}
      </div>

      {instructions && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold mb-4">Payment Instructions</h3>
          {selectedMethod === 'cashapp' ? (
            <>
              <p>
                Send ${amount} to: {instructions.cashtag}
              </p>
              <p>Include note: {instructions.note}</p>
              <input
                type="file"
                onChange={(e) => setVerificationFile(e.target.files[0])}
                className="mt-4"
                accept="image/*"
              />
            </>
          ) : (
            <>
              <p>Send {instructions.amountBTC} BTC to:</p>
              <code className="block bg-gray-100 p-2 rounded">{instructions.address}</code>
            </>
          )}
          <button
            onClick={handlePaymentSubmit}
            className="mt-4 w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600"
          >
            Verify Payment
          </button>
        </div>
      )}
    </div>
  );
};
