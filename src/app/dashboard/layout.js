"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { TimerProvider } from "@/context/TimerContext";
import API from "@/api";
import DashNavbar from "./dashnavbar";
import Sidebar from "./sidebar";
import EditTime from "@/app/dashboard/time-tracking/overview/EditTime";

export default function DashboardLayout({ children }) {
  const [user, setUser] = useState(null);
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const open = () => setShowModal(true);
    window.addEventListener("openManualTime", open);

    return () => window.removeEventListener("openManualTime", open);
  }, []);

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
      <div
        className={`h-screen transition-all duration-300 ${
          showModal ? "blur-sm brightness-75 scale-[0.98]" : ""
        }`}
      >
        <div className="flex h-full overflow-hidden">
          <Sidebar />
          <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
            <DashNavbar user={user} />
            <main className="flex-1 overflow-y-auto bg-gray-100">
              {children}
            </main>
          </div>
        </div>
      </div>

      {showModal && (
        <>
          {/* BLUR OVERLAY */}
          <div
            onClick={() => setShowModal(false)}
            className="fixed inset-0 z-40 bg-black/30"
          />

          {/* MODAL */}
          <div className="fixed inset-0 z-50 w-screen overflow-y-auto">
            <EditTime onClose={() => setShowModal(false)} />
          </div>
        </>
      )}
    </TimerProvider>
  );
}
