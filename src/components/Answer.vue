<script setup lang="ts">
    import { AnswerResult } from '@/types/AnswerResult';
    import type { AnswerAttempt } from '@/types/AnswerAttempt';

    defineProps<{
        answerAttempt: AnswerAttempt
    }>();
</script>

<template>
    <div v-if="answerAttempt.result === AnswerResult.Right" class="answer-attempt right-answer">
        <img src="/icons/right.svg" alt="right answer"/>
        <div>{{ answerAttempt.text }}</div>
    </div>

    <div v-else class="answer-attempt wrong-answer">
        <img src="/icons/wrong.svg" alt="wrong answer"/>
        <div>{{ answerAttempt.text }}</div>
    </div>
</template>

<style scoped>
    .answer-attempt {
        background-color: var(--color-dark-blue);
        height: 40px;
        padding-inline: 10px;
        display: flex;
        align-items: center;
        gap: 10px;
        border-radius: 10px;
    }

    .wrong-answer {
        border: 2px solid var(--color-wrong);
    }

    .right-answer {
        border: 2px solid var(--color-right);
    }

    .answer-attempt > img {
        width: 20px;
        aspect-ratio: 1/1;
    }
</style>
