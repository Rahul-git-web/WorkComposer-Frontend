"use client";

import Image from "next/image";
import logo from "@/assets/logo.W.png";
import { IoIosPause } from "react-icons/io";
import { FaRegEdit } from "react-icons/fa";
import { Clock3 } from "lucide-react";
import { FiPlusCircle, FiMinusCircle } from "react-icons/fi";
import { useTimer } from "@/context/TimerContext";
import { useState, useRef, useEffect } from "react";

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

type Props = {
  data?: DataItem[];
  onAddManualTime: () => void;
  onRemoveTime: () => void;
};

export default function OverviewContent({
  data = [],
  onAddManualTime,
  onRemoveTime,
}: Props) {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const { isTracking } = useTimer();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node)
      ) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className="min-h-[calc(100vh-250)] rounded-b-lg bg-white shadow-sm border border-r border-b border-gray-200">
      <div className="divide-y divide-gray-200 overflow-visible bg-white">

        {/* Header */}
        <div className="px-3 py-2 sm:px-5 bg-white shadow-sm border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <h2 className="text-lg font-bold text-gray-800">Overview</h2>
          </div>
        </div>

        {/* Content */}
        <div className="px-2 py-4 sm:px-4">

          {/* EMPTY STATE */}
          {data.length === 0 ? (
            <div className="text-center my-8 py-6 px-4 bg-gray-50 rounded-lg border border-gray-100">
              <Clock3 className="w-10 h-10 mx-auto text-gray-300 mb-2" />
              <h4 className="text-gray-600 font-medium mb-1">
                No tracking data available
              </h4>
              <p className="text-gray-400 text-sm">
                Tracking information will be displayed here once activity is recorded.
              </p>
            </div>
          ) : (
            data.map((item) => (
              <div
                key={item.id}
                className="p-4 mb-4 relative border border-gray-100 rounded-lg hover:bg-gray-50 hover:shadow-sm transition-all duration-200"
              >
                <div className="flex flex-col md:flex-row gap-4 items-start md:items-center rounded-lg p-2 -m-2">

                  {/* Avatar */}
                  <div className="relative shrink-0 mx-auto md:mx-0 mb-4 md:mb-0">
                    <div className="profile-image-container group relative w-12 h-12">
                      <div
                        className={`absolute inset-0 rounded-full p-0.5 ${item.status?.includes("running")
                            ? "bg-linear-to-tr from-green-300 to-green-600"
                            : "bg-linear-to-tr from-red-300 to-red-600"
                          } opacity-80`}
                      >
                        <div className="absolute inset-px rounded-full bg-white"></div>
                      </div>

                      <div className="relative w-full h-full transform group-hover:scale-105 transition-transform duration-300">
                        <Image
                          src={logo}
                          alt="Arena Z"
                          className="h-full w-full cursor-pointer rounded-full object-cover shadow-md transition-all duration-300 group-hover:shadow-lg"
                        />
                        <div className="absolute inset-0 rounded-full bg-blue-500 opacity-0 group-hover:opacity-5 transition-all duration-300 cursor-pointer"></div>
                      </div>
                    </div>
                  </div>

                  {/* User Info */}
                  <div className="flex-1 min-w-0 w-full md:w-1/2">
                    <h3 className="text-blue-700 font-bold text-lg truncate max-w-xs">
                      {item.name}
                    </h3>

                    <div className="mt-1 text-sm flex items-center flex-wrap gap-2">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-md ${item.status?.includes("running")
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                          }`}
                      >
                        {item.status || "Tracking stopped"}
                      </span>

                      <span className="text-gray-400">•</span>

                      <span className="text-gray-700">
                        <b>Last sync: </b>
                        <span className="text-gray-600">
                          {item.lastSync || "--"}
                        </span>
                      </span>
                    </div>
                  </div>

                  {/* Work + Break */}
                  <div className="flex flex-row items-start gap-3 text-sm w-full md:w-1/2">

                    {/* Work */}
                    <div className="w-1/2">
                      <div className="flex items-center mb-1">
                        <Clock3 className="w-5 h-5 mr-2 text-indigo-600" />
                        <span className="text-sm font-medium text-gray-700 uppercase">
                          Work Time
                        </span>
                      </div>
                      <div className="text-blue-600 font-bold text-xl ml-7">
                        {item.workTime || "0h 0m"}
                      </div>
                    </div>

                    {/* Break */}
                    <div className="w-1/2">
                      <div className="flex items-center mb-1">
                        <IoIosPause className="w-5 h-5 mr-2 text-orange-500" />
                        <span className="text-sm font-medium text-gray-700 uppercase">
                          Break Time
                        </span>
                      </div>
                      <div className="text-orange-600 font-bold text-xl ml-7">
                        {item.breakTime || "0h 0m"}
                      </div>
                    </div>

                    {/* Edit */}
                    <div className="ml-auto relative" ref={menuRef}>
                      <button
                        onClick={() =>
                          setOpenMenuId(
                            openMenuId === item.id ? null : item.id
                          )
                        }
                        className="flex items-center px-3 py-2 hover:bg-indigo-100 rounded-md"
                      >
                        <FaRegEdit className="w-5 h-5 text-indigo-500 mr-2" />
                        <span className="text-sm font-medium text-indigo-600">
                          Edit time
                        </span>
                      </button>

                      {openMenuId === item.id && (
                        <div className="absolute right-0 mt-2 w-50 bg-white shadow-xl rounded-md z-50 py-2">

                          <div className="px-4 pb-2 text-xs font-semibold text-gray-400 uppercase">
                            Time Options
                          </div>

                          <div
                            onClick={() => {
                              setOpenMenuId(null);
                              onAddManualTime();
                            }}
                            className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 cursor-pointer"
                          >
                            <FiPlusCircle className="text-green-600" />
                            Add Manual Time
                          </div>

                          <div
                            onClick={() => {
                              setOpenMenuId(null);
                              onRemoveTime();
                            }}
                            className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 cursor-pointer"
                          >
                            <FiMinusCircle className="text-red-600" />
                            Remove Time
                          </div>
                        </div>
                      )}
                    </div>

                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}