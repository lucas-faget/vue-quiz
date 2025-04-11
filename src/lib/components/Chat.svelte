<script lang="ts">
    import { room } from "$lib/stores/room.svelte";
</script>

<div class="flex flex-col">
    {#each room.messages as message, index}
        <div class={`px-2.5 py-1.5 ${index % 2 === 1 ? "bg-muted" : ""} rounded-md`}>
            {#if message.author}
                <span class="text-muted-foreground me-0.5">{message.author}</span>
            {/if}
            <span>{message.content}</span>
        </div>
    {/each}
</div>
