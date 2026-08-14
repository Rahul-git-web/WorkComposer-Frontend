"use client";

import Image from "next/image";
import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type KekaIntegration = {
    connected?: boolean;
    subdomain?: string;
};

type KekaEmployee = {
    id?: string;
    employeeNumber?: string;
    displayName?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    workEmail?: string;
    jobTitle?: string;
    department?: string;
};

type KekaLeave = {
    id?: string;
    employeeName?: string;
    requestedBy?: string;
    fromDate?: string;
    toDate?: string;
    leaveType?: string;
};

export default function KekaIntegrationPage() {
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [connecting, setConnecting] = useState(false);
    const [integration, setIntegration] =
        useState<KekaIntegration | null>(null);

    const [apiKey, setApiKey] = useState("");
    const [subdomain, setSubdomain] = useState("");
    const [error, setError] = useState("");

    const [syncing, setSyncing] = useState(false);
    const [syncMessage, setSyncMessage] = useState("");

    const [activeTab, setActiveTab] = useState("employees");
    const [employees, setEmployees] =
        useState<KekaEmployee[]>([]);
    const [leaves, setLeaves] =
        useState<KekaLeave[]>([]);
    const [dataLoading, setDataLoading] = useState(false);

    useEffect(() => {
        fetchIntegration();
    }, []);

    const fetchIntegration = async () => {
        try {
            const { data } = await axios.get("/api/integrations/keka", {
                withCredentials: true,
            });

            setIntegration(data);
            if (data?.connected) loadEmployees();
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const loadEmployees = async () => {
        setDataLoading(true);
        try {
            const { data } = await axios.get("/api/integrations/keka/employees", {
                withCredentials: true,
            });
            setEmployees(data);
        } catch (err) {
            console.error("Failed to load Keka employees", err);
        } finally {
            setDataLoading(false);
        }
    };

    const loadLeaves = async () => {
        setDataLoading(true);
        try {
            const { data } = await axios.get("/api/integrations/keka/leaves", {
                withCredentials: true,
            });
            setLeaves(data || []);
        } catch (err) {
            console.error("Failed to load Keka leaves", err);
        } finally {
            setDataLoading(false);
        }
    };

    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
        if (tab === "employees" && employees.length === 0) loadEmployees();
        if (tab === "leaves" && leaves.length === 0) loadLeaves();
    };

    const handleConnect = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();
        setError("");

        if (!apiKey || !subdomain) {
            setError("Please enter your API Key and Company Subdomain.");
            return;
        }

        setConnecting(true);

        try {
            await axios.post(
                "/api/integrations/keka/connect",
                { apiKey, subdomain },
                { withCredentials: true }
            );

            setApiKey("");
            await fetchIntegration();
        } catch (err: any) {
            setError(
                err.response?.data?.message ||
                "Failed to connect Keka HR. Check your API Key and Subdomain."
            );
        } finally {
            setConnecting(false);
        }
    };

    const handleDisconnect = async () => {
        try {
            await axios.delete("/api/integrations/keka", {
                withCredentials: true,
            });

            await fetchIntegration();
        } catch (err) {
            console.error(err);
        }
    };

    const handleSync = async () => {
        setSyncing(true);
        setSyncMessage("");

        try {
            const { data } = await axios.post(
                "/api/integrations/keka/sync-employees",
                {},
                { withCredentials: true }
            );

            setSyncMessage(
                `Synced ${data.syncedCount} employee${data.syncedCount === 1 ? "" : "s"}.`
            );
            await loadEmployees();
        } catch (err) {
            setSyncMessage("Failed to sync employees from Keka.");
        } finally {
            setSyncing(false);
        }
    };

    if (loading) {
        return (
            <div className="max-w-4xl mx-auto px-6 py-6">
                <p className="text-gray-500">Loading...</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-6 py-6">
            <button
                onClick={() => router.push("/dashboard/settings/account/integrations")}
                className="mb-6 text-sm text-gray-500 hover:text-gray-700"
            >
                ← Back to Integrations
            </button>

            <div className="flex items-center gap-4 mb-8">
                <Image src="/icons/keka.png" alt="Keka HR" width={48} height={48} />
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Keka HR</h1>
                    <p className="text-gray-600">
                        Sync employee directory, attendance, and leave information.
                    </p>
                </div>
            </div>

            {integration?.connected ? (
                <div className="space-y-6">
                    <div className="border border-gray-200 rounded-xl p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-2">
                                <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
                                <span className="font-medium text-gray-900">Connected</span>
                            </div>

                            <button
                                onClick={handleDisconnect}
                                className="text-sm text-red-600 hover:text-red-700"
                            >
                                Disconnect
                            </button>
                        </div>

                        <dl className="grid grid-cols-2 gap-4 text-sm mb-6">
                            <div>
                                <dt className="text-gray-500">Subdomain / Domain</dt>
                                <dd className="text-gray-900 font-medium">
                                    {integration.subdomain}
                                </dd>
                            </div>
                        </dl>

                        <div className="border-t border-gray-100 pt-6">
                            <h2 className="text-sm font-semibold text-gray-900 mb-2">
                                Employee Sync
                            </h2>
                            <p className="text-sm text-gray-600 mb-4">
                                Match Keka HR employees to local users by work email.
                            </p>

                            <button
                                onClick={handleSync}
                                disabled={syncing}
                                className="px-4 py-2 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 disabled:opacity-50"
                            >
                                {syncing ? "Syncing..." : "Sync Employees Now"}
                            </button>

                            {syncMessage && (
                                <p className="mt-3 text-sm text-gray-600">{syncMessage}</p>
                            )}
                        </div>
                    </div>

                    {/* Directory & Leaves Tabs */}
                    <div className="border border-gray-200 rounded-xl p-6">
                        <div className="flex border-b border-gray-200 mb-4 gap-4">
                            <button
                                onClick={() => handleTabChange("employees")}
                                className={`pb-2 text-sm font-medium border-b-2 ${activeTab === "employees"
                                    ? "border-gray-900 text-gray-900"
                                    : "border-transparent text-gray-500 hover:text-gray-700"
                                    }`}
                            >
                                Directory ({employees.length})
                            </button>
                            <button
                                onClick={() => handleTabChange("leaves")}
                                className={`pb-2 text-sm font-medium border-b-2 ${activeTab === "leaves"
                                    ? "border-gray-900 text-gray-900"
                                    : "border-transparent text-gray-500 hover:text-gray-700"
                                    }`}
                            >
                                Leaves
                            </button>
                        </div>

                        {dataLoading ? (
                            <p className="text-sm text-gray-500 py-4">Fetching data...</p>
                        ) : activeTab === "employees" ? (
                            <div className="divide-y divide-gray-100">
                                {employees.length === 0 ? (
                                    <p className="text-sm text-gray-500 py-4">
                                        No employees found.
                                    </p>
                                ) : (
                                    employees.map((emp) => (
                                        <div
                                            key={emp.id || emp.employeeNumber}
                                            className="py-3 flex justify-between items-center text-sm"
                                        >
                                            <div>
                                                <p className="font-medium text-gray-900">
                                                    {emp.displayName || `${emp.firstName} ${emp.lastName}`}
                                                </p>
                                                <p className="text-gray-500">{emp.email || emp.workEmail}</p>
                                            </div>
                                            <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">
                                                {emp.jobTitle || emp.department || "Employee"}
                                            </span>
                                        </div>
                                    ))
                                )}
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-100">
                                {leaves.length === 0 ? (
                                    <p className="text-sm text-gray-500 py-4">
                                        No leave records available.
                                    </p>
                                ) : (
                                    leaves.map((item, idx) => (
                                        <div
                                            key={item.id || idx}
                                            className="py-3 flex justify-between items-center text-sm"
                                        >
                                            <div>
                                                <p className="font-medium text-gray-900">
                                                    {item.employeeName || item.requestedBy}
                                                </p>
                                                <p className="text-gray-500 text-xs">
                                                    {item.fromDate} → {item.toDate}
                                                </p>
                                            </div>
                                            <span className="text-xs bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-1 rounded-full font-medium">
                                                {item.leaveType || "Leave"}
                                            </span>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <form
                    onSubmit={handleConnect}
                    className="border border-gray-200 rounded-xl p-6"
                >
                    <h2 className="text-sm font-semibold text-gray-900 mb-1">
                        Connect your Keka HR account
                    </h2>
                    <p className="text-sm text-gray-600 mb-6">
                        Enter your API Key and Keka Subdomain / Organization ID.
                    </p>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Subdomain / Company ID
                        </label>
                        <input
                            type="text"
                            value={subdomain}
                            onChange={(e) => setSubdomain(e.target.value.trim())}
                            placeholder="e.g. mycompany"
                            className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-gray-900"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            API Key / Access Token
                        </label>
                        <input
                            type="password"
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value.trim())}
                            placeholder="Paste your Keka API Key"
                            className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-gray-900"
                        />
                    </div>

                    {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

                    <button
                        type="submit"
                        disabled={connecting}
                        className="px-4 py-2 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 disabled:opacity-50"
                    >
                        {connecting ? "Connecting..." : "Connect Keka HR"}
                    </button>
                </form>
            )}
        </div>
    );
}