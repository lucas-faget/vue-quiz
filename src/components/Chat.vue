<script setup lang="ts">
import type { Message } from "@/types/Message";

defineProps<{
    messages: Message[];
}>();
</script>

<template>
    <div class="scrollbar">
        <div
            :class="{ message: true, 'dark-message': index % 2 === 1 }"
            v-for="(message, index) in messages"
            :key="index"
        >
            <span v-if="message.author" class="author">{{ message.author }}</span>
            <span v-if="message.content">{{ message.content }}</span>
        </div>
    </div>
</template>

<style scoped>
.message {
    padding: 5px 10px;
}

.dark-message {
    background-color: var(--color-darkest-blue);
}

.author {
    color: var(--color-blue);
    margin-right: 10px;
}
</style>
