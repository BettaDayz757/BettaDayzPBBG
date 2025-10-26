import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export const VerificationDashboard = ({ isAdmin }) => {
  const [pendingVerifications, setPendingVerifications] = useState([]);
  const [selectedVerification, setSelectedVerification] = useState(null);

  useEffect(() => {
    // Fetch pending verifications
    fetchPendingVerifications();
  }, []);

  const fetchPendingVerifications = async () => {
    // Implementation to fetch pending verifications
    const response = await fetch('/api/verifications/pending');
    const data = await response.json();
    setPendingVerifications(data);
  };

  const handleVerification = async (verificationId, approved) => {
    try {
      const response = await fetch(`/api/verifications/${verificationId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ approved }),
      });

      if (response.ok) {
        // Refresh the list
        fetchPendingVerifications();
        setSelectedVerification(null);
      }
    } catch (error) {
      console.error('Verification error:', error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Payment Verifications</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold mb-4">Pending Verifications</h3>
          {pendingVerifications.map((verification) => (
            <motion.div
              key={verification.id}
              whileHover={{ scale: 1.02 }}
              className="border-b p-4 cursor-pointer"
              onClick={() => setSelectedVerification(verification)}
            >
              <p className="font-bold">User: {verification.userId}</p>
              <p>Amount: ${verification.amount}</p>
              <p>Submitted: {new Date(verification.timestamp).toLocaleString()}</p>
            </motion.div>
          ))}
        </div>

        {selectedVerification && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold mb-4">Verification Details</h3>
            <img
              src={selectedVerification.screenshotUrl}
              alt="Payment Screenshot"
              className="w-full mb-4 rounded"
            />
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleVerification(selectedVerification.id, true)}
                className="bg-green-500 text-white py-2 rounded hover:bg-green-600"
              >
                Approve
              </button>
              <button
                onClick={() => handleVerification(selectedVerification.id, false)}
                className="bg-red-500 text-white py-2 rounded hover:bg-red-600"
              >
                Reject
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};