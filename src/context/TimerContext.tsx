"use client";
import {
  createContext,
  useContext,
  useState,
} from "react";

import type { ReactNode } from "react";

import API from "@/api";

/*TYPES */

type TimerContextType = {
  isTracking: boolean;
  isPaused: boolean;
  start: () => void;
  stop: () => Promise<void>;
  pause: () => void;
  resume: () => void;
  duration: number;
};

type Props = {
  children: ReactNode;
};

/* CONTEXT */

const TimerContext = createContext<TimerContextType | null>(null);

/* PROVIDER */

export const TimerProvider = ({ children }: Props) => {
  const [isTracking, setIsTracking] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [totalDuration, setTotalDuration] = useState<number>(0);
  const [sessionStart, setSessionStart] = useState<Date | null>(null);

  // START
  const start = () => {
    if (isTracking) return;
    const now = new Date();
    setIsTracking(true);
    setIsPaused(false);
    setStartTime(now);
    setSessionStart(now);
  };

  // PAUSE
  const pause = () => {
    if (!startTime) return;

    const now = new Date();
    const diff = Math.floor((now.getTime() - startTime.getTime()) / 1000);

    setTotalDuration((prev) => prev + diff);
    setIsTracking(false);
    setIsPaused(true);
    setStartTime(null);
  };

  // RESUME
  const resume = () => {
    if (!isPaused) return;

    setIsTracking(true);
    setIsPaused(false);
    setStartTime(new Date());
  };

  // STOP
  const stop = async () => {
    if (!isTracking && !isPaused) return;

    let finalDuration = totalDuration;

    if (startTime) {
      const now = new Date();
      const diff = Math.floor(
        (now.getTime() - startTime.getTime()) / 1000
      );
      finalDuration += diff;
    }

    setTotalDuration(finalDuration);
    setIsTracking(false);
    setIsPaused(false);

    try {
      await API.post("/sessions/create", {
        startTime: sessionStart,
        endTime: new Date(),
        duration: finalDuration,
        date: new Date().toISOString().split("T")[0]!,
        team: "Default team",
        type: "work", // important for consistency
      });
    } catch (err) {
      console.log("Save failed", err);
    }

    // reset
    setStartTime(null);
    setTotalDuration(0);
    setSessionStart(null);
  };

  // LIVE DURATION
  const duration: number =
    isTracking && startTime
      ? totalDuration +
        Math.floor(
          (new Date().getTime() - startTime.getTime()) / 1000
        )
      : totalDuration;

  return (
    <TimerContext.Provider
      value={{
        isTracking,
        isPaused,
        start,
        stop,
        pause,
        resume,
        duration,
      }}
    >
      {children}
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