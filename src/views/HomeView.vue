<script setup lang="ts">
import { ref } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { RoomAction } from "@/types/RoomAction";
import Navigation, { type NavItem } from "@/components/Navigation.vue";

const store = useStore();
const router = useRouter();

const items: NavItem[] = [
    { text: "join", value: RoomAction.Join },
    { text: "create", value: RoomAction.Create },
];

const roomAction = ref<RoomAction>(RoomAction.Join);
const playerName = ref<string>(store.state.playerName ?? "");
const roomCode = ref<string>("");

const updateRoomAction = (value: RoomAction) => {
    roomAction.value = value;
};

const handleRoomAction = () => {
    store.commit("setPlayerName", playerName.value);
    if (roomAction.value === RoomAction.Join) {
        router.push({
            name: "room",
            params: { code: roomCode.value },
        });
    } else {
        router.push({
            name: "room",
        });
    }
};
</script>

<template>
    <main>
        <div class="form">
            <navigation :items="items" @updateAction="updateRoomAction"></navigation>

            <div style="display: flex; flex-direction: column; gap: 10px">
                <div style="font-size: 40px">Let's Play Quiz</div>
                <div>
                    {{
                        roomAction === RoomAction.Join
                            ? "Enter your player name, enter the room code, then click on the button to join the room."
                            : "Enter your player name, then click on the button to create a new room."
                    }}
                </div>
            </div>
            <form style="display: flex; flex-direction: column; gap: 30px" @submit.prevent="handleRoomAction">
                <div class="input-group">
                    <label>Player Name</label>
                    <input type="text" minlength="3" maxlength="12" v-model="playerName" required />
                </div>

                <div class="input-group" v-if="roomAction === RoomAction.Join">
                    <label>Room Code</label>
                    <input type="text" maxlength="4" pattern="[a-zA-Z0-9]{4}" v-model="roomCode" required />
                </div>

                <button>
                    {{ roomAction === RoomAction.Join ? "join room" : "create a room" }}
                </button>
            </form>
        </div>
    </main>
</template>

<style scoped>
main {
    background-color: var(--color-dark-blue);
    min-height: 100vh;
    display: flex;
    justify-content: center;
}

.form {
    margin-top: 5vw;
    width: 400px;
    display: flex;
    flex-direction: column;
    gap: 30px;
}
</style>
