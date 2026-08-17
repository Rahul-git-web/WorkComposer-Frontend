import { ChartColumn, TrendingUp, Clock } from 'lucide-react';
import { FiCalendar } from "react-icons/fi";

import { useEffect, useState } from "react";
import API from "@/api";

export default function StatsRow() {

    const [stats, setStats] = useState({
        todaySeconds: 0,
        weekSeconds: 0,
        monthSeconds: 0,
        avgDaySeconds: 0,
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await API.get("/sessions/stats");

                setStats(data);
            } catch (err) {
                console.error(err);
            }
        };

        fetchStats();

        const interval = setInterval(fetchStats, 1000);

        return () => clearInterval(interval);
    }, []);


    const formatHours = (seconds: number) => {
        return `${(seconds / 3600).toFixed(1)}h`;
    };

    return (

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mt-3 px-3 ">

            <div className="bg-[#0e1527] rounded-lg p-5 transition-shadow duration-300 hover:shadow-[0_0_20px_rgba(22,163,74,0.25)]">
                <div className="flex items-center gap-2">
                    <ChartColumn className='w-3.5 h-3.5 text-green-600' />
                    <p className="text-gray-400 text-xs font-semibold">
                        LAST 7 DAYS
                    </p>
                </div>

                <h2 className="text-white text-xl font-bold mt-2">
                    {formatHours(stats.weekSeconds)}
                </h2>
            </div>

            <div className="bg-[#0e1527] rounded-lg p-5 transition-shadow duration-300 hover:shadow-[0_0_20px_rgba(37,99,235,0.25)]">
                <div className='flex items-center gap-2'>
                    <FiCalendar className='w-3.5 h-3.5 text-blue-600' />
                    <p className="text-gray-400 text-xs font-semibold">
                        LAST 30 DAYS
                    </p>
                </div>

                <h2 className="text-white text-xl font-bold mt-2">
                    {formatHours(stats.monthSeconds)}
                </h2>
            </div>

            <div className="bg-[#0e1527] rounded-lg p-5 transition-shadow duration-300 hover:shadow-[0_0_20px_rgba(22,163,74,0.25)]">
                <div className='flex items-center gap-2'>
                    <TrendingUp className='w-3.5 h-3.5 text-green-600' />
                    <p className="text-gray-400 text-xs font-semibold">
                        AVG/DAY
                    </p>
                </div>

                <h2 className="text-white text-xl font-bold mt-2">
                    {formatHours(stats.avgDaySeconds)}
                </h2>
            </div>

            <div className="bg-[#0e1527] rounded-lg p-5 transition-shadow duration-300 hover:shadow-[0_0_20px_rgba(168,85,247,0.25)]">
                <div className='flex items-center gap-2'>
                    <Clock className='w-3.5 h-3.5 text-purple-500' />
                    <p className="text-gray-400 text-xs font-semibold">
                        TODAY
                    </p>
                </div>

                <h2 className="text-white text-xl font-bold mt-2">
                    {formatHours(stats.todaySeconds)}
                </h2>
            </div>

        </div>
    )
}