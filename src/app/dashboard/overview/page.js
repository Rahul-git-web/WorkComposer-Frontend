"use client";
import { useState, useEffect } from "react";

import OverviewHeader from "@/components/overview/OverviewHeader";
import OverviewContent from "@/components/overview/OverviewContent";
import Footer from "@/components/overview/Footer";
import DashNavbar from "../dashnavbar";
import { useTimer } from "@/context/TimerContext";

export default function Page() {
  const { seconds, isTracking } = useTimer();
  const [date, setDate] = useState(new Date());
  const [data, setData] = useState([]);
  const [selectedTeams, setSelectedTeams] = useState([]);
  const [lastSync, setLastSync] = useState("");

  const formatWorkTime = (sec) => {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    return `${h}h ${m}m`;
  };

  const formattedDate = date.toISOString().split("T")[0];

  useEffect(() => {
    const allData = [
      {
        id: 1,
        name: "Arena Z",
        team: "Default team",
        date: formattedDate,
        workTime: formatWorkTime(seconds),
        breakTime: "0h 0m",
        status: isTracking
          ? "Tracking running"
          : seconds > 0
            ? "Tracking stopped"
            : "No tracking",
        lastSync:
          !isTracking && seconds > 0
            ? lastSync || new Date().toLocaleString()
            : "--",
      },
    ];

    const filtered = allData.filter((item) => {
      const matchDate = item.date === formattedDate;
      const matchTeam =
        selectedTeams.length === 0 || selectedTeams.includes(item.team);

      return matchDate && matchTeam;
    });

    setData(filtered);
  }, [formattedDate, selectedTeams, seconds, isTracking]);

  useEffect(() => {
    if (!isTracking && seconds > 0) {
      setLastSync(new Date().toLocaleString());
    }
  }, [isTracking, seconds]);

  return (
    <>
      {/* <DashNavbar setTrackedSeconds={setTrackedSeconds} /> */}

      <div className="px-4 sm:px-6 lg:px-8">
        <OverviewHeader
          date={date}
          setDate={setDate}
          selectedTeams={selectedTeams}
          setSelectedTeams={setSelectedTeams}
        />

        <OverviewContent data={data} />
      </div>

      <Footer />
    </>
  );
}
