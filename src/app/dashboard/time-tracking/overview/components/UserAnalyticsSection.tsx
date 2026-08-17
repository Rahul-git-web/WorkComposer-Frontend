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

    // Keep the grid mounted while we're still waiting on any child
    // (so their fetches can run and report back), and keep it mounted
    // once we know there's real data to show. Only unmount once we've
    // confirmed everything is empty - no point keeping idle
    // fetch/poll effects alive for a day with nothing to show.
    const shouldMountGrid = !allLoaded || (allLoaded && !allEmpty);

    return (
        <div className="mt-1">
            {/* Single loading state while children fetch in the background */}
            {!allLoaded && (
                <div className="flex flex-col items-center justify-center py-8 text-center border border-dashed border-gray-200 rounded-lg bg-gray-50">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-200 border-t-indigo-600" />
                </div>
            )}

            {/* Single unified empty state once everyone has reported back */}
            {allLoaded && allEmpty && (
                <div className="flex flex-col items-center justify-center py-8 text-center border border-dashed border-gray-200 rounded-lg bg-gray-50">
                    <Clock3 className="w-8 h-8 text-gray-300 mb-2" />
                    <p className="text-sm font-medium text-gray-500">
                        No activity recorded for this day
                    </p>
                </div>
            )}

            {/*
              Children stay mounted while loading (hidden, not removed) so
              their fetch effects can run and report back via onLoaded.
              They unmount once we've confirmed everything is empty, so no
              idle polling/effects linger for a day with no data.
            */}
            {shouldMountGrid && (
                <div
                    className={`grid gap-6 ${canViewScreenshots
                        ? "grid-cols-1 xl:grid-cols-13"
                        : "grid-cols-1 xl:grid-cols-8"
                        }`}
                    style={{ display: allLoaded ? "grid" : "none" }}
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
            )}
        </div>
    );
}