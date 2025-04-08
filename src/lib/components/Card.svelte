<script lang="ts">
    let { children } = $props();
</script>

<div class="rounded-card border-muted bg-background-alt shadow-card w-full border p-3 flex flex-col gap-4">
    {@render children()}
</div>
