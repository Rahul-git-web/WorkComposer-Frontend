"use client";

import { useEffect, useState } from "react";
import API from "@/api";

type ManualTimeSettings = {
    allowManualTime: boolean;
    requireApproval: boolean;
    managerApproval: boolean;
    backdatingLimit: number;
    requireProjectTask: boolean;
};

export default function useManualTimeSettings() {
    const [settings, setSettings] =
        useState<ManualTimeSettings | null>(null);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const fetchSettings = async () => {
        try {
            setLoading(true);

            const { data } = await API.get(
                "/manual-time/settings"
            );

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

    const updateSettings = async (
        newSettings: ManualTimeSettings
    ) => {
        try {
            setSaving(true);

            await API.put(
                "/manual-time/settings",
                newSettings
            );

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
        updateSettings,
        fetchSettings,
    };
}