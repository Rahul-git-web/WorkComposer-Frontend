"use client"
import { useState } from "react";

import { ChevronLeft, ChevronRight, RefreshCw } from "lucide-react";

export default function DateControls({ date, setDate }) {

const formatDate = (d) =>
  d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const handlePrev = () => {
  const newDate = new Date(date);
  newDate.setDate(date.getDate() - 1);
  setDate(newDate);
};


const handleNext = () => {
  const newDate = new Date(date);
  newDate.setDate(date.getDate() + 1);
  setDate(newDate);
};

const handleToday = () => {
  setDate(new Date());
};

  return (
    <div className="flex items-center gap-3 ml-auto relative">
      <div className="relative inline-block">
        <div className="flex items-center gap-3">
          <button onClick={handleToday}
           className="text-sm font-semibold text-slate-800 bg-white border border-slate-200 rounded-lg shadow-sm px-4 py-2 ring-1 ring-slate-100 hover:shadow-md hover:border-slate-300 hover:bg-slate-500 transition-all duration-200 cursor-pointer">
            Today
          </button>
          <button onClick={handlePrev}
            className="text-slate-600 hover:text-slate-800 p-2 rounded-lg hover:bg-white hover:shadow-sm transition-all duration-200 cursor-pointer font-medium"
            title="Previous"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button className="flex cursor-pointer font-medium items-center gap-2 bg-white border border-slate-200 rounded-lg px-4 py-2 text-sm text-slate-800 shadow-sm hover:shadow-md hover:border-slate-300 hover:bg-slate-50 transition-all duration-200 ring-1 ring-slate-100">
            <span className="font-semibold">{formatDate(date)}</span>
            <ChevronRight onClick={handleNext} 
            className="w-4 h-4 text-slate-500 transition-transform duration-200" />
          </button>

          <button
            className="text-slate-600 cursor-pointer font-medium hover:text-slate-800 p-2 rounded-lg hover:bg-white hover:shadow-sm transition-all duration-200"
            title="Next"
          >
            <ChevronRight onClick={handleNext} 
             className="w-4 h-4" />
          </button>
        </div>
      </div>

      <button className="cursor-pointer inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-500 hover:text-indigo-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500">
        <RefreshCw className="w-5 h-5" />
      </button>
    </div>
  );
}