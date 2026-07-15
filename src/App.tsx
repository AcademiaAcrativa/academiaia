/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import { User } from "./types";

export default function App() {
  const [activeUser, setActiveUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Check persistent login state on mount
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("academia_ia_active_user");
      if (storedUser) {
        setActiveUser(JSON.parse(storedUser));
      }
    } catch (e) {
      console.error("Failed to parse stored active user", e);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleLoginSuccess = (user: User) => {
    setActiveUser(user);
    localStorage.setItem("academia_ia_active_user", JSON.stringify(user));
  };

  const handleLogout = () => {
    setActiveUser(null);
    localStorage.removeItem("academia_ia_active_user");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-400 font-mono text-xs">
        <div className="w-8 h-8 border-2 border-emerald-500/25 border-t-emerald-500 rounded-full animate-spin mb-4"></div>
        <span>Carregando Academia...</span>
      </div>
    );
  }

  return (
    <>
      {activeUser ? (
        <Dashboard user={activeUser} onLogout={handleLogout} />
      ) : (
        <Login onLoginSuccess={handleLoginSuccess} />
      )}
    </>
  );
}

