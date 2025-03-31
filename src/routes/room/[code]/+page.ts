import type { PageLoad } from "./$types";
import { get } from "svelte/store";
import { store } from "$lib/stores/QuizStore";
import { startConnection, stopConnection } from "$lib/signalr/QuizHubClient";
import { browser } from "$app/environment";

const isValidCode = (code: string): boolean => /^[A-Z0-9]{4}$/.test(code);

export const load: PageLoad = async ({ params, fetch }) => {
    const code = params.code?.toUpperCase();

    if (!code || !isValidCode(code)) {
        return { status: 302, redirect: "/" };
    }

    if (browser) {
        const connection = get(store).connection;
        if (connection) {
            await startConnection(connection);
            const roomExists = await connection.invoke<boolean>("RoomExists", code);
            await stopConnection(connection);

            if (!roomExists) {
                return { status: 302, redirect: "/" };
            }
        }
    }

    return { props: { code } };
};
