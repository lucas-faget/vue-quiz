import { writable } from "svelte/store";
import { browser } from "$app/environment";
import { buildConnection } from "../signalr/QuizHubClient";
import type { HubConnection } from "@microsoft/signalr";

interface QuizStore {
    playerName: string;
    roomCode: string | undefined;
    connection: HubConnection | undefined;
}

export const store = writable<QuizStore>({
    playerName: "",
    roomCode: "",
    connection: browser ? buildConnection() : undefined,
});

export function setRoomCode(roomCode: string) {
    store.update((store) => ({
        ...store,
        roomCode: roomCode,
    }));
}
