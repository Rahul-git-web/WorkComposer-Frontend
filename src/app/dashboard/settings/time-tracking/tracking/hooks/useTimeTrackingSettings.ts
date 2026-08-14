"use client";

import { useEffect, useState } from "react";
import API from "@/api";
import socket from "@/socket/socket";

export default function useTimeTrackingSettings() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [settings, setSettings] = useState<any>(null);

    const fetchSettings = async () => {
        try {
            const { data } = await API.get("/time-tracking/settings");
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

            await API.put("/time-tracking/settings", newSettings);

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

    useEffect(() => {
        const handleSettingsUpdated = (updatedSettings: any) => {

            setSettings(updatedSettings);
        };

        socket.on(
            "tracking-settings-updated",
            handleSettingsUpdated
        );

        return () => {
            socket.off(
                "tracking-settings-updated",
                handleSettingsUpdated
            );
        };
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