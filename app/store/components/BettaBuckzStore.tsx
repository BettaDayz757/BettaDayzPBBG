'use client';

import { useState } from 'react';

interface BettaBuckzPackage {
  id: string;
  amount: number;
  price: number;
  bonus: number;
  popular?: boolean;
}

const packages: BettaBuckzPackage[] = [
  { id: 'starter', amount: 100, price: 5, bonus: 0 },
  { id: 'basic', amount: 500, price: 20, bonus: 50 },
  { id: 'premium', amount: 1000, price: 35, bonus: 150, popular: true },
  { id: 'ultimate', amount: 2500, price: 75, bonus: 500 },
  { id: 'legendary', amount: 5000, price: 125, bonus: 1250 },
];

export default function BettaBuckzStore() {
  const [selectedPackage, setSelectedPackage] = useState<BettaBuckzPackage | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'cashapp' | 'bitcoin' | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePurchase = async () => {
    if (!selectedPackage || !paymentMethod) return;

    setIsProcessing(true);
    
    try {
      const response = await fetch('/api/store/purchase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          packageId: selectedPackage.id,
          paymentMethod,
          amount: selectedPackage.price,
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        // Handle successful purchase
        alert(`Purchase initiated! Payment reference: ${result.reference}`);
        // Redirect to payment processor
        if (result.paymentUrl) {
          window.location.href = result.paymentUrl;
        }
      } else {
        alert('Purchase failed. Please try again.');
      }
    } catch (error) {
      console.error('Purchase error:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Package Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-12">
        {packages.map((pkg) => (
          <div
            key={pkg.id}
            className={`relative bg-white/10 backdrop-blur-sm rounded-xl p-6 cursor-pointer transition-all duration-300 ${
              selectedPackage?.id === pkg.id
                ? 'ring-4 ring-yellow-400 transform scale-105'
                : 'hover:bg-white/20 hover:scale-102'
            } ${pkg.popular ? 'ring-2 ring-purple-400' : ''}`}
            onClick={() => setSelectedPackage(pkg)}
          >
            {pkg.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                  POPULAR
                </span>
              </div>
            )}
            
            <div className="text-center">
              <h3 className="text-2xl font-bold text-white mb-2 capitalize">{pkg.id}</h3>
              <div className="text-4xl font-bold text-yellow-400 mb-2">
                {pkg.amount + pkg.bonus}
              </div>
              <div className="text-sm text-blue-200 mb-2">
                {pkg.amount} BettaBuckz
                {pkg.bonus > 0 && <span className="text-green-400"> + {pkg.bonus} Bonus</span>}
              </div>
              <div className="text-3xl font-bold text-white">
                ${pkg.price}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Payment Method Selection */}
      {selectedPackage && (
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 mb-8">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">
            Select Payment Method
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Cash App Payment */}
            <div
              className={`bg-white/10 rounded-xl p-6 cursor-pointer transition-all duration-300 ${
                paymentMethod === 'cashapp'
                  ? 'ring-4 ring-green-400 transform scale-105'
                  : 'hover:bg-white/20'
              }`}
              onClick={() => setPaymentMethod('cashapp')}
            >
              <div className="text-center">
                <div className="text-4xl mb-4">💰</div>
                <h3 className="text-2xl font-bold text-white mb-2">Cash App</h3>
                <p className="text-blue-200 mb-4">
                  Quick and easy payment with Cash App
                </p>
                <div className="text-green-400 font-bold">No additional fees</div>
              </div>
            </div>

            {/* Bitcoin Payment */}
            <div
              className={`bg-white/10 rounded-xl p-6 cursor-pointer transition-all duration-300 ${
                paymentMethod === 'bitcoin'
                  ? 'ring-4 ring-orange-400 transform scale-105'
                  : 'hover:bg-white/20'
              }`}
              onClick={() => setPaymentMethod('bitcoin')}
            >
              <div className="text-center">
                <div className="text-4xl mb-4">₿</div>
                <h3 className="text-2xl font-bold text-white mb-2">Bitcoin</h3>
                <p className="text-blue-200 mb-4">
                  Pay with Bitcoin (BTC)
                </p>
                <div className="text-orange-400 font-bold">
                  Via Cash App or External Wallet
                </div>
                <div className="text-sm text-red-300 mt-2">
                  +$2 fee for external wallets
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Purchase Summary & Button */}
      {selectedPackage && paymentMethod && (
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">Purchase Summary</h3>
          
          <div className="bg-white/10 rounded-lg p-6 mb-6 max-w-md mx-auto">
            <div className="flex justify-between items-center mb-2">
              <span className="text-blue-200">Package:</span>
              <span className="text-white font-bold capitalize">{selectedPackage.id}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-blue-200">BettaBuckz:</span>
              <span className="text-yellow-400 font-bold">
                {selectedPackage.amount + selectedPackage.bonus}
              </span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-blue-200">Payment Method:</span>
              <span className="text-white font-bold capitalize">{paymentMethod}</span>
            </div>
            <div className="border-t border-white/20 pt-2 mt-2">
              <div className="flex justify-between items-center">
                <span className="text-blue-200">Total:</span>
                <span className="text-white font-bold text-xl">
                  ${selectedPackage.price}
                  {paymentMethod === 'bitcoin' && ' + $2 fee'}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={handlePurchase}
            disabled={isProcessing}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 px-8 rounded-xl text-xl transition-all duration-300 transform hover:scale-105"
          >
            {isProcessing ? 'Processing...' : `Purchase ${selectedPackage.amount + selectedPackage.bonus} BettaBuckz`}
          </button>

          <p className="text-sm text-blue-200 mt-4">
            Secure payment processing. BettaBuckz will be added to your account after payment confirmation.
          </p>
        </div>
      )}

      {/* Information Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16">
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
          <h3 className="text-2xl font-bold text-white mb-4">What are BettaBuckz?</h3>
          <ul className="text-blue-200 space-y-2">
            <li>• Premium in-game currency for BettaDayz PBBG</li>
            <li>• Purchase exclusive items and upgrades</li>
            <li>• Access premium game features</li>
            <li>• Trade with other players</li>
            <li>• Support game development</li>
          </ul>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
          <h3 className="text-2xl font-bold text-white mb-4">Payment Information</h3>
          <ul className="text-blue-200 space-y-2">
            <li>• Cash App: Instant processing</li>
            <li>• Bitcoin via Cash App: No extra fees</li>
            <li>• External Bitcoin wallets: +$2 processing fee</li>
            <li>• All transactions are secure and encrypted</li>
            <li>• 24/7 customer support available</li>
          </ul>
        </div>
      </div>
    </div>
  );
}