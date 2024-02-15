<script setup lang="ts">
    import type { Message } from '@/types/Message';

    defineProps<{
        messages: Message[]
    }>();
</script>

<template>
    <div class="scrollbar">
        <div v-for="(message, index) in messages" :key="index">
            <span v-if="message.author" class="author">{{ message.author }}</span>
            <span v-if="message.content">{{ message.content }}</span>
        </div>
    </div>
</template>

<style scoped>
    .author {
        color: var(--color-gray);
        margin-right: 10px;
    }
</style>
