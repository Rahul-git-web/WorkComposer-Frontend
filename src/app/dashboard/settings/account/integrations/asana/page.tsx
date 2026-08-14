"use client";

import Image from "next/image";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import {
    ArrowLeft,
    Link2,
    Download,
    Clock3,
    RefreshCw,
    BarChart3,
} from "lucide-react";
import { useEffect, useState } from "react";
import API from "@/api";

export default function AsanaPage() {

    const searchParams = useSearchParams();

    useEffect(() => {
        const status = searchParams.get("status");

        if (!status) return;

        if (status === "connected") {
            toast.success("Asana connected successfully.");
        }

        if (status === "cancelled") {
            toast("Asana connection was cancelled.", {
                icon: "⚠️",
            });
        }

        window.history.replaceState(
            {},
            "",
            "/dashboard/settings/account/integrations/asana"
        );
    }, [searchParams]);

    const [loading, setLoading] = useState(false);
    const [integration, setIntegration] = useState<any>(null);

    const fetchIntegration = async () => {
        try {
            const { data } = await API.get("/integrations/asana");

            setIntegration(data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchIntegration();
    }, []);

    const connectAsana = async () => {
        try {
            setLoading(true);

            const { data } = await API.get("/integrations/asana/connect");

            if (data.url) {
                window.location.href = data.url;
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const disconnectAsana = async () => {
        const confirmed = window.confirm(
            "Disconnect Asana?\n\nThis will stop syncing tasks and remove your stored Asana credentials."
        );

        if (!confirmed) return;

        try {
            setLoading(true);

            const { data } = await API.delete("/integrations/asana");

            toast.success(data.message);

            await fetchIntegration();
        } catch (err) {
            console.error(err);
            toast.error("Failed to disconnect Asana.");
        } finally {
            setLoading(false);
        }
    };

    const importProjects = async () => {
        try {
            setLoading(true);

            const { data: workspaces } = await API.get(
                "/integrations/asana/workspaces"
            );

            if (!workspaces.length) {
                toast.error("No workspaces found.");
                return;
            }

            const workspaceId = workspaces[0].gid;

            const { data } = await API.post(
                `/integrations/asana/workspaces/${workspaceId}/import-projects`
            );

            toast.success(data.message);

        } catch (err) {
            console.error(err);
            toast.error("Failed to import projects.");
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="max-w-6xl mx-auto p-3">

            {/* Back */}

            <Link
                href="/dashboard/settings/account/integrations"
                className="flex items-center gap-2 text-gray-500 hover:text-black mb-8"
            >
                <ArrowLeft size={18} />
                Back to Integrations
            </Link>

            {/* Header */}

            <div className="flex items-center gap-4 mb-8">

                <Image
                    src="/icons/asana.png"
                    alt="asana"
                    width={56}
                    height={56}
                    className="rounded-xl shadow"
                />

                <div>
                    <h1 className="text-xl font-bold">
                        Asana Integration
                    </h1>

                    <p className="text-gray-500">
                        Sync tasks and track time across platforms
                    </p>
                </div>

            </div>

            {/* Hero */}

            <div className="overflow-hidden rounded-xl bg-white shadow-sm">

                <div className="py-10 px-10 flex flex-col items-center text-center">

                    <div className="h-14 w-14 rounded-full bg-gray-100 flex items-center justify-center mb-6">

                        <Link2
                            size={34}
                            className="text-gray-500"
                        />

                    </div>

                    <h2 className="text-lg font-semibold mb-2">
                        {integration?.connected
                            ? "Asana Connected"
                            : "Connect Your Asana Workspace"}
                    </h2>

                    {integration?.connected ? (
                        <div className="text-center">
                            <p className="text-green-600 font-medium">
                                ✓ Successfully connected
                            </p>

                            <p className="text-sm text-gray-500 mt-2">
                                Workspace: {integration.workspaceName}
                            </p>

                            <p className="text-sm text-gray-500">
                                {integration.email}
                            </p>

                            <button
                                onClick={importProjects}
                                disabled={loading}
                                className="mt-6 mr-2 bg-[#f24b09] hover:bg-[#e15d2b] text-white px-6 py-2 rounded-md font-medium transition"
                            >
                                {loading ? "Importing..." : "Import Projects"}
                            </button>

                            <button
                                onClick={disconnectAsana}
                                disabled={loading}
                                className="mt-6 ml-2 border border-red-300 text-red-600 hover:bg-red-50 px-6 py-2 rounded-md font-medium transition"
                            >
                                {loading ? "Disconnecting..." : "Disconnect"}
                            </button>
                        </div>
                    ) : (
                        <p className="text-gray-600 text-sm max-w-md">
                            Link your Asana workspace to import tasks,
                            track time against Asana projects,
                            and automatically sync time entries —
                            all without leaving your workspace.
                        </p>
                    )}

                    {!integration?.connected && (
                        <button
                            onClick={connectAsana}
                            disabled={loading}
                            className="mt-6 bg-[#f24b09] hover:bg-[#e15d2b] text-white px-7 py-2 rounded-md font-semibold transition"
                        >
                            {loading ? "Connecting..." : "Connect to Asana"}
                        </button>
                    )}

                </div>

                {/* Bottom */}

                <div className="border-t bg-gray-50 p-6">

                    <h3 className="text-center text-sm font-semibold tracking-widest text-gray-500 mb-6">

                        WHAT YOU'LL GET

                    </h3>

                    <div className="grid grid-cols-4 gap-4 text-center">

                        <Feature
                            icon={<Download size={16} />}
                            title="Import Tasks"
                            desc="Pull tasks from Asana projects"
                        />

                        <Feature
                            icon={<Clock3 size={22} />}
                            title="Track Time"
                            desc="Log hours against Asana tasks"
                        />

                        <Feature
                            icon={<RefreshCw size={22} />}
                            title="Auto Sync"
                            desc="Background sync every 15 min"
                        />

                        <Feature
                            icon={<BarChart3 size={22} />}
                            title="Time Entries"
                            desc="Push time entries to Asana"
                        />

                    </div>

                </div>

            </div>

        </div>
    );
}

function Feature({
    icon,
    title,
    desc,
}: {
    icon: React.ReactNode;
    title: string;
    desc: string;
}) {
    return (
        <div>

            <div className="mx-auto h-14 w-14 rounded-lg bg-white border flex items-center justify-center shadow-sm mb-4">

                {icon}

            </div>

            <h4 className="font-semibold">
                {title}
            </h4>

            <p className="text-sm text-gray-500 mt-2">
                {desc}
            </p>

        </div>
    );
}