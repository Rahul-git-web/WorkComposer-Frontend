"use client"

import { useDashboard } from "@/context/DashboardContext";

import { Building2, Clock } from 'lucide-react';
import { useEffect, useState } from "react";

export default function OrganizationCard() {

  const { user } = useDashboard();

  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());

    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);


  const currentTime = now
    ? now.toLocaleTimeString("en-IN", {
      timeZone: user?.organization?.timezone || "Asia/Kolkata",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    })
    : "--:--:--";

  const timezone =
    user?.reportTimezone === "Browser timezone"
      ? Intl.DateTimeFormat().resolvedOptions().timeZone
      : user?.reportTimezone || "Asia/Kolkata";

  return (
    <div className="bg-[#17253D] rounded-xl p-4 border border-[#22324D] h-[220px] transition-shadow duration-300 hover:shadow-[0_0_25px_rgba(22,163,74,0.25)]">
      <div className='flex items-center gap-3 '>
        <div className="w-9 h-9 bg-green-600 rounded-lg mb-3 flex items-center justify-center shadow-[0_0_12px_rgba(22,163,74,0.6)]">
          <Building2 className='w-4 h-4 text-white' />
        </div>

        <h3 className="text-gray-400 font-semibold uppercase text-xs mb-2">
          ORGANIZATION
        </h3>
      </div>

      <p className="text-white text-sm font-bold mb-3">
        {user?.organization?.name || "Unknown Organization"}
      </p>

      <div className="flex border-t border-[#263852] mt-3 pt-2">
        <Clock className='w-3.5 h-3.5 text-green-500 mr-2 mt-1' />
        <p className="text-gray-400 text-sm">
          {timezone} •
        </p>
        <span className="text-white font-normal text-sm ml-2">
          {currentTime}
        </span>
      </div>
    </div>
  );
}