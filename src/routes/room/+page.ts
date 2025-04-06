import type { PageLoad } from "./$types";
import { redirect } from "@sveltejs/kit";
import { store } from "$lib/stores/QuizStore.svelte";
import {
    buildConnection,
    createRoom,
    joinRoom,
    startConnection,
    startGame,
    stopConnection,
} from "$lib/signalr/QuizHubClient";
import { browser } from "$app/environment";

const isValidPlayerName = (name: string): boolean => name.length >= 3;
const isValidRoomCode = (code: string): boolean => /^[A-Z0-9]{4}$/.test(code);

export const load: PageLoad = async ({ params, fetch }) => {
    if (isValidPlayerName(store.playerName)) {
        if (browser) {
            if (store.connection) {
                await startConnection(store.connection);

                if (store.roomCode) {
                    if (isValidRoomCode(store.roomCode)) {
                        const roomExists = await store.connection.invoke<boolean>("RoomExists", store.roomCode);

                        if (roomExists) {
                            await joinRoom(store.connection, store.roomCode, store.playerName);
                            return { props: { code: store.roomCode } };
                        }
                    }
                } else {
                    store.roomCode = await createRoom(store.connection, store.playerName);
                    console.log(store.roomCode);

                    if (store.roomCode) {
                        const game = buildConnection();
                        //await startGame(game, store.roomCode);
                        return { props: { code: store.roomCode } };
                    }
                }

                await stopConnection(store.connection);
            }
        }
    }

    redirect(302, "/");
};
