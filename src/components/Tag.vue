<script setup lang="ts">
defineProps<{
    text: string;
}>();
</script>

<template>
    <div class="tag">
        {{ text }}
    </div>
</template>

<style>
.tag {
    color: var(--color-blue-gray);
    background: var(--color-blue);
    height: 30px;
    padding-inline: 15px;
    display: flex;
    align-items: center;
    font-size: 14px;
    font-weight: bold;
    border-radius: 20px;
}
</style>
