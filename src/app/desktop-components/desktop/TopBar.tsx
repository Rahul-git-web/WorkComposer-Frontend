"use client";

import { Clipboard, Clock, CirclePause, Play, Square } from "lucide-react";
import { useEffect, useState } from "react";
import { useProject } from "@/context/ProjectContext";
import { useDesktop } from "@/context/DesktopContext";
import { useTimer } from "@/context/TimerContext";
import { useDashboard } from "@/context/DashboardContext";
import API from "@/api";
import toast from "react-hot-toast";

export default function TopBar() {


  const {
    selectedProject,
  } = useProject();

  const {
    setActivePage,
    setActiveReport,
  } = useDesktop();

  const { user } = useDashboard();

  const {
    timer,
    isTracking,
    start,
    stop,
    finishDay,
    duration,

    todayWorkSeconds,
    todayBreakSeconds,
    refreshTodayWork,

    lastStartedAt,
    lastStoppedAt,

    finishedToday,
  } = useTimer();

  const [showFinishModal, setShowFinishModal] = useState(false);
  const [finishing, setFinishing] = useState(false);

  useEffect(() => {
    if (!window.electronAPI) return;

    window.electronAPI.onIdleTimeout(() => {
      stop();
    });
  }, [stop]);

  const formatDuration = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;

    return `${h}h ${m}m ${s}s`;
  };

  const displayedWorkSeconds = isTracking
    ? todayWorkSeconds + duration
    : todayWorkSeconds;

  useEffect(() => {
    if (lastStartedAt || lastStoppedAt) {
      refreshTodayWork();
    }
  }, [lastStartedAt, lastStoppedAt]);


  const handleFinishDay = async () => {
    try {
      setFinishing(true);

      const success = await finishDay();

      if (success) {
        setShowFinishModal(false);
      }
    } finally {
      setFinishing(false);
    }
  };


  return (
    <div className="fixed top-0 left-[78px] right-0 h-16 bg-[#162742] border-b border-[#263852] flex items-center justify-between px-6 z-30">

      {/* Left Side */}
      <div className="flex flex-wrap items-center gap-3">

        {timer?.task ? (
          <div className="flex items-center gap-2 bg-[#0F1B31] border border-[#263852] rounded-lg px-4 py-2">
            <Clipboard className="w-4 h-4 text-blue-400" />

            <div>
              <p className="text-[10px] text-gray-400 uppercase">
                Current Task
              </p>

              <p className="text-sm text-white font-medium">
                {timer.task.title}
              </p>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setActivePage("projects")}
            className="px-5 py-2 rounded-lg text-xs font-medium bg-blue-600 hover:bg-blue-700 text-gray-200"
          >
            + Select Task
          </button>
        )}
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-4">

        <div className="bg-[#0F1B31] border border-[#263852] rounded-xl px-3 py-1 min-w-[180px] flex items-center gap-3">

          <div className="w-10 h-10 rounded-lg bg-[#113B35] flex items-center justify-center">
            <Clock className="w-4 h-4 text-green-400" />
          </div>

          <div>
            <p className="text-[11px] text-gray-400 font-bold text-lg">
              WORK TODAY
            </p>

            <h3 className="text-white font-bold text-xl">
              {formatDuration(displayedWorkSeconds)}
            </h3>
          </div>
        </div>

        <div className="bg-[#0F1B31] border border-[#263852] rounded-lg px-3 py-1 min-w-[180px] flex items-center gap-3">

          <div className="w-10 h-10 rounded-lg bg-[#3B2418] flex items-center justify-center">
            <CirclePause className="w-4 h-4 text-orange-400" />
          </div>

          <div>
            <p className="text-[11px] text-gray-400 font-bold">BREAK TODAY</p>
            <h3 className="text-white font-bold text-xl">
              {formatDuration(todayBreakSeconds)}
            </h3>
          </div>
        </div>

        <button
          onClick={() => {
            if (!user?._id) return;

            if (isTracking) {
              stop();
            } else {
              start(user._id);
            }
          }}
          className={`font-semibold px-6 py-2 rounded-lg flex items-center gap-1 text-white ${isTracking
            ? "bg-red-600 hover:bg-red-700"
            : "bg-green-600 hover:bg-green-700"
            }`}
        >
          <Play size={15} />

          {isTracking ? "Stop" : "Start"}
        </button>

        <button
          disabled={finishedToday}
          onClick={() => setShowFinishModal(true)}
          className={`font-semibold px-6 py-2 rounded-lg flex items-center gap-1 ${finishedToday
            ? "bg-[#243447] text-gray-400 cursor-not-allowed"
            : "bg-[#243447] text-white hover:bg-[#30445A]"
            }`}
        >
          {finishedToday ? (
            <>
              <span>✓</span>
              Finished
            </>
          ) : (
            <>
              <Square size={15} />
              Finish
            </>
          )}
        </button>
      </div>

      {showFinishModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-[400px] rounded-xl bg-[#16253D] border border-[#263852] p-6 shadow-2xl">

            <h2 className="text-lg font-semibold text-white">
              Finish your workday?
            </h2>

            <p className="text-sm text-gray-400 mt-2">
              You&apos;ve finished working for today. You won&apos;t be able
              to start tracking again until tomorrow.
            </p>

            <div className="flex justify-end gap-3 mt-6">

              <button
                onClick={() => setShowFinishModal(false)}
                disabled={finishing}
                className="px-4 py-2 rounded-lg text-sm font-medium
                    bg-[#243447] text-gray-300 hover:bg-[#30445A]"
              >
                Cancel
              </button>

              <button
                onClick={handleFinishDay}
                disabled={finishing}
                className="px-4 py-2 rounded-lg text-sm font-semibold
                    bg-red-600 text-white hover:bg-red-700
                    disabled:opacity-50"
              >
                {finishing ? "Finishing..." : "Finish Day"}
              </button>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}