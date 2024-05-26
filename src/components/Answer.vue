<script setup lang="ts">
import { AnswerResult } from "@/types/AnswerResult";
import type { AnswerTry } from "@/types/AnswerTry";

defineProps<{
    answerTry: AnswerTry;
}>();
</script>

<template>
    <div v-if="answerTry.result === AnswerResult.Right" class="answer-try right-answer">
        <img src="/icons/right.svg" alt="right answer" />
        <div>{{ answerTry.text }}</div>
    </div>

    <div
        v-else-if="answerTry.result === AnswerResult.AlmostRight"
        class="answer-try almost-right-answer"
    >
        <img src="/icons/almost-right.svg" alt="almost right answer" />
        <div>{{ answerTry.text }}</div>
    </div>

    <div v-else class="answer-try wrong-answer">
        <img src="/icons/wrong.svg" alt="wrong answer" />
        <div>{{ answerTry.text }}</div>
    </div>
</template>

<style scoped>
.answer-try {
    background-color: var(--color-darkest-blue);
    height: 40px;
    padding-inline: 10px;
    display: flex;
    align-items: center;
    gap: 10px;
    border-radius: 10px;
    overflow-x: hidden;
}

.wrong-answer {
    border: 2px solid var(--color-wrong);
}

.almost-right-answer {
    border: 2px solid var(--color-almost-right);
}

.right-answer {
    border: 2px solid var(--color-right);
}

.answer-try > img {
    width: 20px;
    aspect-ratio: 1/1;
}
</style>
