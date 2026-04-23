"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { TimerProvider } from "@/context/TimerContext";
import API from "@/api";
import DashNavbar from "./dashnavbar";
import Sidebar from "./sidebar";

export default function DashboardLayout({ children }) {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await API.get("/auth/me");
        setUser(res.data);
      } catch {
        router.replace("/authenticate/login");
      }
    };

    checkAuth();
  }, [router]);

  if (!user) return null;
  return (
    <TimerProvider>
    <div className="flex h-screen bg-gray-900 overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <DashNavbar user={user} />

        <main className="flex-1 overflow-y-auto bg-gray-100">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
    </TimerProvider>
  );
}
