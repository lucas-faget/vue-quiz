<script setup lang="ts">
    /* Types */
    import type { Question } from '@/types/Question';
    import type { AnswerTry } from '@/types/AnswerTry';
    /* Components */
    import Tag from '@/components/Tag.vue';
    import Answer from '@/components/Answer.vue';

    defineProps<{
        questionNumber: number,
        maxQuestionNumber: number,
        question: Question,
        answer?: string,
        answerTries: AnswerTry[]
    }>();
</script>

<template>
    <div class="question-area">
        <div class="question-header">
            <div class="question-number-container">
                <span class="question-number">Question {{ questionNumber }}</span>
                <span class="max-question-number">/{{ maxQuestionNumber }}</span>
            </div>
            <div class="question-category">
                <div>{{ question.category }}</div>
                <tag v-if="question.difficulty" :text="question.difficulty"></tag>
            </div>
        </div>
        <div class="question-title">{{ question.title }}</div>
        <div class="answers">
            <div class="answer" v-if="answer">{{ answer }}</div>
            <answer v-for="(answerTry, index) in answerTries" :key="index" :answerTry="answerTry"></answer>
        </div>
    </div>
</template>

<style scoped>
    .question-area {
        display: flex;
        flex-direction: column;
        gap: 20px;
    }

    .question-header {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    .question-number-container {
        color: var(--color-gray);
        background-color: var(--color-dark-blue);
        padding: 10px 20px;
        border-radius: 10px;
    }

    .question-number {
        font-size: 25px;
    }

    .max-question-number {
        margin-left: 5px;
    }

    .question-category {
        background-color: var(--color-dark-blue);
        padding: 10px 20px;
        border-radius: 10px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .question-title {
        font-size: 20px;
    }

    .answers {
        min-height: 190px;
        display: flex;
        flex-direction: column;
        gap: 10px;
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
</style>
