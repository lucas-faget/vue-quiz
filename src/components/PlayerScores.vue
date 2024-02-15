<script setup lang="ts">
    import type { Player } from '@/types/Player';
    import PlayerScore from '@/components/PlayerScore.vue';

    defineProps<{
        players: Player[]
    }>();
</script>

<template>
    <div class="player-scores scrollbar">
        <player-score v-for="(player, index) in players" :key="index" :player="player"></player-score>
    </div>
</template>

<style scoped>
    .player-scores {
        display: flex;
        flex-direction: column;
        gap: 5px;
    }
</style>
