import React from "react";
import AdminContent from "../components/AdminContent";

// Admin Dashboard for Content Management
export default function AdminDashboardPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-800 to-green-700 flex flex-col items-center justify-center">
      <section className="w-full max-w-2xl bg-white/80 rounded-xl shadow-xl p-8 mt-8">
        <h1 className="text-3xl font-bold text-center text-green-700 mb-4">Admin Dashboard</h1>
        <p className="text-center text-gray-700 mb-6">
          Manage events, locations, culture, and HBCU connections for BettaDayz PBBG.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
            <span className="text-lg font-semibold mb-2">Events</span>
            <button className="btn btn-primary">Manage Events</button>
          </div>
          <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
            <span className="text-lg font-semibold mb-2">Locations</span>
            <button className="btn btn-secondary">Manage Locations</button>
          </div>
          <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
            <span className="text-lg font-semibold mb-2">Culture</span>
            <button className="btn btn-primary">Manage Culture</button>
          </div>
          <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
            <span className="text-lg font-semibold mb-2">HBCU Connections</span>
            <button className="btn btn-secondary">Manage HBCU</button>
          </div>
        </div>
        <AdminContent />
      </section>
    </main>
  );
}
