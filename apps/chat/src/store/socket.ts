import { create } from "zustand";
import { io, type Socket } from 'socket.io-client'

import { PUBLIC_ENV } from "@/constants/env.public";

interface SocketState {
    socket: Socket
}

export const useSocketStore = create<SocketState>((set) => ({
    socket: io(PUBLIC_ENV.SERVER_API, {
        withCredentials: true
    }),
}))