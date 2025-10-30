import React from "react";
import PvP from "../components/PvP";

// Torn.com-style Competitive Gameplay Page
export default function CompetitivePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-800 to-red-700 flex flex-col items-center justify-center">
      <section className="w-full max-w-2xl bg-white/80 rounded-xl shadow-xl p-8 mt-8">
        <h1 className="text-3xl font-bold text-center text-red-700 mb-4">BettaDayz Competitive Arena</h1>
        <p className="text-center text-gray-700 mb-6">
          Compete for resources, climb leaderboards, and challenge other players!
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
            <span className="text-lg font-semibold mb-2">Leaderboards</span>
            <button className="btn btn-primary">View Rankings</button>
          </div>
          <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
            <span className="text-lg font-semibold mb-2">PvP Battles</span>
            <button className="btn btn-secondary">Start Battle</button>
          </div>
        </div>
        <PvP />
      </section>
    </main>
  );
}
