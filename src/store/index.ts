import { createStore } from "vuex";
import { buildConnection } from "@/signalr/QuizHubClient";

interface State {
    playerName: string;
    connection: signalR.HubConnection;
}

const store = createStore({
    state: {
        playerName: "",
        connection: buildConnection(),
    },
    mutations: {
        setPlayerName(state: State, name: string) {
            state.playerName = name;
        },
    },
});

export default store;
