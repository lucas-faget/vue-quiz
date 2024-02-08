<script setup lang="ts">
    defineProps<{
        text: string
    }>();
</script>

<template>
    <div class="tag">
        {{ text }}
    </div>
</template>

<style>
    .tag {
        color: var(--color-black);
        background: var(--color-gray);
        height: 25px;
        padding-inline: 10px;
        display: flex;
        align-items: center;
        font-size: 12px;
        font-weight: bold;
        border-radius: 20px;
    }
</style>
