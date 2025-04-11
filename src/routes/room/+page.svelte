<script lang="ts">
    import { onDestroy } from "svelte";
    import { stopConnection } from "$lib/signalr/QuizHubClient";
    import { handleMessageSending, handleUserAnswerSending, room } from "$lib/stores/room.svelte";
    import { stopCountdown } from "$lib/stores/countdown.svelte";
    import Card from "$lib/components/Card.svelte";
    import Chat from "$lib/components/Chat.svelte";
    import Question from "$lib/components/Question.svelte";

    onDestroy(() => {
        room.connection && stopConnection(room.connection);
        stopCountdown();
    });
</script>

<main class="h-screen min-h-[40rem] flex flex-col justify-center items-center p-12">
    <div class="h-full flex gap-8 w-full max-w-7xl">
        <Card>
            <h1 class="text-2xl">Players</h1>
            <table class="text-left">
                <thead>
                    <tr>
                        <th>Rank</th>
                        <th>Name</th>
                        <th>Points</th>
                    </tr>
                </thead>
                <tbody>
                    {#each room.players as player}
                        <tr>
                            <td>{player.rank}</td>
                            <td>{player.name}</td>
                            <td>{player.totalPoints}</td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </Card>
        <Card>
            <Question />
            <div class="mt-auto">
                <form onsubmit={handleUserAnswerSending}>
                    <div class="relative">
                        <input
                            class="h-input rounded-input border-border-input bg-background text-foreground focus-within:border-border-input-hover focus-within:shadow-date-field-focus hover:border-border-input-hover data-invalid:border-destructive flex w-full select-none items-center border px-2 py-3 text-sm tracking-[0.01em]"
                            id="user-message"
                            name="user-message"
                            type="text"
                            placeholder="Type your answer..."
                            bind:value={room.userAnswer}
                        />
                        <button
                            class="absolute top-0 right-0 h-full aspect-square bg-transparent flex justify-center items-center"
                            aria-label="send-answer"
                            onclick={handleUserAnswerSending}
                        >
                            <iconify-icon icon="mdi:send" class="text-2xl"></iconify-icon>
                        </button>
                    </div>
                </form>
            </div>
        </Card>
        <Card>
            <h1 class="text-2xl">Chat</h1>
            <Chat />
            <div class="mt-auto">
                <form onsubmit={handleMessageSending}>
                    <div class="relative">
                        <input
                            class="pr-12 h-input rounded-input border-border-input bg-background text-foreground focus-within:border-border-input-hover focus-within:shadow-date-field-focus hover:border-border-input-hover data-invalid:border-destructive flex w-full select-none items-center border px-2 py-3 text-sm tracking-[0.01em]"
                            id="user-message"
                            name="user-message"
                            type="text"
                            placeholder="Type something..."
                            bind:value={room.userMessage}
                        />
                        <button
                            class="absolute top-0 right-0 h-full aspect-square bg-transparent flex justify-center items-center"
                            aria-label="send-message"
                            onclick={handleMessageSending}
                        >
                            <iconify-icon icon="mdi:send" class="text-2xl"></iconify-icon>
                        </button>
                    </div>
                </form>
            </div>
        </Card>
    </div>
</main>
