"use strict";

import * as signalR from "@microsoft/signalr";

export const buildConnection = () => new signalR.HubConnectionBuilder()
    .withUrl("wss://localhost:7052/quizHub", {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets
    })
    .configureLogging(signalR.LogLevel.Information)
    .build();

export async function startConnection(connection: signalR.HubConnection) {
    await connection.start();
    console.log("SignalR Connected.");
};

export async function stopConnection(connection: signalR.HubConnection) {
    await connection.stop();
    console.log("SignalR Disconnected.");
};

export async function createRoom(connection: signalR.HubConnection, playerName: string = ""): Promise<string|undefined> {
    try {
        return await connection.invoke("CreateRoom", playerName);
    } catch (err) {
        console.error("Failed to create room:", err);
    }
};

export async function joinRoom(connection: signalR.HubConnection,code: string, playerName: string = "") {
    try {
        await connection.invoke("JoinRoom", code, playerName);
    } catch (err) {
        console.error("Failed to join room:", err);
    }
};

export async function startGame(connection: signalR.HubConnection, code: string) {
    try {
        await connection.start();
        await connection.invoke("StartGame", code);
        await connection.stop();
    } catch (err) {
        console.error("Failed to start game:", err);
    }
};

export async function sendUserMessage(connection: signalR.HubConnection, roomCode: string, message: string) {
    try {
        await connection.invoke("SendUserMessage", roomCode, message);
    } catch (err) {
        console.error("Failed to send message:", err);
    }
};

export async function sendAnswer(connection: signalR.HubConnection, roomCode: string, questionId: number, userAnswer: string) {
    try {
        await connection.invoke("CheckAnswer", roomCode, questionId, userAnswer);
    } catch (err) {
        console.error("Failed to send answer:", err);
    }
};
