<script setup lang="ts">
    import * as signalR from "@microsoft/signalr";

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

    connection.on("ReceiveMessage", (message) => {
        console.log(message);
    });

    connection.onclose(async () => {
        await start();
    });

    start();
</script>

<template>
    <main>
        Room
    </main>
</template>
