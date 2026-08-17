import { Clock } from 'lucide-react';

import { useEffect, useState } from "react";
import API from "@/api";

export default function WorkTimeTrackingCard() {

    const [stats, setStats] = useState({
        todaySeconds: 0,
        weekSeconds: 0,
        monthSeconds: 0,
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

    const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;

        return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    };

    return (
        <div className="bg-[#17253D] rounded-xl p-5 h-[220px] transition-shadow duration-300 hover:shadow-[0_0_25px_rgba(59,130,246,0.25)]">
            <div className='flex items-center gap-3 '>
                <div className="w-9 h-9 bg-blue-500 rounded-lg mb-3 flex items-center justify-center shadow-[0_0_12px_rgba(59,130,246,0.6)]">
                    <Clock className='w-4 h-4 text-white' />
                </div>
                <h3 className="text-gray-400 font-semibold mb-4 text-xs">
                    WORK TIME TRACKING
                </h3>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#101B2D] rounded-xl p-3">
                    <p className="text-gray-400 text-xs">TODAY</p>

                    <h2 className="text-white text-xl font-bold mt-2">
                        {formatTime(stats.todaySeconds)}
                    </h2>
                </div>

                <div className="bg-[#101B2D] rounded-xl p-3">
                    <p className="text-gray-400 text-xs">THIS WEEK</p>

                    <h2 className="text-blue-400 text-xl font-bold mt-2">
                        {formatTime(stats.weekSeconds)}
                    </h2>
                </div>
            </div>

            <div className="mt-4 bg-[#263452] rounded-lg p-3 flex justify-between text-xs font-semibold">
                <span className="text-gray-300">
                    This Month
                </span>

                <span className="text-white font-bold">
                    {formatTime(stats.monthSeconds)}
                </span>
            </div>
        </div>
    );
}