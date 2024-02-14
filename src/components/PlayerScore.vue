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
            <template v-if="player.score?.hasAnsweredRight">
                <img v-if="player.score.order === 1" src="/icons/first.svg" alt="right answer" />
                <img v-else-if="player.score.order === 2" src="/icons/second.svg" alt="right answer" />
                <img v-else-if="player.score.order === 3" src="/icons/third.svg" alt="right answer" />
                <img v-else src="/icons/right.svg" alt="right answer" />
            </template>
            <span class="points">{{ player.totalPoints }}</span>
        </div>
    </div>
</template>

<style scoped>
    .player-score {
        height: 30px;
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
