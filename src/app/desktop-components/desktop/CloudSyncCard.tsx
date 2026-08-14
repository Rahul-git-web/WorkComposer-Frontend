import { Cloud, Check, Clock, RefreshCw } from 'lucide-react';

import { useEffect, useState } from "react";
import API from "@/api";

export default function CloudSyncCard() {

    const [sync, setSync] = useState({
        status: "synced",
        pendingUploads: 0,
        lastSync: "",
    });

    useEffect(() => {
        const fetchSync = async () => {
            try {
                const { data } = await API.get("/sync/status");
                setSync(data);
            } catch (err) {
                console.error(err);
            }
        };

        fetchSync();

        const interval = setInterval(fetchSync, 10000);

        return () => clearInterval(interval);
    }, []);

    const lastSync = sync.lastSync
        ? new Date(sync.lastSync).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        })
        : "--:--:--";

    return (
        <div className="bg-[#17253D] rounded-xl p-5 h-[220px]">
            <div className='flex items-center gap-3 '>
                <div className="w-9 h-9 bg-purple-500 rounded-lg mb-3 flex items-center justify-center">
                    <Cloud className='w-4 h-4 text-white' />
                </div>
                <h3 className="text-gray-400 font-semibold mb-5 text-xs">
                    CLOUD SYNC
                </h3>
            </div>

            <div className="space-y-4">
                <div className="bg-[#101B2D] rounded-lg p-2 flex justify-between">
                    <div className='flex items-center gap-1'>
                        {sync.status === "syncing" ? (
                            <RefreshCw className="h-3.5 w-3.5 text-yellow-400 animate-spin" />
                        ) : (
                            <Check
                                className={`h-3.5 w-3.5 ${sync.status === "synced"
                                    ? "text-green-500"
                                    : "text-red-500"
                                    }`}
                            />
                        )}
                        <span className="text-gray-300 text-xs font-semibold ml-1">
                            Status
                        </span>
                    </div>

                    <span
                        className={`font-semibold text-xs mr-1 ${sync.status === "synced"
                            ? "text-green-400"
                            : sync.status === "syncing"
                                ? "text-yellow-400"
                                : "text-red-400"
                            }`}
                    >
                        {sync.status}
                    </span>
                </div>

                <div className="bg-[#101B2D] rounded-lg p-2 flex justify-between">
                    <div className='flex items-center gap-1'>
                        <Clock className='h-3.5 w-3.5 text-purple-500' />
                        <span className="text-gray-300 text-xs font-semibold ml-1">
                            Last Sync
                        </span>
                    </div>

                    <span className="text-white font-semibold text-xs mr-1">
                        {lastSync}
                    </span>
                </div>
            </div>
        </div>
    );
}