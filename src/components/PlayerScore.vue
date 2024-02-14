<script setup lang="ts">
    import type { Player } from '@/types/Player';

    defineProps<{
        player: Player
    }>();
</script>

<template>
    <div class="player-score">
        <div class="player">
            {{ player.name }}
        </div>

        <div class="score">
            <img v-if="player.score?.hasAnsweredRight" src="/icons/right.svg" alt="right answer"/>
            <span class="points">{{ player.totalPoints }}</span>
        </div>
    </div>
</template>

<style scoped>
    .player-score {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .score {
        display: flex;
        align-items: center;
    }

    .score > img {
        width: 25px;
        aspect-ratio: 1/1;
    }

    .points {
        width: 40px;
        text-align: right;
        font-size: 18px;
    }
</style>
