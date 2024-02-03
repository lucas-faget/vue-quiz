<script setup lang="ts">
    import { ref } from 'vue';
    import type { Player } from '@/types/Player';
    import type { Question } from '@/types/Question';
    import * as signalR from "@microsoft/signalr";
    import Countdown from '@/components/Countdown.vue';

    const countdown = ref(null);

    const players = ref<Player[]>([]);
    const chat = ref<string[]>([]);
    const question = ref<Question|undefined>(undefined);
    const canAnswer = ref<boolean>(false);
    const userAnswer = ref<string>("");
    const result = ref<string>("");
    const answer = ref<string>("");

    const connection = new signalR.HubConnectionBuilder()
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
        if (canAnswer.value && question.value) {
            try {
                console.log("check answer");
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

    connection.on("ReceiveDelay", (seconds) => {
        handleRestartCountdown(seconds);
    });
    
    
    connection.on("ReceiveQuestion", (q, seconds) => {
        console.log(q);
        canAnswer.value = true;
        answer.value = "";
        result.value = '';
        question.value = q;
        handleRestartCountdown(seconds);
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

    const handleRestartCountdown = (seconds: number) => {
        if (countdown.value) {
            countdown.value.restartCountdown(seconds);
        }
    };

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
        <countdown ref="countdown"></countdown>
        <div class="question" v-if="question">
            <div v-if="question.difficulty">{{ question.difficulty }}</div>
            <div v-if="question.category">{{ question.category }}</div>
            <div v-if="question.title">{{ question.title }}</div>
        </div>
        <input type="text" v-model="userAnswer" />
        <button @click="sendAnswer">Send</button>
        <div>{{ result == '1' ? "Right" : result == '0' ? "Wrong" : "" }}</div>
        <div v-if="answer">{{ answer  }}</div>
    </main>
</template>
