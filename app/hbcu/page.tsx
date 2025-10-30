import React from "react";

// HBCU Connections Page
export default function HBCUPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-green-900 via-yellow-800 to-blue-700 flex flex-col items-center justify-center">
      <section className="w-full max-w-2xl bg-white/80 rounded-xl shadow-xl p-8 mt-8">
        <h1 className="text-3xl font-bold text-center text-green-700 mb-4">HBCU Connections</h1>
        <p className="text-center text-gray-700 mb-6">
          Connect with Norfolk State, Hampton University, and other HBCUs in the region.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
            <span className="text-lg font-semibold mb-2">Norfolk State University</span>
            <button className="btn btn-primary">Learn More</button>
          </div>
          <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
            <span className="text-lg font-semibold mb-2">Hampton University</span>
            <button className="btn btn-secondary">Learn More</button>
          </div>
        </div>
        <div className="mt-8">
          <h2 className="text-xl font-bold text-green-600 mb-2">Student Opportunities</h2>
          <div className="bg-gray-100 rounded-lg p-4 h-48 overflow-y-auto mb-2">
            {/* HBCU events and opportunities will appear here */}
            <p className="text-gray-500 text-center">HBCU content coming soon...</p>
          </div>
        </div>
      </section>
    </main>
  );
}
