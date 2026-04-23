"use client";
import { useState, useRef, useEffect } from "react";

import { HiUsers } from "react-icons/hi2";
import { MdKeyboardArrowDown } from "react-icons/md";
import { HiOfficeBuilding } from "react-icons/hi";
import FilterPopover from "./FilterPopover";
import DateControls from "./DateControls";

export default function OverviewHeader({ date, setDate }) {
  // const [date, setDate] = useState(new Date());
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedTeams, setSelectedTeams] = useState([]);
  const [open, setOpen] = useState(false);
  const ref = useRef();

  useEffect(() => {
  const interval = setInterval(() => {
    setCurrentTime(new Date());
  }, 1000);

  return () => clearInterval(interval);
}, []);

const formatDateTime = (date) => {
  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className="w-full">
      {/* Top Info */}
      <div className="mb-1 flex justify-end">
        <div className="text-xs text-gray-500">
         <span>Report generated: {formatDateTime(currentTime)}</span>
          <span className="ml-2">•</span>
          <span className="ml-2">Timezone: Asia/Calcutta (UTC+05:30)</span>
        </div>
      </div>

      {/* Header */}
      <div className="relative flex flex-wrap items-center justify-between gap-4 bg-gray-50 px-4 py-3 border border-r border-t border-gray-200 sm:px-6 lg:px-8 rounded-t-md">
        {/* Left Section */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex items-center" ref={ref}>
            {/* Main Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setOpen(!open);
              }}
              className="flex items-center gap-2.5 px-3.5 py-2 border border-gray-300 rounded-lg text-sm hover:bg-white hover:border-gray-400 transition-colors bg-white"
            >
              {selectedTeams.length > 0 ? (
                <HiOfficeBuilding className="w-4 h-4 text-gray-600" />
              ) : (
                <HiUsers className="w-4 h-4 text-gray-600" />
              )}

              {/* TEXT UI (NOT CHIPS) */}
              <div className="flex items-center gap-2 max-w-[250px]">
                {selectedTeams.length > 0 ? (
                  <>
                    <span className="font-medium text-gray-900">
                      {selectedTeams[0]}
                    </span>

                    <span className="text-gray-400">•</span>

                    <span className="text-gray-500 text-sm">
                      {selectedTeams.length} selected
                    </span>
                  </>
                ) : (
                  <span className="text-gray-900">All Users & Teams</span>
                )}
              </div>

              <MdKeyboardArrowDown className="w-4 h-4 text-gray-400 ml-1" />
            </button>

            {/* Clear Button (outside main button) */}
            {selectedTeams.length > 0 && (
              <button
                onClick={() => setSelectedTeams([])}
                className="text-sm text-gray-500 hover:text-gray-700 ml-3"
              >
                Clear
              </button>
            )}

            {/* Popover */}
            {open && (
              <div
                className="absolute top-full left-0 mt-2"
                onClick={(e) => e.stopPropagation()}
              >
                <FilterPopover
                  selectedTeams={selectedTeams}
                  setSelectedTeams={setSelectedTeams}
                  setOpen={setOpen}
                />
              </div>
            )}
          </div>
        </div>

        {/* Right Section */}
       <DateControls date={date} setDate={setDate} />
      </div>
    </div>
  );
}
