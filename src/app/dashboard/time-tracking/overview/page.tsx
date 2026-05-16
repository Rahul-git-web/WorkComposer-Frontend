"use client";
import { useState, useEffect } from "react";
import API from "@/api";

import OverviewHeader from "@/app/dashboard/time-tracking/overview/OverviewHeader";
import OverviewContent from "@/app/dashboard/time-tracking/overview/OverviewContent";
import Footer from "@/app/dashboard/time-tracking/overview/Footer";
import { useTimer } from "@/context/TimerContext";
import EditTime from "@/app/dashboard/time-tracking/overview/EditTime";
import type { Session } from "@/types/session";
import RemoveTime from "@/app/dashboard/time-tracking/overview/RemoveTime";

type DataItem = {
  id: string;
  name: string;
  team: string;
  date: string;
  workTime: string;
  breakTime: string;
  status: string;
  lastSync: string;
};

export default function Page() {
  const { duration, isTracking } = useTimer();

  const [date, setDate] = useState<Date>(new Date());
  const [data, setData] = useState<DataItem[]>([]);
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showRemoveModal, setShowRemoveModal] = useState<boolean>(false);
  const [refresh, setRefresh] = useState<number>(0);

  const formatWorkTime = (sec: number): string => {
    if (!sec || isNaN(sec)) return "00:00";

    const h = String(Math.floor(sec / 3600)).padStart(2, "0");
    const m = String(Math.floor((sec % 3600) / 60)).padStart(2, "0");

    return `${h}:${m}`;
  };

  const formattedDate = date.toISOString().split("T")[0]!;

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const res = await API.get<Session[]>(`/sessions?date=${formattedDate}`);
        const sessions = res.data;

        const filteredSessions =
          selectedTeams.length > 0
            ? sessions.filter((s) => selectedTeams.includes(s.team))
            : sessions;

        const workSeconds = filteredSessions
          .filter((s) => s.type === "work")
          .reduce((sum, s) => sum + s.duration, 0);

        const breakSeconds = filteredSessions
          .filter((s) => s.type === "break")
          .reduce((sum, s) => sum + s.duration, 0);

        const liveSeconds = isTracking ? duration : 0;
        const finalWork = workSeconds + liveSeconds;

        const lastSession = filteredSessions
          .slice()
          .sort(
            (a, b) =>
              new Date(b.endTime).getTime() -
              new Date(a.endTime).getTime()
          )[0];

        setData([
          {
            id: "total",
            name: "Arena Z",
            team: "Default team",
            date: formattedDate,
            workTime: formatWorkTime(finalWork),
            breakTime: formatWorkTime(breakSeconds),
            status: isTracking ? "Tracking running" : "Tracking stopped",
            lastSync: lastSession
              ? new Date(lastSession.endTime).toLocaleString()
              : "--",
          },
        ]);
      } catch (err) {
        console.log("Fetch failed", err);
      }
    };

    fetchSessions();
  }, [formattedDate, isTracking, duration, refresh, selectedTeams]);


  return (
    <>
      <div className="px-4 sm:px-6 lg:px-8">
        <OverviewHeader
          date={date}
          setDate={setDate}
          selectedTeams={selectedTeams}
          setSelectedTeams={setSelectedTeams}
        />

        <OverviewContent
          data={data}
          onAddManualTime={() => setShowModal(true)}
          onRemoveTime={() => setShowRemoveModal(true)}
        />

        {showModal && (
          <EditTime
            onClose={() => setShowModal(false)}
            onSave={() => {
              setShowModal(false);
              setRefresh((prev) => prev + 1);
            }}
          />
        )}

        {showRemoveModal && (
          <RemoveTime
            onClose={() =>
              setShowRemoveModal(false)
            }
            onDelete={() => {
              setShowRemoveModal(false);
              setRefresh((prev) => prev + 1);
            }}
          />
        )}

        
      </div>

      <Footer />
    </>
  );
}