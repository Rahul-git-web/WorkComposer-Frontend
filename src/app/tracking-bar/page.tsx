"use client";

import { Play, Pause, Square, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

export default function TrackingBar() {
    const [seconds, setSeconds] = useState(0);

    useEffect(() => {
        window.electronAPI.onTrackingUpdate((data) => {
            setSeconds(data.duration || 0);
        });
    }, []);

    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;

    const time = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;

    return (
        <div
            className="fixed inset-0 overflow-hidden bg-transparent flex items-center justify-center"
            style={
                {
                    WebkitAppRegion: "drag",
                } as any
            }
        >
            <div
                className="
            h-12
           min-w-[355px]
           max-w-[400px]
            rounded-xl
            border
            border-[#49557A]
            bg-[#2A2942]
            shadow-[0_12px_35px_rgba(0,0,0,.45)]
            backdrop-blur-xl
            flex
            items-center
            justify-between
            px-5
            text-white
        "
            >

                <div className="flex items-center gap-2">

                    {/* Play icon */}
                    <Play
                        size={9}
                        fill="currentColor"
                        className="text-emerald-400"
                    />

                    {/* Status dot */}
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />

                    {/* Timer */}
                    <span className="font-mono text-[14px] font-bold tracking-wide text-white">
                        {time}
                    </span>

                    {/* Status */}
                    <span className="text-[12px] font-medium text-gray-300">
                        Working
                    </span>

                </div>

                <div
                    className="flex items-center rounded-xl border border-[#4C5679] overflow-hidden h-6 w-[50px]"
                    style={
                        {
                            WebkitAppRegion: "no-drag",
                        } as any
                    }
                >

                    {/* Stop */}

                    <button
                        onClick={() => {
                            window.electronAPI.stopTrackingFromBar();
                        }}
                        className="
            h-6.5
            w-6.5
            flex
            items-center
            justify-center
            hover:bg-[#3A3B58]
            transition-colors
        "
                    >
                        <Square
                            size={9}
                            fill="currentColor"
                            className="text-gray-300"
                        />
                    </button>

                    <div className="w-px h-5 bg-[#505B7C]" />

                    {/* Expand (future) */}

                    <button
                        onClick={() => {
                            window.electronAPI.openMainWindow();
                        }}
                        className="
        h-6.5
        w-6.5
        flex
        items-center
        justify-center
        hover:bg-[#3A3B58]
        transition-colors
    "
                    >
                        <ChevronRight
                            size={14}
                            className="text-gray-300"
                        />
                    </button>

                </div>

            </div>
        </div>
    );
}