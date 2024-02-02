<script setup lang="ts">
    import { ref } from 'vue';
    import * as signalR from "@microsoft/signalr";
    import Countdown from '@/components/Countdown.vue';

    const players = ref([]);
    const chat = ref([]);
    const question = ref({});
    const canAnswer = ref(false);
    const userAnswer = ref("");
    const result = ref("");
    const answer = ref("");

    const connection = new signalR.HubConnectionBuilder()
        // .withUrl("wss://localhost:7052/quizHub")
        .withUrl("wss://localhost:7052/quizHub", {
            skipNegotiation: true,
            transport: signalR.HttpTransportType.WebSockets
        })
        .configureLogging(signalR.LogLevel.Information)
        .build();

    async function start() {
        try {
            await connection.start();
            console.log("SignalR Connected.");

            try {
                await connection.invoke("JoinRoom", 0, "");
            } catch (err) {
                console.error("Failed to join room:", err);
            }
        } catch (err) {
            console.log(err);
            setTimeout(start, 5000);
        }
    };

    async function sendAnswer() {
        if (canAnswer.value) {
            try {
                await connection.invoke("CheckAnswer", 0, question.value.id, userAnswer.value);
            } catch (err) {
                console.log("Failed to send answer:", err);
            }
        } else {
            console.log("User answer is not available");
        }
    };

    connection.on("ReceivePlayers", (playerList) => {
        console.log(playerList);
        players.value = playerList;
    });
    
    connection.on("ReceiveMessage", (message) => {
        console.log(message);
        chat.value.push(message);
    });
    
    connection.on("ReceiveQuestion", (q) => {
        console.log(q);
        canAnswer.value = true;
        question.value = q;
    });

    connection.on("ReceiveAnswerResult", (answerResult) => {
        console.log(answerResult);
        result.value = answerResult;
    });

    connection.on("ReceiveAnswer", (a) => {
        console.log(a);
        canAnswer.value = false;
        answer.value = a;
    });

    connection.onclose(async () => {
        await start();
    });

    start();
</script>

<template>
    <main>
        <h1>Room</h1>
        <h2>Player List</h2>
        <div class="players" v-for="player in players" :key="player.id">
            <div>{{ player.name }}</div>
        </div>
        <h2>Chat</h2>
        <div class="chat" v-for="(message, index) in chat" :key="index">
            <div>{{ message }}</div>
        </div>
        <h2>Quiz</h2>
        <countdown :seconds=20></countdown>
        <div class="question">
            <div v-if="question.difficulty">{{ question.difficulty }}</div>
            <div v-if="question.category">{{ question.category }}</div>
            <div v-if="question.title">{{ question.title }}</div>
        </div>
        <input type="text" v-model="userAnswer" />
        <button @click="sendAnswer">Send</button>
        <div>{{ result == '1' ? "Right" : "Wrong"  }}</div>
        <div v-if="answer">{{ answer  }}</div>
    </main>
</template>
