import React from "react";

// African American & Minority Culture Page
export default function CulturePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-yellow-900 via-red-800 to-purple-700 flex flex-col items-center justify-center">
      <section className="w-full max-w-2xl bg-white/80 rounded-xl shadow-xl p-8 mt-8">
        <h1 className="text-3xl font-bold text-center text-yellow-700 mb-4">African American & Minority Culture</h1>
        <p className="text-center text-gray-700 mb-6">
          Discover Norfolk&apos;s vibrant African American and minority communities, events, and history.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
            <span className="text-lg font-semibold mb-2">Cultural Events</span>
            <button className="btn btn-primary">View Events</button>
          </div>
          <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
            <span className="text-lg font-semibold mb-2">Community Leaders</span>
            <button className="btn btn-secondary">Meet Leaders</button>
          </div>
        </div>
        <div className="mt-8">
          <h2 className="text-xl font-bold text-yellow-600 mb-2">Spotlight</h2>
          <div className="bg-gray-100 rounded-lg p-4 h-48 overflow-y-auto mb-2">
            {/* Cultural highlights will appear here */}
            <p className="text-gray-500 text-center">Cultural content coming soon...</p>
          </div>
        </div>
      </section>
    </main>
  );
}
