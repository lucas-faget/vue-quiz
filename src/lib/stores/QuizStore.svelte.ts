import { writable } from "svelte/store";
import { browser } from "$app/environment";
import { buildConnection, sendAnswer, sendUserMessage } from "../signalr/QuizHubClient";
import type { HubConnection } from "@microsoft/signalr";
import type { Player } from "$lib/types/Player";
import type { Question } from "$lib/types/Question";
import type { AnswerTry } from "$lib/types/AnswerTry";
import type { Message } from "$lib/types/Message";
import { AnswerResult } from "$lib/types/AnswerResult";

interface QuizStore {
    /* SignalR connection */
    connection: HubConnection | undefined;
    /* Room */
    roomCode: string | undefined;
    /* Players */
    playerName: string;
    players: Player[];
    /* Question */
    countdown: any;
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

export const store = $state<QuizStore>({
    connection: undefined,
    roomCode: "",
    playerName: "",
    players: [],
    countdown: null,
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
    store.connection = buildConnection();

    store.connection.on("ReceivePlayers", (playerScores: Player[]) => {
        store.players = playerScores;
    });

    store.connection.on("ReceiveMessage", (content: string, author?: string) => {
        store.messages.push({
            author,
            content,
        });
    });

    store.connection.on("ReceiveDelay", (seconds: number) => {
        handleRestartCountdown(seconds);
    });

    store.connection.on("ReceiveQuestion", (q: Question, seconds: number, number: number, maxNumber: number) => {
        store.answer = "";
        store.answerTries = [];
        store.questionNumber = number;
        store.maxQuestionNumber = maxNumber;
        store.canAnswer = true;
        store.question = q;
        handleRestartCountdown(seconds);
    });

    store.connection.on("ReceiveAnswerResult", (answerResult: AnswerResult) => {
        if (store.answerTries.length < 3) {
            store.answerTries.push({
                text: store.userAnswer,
                result: answerResult,
            });
            if (answerResult === AnswerResult.Right) {
                store.canAnswer = false;
            }
        } else {
            store.canAnswer = false;
        }
    });

    store.connection.on("ReceiveAnswer", (a: string) => {
        store.canAnswer = false;
        store.answer = a;
    });
}

export const handleMessageSending = async () => {
    if (store.connection) {
        if (store.roomCode && /\S/.test(store.userMessage)) {
            store.messages.push({
                author: store.playerName,
                content: store.userMessage,
            });
            await sendUserMessage(store.connection, store.roomCode, store.userMessage);
        }
        store.userMessage = "";
    }
};

export const handleUserAnswerSending = async () => {
    if (store.connection) {
        if (store.roomCode && store.canAnswer && store.question && /\S/.test(store.userAnswer)) {
            await sendAnswer(store.connection, store.roomCode, store.question.id, store.userAnswer);
        }
        store.userAnswer = "";
    }
};

export const handleRestartCountdown = (seconds: number) => {
    if (store.countdown) {
        store.countdown.restartCountdown(seconds);
    }
};
