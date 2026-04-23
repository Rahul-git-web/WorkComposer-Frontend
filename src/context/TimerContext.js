"use client";
import { createContext, useContext, useState, useRef, useEffect } from "react";

const TimerContext = createContext();

export const TimerProvider = ({ children }) => {
  const [isTracking, setIsTracking] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const intervalRef = useRef(null);

  const start = () => {
    if (isTracking) return;

    setIsTracking(true);
    intervalRef.current = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);
  };

  const stop = () => {
    clearInterval(intervalRef.current);
    setIsTracking(false);
  };

  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);

  return (
    <TimerContext.Provider
      value={{
        isTracking,
        seconds,
        start,
        stop,
      }}
    >
      {children}
    </TimerContext.Provider>
  );
};

export const useTimer = () => useContext(TimerContext);