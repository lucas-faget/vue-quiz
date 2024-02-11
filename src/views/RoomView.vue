<script setup lang="ts">
    import * as quizHub from '@/signalr/QuizHubClient';
    import { ref, onMounted, onBeforeUnmount } from 'vue';
    import { useRoute, useRouter } from 'vue-router';
    import type { Player } from '@/types/Player';
    import type { Message } from '@/types/Message';
    import type { Question } from '@/types/Question';
    import { AnswerResult } from '@/types/AnswerResult';
    import type { AnswerAttempt } from '@/types/AnswerAttempt';
    import Tag from '@/components/Tag.vue';
    import Countdown from '@/components/Countdown.vue';
    import Answer from '@/components/Answer.vue';

    const route = useRoute();
    const router = useRouter();

    const roomCode = ref<string|undefined>(undefined);
    const playerName = ref<string>("Me");
    const players = ref<Player[]>([]);
    const userMessage = ref<string>("");
    const chat = ref<Message[]>([]);
    const questionNumber = ref<number>(0);
    const maxQuestionNumber = ref<number>(0);
    const question = ref<Question|undefined>(undefined);
    const canAnswer = ref<boolean>(false);
    const userAnswer = ref<string>("");
    const answerAttempts = ref<AnswerAttempt[]>([]);
    const answer = ref<string>("");
    const countdown = ref<any>(null);

    const isValidCode = (code: string): boolean => {
        return /^[A-Z0-9]{4}$/.test(code);
    };

    quizHub.connection.on("ReceivePlayers", (playerList: Player[]) => {
        players.value = playerList;
    });

    quizHub.connection.on("ReceivePlayers", (playerList: Player[]) => {
        players.value = playerList;
    });

    quizHub.connection.on("ReceiveMessage", (content: string, author?: string) => {
        chat.value.push({
            author,
            content
        });
    });

    quizHub.connection.on("ReceiveDelay", (seconds: number) => {
        handleRestartCountdown(seconds);
    });
    
    quizHub.connection.on("ReceiveQuestion", (q: Question, seconds: number, number: number, maxNumber: number) => {
        answer.value = "";
        answerAttempts.value = [];
        questionNumber.value = number;
        maxQuestionNumber.value = maxNumber;
        canAnswer.value = true;
        question.value = q;
        handleRestartCountdown(seconds);
    });

    quizHub.connection.on("ReceiveAnswerResult", (answerResult: AnswerResult) => {
        if (answerAttempts.value.length < 3) {
            answerAttempts.value.push({
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

    quizHub.connection.on("ReceiveAnswer", (a: string) => {
        canAnswer.value = false;
        answer.value = a;
    });

    const handleMessageSending = async () => {
        if (roomCode.value && /\S/.test(userMessage.value)) {
            chat.value.push({
                author: playerName.value,
                content: userMessage.value
            });
            await quizHub.sendUserMessage(roomCode.value, userMessage.value);
        }
        userMessage.value = "";
    }

    const handleUserAnswerSending = async () => {
        if (roomCode.value && canAnswer.value && question.value && /\S/.test(userAnswer.value)) {
            await quizHub.sendAnswer(roomCode.value, question.value.id ,userAnswer.value);
        }
        userAnswer.value = "";
    }

    const handleRestartCountdown = (seconds: number) => {
        if (countdown.value) {
            countdown.value.restartCountdown(seconds);
        }
    };

    onMounted(async () => {
        await quizHub.startConnection();

        if (route.params.code === undefined) {
            const code: string|undefined = await quizHub.createRoom();
            console.log(code);
            if (code) {
                roomCode.value = code;
                await quizHub.startGame(code);
            }
        } else {
            if (isValidCode(route.params.code as string)) {
                const roomExists = await quizHub.connection.invoke("RoomExists", route.params.code);
                if (roomExists) {
                    await quizHub.joinRoom(route.params.code as string);
                    roomCode.value = route.params.code as string;
                } else {
                    router.push({ name: 'home' });
                }
            } else {
                router.push({ name: 'home' });
            }
        }
    });

    onBeforeUnmount(async () => {
        await quizHub.stopConnection();
    });
</script>

<template>
    <main>
        <div class="board">
            <section>
                <div class="section-header">players</div>
                <div class="section-content">
                    <div>
                        <div v-for="(player, index) in players" :key="index">
                            {{ player.name }}
                        </div>
                    </div>
                </div>
            </section>
            <section>
                <div class="section-header">question</div>
                <div class="section-content">
                    <div style="display: flex; flex-direction: column; gap: 10px;">
                        <div class="color-gray">
                            <div style="background-color: var(--color-dark-blue); padding: 10px 20px; border-radius: 10px;">
                                <span style="font-size: 25px;">Question {{ questionNumber }}</span>
                                <span style="margin-left: 5px;">/{{ maxQuestionNumber }}</span>
                            </div>
                        </div>
                        <div v-if="question" style="display: flex; justify-content: space-between; align-items: center;">
                            <div style="background-color: var(--color-dark-blue); padding: 10px 20px; border-radius: 10px;">
                                <div v-if="question.category">{{ question.category }}</div>
                            </div>
                            <tag v-if="question.difficulty" :text="question.difficulty"></tag>
                        </div>
                    </div>
                    <countdown ref="countdown"></countdown>
                    <div v-if="question" style="font-size: 16px;">{{ question.title }}</div>
                    <div style="display: flex; flex-direction: column; gap: 10px;">
                        <div v-if="answer" class="answer">{{ answer  }}</div>
                        <answer v-for="(answerAttempt, index) in answerAttempts" :key="index" :answerAttempt="answerAttempt"></answer>
                    </div>
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
                    <div class="messages">
                        <div class="message" v-for="(message, index) in chat" :key="index">
                            <span class="color-gray" v-if="message.author">{{ message.author }}</span>
                            <span v-if="message.content">{{ message.content }}</span>
                        </div>
                    </div>
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
        min-height: 100vh;
        display: flex;
		justify-content: center;
    }

    .board {
		margin-top: 20px;
		display: flex;
        align-items: flex-start;
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
        min-height: 600px;
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
        position: absolute;
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

    .answer {
        background-color: var(--color-right);
        height: 40px;
        padding-inline: 15px;
        display: flex;
        align-items: center;
        gap: 10px;
        border-radius: 10px;
    }

    .message {
        display: flex;
        gap: 10px;
    }
</style>
