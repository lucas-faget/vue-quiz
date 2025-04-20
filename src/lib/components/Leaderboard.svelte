<script lang="ts">
    import { room } from "$lib/stores/room.svelte";
    import { AnimalEmoji } from "$lib/types/AnimalEmoji";
    import type { Player } from "$lib/types/Player";
    import type { Score } from "$lib/types/Score";

    function getRandomAnimalEmoji(): AnimalEmoji {
        const emojis = Object.values(AnimalEmoji);
        const randomIndex = Math.floor(Math.random() * emojis.length);
        return emojis[randomIndex];
    }
</script>

{#snippet medal(score: Score | undefined = undefined)}
    <div class="size-8 flex justify-center items-center ms-1.5">
        {#if score?.hasAnsweredRight}
            {#if score.order === 1}
                <img src="/icons/gold-medal.svg" alt="Gold medal" class="size-full" />
            {:else if score.order === 2}
                <img src="/icons/silver-medal.svg" alt="Silver medal" class="size-full" />
            {:else if score.order === 3}
                <img src="/icons/bronze-medal.svg" alt="Bronze medal" class="size-full" />
            {:else}
                <iconify-icon icon="mdi:check-circle" class="text-4xl text-green-600"></iconify-icon>
            {/if}
        {:else}
            <div class="size-full rounded-full bg-background"></div>
        {/if}
    </div>
{/snippet}

{#snippet rankingTrend(player: Player)}
    <div class="size-4 flex justify-center items-center">
        {#if player.previousRank && player.previousRank !== player.rank}
            {#if player.previousRank < player.rank}
                <iconify-icon icon="mdi:arrow-down-thick" class="text-xl text-red-400"></iconify-icon>
            {:else}
                <iconify-icon icon="mdi:arrow-up-thick" class="text-xl text-green-600"></iconify-icon>
            {/if}
        {/if}
    </div>
{/snippet}

<div class="flex flex-col gap-3">
    {#each room.players as player}
        <div class="bg-muted py-4 px-4 rounded-2xl flex gap-4 items-center">
            <div class="flex-1 flex items-center gap-3 text-nowrap truncate">
                <span class="text-2xl font-bold">{player.rank}</span>
                <iconify-icon icon={getRandomAnimalEmoji()} class="text-4xl"></iconify-icon>
                <span class="text-muted-foreground">{player.name}</span>
            </div>
            <div class="flex items-center">
                <span class="w-[3ch] text-right me-1">{player.totalPoints}</span>
                {@render rankingTrend(player)}
                {@render medal(player.score)}
            </div>
        </div>
    {/each}
</div>
