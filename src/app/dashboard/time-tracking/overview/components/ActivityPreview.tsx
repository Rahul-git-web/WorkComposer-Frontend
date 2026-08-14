"use client";

import { BiExpand } from "react-icons/bi";
import { BsBarChart } from "react-icons/bs";
import ActivityChart from "./ActivityChart";
import { useEffect, useState } from "react";
import ActivityDetailsModal from "./ActivityDetailsModal";
import API from "@/api";
import { useAppTimezone } from "@/hooks/useAppTimezone";
import { formatDateForApi } from "@/utils/appTimezone";

type Props = {
    userId: string;
    selectedDate: Date;
    workTime: string;
    userName: string;
    onLoaded?: (hasData: boolean) => void;
};

export default function ActivityPreview({
    userId,
    selectedDate,
    workTime,
    userName,
    onLoaded,
}: Props) {

    const timezone = useAppTimezone();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activityData, setActivityData] = useState<
        {
            time: string;
            value: number;
            color?: string;
        }[]>
        ([]);
    const [activityScore, setActivityScore] = useState(0);
    const [idleTime, setIdleTime] = useState(0);

    useEffect(() => {
        const fetchActivity = async () => {
            try {
                const date = formatDateForApi(selectedDate, timezone);

                const res = await API.get(
                    `/activity/${userId}?date=${date}`
                );

                setActivityData(res.data.activity);
                setActivityScore(res.data.activityScore);
                setIdleTime(res.data.idleTime);

                const hasData = Array.isArray(res.data.activity)
                    ? res.data.activity.some((item: any) => item.value > 0)
                    : false;

                onLoaded?.(hasData);
            } catch (err) {
                console.error(err);
                onLoaded?.(false);
            }
        };

        fetchActivity();
    }, [userId, selectedDate, timezone]);

    const hasActivityData = activityData.some(
        (item) => item.value > 0
    );

    return (
        <div className="w-full min-w-0">

            <div className="flex items-center justify-between mb-1">
                <h3 className="text-lg font-semibold text-gray-900 whitespace-nowrap">
                    Activity Levels
                </h3>

                <button
                    type="button"
                    title="View details"
                    onClick={() =>
                        setIsModalOpen(true)
                    }
                    className="text-xs font-semibold cursor-pointer text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded px-2 py-1 shadow-sm">
                    View Details
                </button>
            </div>

            <div className="bg-white rounded-lg p-1.5 h-[125px]">

                {/* Score */}
                {hasActivityData ? (
                    <div className="mb-1">

                        <div className="flex items-center justify-between text-sm mb-0.5">

                            <div className="flex items-center">
                                <span className="font-medium text-gray-700">
                                    Activity Score:
                                </span>

                                <span className="ml-2 px-2 py-0.5 rounded-full text-sm font-semibold bg-yellow-100 text-yellow-800">
                                    {activityScore}%
                                </span>
                            </div>

                            <span className="text-xs text-gray-500">
                                {idleTime}% idle time
                            </span>
                        </div>

                        {/* Progress */}
                        <div className="flex-1 cursor-pointer group relative">

                            <div
                                className="h-3 rounded-full bg-gray-200 overflow-hidden relative"
                                title="Click to see detailed activity chart"
                            >
                                <div
                                    className="h-full rounded-full transition-all duration-300 group-hover:opacity-90"
                                    style={{
                                        width: `${activityScore}%`,
                                        backgroundColor:
                                            activityScore < 40
                                                ? "#EF4444"
                                                : activityScore < 70
                                                    ? "#F59E0B"
                                                    : "#22C55E",
                                    }}
                                />
                            </div>

                            <div className="flex justify-between mt-0.5 text-xs text-gray-500">
                                <span>Low</span>
                                <span>Medium</span>
                                <span>High</span>
                            </div>

                        </div>
                    </div>

                ) : (
                    <div className="mb-3">
                        <div className="flex items-center justify-between text-sm">
                            <span className="font-medium text-gray-500">
                                Activity Status
                            </span>

                            <span className="px-2 py-1 text-xs font-medium rounded-md bg-gray-100 text-gray-500">
                                No activity recorded
                            </span>
                        </div>
                    </div>
                )}

                {/* Chart */}
                <div className="h-[90px] relative">
                    {hasActivityData ? (
                        <>
                            <ActivityChart data={activityData} />

                            <button
                                type="button"
                                onClick={() => setIsModalOpen(true)}
                                className="absolute top-0 right-0 p-1 bg-white/70 rounded-md hover:bg-white shadow-sm group"
                                aria-label="View activity details"
                                title="View activity details"
                            >
                                <BiExpand className="w-4 h-4 text-indigo-500" />
                            </button>
                        </>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-200 bg-gray-50">
                            <BsBarChart className="w-6 h-6 text-gray-300 mb-2" />

                            <p className="text-sm font-medium text-gray-500">
                                No activity data
                            </p>

                            <p className="text-xs text-gray-400 mt-1">
                                No activity recorded for the selected date
                            </p>
                        </div>
                    )}
                </div>
            </div>

            <ActivityDetailsModal
                isOpen={isModalOpen}
                onClose={() =>
                    setIsModalOpen(false)}
                activityData={activityData}
                selectedDate={selectedDate}
                workTime={workTime}
                userName={userName}
            />
        </div>
    );
}