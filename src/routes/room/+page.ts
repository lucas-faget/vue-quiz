import type { PageLoad } from "./$types";
import { redirect } from "@sveltejs/kit";
import { get } from "svelte/store";
import { setRoomCode, store } from "$lib/stores/QuizStore";
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
    const playerName: string = get(store).playerName;
    let roomCode: string | undefined = get(store).roomCode;

    if (isValidPlayerName(playerName)) {
        if (browser) {
            const connection = get(store).connection;
            if (connection) {
                await startConnection(connection);

                if (roomCode) {
                    if (isValidRoomCode(roomCode)) {
                        const roomExists = await connection.invoke<boolean>("RoomExists", roomCode);

                        if (roomExists) {
                            await joinRoom(connection, roomCode, playerName);
                            return { props: { code: roomCode } };
                        }
                    }
                } else {
                    roomCode = await createRoom(connection, playerName);
                    console.log(roomCode);

                    if (roomCode) {
                        setRoomCode(roomCode);
                        const game = buildConnection();
                        await startGame(game, roomCode);
                        return { props: { code: roomCode } };
                    }
                }

                await stopConnection(connection);
            }
        }
    }

    redirect(302, "/");
};
