import { browser } from "$app/environment";
import type { HubConnection } from "@microsoft/signalr";
import { buildConnection, sendAnswer, sendUserMessage } from "../signalr/QuizHubClient";
import { restartCountdown } from "./countdown.svelte";
import type { Player } from "$lib/types/Player";
import type { Question } from "$lib/types/Question";
import type { AnswerTry } from "$lib/types/AnswerTry";
import type { Message } from "$lib/types/Message";
import { AnswerResult } from "$lib/types/AnswerResult";

interface QuizRoom {
    /* SignalR connection */
    connection: HubConnection | undefined;
    /* Room */
    roomCode: string | undefined;
    /* Players */
    playerName: string;
    players: Player[];
    /* Question */
    questionNumber: number;
    maxQuestionNumber: number;
    question: Question | undefined;
    answer: string;
    canAnswer: boolean;
    userAnswer: string;
    answerTries: AnswerTry[];
    /* Chat */
    userMessage: string;
    messages: Message[];
}

export const room = $state<QuizRoom>({
    connection: undefined,
    roomCode: "",
    playerName: "",
    players: [],
    questionNumber: 0,
    maxQuestionNumber: 0,
    question: undefined,
    answer: "",
    canAnswer: false,
    userAnswer: "",
    answerTries: [],
    userMessage: "",
    messages: [],
});

if (browser) {
    room.connection = buildConnection();

    room.connection.on("ReceivePlayers", (playerScores: Player[]) => {
        room.players = playerScores;
    });

    room.connection.on("ReceiveMessage", (content: string, author?: string) => {
        room.messages.push({
            author,
            content,
        });
    });

    room.connection.on("ReceiveDelay", (seconds: number) => {
        restartCountdown(seconds);
    });

    room.connection.on("ReceiveQuestion", (q: Question, seconds: number, number: number, maxNumber: number) => {
        room.answer = "";
        room.answerTries = [];
        room.questionNumber = number;
        room.maxQuestionNumber = maxNumber;
        room.canAnswer = true;
        room.question = q;
        restartCountdown(seconds);
    });

    room.connection.on("ReceiveAnswerResult", (answerResult: AnswerResult) => {
        if (room.answerTries.length < 3) {
            room.answerTries.push({
                text: room.userAnswer,
                result: answerResult,
            });
            if (answerResult === AnswerResult.Right) {
                room.canAnswer = false;
            }
        } else {
            room.canAnswer = false;
        }
    });

    room.connection.on("ReceiveAnswer", (a: string) => {
        room.canAnswer = false;
        room.answer = a;
    });
}

export const handleMessageSending = async (e: Event) => {
    e.preventDefault();
    if (room.connection) {
        if (room.roomCode && /\S/.test(room.userMessage)) {
            room.messages.push({
                author: room.playerName,
                content: room.userMessage,
            });
            await sendUserMessage(room.connection, room.roomCode, room.userMessage);
        }
        room.userMessage = "";
    }
};

export const handleUserAnswerSending = async (e: Event) => {
    e.preventDefault();
    if (room.connection) {
        if (room.roomCode && room.canAnswer && room.question && /\S/.test(room.userAnswer)) {
            await sendAnswer(room.connection, room.roomCode, room.question.id, room.userAnswer);
        }
        room.userAnswer = "";
    }
};
