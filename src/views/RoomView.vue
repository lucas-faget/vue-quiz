<script setup lang="ts">
    import { ref } from 'vue';
    import * as signalR from "@microsoft/signalr";

    const chat = ref([]);
    const quiz = ref([]);

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
                await connection.invoke("GetQuestions", 0);
            } catch (err) {
                console.error("Failed to join room:", err);
            }
        } catch (err) {
            console.log(err);
            setTimeout(start, 5000);
        }
    };
    
    connection.on("ReceiveMessage", (message) => {
        console.log(message);
        chat.value.push(message);
    });
    
    connection.on("ReceiveQuestions", (questions) => {
        console.log(questions);
        quiz.value = questions;
    });

    connection.onclose(async () => {
        await start();
    });

    start();
</script>

<template>
    <main>
        <h1>Room</h1>
        <h2>Chat</h2>
        <div class="chat" v-for="(message, index) in chat" :key="index">
            <div>{{ message }}</div>
        </div>
        <h2>Quiz</h2>
        <div class="quiz" v-for="question in quiz" :key="question.id">
            <div v-if="question.difficulty">{{ question.difficulty }}</div>
            <div v-if="question.category">{{ question.category }}</div>
            <div v-if="question.title">{{ question.title }}</div>
            <hr>
        </div>
    </main>
</template>
