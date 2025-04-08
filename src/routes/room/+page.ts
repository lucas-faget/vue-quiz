import type { PageLoad } from "./$types";
import { redirect } from "@sveltejs/kit";
import { room } from "$lib/stores/room.svelte";
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
    if (isValidPlayerName(room.playerName)) {
        if (browser) {
            if (room.connection) {
                await startConnection(room.connection);

                if (room.roomCode) {
                    if (isValidRoomCode(room.roomCode)) {
                        const roomExists = await room.connection.invoke<boolean>("RoomExists", room.roomCode);

                        if (roomExists) {
                            await joinRoom(room.connection, room.roomCode, room.playerName);
                            return { props: { code: room.roomCode } };
                        }
                    }
                } else {
                    room.roomCode = await createRoom(room.connection, room.playerName);
                    console.log(room.roomCode);

                    if (room.roomCode) {
                        const game = buildConnection();
                        startGame(game, room.roomCode);
                        return { props: { code: room.roomCode } };
                    }
                }

                await stopConnection(room.connection);
            }
        }
    }

    redirect(302, "/");
};
