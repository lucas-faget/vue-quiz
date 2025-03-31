import { writable } from "svelte/store";
import { browser } from "$app/environment";
import { buildConnection } from "../signalr/QuizHubClient";
import type { HubConnection } from "@microsoft/signalr";

interface QuizStore {
    playerName: string;
    connection: HubConnection | undefined;
}

export const store = writable<QuizStore>({
    playerName: "",
    connection: browser ? buildConnection() : undefined,
});

export function setPlayerName(name: string) {
    store.update((store) => ({
        ...store,
        playerName: name,
    }));
}
