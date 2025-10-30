import React from "react";

// Norfolk VA Locations & History Page
export default function NorfolkPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-800 via-green-700 to-yellow-600 flex flex-col items-center justify-center">
      <section className="w-full max-w-2xl bg-white/80 rounded-xl shadow-xl p-8 mt-8">
        <h1 className="text-3xl font-bold text-center text-blue-700 mb-4">Norfolk VA: Locations & History</h1>
        <p className="text-center text-gray-700 mb-6">
          Explore Norfolk&apos;s neighborhoods, historical sites, and cultural events.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
            <span className="text-lg font-semibold mb-2">Neighborhoods</span>
            <button className="btn btn-primary">View Map</button>
          </div>
          <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
            <span className="text-lg font-semibold mb-2">Historical Sites</span>
            <button className="btn btn-secondary">Learn More</button>
          </div>
        </div>
        <div className="mt-8">
          <h2 className="text-xl font-bold text-blue-600 mb-2">Upcoming Events</h2>
          <div className="bg-gray-100 rounded-lg p-4 h-48 overflow-y-auto mb-2">
            {/* Norfolk events will appear here */}
            <p className="text-gray-500 text-center">Event listings coming soon...</p>
          </div>
        </div>
      </section>
    </main>
  );
}
