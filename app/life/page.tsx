import React from "react";

// BitLife-style Life Simulation Page
export default function LifeSimulationPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-green-900 via-blue-800 to-yellow-700 flex flex-col items-center justify-center">
      <section className="w-full max-w-2xl bg-white/80 rounded-xl shadow-xl p-8 mt-8">
        <h1 className="text-3xl font-bold text-center text-green-700 mb-4">BettaDayz Life Simulator</h1>
        <p className="text-center text-gray-700 mb-6">
          Experience life events, make choices, and shape your story in Norfolk VA!
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
            <span className="text-lg font-semibold mb-2">Career Path</span>
            <button className="btn btn-primary">Choose Career</button>
          </div>
          <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
            <span className="text-lg font-semibold mb-2">Life Events</span>
            <button className="btn btn-secondary">View Events</button>
          </div>
        </div>
        <div className="mt-8">
          <h2 className="text-xl font-bold text-green-600 mb-2">Your Story</h2>
          <div className="bg-gray-100 rounded-lg p-4 h-48 overflow-y-auto mb-2">
            {/* Life events and choices will appear here */}
            <p className="text-gray-500 text-center">Life simulation coming soon...</p>
          </div>
        </div>
      </section>
    </main>
  );
}
