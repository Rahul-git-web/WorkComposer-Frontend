"use client";

import { useEffect, useState } from "react";
import API from "@/api";

type ShiftSettings = {
    enabled: boolean;
    autoStartTracking: boolean;
    autoStopTracking: boolean;
    stopTrackingDuringBreaks: boolean;
    schedule: any[];
};

export default function useShiftSettings() {
    const [settings, setSettings] = useState<ShiftSettings | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const fetchSettings = async () => {
        try {
            setLoading(true);

            const { data } = await API.get("/shift/settings");

            setSettings(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    const updateSettings = async (newSettings: ShiftSettings) => {
        try {
            setSaving(true);

            await API.put("/shift/settings", newSettings);

            setSettings(newSettings);
        } catch (error) {
            console.error(error);
        } finally {
            setSaving(false);
        }
    };

    return {
        loading,
        saving,
        settings,
        setSettings,
        fetchSettings,
        updateSettings,
    };
}