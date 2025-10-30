import React from "react";
import Chat from "../components/Chat";

// IMVU-style Social Room Page
export default function SocialRoomPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-800 to-pink-700 flex flex-col items-center justify-center">
      <section className="w-full max-w-2xl bg-white/80 rounded-xl shadow-xl p-8 mt-8">
        <h1 className="text-3xl font-bold text-center text-purple-700 mb-4">BettaDayz Social Lounge</h1>
        <p className="text-center text-gray-700 mb-6">
          Chat, customize your avatar, and join themed rooms inspired by IMVU!
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
            <span className="text-lg font-semibold mb-2">Avatar Customization</span>
            <button className="btn btn-primary">Edit Avatar</button>
          </div>
          <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
            <span className="text-lg font-semibold mb-2">Join a Room</span>
            <button className="btn btn-secondary">Browse Rooms</button>
          </div>
        </div>
        <Chat />
      </section>
    </main>
  );
}
