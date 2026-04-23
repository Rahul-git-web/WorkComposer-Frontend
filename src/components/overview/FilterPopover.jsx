"use client";
import { useState } from "react";

import { X, Search, Check } from "lucide-react";
import { MdKeyboardArrowDown } from "react-icons/md";

export default function FilterPopover({
  selectedTeams,
  setSelectedTeams,
  setOpen,
}) {
  const [teamOpen, setTeamOpen] = useState(false);

  const teams = ["Default team"];

  const toggleTeam = (team) => {
    if (selectedTeams.includes(team)) {
      setSelectedTeams(selectedTeams.filter((t) => t !== team));
    } else {
      setSelectedTeams([...selectedTeams, team]);
    }
  };

  return (
    <div className="absolute top-full left-0 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-20 w-[400px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-gray-900">Filter Options</h3>
        <button
          onClick={() => setOpen(false)}
          className="p-1 hover:bg-gray-100 rounded"
        >
          <X className="h-4 w-4 text-gray-500" />
        </button>
      </div>

      {/* Select Users */}
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        Select Users
      </label>
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 z-10" />
        <input
          type="text"
          placeholder="Search and select users..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Teams */}
      <div className="flex flex-col mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Teams
        </label>

        {/* Selected Chips */}
        {selectedTeams.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            <div
              onClick={(e) => {
                e.stopPropagation();
                setSelectedTeams([]);
              }}
              className={`px-3 py-2 text-sm cursor-pointer ${
                selectedTeams.length === 0
                  ? "bg-blue-50 text-blue-600 font-medium"
                  : "hover:bg-gray-100"
              }`}
            >
              All Teams
            </div>

            {selectedTeams.map((team) => (
              <div
                key={team}
                className="flex items-center gap-1 bg-blue-100 text-blue-700 px-2 py-1 rounded-md text-xs"
              >
                {team}
                <button onClick={() => toggleTeam(team)}>
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        {selectedTeams.length > 0 && (
          <button
            onClick={() => setSelectedTeams([])}
            className="text-sm text-gray-500 hover:text-gray-700"
          ></button>
        )}

        <div className="relative" onClick={(e) => e.stopPropagation()}>
          {/* Button */}
          <button
            onClick={() => setTeamOpen(!teamOpen)}
            className="w-full flex items-center justify-between px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
          >
            <span className="text-gray-700">
              {selectedTeams.length > 0
                ? `${selectedTeams.length} selected`
                : "All Teams"}
            </span>
            <MdKeyboardArrowDown className="w-4 h-4 text-gray-500" />
          </button>

          {/* Dropdown */}
          {teamOpen && (
            <div className="absolute mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-md z-30">
              {/* Default team */}
              {teams.map((team) => (
                <div
                  key={team}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleTeam(team);
                  }}
                  className="px-3 py-2 text-sm cursor-pointer flex justify-between items-center hover:bg-gray-100"
                >
                  <span>{team}</span>

                  {selectedTeams.includes(team) && (
                    <Check className="w-4 h-4 text-blue-600" />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Sort By & Order */}
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Sort By
          </label>
          <div className="relative">
            <select className="w-full appearance-none pl-3 pr-9 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer bg-white">
              <option value="name">Name</option>
              <option value="team">Team</option>
              <option value="externalId">External ID</option>
              <option value="trackingStatus">Tracking Status</option>
            </select>
            <MdKeyboardArrowDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
          </div>
        </div>

        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Order
          </label>
          <div className="relative">
            <select className="w-full appearance-none pl-3 pr-9 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer bg-white">
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
            <MdKeyboardArrowDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
          </div>
        </div>
      </div>
    </div>
  );
}
