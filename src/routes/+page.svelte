<script lang="ts">
    import { goto } from "$app/navigation";
    import { RoomAction } from "$lib/types/RoomAction";
    import { setPlayerName } from "$lib/stores/QuizStore";
    import { Tabs } from "bits-ui";
    import { Label } from "bits-ui";
    import { Button } from "bits-ui";

    let roomAction: RoomAction = $state(RoomAction.Join);
    let playerName: string = $state("");
    let roomCode: string = $state("");

    const handleRoomAction = () => {
        setPlayerName(playerName);
        if (roomAction === RoomAction.Join) {
            goto(`/room/${roomCode}`);
        } else {
            goto("/room");
        }
    };
</script>

<main class="flex flex-col justify-center items-center mt-20">
    <div class="w-full max-w-lg">
        <Tabs.Root
            bind:value={roomAction}
            class="rounded-card border-muted bg-background-alt shadow-card w-full border p-3"
        >
            <Tabs.List
                class="rounded-9px bg-dark-10 shadow-mini-inset dark:bg-background grid w-full grid-cols-2 gap-1 p-1 text-sm font-semibold leading-[0.01em] dark:border dark:border-neutral-600/30"
            >
                <Tabs.Trigger
                    value={RoomAction.Join}
                    class="data-[state=active]:shadow-mini dark:data-[state=active]:bg-muted h-8 rounded-[7px] bg-transparent py-2 data-[state=active]:bg-white"
                >
                    Join
                </Tabs.Trigger>
                <Tabs.Trigger
                    value={RoomAction.Create}
                    class="data-[state=active]:shadow-mini dark:data-[state=active]:bg-muted h-8 rounded-[7px] bg-transparent py-2 data-[state=active]:bg-white"
                >
                    Create
                </Tabs.Trigger>
            </Tabs.List>
            <Tabs.Content value={RoomAction.Join} class="select-none pt-3">
                <div class="flex flex-col gap-8 pt-4">
                    <h1 class="text-4xl font-bold">Let's Play Quiz</h1>
                    <p class="text-sm">
                        Enter your player name, enter the room code, then click on the button to join the room.
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
                            bind:value={playerName}
                        />
                    </div>
                    <div class="flex w-full flex-col gap-1.5">
                        <Label.Root id="room-code-label" for="room-code" class="block select-none text-sm font-medium">
                            Room Code
                        </Label.Root>
                        <input
                            class="h-input rounded-input border-border-input bg-background text-foreground focus-within:border-border-input-hover focus-within:shadow-date-field-focus hover:border-border-input-hover data-invalid:border-destructive flex w-full select-none items-center border px-2 py-3 text-sm tracking-[0.01em]"
                            id="room-code"
                            name="room-code"
                            type="text"
                            placeholder="Enter the room code..."
                            bind:value={roomCode}
                        />
                    </div>
                    <Button.Root
                        class="rounded-input bg-dark text-background shadow-mini hover:bg-dark/95 inline-flex h-12 items-center justify-center px-[21px] text-[15px] font-semibold active:scale-[0.98] active:transition-all"
                        onclick={handleRoomAction}
                    >
                        JOIN ROOM
                    </Button.Root>
                </div>
            </Tabs.Content>
            <Tabs.Content value={RoomAction.Create} class="select-none pt-3">
                <div class="flex flex-col gap-8 pt-4">
                    <h1 class="text-4xl font-bold">Let's Play Quiz</h1>
                    <p class="text-sm">Enter your player name, then click on the button to create a new room.</p>
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
                            value={playerName}
                        />
                    </div>
                    <Button.Root
                        class="rounded-input bg-dark text-background shadow-mini hover:bg-dark/95 inline-flex h-12 items-center justify-center px-[21px] text-[15px] font-semibold active:scale-[0.98] active:transition-all"
                        onclick={handleRoomAction}
                    >
                        CREATE ROOM
                    </Button.Root>
                </div>
            </Tabs.Content>
        </Tabs.Root>
    </div>
</main>
