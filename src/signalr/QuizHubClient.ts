"use strict";

import * as signalR from "@microsoft/signalr";

export const buildConnection = () => new signalR.HubConnectionBuilder()
    .withUrl("wss://localhost:7052/quizHub", {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets
    })
    .configureLogging(signalR.LogLevel.Information)
    .build();

export const connection = buildConnection();
export const game = buildConnection();

export async function startConnection() {
    await connection.start();
    console.log("SignalR Connected.");
};

export async function stopConnection() {
    await connection.stop();
    console.log("SignalR Disconnected.");
};

export async function createRoom(playerName: string = ""): Promise<string|undefined> {
    try {
        return await connection.invoke("CreateRoom", playerName);
    } catch (err) {
        console.error("Failed to create room:", err);
    }
};

export async function joinRoom(code: string, playerName: string = "") {
    try {
        await connection.invoke("JoinRoom", code, playerName);
    } catch (err) {
        console.error("Failed to join room:", err);
    }
};

export async function startGame(code: string) {
    try {
        await game.start();
        await game.invoke("StartGame", code);
        await game.stop();
    } catch (err) {
        console.error("Failed to start game:", err);
    }
};

export async function sendUserMessage(roomCode: string, message: string) {
    try {
        await connection.invoke("SendUserMessage", roomCode, message);
    } catch (err) {
        console.log("Failed to send message:", err);
    }
};

export async function sendAnswer(roomCode: string, questionId: number, userAnswer: string) {
    try {
        await connection.invoke("CheckAnswer", roomCode, questionId, userAnswer);
    } catch (err) {
        console.log("Failed to send answer:", err);
    }
};
