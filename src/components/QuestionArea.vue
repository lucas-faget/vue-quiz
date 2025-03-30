<script setup lang="ts">
/* Types */
import type { Question } from "@/types/Question";
import type { AnswerTry } from "@/types/AnswerTry";
/* Components */
import Tag from "@/components/Tag.vue";
import Answer from "@/components/Answer.vue";

defineProps<{
    questionNumber: number;
    maxQuestionNumber: number;
    question: Question;
    answer?: string;
    answerTries: AnswerTry[];
}>();
</script>

<template>
    <div class="question-area">
        <div class="question-header">
            <div class="question-number">
                <span>Question {{ questionNumber }}</span>
                <span>/{{ maxQuestionNumber }}</span>
            </div>
            <div class="line"></div>
        </div>
        <div class="question-category">
            <div>{{ question.category }}</div>
            <tag v-if="question.difficulty" :text="question.difficulty"></tag>
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
    gap: 15px;
}

.question-number {
    color: var(--color-blue);
}

.question-number > span:nth-child(1) {
    font-size: 25px;
}

.question-number > span:nth-child(2) {
    margin-left: 5px;
}

.question-category {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.question-category > div:nth-child(1) {
    font-size: 18px;
}

.question-title {
    background-color: var(--color-darkest-blue);
    padding: 20px;
    text-align: center;
    font-size: 20px;
    border-radius: 30px;
}

.answers {
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
