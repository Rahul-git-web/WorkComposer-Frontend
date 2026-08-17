import { RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import API from "@/api";

export default function FooterStatusBar() {

    const [isOnline, setIsOnline] = useState(false);
    const [lastSync, setLastSync] = useState<Date | null>(null);
    const [syncing, setSyncing] = useState(false);

    useEffect(() => {
        setIsOnline(navigator.onLine);

        const goOnline = () => setIsOnline(true);
        const goOffline = () => setIsOnline(false);

        window.addEventListener("online", goOnline);
        window.addEventListener("offline", goOffline);

        return () => {
            window.removeEventListener("online", goOnline);
            window.removeEventListener("offline", goOffline);
        };
    }, []);

    const fetchSyncStatus = async () => {
        try {
            setSyncing(true);

            const { data } = await API.get("/sync/status");

            setLastSync(
                data.lastSync ? new Date(data.lastSync) : null
            );
        } catch (err) {
            console.error(err);
        } finally {
            setSyncing(false);
        }
    };

    useEffect(() => {
        fetchSyncStatus();

        const interval = setInterval(() => {
            fetchSyncStatus();
        }, 10000);

        return () => clearInterval(interval);
    }, []);

    const formatLastSync = (date: Date | null) => {
        if (!date) return "Never synced";

        return date.toLocaleString([], {
            month: "short",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <footer className="fixed bottom-0 left-0 right-0 z-50 h-7 bg-[#111827] border-t border-[#22324D] flex items-center justify-between px-4 text-[12px]">


            <div className="flex items-center gap-7 pl-5">
                <div className="flex items-center gap-2 bg-[#16253D] px-2 py-1 rounded-sm transition-shadow duration-300 hover:shadow-[0_0_14px_rgba(74,222,128,0.3)]">
                    <span
                        className={`w-2 h-2 rounded-full ${isOnline
                            ? "bg-green-400 animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.9)]"
                            : "bg-red-500"
                            }`}
                    />
                    <span className="text-white">
                        {isOnline ? "Online" : "Offline"}
                    </span>
                </div>

                <div className="flex items-center gap-2 text-gray-300 font-semibold">
                    <RefreshCw
                        size={13}
                        className={syncing ? "animate-spin" : ""}
                    />
                    <span>
                        Synced {formatLastSync(lastSync)}
                    </span>
                </div>
            </div>


            <div className="text-gray-400">
                v1.0.0 © 2026 WorkComposer
            </div>

        </footer>
    );
}