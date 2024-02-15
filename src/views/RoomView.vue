<script setup lang="ts">
    import { ref, onBeforeMount, onBeforeUnmount } from 'vue';
    import { useStore } from 'vuex';
    import { useRoute } from 'vue-router';
    import { startConnection, stopConnection, createRoom, joinRoom, sendUserMessage, startGame, sendAnswer, buildConnection } from '@/signalr/QuizHubClient';
    /* Types */
    import type { Player } from '@/types/Player';
    import type { Question } from '@/types/Question';
    import { AnswerResult } from '@/types/AnswerResult';
    import type { AnswerTry } from '@/types/AnswerTry';
    import type { Message } from '@/types/Message';
    /* Components */
    import PlayerScores from '@/components/PlayerScores.vue';
    import Countdown from '@/components/Countdown.vue';
    import QuestionArea from '@/components/QuestionArea.vue';
    import Chat from '@/components/Chat.vue';

    const store = useStore();
    const route = useRoute();

    /* Room */
    const roomCode = ref<string|undefined>(undefined);
    /* Players */
    const playerName = ref<string>(store.state.playerName);
    const players = ref<Player[]>([]);
    /* Question */
    const questionNumber = ref<number>(0);
    const maxQuestionNumber = ref<number>(0);
    const countdown = ref<any>(null);
    const question = ref<Question|undefined>(undefined);
    const answer = ref<string>("");
    const canAnswer = ref<boolean>(false);
    const userAnswer = ref<string>("");
    const answerTries = ref<AnswerTry[]>([]);
    /* Chat */
    const userMessage = ref<string>("");
    const messages = ref<Message[]>([]);

    store.state.connection.on("ReceivePlayers", (playerScores: Player[]) => {
        players.value = playerScores;
    });

    store.state.connection.on("ReceiveMessage", (content: string, author?: string) => {
        messages.value.push({
            author,
            content
        });
    });

    store.state.connection.on("ReceiveDelay", (seconds: number) => {
        handleRestartCountdown(seconds);
    });
    
    store.state.connection.on("ReceiveQuestion", (q: Question, seconds: number, number: number, maxNumber: number) => {
        answer.value = "";
        answerTries.value = [];
        questionNumber.value = number;
        maxQuestionNumber.value = maxNumber;
        canAnswer.value = true;
        question.value = q;
        handleRestartCountdown(seconds);
    });

    store.state.connection.on("ReceiveAnswerResult", (answerResult: AnswerResult) => {
        if (answerTries.value.length < 3) {
            answerTries.value.push({
                text: userAnswer.value,
                result: answerResult
            });
            if (answerResult === AnswerResult.Right) {
                canAnswer.value = false;
            }
        } else {
            canAnswer.value = false;
        }
    });

    store.state.connection.on("ReceiveAnswer", (a: string) => {
        canAnswer.value = false;
        answer.value = a;
    });

    const handleMessageSending = async () => {
        if (roomCode.value && /\S/.test(userMessage.value)) {
            messages.value.push({
                author: playerName.value,
                content: userMessage.value
            });
            await sendUserMessage(store.state.connection, roomCode.value, userMessage.value);
        }
        userMessage.value = "";
    };

    const handleUserAnswerSending = async () => {
        if (roomCode.value && canAnswer.value && question.value && /\S/.test(userAnswer.value)) {
            await sendAnswer(store.state.connection, roomCode.value, question.value.id ,userAnswer.value);
        }
        userAnswer.value = "";
    };

    const handleRestartCountdown = (seconds: number) => {
        if (countdown.value) {
            countdown.value.restartCountdown(seconds);
        }
    };

    onBeforeMount(async () => {
        await startConnection(store.state.connection);

        if (route.params.code === undefined) {
            const code: string|undefined = await createRoom(store.state.connection, playerName.value);
            console.log(code);
            if (code) {
                roomCode.value = code;
                const game = buildConnection();
                await startGame(game, code);
            }
        } else {
            roomCode.value = route.params.code as string;
            await joinRoom(store.state.connection, roomCode.value, playerName.value);
        }
    });

    onBeforeUnmount(async () => {
        await stopConnection(store.state.connection);
    });
</script>

<template>
    <main>
        <div class="board">
            <section>
                <div class="section-header">players</div>
                <div class="section-content">
                    <player-scores :players="players"></player-scores>
                </div>
            </section>
            <section>
                <div class="section-header">question</div>
                <div class="section-content">
                    <countdown ref="countdown"></countdown>
                    <question-area v-if="question"
                        :questionNumber="questionNumber"
                        :maxQuestionNumber="maxQuestionNumber"
                        :question="question"
                        :answer="answer"
                        :answerTries="answerTries">
                    </question-area>
                    <div class="input-group">
                        <input type="text" v-model="userAnswer" @keyup.enter="handleUserAnswerSending" />
                        <div class="icon-container" @click="handleUserAnswerSending">
                            <img src="/icons/send.svg" />
                        </div>
                    </div>
                </div>
            </section>
            <section>
                <div class="section-header">chat</div>
                <div class="section-content">
                    <chat :messages="messages"></chat>
                    <div class="input-group">
                        <input type="text" v-model="userMessage" @keyup.enter="handleMessageSending" />
                        <div class="icon-container" @click="handleMessageSending">
                            <img src="/icons/send.svg" />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    </main>
</template>

<style scoped>
    main {
        display: flex;
		justify-content: center;
    }

    .board {
		margin-block: 20px;
		display: flex;
		gap: 30px;
    }
    .board > section:nth-child(1) {
        width: 300px;
    }
    .board > section:nth-child(2) {
        width: 500px;
    }
    .board > section:nth-child(3) {
        width: 300px;
    }

    section {
        position: relative;
        background-color: var(--color-blue);
        width: 300px;
        margin-top: calc(var(--section-header-height) / 2);
        display: flex;
        flex-direction: column;
        gap: 20px;
        border-image: var(--color-linear-gradient-green) 1;
        border-width: 3px;
        border-style: solid;
    }

    .section-header {
        position: absolute;
        top: calc(var(--section-header-height) / -2);
        left: calc(50% - calc(var(--section-header-width) / 2));
        color: var(--color-dark-blue);
        background: var(--color-linear-gradient-green);
        width: 150px;
        height: 50px;
        display: flex;
        justify-content: center;
        align-items: center;
        border: 5px solid var(--color-blue);
        border-radius: 20px;
        font-size: 15px;
        font-weight: bold;
        text-transform: uppercase;
    }

    .section-content {
        width: 100%;
        height: 100%;
        padding-block: calc(var(--section-padding) / 2 + var(--section-header-height) / 2) 20px;
        padding-inline: 20px;
        display: flex;
        flex-direction: column;
        gap: 20px;
    }

    .section-content > .input-group {
        margin-top: auto;
    }
</style>
