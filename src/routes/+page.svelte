<script lang="ts">
    import { goto } from "$app/navigation";
    import { RoomAction } from "$lib/types/RoomAction";
    import { store } from "$lib/stores/QuizStore";
    import { Tabs } from "bits-ui";
    import { Label } from "bits-ui";
    import { Button } from "bits-ui";

    const roomActions: RoomAction[] = [RoomAction.Join, RoomAction.Create];

    let activeRoomAction: RoomAction = $state(RoomAction.Join);

    const handleRoomAction = (e: Event) => {
        e.preventDefault();
        goto("/room");
    };
</script>

<main class="flex flex-col justify-center items-center mt-20">
    <div class="w-full max-w-lg">
        <Tabs.Root
            bind:value={activeRoomAction}
            class="rounded-card border-muted bg-background-alt shadow-card w-full border p-3"
        >
            <Tabs.List
                class="rounded-9px bg-dark-10 shadow-mini-inset dark:bg-background grid w-full grid-cols-2 gap-1 p-1 text-sm font-semibold leading-[0.01em] dark:border dark:border-neutral-600/30"
            >
                {#each roomActions as roomAction}
                    <Tabs.Trigger
                        value={roomAction}
                        class="data-[state=active]:shadow-mini dark:data-[state=active]:bg-muted h-8 rounded-[7px] bg-transparent py-2 data-[state=active]:bg-white"
                    >
                        {roomAction === RoomAction.Join ? "Join" : "Create"}
                    </Tabs.Trigger>
                {/each}
            </Tabs.List>

            {#each roomActions as roomAction}
                <Tabs.Content value={roomAction} class="select-none pt-3">
                    <form onsubmit={handleRoomAction}>
                        <div class="flex flex-col gap-8 pt-4">
                            <h1 class="text-4xl font-bold">Let's Play Quiz</h1>
                            <p class="text-sm">
                                {roomAction === RoomAction.Join
                                    ? "Enter your player name, enter the room code, then click on the button to join the room."
                                    : "Enter your player name, then click on the button to create a new room."}
                            </p>
                            <div class="flex w-full flex-col gap-1.5">
                                <Label.Root
                                    id="player-name-label"
                                    for="player-name"
                                    class="block select-none text-sm font-medium"
                                >
                                    Player Name
                                </Label.Root>
                                <input
                                    class="h-input rounded-input border-border-input bg-background text-foreground focus-within:border-border-input-hover focus-within:shadow-date-field-focus hover:border-border-input-hover data-invalid:border-destructive flex w-full select-none items-center border px-2 py-3 text-sm tracking-[0.01em]"
                                    id="player-name"
                                    name="player-name"
                                    type="text"
                                    placeholder="Enter your name..."
                                    bind:value={$store.playerName}
                                />
                            </div>
                            {#if roomAction === RoomAction.Join}
                                <div class="flex w-full flex-col gap-1.5">
                                    <Label.Root
                                        id="room-code-label"
                                        for="room-code"
                                        class="block select-none text-sm font-medium"
                                    >
                                        Room Code
                                    </Label.Root>
                                    <input
                                        class="h-input rounded-input border-border-input bg-background text-foreground focus-within:border-border-input-hover focus-within:shadow-date-field-focus hover:border-border-input-hover data-invalid:border-destructive flex w-full select-none items-center border px-2 py-3 text-sm tracking-[0.01em]"
                                        id="room-code"
                                        name="room-code"
                                        type="text"
                                        placeholder="Enter the room code..."
                                        bind:value={$store.roomCode}
                                    />
                                </div>
                            {/if}
                            <Button.Root
                                class="rounded-input bg-dark text-background shadow-mini hover:bg-dark/95 inline-flex h-12 items-center justify-center px-[21px] text-[15px] font-semibold active:scale-[0.98] active:transition-all"
                            >
                                {roomAction === RoomAction.Join ? "JOIN ROOM" : "CREATE ROOM"}
                            </Button.Root>
                        </div>
                    </form>
                </Tabs.Content>
            {/each}
        </Tabs.Root>
    </div>
</main>
