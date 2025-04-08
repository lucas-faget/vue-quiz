<script lang="ts">
    import type { Message } from "$lib/types/Message";

    const { messages = [] }: { messages: Message[] } = $props();
</script>

<div class="flex flex-col">
    {#each messages as message, index}
        <div class={`px-2.5 py-1.5 ${index % 2 === 1 ? "bg-muted" : ""} rounded-md`}>
            {#if message.author}
                <span class="text-muted-foreground me-0.5">{message.author}</span>
            {/if}
            <span>{message.content}</span>
        </div>
    {/each}
</div>
