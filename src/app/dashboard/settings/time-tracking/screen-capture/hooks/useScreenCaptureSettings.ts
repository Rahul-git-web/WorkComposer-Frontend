"use client";

import { useEffect, useState } from "react";
import API from "@/api";

export default function useScreenCaptureSettings() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [settings, setSettings] = useState<any>(null);

    const fetchSettings = async () => {
        try {
            const { data } = await API.get("/screen-capture/settings");
            setSettings(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const updateSettings = async (newSettings: any) => {
        try {
            setSaving(true);

            await API.put(
                "/screen-capture/settings",
                newSettings
            );

            setSettings(newSettings);
        } catch (error) {
            console.error(error);
        } finally {
            setSaving(false);
        }
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    return {
        loading,
        saving,
        settings,
        setSettings,
        fetchSettings,
        updateSettings,
    };
}