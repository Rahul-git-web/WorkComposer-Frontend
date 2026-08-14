"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
import type { ReactNode } from "react";

import toast from "react-hot-toast";

import API from "@/api";
import { useProject } from "@/context/ProjectContext";
import socket from "@/socket/socket";
import useEffectiveTrackingSettings from "@/hooks/useEffectiveTrackingSettings";
import { useDashboard } from "@/context/DashboardContext";

/*TYPES */

type TimerContextType = {
  timer: any;
  isTracking: boolean;

  start: (
    userId: string,
    projectId?: string | null,
    taskId?: string | null
  ) => void;

  switchTask: (
    projectId: string | null,
    taskId: string | null
  ) => void;

  stop: () => void;

   finishDay: () => Promise<boolean>;

  duration: number;

  todayWorkSeconds: number;
  todayBreakSeconds: number;
  finishedToday: boolean;
  refreshTodayWork: () => Promise<void>;
  lastStartedAt: number;
  lastStoppedAt: number;
};

/* CONTEXT */

const TimerContext = createContext<TimerContextType | null>(null);

/* PROVIDER */
type Props = {
  children: ReactNode;
};

export const TimerProvider = ({ children }: Props) => {
  const [timer, setTimer] = useState<any>(null);
  const [isTracking, setIsTracking] = useState<boolean>(false);
  const [duration, setDuration] = useState<number>(0);
  const [todayWorkSeconds, setTodayWorkSeconds] = useState(0);
  const [todayBreakSeconds, setTodayBreakSeconds] = useState(0);
  const [lastStoppedAt, setLastStoppedAt] = useState(0);
  const [lastStartedAt, setLastStartedAt] = useState(0);
  const [finishedToday, setFinishedToday] = useState(false);
  const [attendanceChecked, setAttendanceChecked] = useState(false);
  const [showIdleModal, setShowIdleModal] = useState(false);
  const [idleCountdown, setIdleCountdown] = useState(20);
  const autoStarted = useRef(false);

  const isTrackingRef = useRef(false);

  const handlingSleep = useRef(false);

  const {
    selectedProject,
    selectedTask,
  } = useProject();

  const { user } = useDashboard();

  const {
    settings: effectiveSettings,
  } = useEffectiveTrackingSettings();


  useEffect(() => {
    if (!effectiveSettings) return;

    console.log(
      "EFFECTIVE SETTINGS UPDATED",
      effectiveSettings
    );
  }, [effectiveSettings]);

  const refreshTodayWork = async () => {
    try {
      const { data } = await API.get("/sessions/today");

      setTodayWorkSeconds(data.workSeconds);
      setTodayBreakSeconds(data.breakSeconds);
    } catch (err) {
      console.log(err);
    }
  };


  // START
  const start = useCallback((
    userId: string,
    projectId: string | null = null,
    taskId: string | null = null
  ) => {
    console.log("USER ID:", userId);

    if (isTracking) return;

    if (!attendanceChecked) {
      console.log("ATTENDANCE STATUS NOT READY");
      return;
    }

    if (finishedToday) {
    toast.error(
        "You have already finished working for today. You can start again tomorrow."
    );
    return;
}
    console.log({
      projectId,
      taskId,
    });

    socket.emit("startTimer", {
      userId,
      project: projectId,
      task: taskId,
    });
 }, [isTracking, attendanceChecked, finishedToday]);

useEffect(() => {
    if (!user) return;

    if (!effectiveSettings) return;

    if (!attendanceChecked) return;

  if (finishedToday) {
    toast.error(
        "You have already finished working for today. You can start again tomorrow."
    );
    return;
}

    const mode = effectiveSettings?.tracking?.trackingMode;

    if (
        mode === "manual" &&
        !effectiveSettings?.tracking?.startTrackingOnBoot
    ) {
        return;
    }

    if (isTracking || timer) return;

    if (autoStarted.current) return;

    autoStarted.current = true;

    start(user._id, null, null);

}, [
    user,
    effectiveSettings,
    timer,
    isTracking,
    start,
    attendanceChecked,
    finishedToday,
]);

  useEffect(() => {
    isTrackingRef.current = isTracking;
  }, [isTracking]);


  useEffect(() => {
    if (!user) return;

    const removeListener =
      window.electronAPI?.onAutoStartTracking(() => {
        console.log("AUTO START FROM SHIFT");

        if (isTrackingRef.current) return;

        start(user._id, null, null);
      });

    return () => {
      removeListener?.();
    };
  }, [user]);

  // SWITCH TASK
  const switchTask = (
    projectId: string | null,
    taskId: string | null
  ) => {
    // Update Electron so screenshots/activity/useage logs use the new task
    window.electronAPI?.switchTask(
      projectId,
      taskId
    );

    // Tell the backend to end the current timer
    // and start a new one with the new project/task
    if (!timer?._id) return;

    socket.emit("switchTask", {
      userId: timer.user,
      project: projectId,
      task: taskId,
    });
  };


  // STOP
  const stop = useCallback(async () => {
    console.log("STOP CALLED");
    console.log("TIMER:", timer);

    if (!timer) return;

    window.electronAPI?.stopTracking();

    socket.emit("stopTimer", {
      timerId: timer._id,
    });
  }, [timer]);

  useEffect(() => {
    if (!user) return;

    const removeListener =
      window.electronAPI?.onAutoStopTracking(() => {
        console.log("AUTO STOP FROM SHIFT");

        if (!isTrackingRef.current) return;

        stop();
      });

    return () => {
      removeListener?.();
    };
  }, [user, stop]);

  const finishDay = useCallback(async () => {
   if (finishedToday) {
    toast.error(
        "You have already finished working for today. You can start again tomorrow."
    );
    return false;
}

    try {
        // If currently tracking, stop first so the
        // current session is saved before finishing.
        if (isTracking) {
            stop();

            // Give the socket/session save a moment to complete.
            await new Promise((resolve) => setTimeout(resolve, 300));
        }

        const { data } = await API.post("/attendance/finish");

        console.log("WORKDAY FINISHED:", data);

        setFinishedToday(true);

        // Refresh today's totals after finishing.
        await refreshTodayWork();

        return true;
    } catch (err: any) {
        console.error("FINISH DAY ERROR:", err);

        console.error(
            err?.response?.data?.message ||
            "Failed to finish workday"
        );

        return false;
    }
}, [
    finishedToday,
    isTracking,
    stop,
    refreshTodayWork,
]);


  useEffect(() => {
    const getActiveTimer = async () => {
      try {
        await refreshTodayWork();

        const res = await API.get("/timers/active");

        if (res.data) {
          setTimer(res.data);
          setIsTracking(true);

          const start = new Date(
            res.data.startTime
          ).getTime();

          const now = Date.now();

          setDuration(
            Math.floor((now - start) / 1000)
          );

          console.log("Restored Timer", res.data);
        }
      } catch (err) {
        console.log(err);
      }
    }

    getActiveTimer();

    window.electronAPI?.onIdleWarning(() => {
      console.log("IDLE WARNING RECEIVED");

      setIdleCountdown(20);
      setShowIdleModal(true);
    });

    window.electronAPI?.onIdleResumed(() => {
      console.log("USER ACTIVE AGAIN");

      setShowIdleModal(false);
      setIdleCountdown(20);
    });


    socket.off("timerStarted");
    socket.off("timerStopped");

    socket.on("timerStarted", (data) => {
      console.log("========== TIMER STARTED ==========");
      console.log(data);

      setTimer(data);
      setIsTracking(true);

      window.electronAPI?.startTracking(
        data.project?._id || null,
        data.task?._id || null
      );

      setLastStartedAt(Date.now());

      console.log("isTracking should now be TRUE");
    });

    socket.on("timerStopped", (data) => {
      handlingSleep.current = false;
      setTimer(null);
      setIsTracking(false);
      setDuration(0);

      window.electronAPI?.updateTrackingBar({
        duration: 0,
        isTracking: false,
      });

      setLastStoppedAt(Date.now());

      console.log("Stopped", data);
    });



    return () => {
      socket.off("timerStarted");
      socket.off("timerStopped");
    };
  }, []);

  useEffect(() => {
    if (!isTracking) return;

    const interval = setInterval(async () => {
      if (handlingSleep.current) return;

      const sleep = await window.electronAPI?.getLastSleep();

      if (!sleep) return;

      if (
        effectiveSettings?.tracking?.continueTrackingDuringSleep
      ) {
        console.log("CONTINUING AFTER SLEEP");
        return;
      }

      const allowed =
        (effectiveSettings?.tracking?.sleepBreakHours || 0) * 60 +
        (effectiveSettings?.tracking?.sleepBreakMinutes || 0);

      console.log("ALLOWED:", allowed);

      if (sleep.sleptMinutes > allowed) {
        console.log("WILL STOP TRACKING");
        handlingSleep.current = true;

        console.log("STOPPING AFTER SLEEP");

        stop();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [
    isTracking,
    effectiveSettings,
    stop,
  ]);

  useEffect(() => {
    const removeTrackingBarListener =
      window.electronAPI?.onTrackingBarStop(() => {
        console.log("TRACKING BAR REQUESTED STOP");
        stop();
      });

    return () => {
      removeTrackingBarListener?.();
    };
  }, [stop]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isTracking && timer?.startTime) {
      interval = setInterval(() => {
        const seconds = Math.floor(
          (Date.now() - new Date(timer.startTime).getTime()) / 1000
        );

        setDuration(seconds);

        window.electronAPI?.updateTrackingBar({
          duration: todayWorkSeconds + seconds,
          isTracking,
        });
      }, 1000);
    }

    return () =>
      clearInterval(interval);
  }, [isTracking, timer, todayWorkSeconds]);

  useEffect(() => {
    if (!showIdleModal) return;

    const interval = setInterval(() => {
      setIdleCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);

          setShowIdleModal(false);

          // Automatically stop tracking
          stop();

          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [showIdleModal]);

  const inactivityMinutes =
    effectiveSettings?.tracking?.inactivityMinutes || 3;

  useEffect(() => {
    const checkTodayAttendance = async () => {
      if (!user?._id) return;

      try {
        const { data } = await API.get(
          `/attendance/summary/${user._id}`
        );

        console.log("TODAY ATTENDANCE:", data);

        setFinishedToday(Boolean(data.finishTime));

      } catch (err) {
        console.log("ATTENDANCE CHECK ERROR:", err);

        // If the check fails, don't assume the day is finished.
        setFinishedToday(false);

      } finally {
        setAttendanceChecked(true);
      }
    };

    checkTodayAttendance();
  }, [user]);

  return (
    <TimerContext.Provider
      value={{
        timer,
        isTracking,
        start,
        switchTask,
        stop,
        finishDay,
        duration,
        todayWorkSeconds,
        todayBreakSeconds,
        finishedToday,
        refreshTodayWork,
        lastStartedAt,
        lastStoppedAt,
      }}
    >
      {children}

      {showIdleModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[9999]">
          <div className="bg-[#162742] rounded-xl p-6 w-[420px] shadow-2xl border border-[#2A3D5C]">

            <h2 className="text-xl font-bold text-white">
              Are you still working?
            </h2>

            <p className="text-gray-300 mt-3">
              No keyboard or mouse activity has been detected for{" "}
              {inactivityMinutes} minute
              {inactivityMinutes === 1 ? "" : "s"}.
            </p>

            <p className="text-yellow-400 text-lg font-bold mt-4">
              {idleCountdown}s remaining
            </p>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => {
                  window.electronAPI?.resetIdle();

                  setIdleCountdown(20);
                  setShowIdleModal(false);
                }}
                className="bg-green-600 hover:bg-green-700 px-5 py-2 rounded-lg text-white"
              >
                Yes, I&apos;m Working
              </button>
            </div>

          </div>
        </div>
      )}

    </TimerContext.Provider>
  );
};

//  HOOK

export const useTimer = () => {
  const context = useContext(TimerContext);

  if (!context) {
    throw new Error("useTimer must be used within TimerProvider");
  }

  return context;

};