import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

export default function Home() {
  const [user, setUser] = useState(null);
  const [balance, setBalance] = useState<number | null>(null);

  useEffect(() => {
    // placeholder: fetch user and wallet when auth is configured
  }, []);

  return (
    <main style={{ padding: "2rem", fontFamily: "Inter, system-ui, sans-serif" }}>
      <h1>BettaDayz</h1>
      <p>BettaBuckz-powered HBCU-themed social PBBG — Norfolk, VA vibe.</p>
      <section style={{ marginTop: "2rem" }}>
        <h2>Your Wallet</h2>
        <div style={{ padding: "1rem", border: "1px solid #eee", borderRadius: 8 }}>
          <p>Balance: {balance === null ? "—" : `${balance} BettaBuckz`}</p>
          <button>Buy BettaBuckz</button>
        </div>
      </section>
    </main>
  );
}
