"use client";

import { io, Socket } from "socket.io-client";

const socket: Socket = io(
    process.env.NEXT_PUBLIC_SOCKET_URL ||
    "http://localhost:5000",
    {
        withCredentials: true,
        autoConnect: false,
    });

const initializeSocket = async () => {
    if (typeof window === "undefined") {
        return;
    }

    let token: string | null = null;

    /*
     * Electron
     */
    if (window.electronAPI?.getToken) {
        try {
            token = await window.electronAPI.getToken();

            if (token) {
                socket.auth = {
                    token,
                };
            }
        } catch (error) {
            console.error(
                "FAILED TO GET ELECTRON TOKEN:",
                error
            );
        }
    }

    /*
     * Web fallback
     *
     * Your web authentication currently uses cookies,
     * so we don't require an accessToken here.
     */
    if (!token && !window.electronAPI) {
        const webToken = localStorage.getItem("accessToken");

        if (webToken) {
            socket.auth = {
                token: webToken,
            };
        }
    }

    socket.connect();
};

/*
 * Socket connected
 */
socket.on("connect", () => {
    console.info(
        "FRONTEND SOCKET CONNECTED:",
        socket.id
    );
});

/*
 * Socket disconnected
 */
socket.on("disconnect", (reason) => {
    console.info(
        "FRONTEND SOCKET DISCONNECTED:",
        reason
    );
});

/*
 * Socket connection error
 */
socket.on("connect_error", (error) => {
    console.error(
        "SOCKET CONNECT ERROR:",
        error.message
    );
});

/*
 * Electron token refresh
 *
 * When the Electron main process refreshes the access token,
 * update the existing socket instead of creating a new socket.
 */
if (
    typeof window !== "undefined" &&
    window.electronAPI?.onTokenRefreshed
) {
    window.electronAPI.onTokenRefreshed((newToken) => {
        console.info("SOCKET: TOKEN REFRESHED");

        /*
         * Update authentication information.
         */
        socket.auth = {
            token: newToken,
        };

        /*
         * Reconnect using the new token.
         */
        if (socket.connected) {
            socket.disconnect();
        }

        socket.connect();
    });
}

/*
 * Initialize after the browser/Electron window exists.
 */
if (typeof window !== "undefined") {
    void initializeSocket();
}

export default socket;