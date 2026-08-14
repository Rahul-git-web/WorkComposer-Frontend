"use client";

import { useState, useEffect } from "react";
import TopAppsPreview from "./TopAppsPreview";
import ActivityPreview from "./ActivityPreview";
import ScreenshotPreview from "./ScreenshotPreview";
import { useDashboard } from "@/context/DashboardContext";
import { Clock3 } from "lucide-react";

type Props = {
    userId: string;
    selectedDate: Date;
    workTime: string;
    userName: string;
};

export default function UserAnalyticsSection({
    userId,
    selectedDate,
    workTime,
    userName,
}: Props) {
    const { user } = useDashboard();

    const canViewScreenshots = user?.screenshotAccess !== "none";

    const [screenshotsHasData, setScreenshotsHasData] = useState<boolean | null>(null);
    const [appsHasData, setAppsHasData] = useState<boolean | null>(null);
    const [activityHasData, setActivityHasData] = useState<boolean | null>(null);

    // Reset the "loaded" signals whenever the user/date changes,
    // so we don't briefly show stale empty-state from a previous card
    useEffect(() => {
        setScreenshotsHasData(null);
        setAppsHasData(null);
        setActivityHasData(null);
    }, [userId, selectedDate]);

    const allLoaded =
        (canViewScreenshots ? screenshotsHasData !== null : true) &&
        appsHasData !== null &&
        activityHasData !== null;

    const allEmpty =
        allLoaded &&
        !screenshotsHasData &&
        !appsHasData &&
        !activityHasData;

    if (allEmpty) {
        return (
            <div className="flex flex-col items-center justify-center py-8 mt-1 text-center border border-dashed border-gray-200 rounded-lg bg-gray-50">
                <Clock3 className="w-8 h-8 text-gray-300 mb-2" />
                <p className="text-sm font-medium text-gray-500">
                    No activity recorded for this day
                </p>
            </div>
        );
    }

    return (
        <div
            className={`grid gap-6 mt-1 ${canViewScreenshots
                    ? "grid-cols-1 xl:grid-cols-13"
                    : "grid-cols-1 xl:grid-cols-8"
                }`}
        >
            {canViewScreenshots && (
                <div className="xl:col-span-5">
                    <ScreenshotPreview
                        userId={userId}
                        selectedDate={selectedDate}
                        onLoaded={setScreenshotsHasData}
                    />
                </div>
            )}

            <div className="xl:col-span-4">
                <TopAppsPreview
                    userId={userId}
                    selectedDate={selectedDate}
                    onLoaded={setAppsHasData}
                />
            </div>

            <div className="xl:col-span-4">
                <ActivityPreview
                    userId={userId}
                    selectedDate={selectedDate}
                    workTime={workTime}
                    userName={userName}
                    onLoaded={setActivityHasData}
                />
            </div>
        </div>
    );
}