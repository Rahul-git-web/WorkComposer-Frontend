"use client";

import { useEffect, useState } from "react";
import { LuCoffee } from "react-icons/lu";
import { Clock } from "lucide-react";
import { FiActivity } from "react-icons/fi";
import API from "@/api";

export default function TodaySummaryCard() {
    const [summary, setSummary] = useState({
        assignedTasks: 0,
        workedTasks: 0,
        taskWorkSeconds: 0,
        breakSeconds: 0,
        activityPercent: 0,
    });

    useEffect(() => {
        const fetchSummary = async () => {
            try {
                const { data } = await API.get(
                    "/sessions/today-task-summary"
                );

                setSummary(data);
            } catch (err) {
                console.error("TODAY SUMMARY ERROR:", err);
            }
        };

        fetchSummary();

        const interval = setInterval(fetchSummary, 30000);

        return () => clearInterval(interval);
    }, []);

 const formatTime = (seconds: number) => {
    if (seconds < 60) {
        return `${seconds}s`;
    }

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
        return `${hours}h ${minutes}m`;
    }

    return `${minutes}m`;
};

    return (
        <div>
            <h2 className="text-white text-sm font-semibold mb-3">
                TODAY&apos;S SUMMARY
            </h2>

            <div className="grid grid-cols-2 gap-3">

                {/* TASKS */}
                <div className="bg-[#101B2D] rounded-xl p-3 transition-shadow duration-300 hover:shadow-[0_0_18px_rgba(34,197,94,0.25)]">
                    <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-green-500" />

                        <p className="text-gray-400 text-xs">
                            TASKS
                        </p>
                    </div>

                    <h2 className="text-white text-xl font-bold mt-2">
                        {summary.workedTasks}
                    </h2>

                    <p className="text-gray-500 text-[10px] mt-1">
                        {summary.assignedTasks} assigned
                    </p>
                </div>

                {/* BREAKS */}
                <div className="bg-[#101B2D] rounded-lg p-3 transition-shadow duration-300 hover:shadow-[0_0_18px_rgba(234,179,8,0.25)]">
                    <div className="flex items-center gap-1">
                        <LuCoffee className="h-3 w-3 text-yellow-500" />

                        <p className="text-gray-400 text-xs">
                            BREAKS
                        </p>
                    </div>

                    <h2 className="text-white text-xl font-bold mt-2">
                        {formatTime(summary.breakSeconds)}
                    </h2>
                </div>
            </div>

            {/* ACTIVITY */}
            <div className="mt-4 bg-[#3A2B22] border border-[#574131] rounded-lg p-3 flex justify-between text-xs transition-shadow duration-300 hover:shadow-[0_0_18px_rgba(234,179,8,0.25)]">
                <div className="flex items-center gap-2">
                    <FiActivity className="h-3.5 w-3.5 text-yellow-500" />

                    <span className="text-gray-300">
                        Activity Level
                    </span>
                </div>

                <span className="text-white font-bold text-xs">
                    {summary.activityPercent}%
                </span>
            </div>

            {/* TASK WORK TIME */}
            <div className="mt-2 text-gray-500 text-[10px]">
                Task work time:{" "}
                <span className="text-gray-300">
                    {formatTime(summary.taskWorkSeconds)}
                </span>
            </div>
        </div>
    );
}