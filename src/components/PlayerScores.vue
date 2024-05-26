<script setup lang="ts">
import type { Player } from "@/types/Player";

defineProps<{
    players: Player[];
}>();
</script>

<template>
    <div class="player-scores scrollbar">
        <table>
            <thead>
                <tr>
                    <th>Rank</th>
                    <th>Name</th>
                    <th>Result</th>
                    <th>Points</th>
                    <th>▴/▾</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(player, index) in players" :key="index">
                    <td>{{ player.rank }}</td>
                    <td>{{ player.name }}</td>
                    <td>
                        <div class="img-container">
                            <template v-if="player.score?.hasAnsweredRight">
                                <img
                                    v-if="player.score.order === 1"
                                    src="/icons/first.svg"
                                    alt="right answer"
                                />
                                <img
                                    v-else-if="player.score.order === 2"
                                    src="/icons/second.svg"
                                    alt="right answer"
                                />
                                <img
                                    v-else-if="player.score.order === 3"
                                    src="/icons/third.svg"
                                    alt="right answer"
                                />
                                <img v-else src="/icons/right.svg" alt="right answer" />
                            </template>
                        </div>
                    </td>
                    <td>{{ player.totalPoints }}</td>
                    <td>
                        <span
                            v-if="player.previousRank && player.previousRank < player.rank"
                            class="color-wrong"
                            >▼</span
                        >
                        <span
                            v-else-if="player.previousRank && player.previousRank > player.rank"
                            class="color-right"
                            >▲</span
                        >
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<style scoped>
.player-scores {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 5px;
}

table {
    width: 100%;
    border-collapse: collapse;
}

tr > td {
    height: 40px;
    display: table-cell;
    vertical-align: bottom;
}

th {
    color: var(--color-blue-gray);
}

tr > th:nth-child(-n + 2),
td:nth-child(-n + 2) {
    text-align: left;
}

tr > th:nth-child(n + 3),
td:nth-child(n + 3) {
    text-align: right;
}

td > .img-container {
    display: flex;
    justify-content: flex-end;
    align-items: center;
}

td > .img-container > img {
    width: 30px;
    aspect-ratio: 1/1;
}
</style>
