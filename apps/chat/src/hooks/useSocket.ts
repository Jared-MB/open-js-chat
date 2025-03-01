"use client"

import { PUBLIC_ENV } from "@/constants/env.public";
import { useSocketStore } from "@/store/socket";
import { useEffect, useMemo } from "react";
import { io } from "socket.io-client";

export const useSocket = (url?: string) => {

    const socket = useSocketStore((state) => state.socket)

    useEffect(() => {
        return () => {
            socket.disconnect()
        }
    }, [socket])

    return {
        socket,
        emit: (event: string, data: any) => socket.emit(event, data),
        on: (event: string, callback: (data: any) => void) => socket.on(event, callback),
        off: (event: string, callback: (data: any) => void) => socket.off(event, callback),
    }

}