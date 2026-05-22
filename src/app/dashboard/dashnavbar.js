"use client";

import { useState, useRef, useEffect } from "react";
import { useTimer } from "@/context/TimerContext";
import { FaUsers } from "react-icons/fa";
import { IoIosPause } from "react-icons/io";
import { usePathname, useRouter } from "next/navigation";
import API from "@/api";
import {
  Clock3,
  ChevronDown,
  Settings,
  Play,
  Check,
} from "lucide-react";
import { HiOutlineInboxStack } from "react-icons/hi2";
import { HiOutlineEnvelopeOpen } from "react-icons/hi2";

const DashNavbar = ({ user, setTrackedSeconds }) => {
  const [appOpen, setAppOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const appRef = useRef(null);
  const profileRef = useRef(null);

  const router = useRouter();
  const pathname = usePathname();

  const currentApp = pathname.startsWith("/dashboard/user-management")
    ? "User Management"
    : pathname.startsWith("/dashboard/task-management")
      ? "Task Management"
      : "Time Tracking";

  const handleLogout = async () => {
    try {
      await API.post("/auth/logout");
      router.push("/authenticate/login");
    } catch (err) {
      console.log("Logout failed", err);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (appRef.current && !appRef.current.contains(e.target)) {
        setAppOpen(false);
      }

      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const avatarLetter = user?.email?.charAt(0).toUpperCase() || "U";

  const { isTracking, isPaused, start, stop, pause, resume } = useTimer();

  const handleTracking = () => {
    if (isTracking || isPaused) {
      stop();
    } else {
      start();
    }
  };

  return (
    <header className="sticky top-0 z-10 bg-white border-b border-gray-200">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* LEFT */}
        <div className="flex items-center gap-x-2 sm:gap-x-4">
          {/* Dropdown */}
          <div className="relative" ref={appRef}>
            <div className="flex items-center">
              <button
                onClick={() => setAppOpen(!appOpen)}
                className="flex items-center px-3 py-2 rounded bg-indigo-50 hover:bg-indigo-100 text-gray-800 border-r border-indigo-200 shadow-sm"
              >
                <Clock3 className="w-5 h-5 mr-2 text-indigo-600" />
                <span className="text-sm font-semibold text-indigo-900 hidden sm:inline">
                  {currentApp}
                </span>
              </button>

              <button
                onClick={() => setAppOpen(!appOpen)}
                className="p-2 rounded-r bg-indigo-50 hover:bg-indigo-100 text-gray-600"
              >
                <ChevronDown className="w-5 h-5" />
              </button>
            </div>

            {/* Dropdown Menu */}
            {appOpen && (
              <div className="absolute mt-2 w-72 bg-[#020617] text-white rounded-xl shadow-lg p-4 z-50">
                <p className="text-sm text-gray-400 mb-2">Apps</p>

                <div className="bg-gray-800 rounded-lg p-2 space-y-2">
                  <div
                    onClick={() => {
                      router.push("/dashboard/time-tracking/overview");
                      setAppOpen(false);
                    }}
                    className="flex items-center justify-between p-2 hover:bg-gray-700 rounded cursor-pointer"
                  >
                    <span>Time Tracking</span>
                    {pathname.startsWith(
                      "/dashboard/time-tracking/overview",
                    ) && <Check className="w-4 h-4 text-gray-400 ml-auto" />}
                  </div>

                  <div
                    onClick={() => {
                      router.push("/dashboard/task-management");
                      setAppOpen(false);
                    }}
                    className="flex items-center justify-between p-2 hover:bg-gray-700 rounded cursor-pointer"
                  >
                    <span>Task Management</span>

                    {pathname.startsWith("/dashboard/task-management") && (
                      <Check className="w-4 h-4 text-green-400 ml-auto" />
                    )}
                  </div>
                </div>

                <p className="text-sm text-gray-400 mt-4 mb-2">Configuration</p>

                <div className="space-y-2">
                  <div
                    onClick={() => {
                      router.push("/dashboard/user-management");
                      setAppOpen(false);
                    }}
                    className="flex items-center justify-between p-2 hover:bg-gray-700 rounded cursor-pointer"
                  >
                    <span>User Management</span>

                    {pathname.startsWith("dashboard/user-management") && (
                      <Check className="w-4 h-4 text-green-400 ml-auto" />
                    )}
                  </div>

                  <div className="p-2 hover:bg-gray-700 rounded cursor-pointer">
                    Settings
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Users */}
          <button className="flex items-center gap-2 px-3 py-2 bg-indigo-50 hover:bg-indigo-100 rounded text-sm font-semibold">
            <FaUsers className="text-indigo-600" />
            <span className="hidden sm:inline">Users</span>
          </button>

          {/* Settings */}
          <button className="flex items-center gap-2 px-3 py-2 bg-indigo-50 hover:bg-indigo-100 rounded text-sm font-semibold">
            <Settings className="text-indigo-600 w-5 h-5" />
            <span className="hidden sm:inline">Settings</span>
          </button>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-x-2 sm:gap-x-4">
          {/* Start Tracking */}
          <button
            onClick={handleTracking}
            className={`flex items-center px-3 py-2 rounded text-sm font-semibold ${
              isTracking || isPaused
                ? "bg-red-600 hover:bg-red-700"
                : "bg-indigo-600 hover:bg-indigo-700"
            } text-white`}
          >
            <Play className="w-4 h-4" />
            <span className="ml-2 hidden sm:inline">
              {isTracking || isPaused ? "Stop tracking" : "Start tracking"}
            </span>
          </button>

          {/* PAUSE / RESUME */}
          {(isTracking || isPaused) && (
            <button
              onClick={isTracking ? pause : resume}
              className="flex items-center px-3 py-2 rounded text-sm font-semibold bg-yellow-500 hover:bg-yellow-600 text-white"
            >
              {isTracking ? (
                <>
                  <IoIosPause className="w-4 h-4" />
                  <span className="ml-2 hidden sm:inline">Pause</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  <span className="ml-2 hidden sm:inline">Resume</span>
                </>
              )}
            </button>
          )}

          <HiOutlineEnvelopeOpen className="w-6 h-6 text-gray-500 hover:text-gray-700 cursor-pointer" />

          <HiOutlineInboxStack className="w-6 h-6 text-gray-500 hover:text-gray-700 cursor-pointer" />

          {/* // User Profile */}

          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 cursor-pointer"
            >
              <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white text-sm font-bold">
                {avatarLetter}
              </div>

              <span className="text-sm text-gray-700 hidden md:block">
                {user?.email || "user@example.com"}
              </span>

              <ChevronDown className="w-4 h-4 text-gray-500" />
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-2 w-64 sm:w-72 bg-[#020617] text-white rounded-xl shadow-lg p-4 z-50">
                {/* Organization */}
                <div className="mb-3">
                  <p className="text-sm text-white font-medium">Organization</p>
                  <p className="text-xs text-gray-400 font-sm">
                    {user?.organization || "XYZ"}
                  </p>
                </div>

                {/* Account */}
                <div className="mb-3">
                  <p className="text-sm text-white font-medium">Account</p>
                  <p className="text-xs text-gray-400 font-sm">{user?.email}</p>
                </div>

                {/* Role */}
                <div className="mb-4">
                  <p className="text-sm text-white font-medium">Role</p>
                  <p className="text-xs text-gray-400 font-sm">
                    {user?.role || "Owner"}
                  </p>
                </div>

                {/* Sign out */}
                <div
                  className="border-t border-gray-100 mt-2 hover:bg-gray-900 py-2 rounded-md"
                  role="none"
                >
                  <button
                    onClick={handleLogout}
                    className="w-full text-left text-red-600 text-sm cursor-pointer min-h-10"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashNavbar;
