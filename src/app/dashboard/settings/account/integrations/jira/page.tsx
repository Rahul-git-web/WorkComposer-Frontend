"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { HiOutlineLink } from "react-icons/hi2";
import { SiJira } from "react-icons/si";
import { useEffect, useState } from "react";
import API from "@/api";

export default function JiraPage() {

    const [status, setStatus] = useState<any>(null);

    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const { data } = await API.get("/integrations/jira/status");
                setStatus(data);
            } catch (err) {
                console.error(err);
            }
        };

        fetchStatus();
    }, []);

    const syncProjects = async () => {
        try {
            await API.post("/integrations/jira/sync-projects");

            alert("Projects synced successfully!");
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-6 py-6">

            <Link
                href="/dashboard/settings/account/integrations"
                className="mb-8 inline-flex items-center gap-2 text-gray-500 hover:text-gray-900"
            >
                <ArrowLeft size={18} />
                Back to Integrations
            </Link>

            <div className="mt-6 flex items-center gap-5">

                <Image
                    src="/icons/jira.png"
                    alt="Jira"
                    width={56}
                    height={56}
                    className="rounded-xl"
                />

                <div>

                    <h1 className="text-3xl font-bold">
                        Jira Integration
                    </h1>

                    <p className="mt-1 text-gray-500">
                        Sync tasks and track time across platforms
                    </p>

                </div>
            </div>

            <div className="mt-10 overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">

                <div className="px-6 py-16 md:px-10">

                    <div className="flex flex-col items-center justify-center py-10">

                        <div className="flex h-18 w-18 items-center justify-center rounded-full bg-blue-50">

                            <HiOutlineLink className="w-10 h-10 text-gray-500" />

                        </div>

                        <h2 className="mt-8 text-3xl font-bold text-gray-900">
                            Connect Your Jira Workspace
                        </h2>

                        <p className="mt-3 max-w-xl text-center text-gray-500">
                            Link your Jira Cloud instance to import tasks, track time against Jira issues, and automatically sync work logs — all without leaving your workspace.
                        </p>

                        {status?.connected ? (
                            <div className="mt-8 flex flex-col items-center">

                                <div className="rounded-xl border border-green-200 bg-green-50 px-6 py-4 text-center">

                                    <p className="font-semibold text-green-700">
                                        ✓ Jira Connected
                                    </p>

                                    <p className="mt-2 text-sm text-gray-600">
                                        Workspace: <span className="font-medium">{status.workspaceName}</span>
                                    </p>

                                    <p className="text-sm text-gray-600">
                                        {status.siteUrl}
                                    </p>

                                </div>

                                <button
                                    onClick={syncProjects}
                                    className="mt-6 rounded-xl bg-indigo-600 px-8 py-3 font-medium text-white hover:bg-indigo-700"
                                >
                                    Sync Projects
                                </button>

                            </div>
                        ) : (
                            <button
                                onClick={() => {
                                    window.location.href =
                                        `${process.env.NEXT_PUBLIC_API_URL}/integrations/jira/connect`;
                                }}
                                className="mt-8 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-8 py-3 font-medium text-white transition-all duration-200 hover:bg-indigo-700 hover:shadow-lg"
                            >
                                <SiJira className="w-4 h-4" />
                                Connect to Jira
                            </button>
                        )}

                    </div>

                </div>

            </div>

        </div>
    );
}