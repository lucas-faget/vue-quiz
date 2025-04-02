<script lang="ts">
    import { get } from "svelte/store";
    import { store } from "$lib/stores/QuizStore";
    import { sendAnswer, sendUserMessage } from "$lib/signalr/QuizHubClient";
    import type { HubConnection } from "@microsoft/signalr";
    /* Types */
    import type { Player } from "$lib/types/Player";
    import type { Question } from "$lib/types/Question";
    import { AnswerResult } from "$lib/types/AnswerResult";
    import type { AnswerTry } from "$lib/types/AnswerTry";
    import type { Message } from "$lib/types/Message";

    /* SignalR connection */
    const connection: HubConnection | undefined = get(store).connection;
    /* Room */
    const { roomCode } = $props();
    /* Players */
    const playerName: string = get(store).playerName;
    let players: Player[] = $state([]);
    /* Question */
    let countdown: any = $state(null);
    let questionNumber: number = $state(0);
    let maxQuestionNumber: number = $state(0);
    let question: Question | undefined = $state(undefined);
    let answer: string = $state("");
    let canAnswer: boolean = $state(false);
    let userAnswer: string = $state("");
    let answerTries: AnswerTry[] = $state([]);
    /* Chat */
    let userMessage: string = $state("");
    let messages: Message[] = $state([]);

    if (connection) {
        connection.on("ReceivePlayers", (playerScores: Player[]) => {
            players = playerScores;
        });

        connection.on("ReceiveMessage", (content: string, author?: string) => {
            messages.push({
                author,
                content,
            });
        });

        connection.on("ReceiveDelay", (seconds: number) => {
            handleRestartCountdown(seconds);
        });

        connection.on("ReceiveQuestion", (q: Question, seconds: number, number: number, maxNumber: number) => {
            answer = "";
            answerTries = [];
            questionNumber = number;
            maxQuestionNumber = maxNumber;
            canAnswer = true;
            question = q;
            handleRestartCountdown(seconds);
        });

        connection.on("ReceiveAnswerResult", (answerResult: AnswerResult) => {
            if (answerTries.length < 3) {
                answerTries.push({
                    text: userAnswer,
                    result: answerResult,
                });
                if (answerResult === AnswerResult.Right) {
                    canAnswer = false;
                }
            } else {
                canAnswer = false;
            }
        });

        connection.on("ReceiveAnswer", (a: string) => {
            canAnswer = false;
            answer = a;
        });

        const handleMessageSending = async () => {
            if (roomCode && /\S/.test(userMessage)) {
                messages.push({
                    author: playerName,
                    content: userMessage,
                });
                await sendUserMessage(connection, roomCode, userMessage);
            }
            userMessage = "";
        };

        const handleUserAnswerSending = async () => {
            if (roomCode && canAnswer && question && /\S/.test(userAnswer)) {
                await sendAnswer(connection, roomCode, question.id, userAnswer);
            }
            userAnswer = "";
        };

        const handleRestartCountdown = (seconds: number) => {
            if (countdown) {
                countdown.restartCountdown(seconds);
            }
        };
    }
</script>

<h1>Room</h1>
