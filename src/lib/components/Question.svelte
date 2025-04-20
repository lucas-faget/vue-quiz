<script lang="ts">
    import { countdown } from "$lib/stores/countdown.svelte";
    import { room } from "$lib/stores/room.svelte";
    import { AnswerResult } from "$lib/types/AnswerResult";
    import type { Question } from "$lib/types/Question";
    import { Progress, useId } from "bits-ui";

    const labelId = useId();
</script>

{#snippet question(question: Question)}
    <div class="flex flex-col gap-4">
        <div class="flex justify-between items-center">
            <span>{question.category}</span>
            <div
                class="rounded-input border-dark-10 bg-background shadow-popover outline-hidden flex items-center justify-center border p-2 text-sm font-medium capitalize"
            >
                {question.difficulty}
            </div>
        </div>
        <div class="bg-muted text-center py-6 px-4 rounded-2xl text-lg">{question.title}</div>
    </div>
{/snippet}

{#snippet answer(
    text: string,
    icon: string | undefined = undefined,
    iconClass: string = "text-green-600",
    answerClass: string = "bg-green-600"
)}
    <div class={`w-full h-10 px-1.5 rounded-lg border-2 ${answerClass} flex items-center gap-2`}>
        {#if icon}
            <iconify-icon {icon} class={`text-2xl ${iconClass}`}></iconify-icon>
        {/if}
        <span>{text}</span>
    </div>
{/snippet}

<div class="flex flex-col gap-2">
    <div class="flex items-center justify-between text-sm font-medium">
        <span id={labelId}>
            <span class="text-2xl">Question {room.questionNumber}</span>
            <span>/{room.maxQuestionNumber}</span>
        </span>
        <div class="flex items-center gap-1 text-xl">
            <span>{countdown.remainingSeconds}</span>
            <iconify-icon icon="mdi:access-time"></iconify-icon>
        </div>
    </div>
    <Progress.Root
        aria-labelledby={labelId}
        value={countdown.percentage}
        max={100}
        class="bg-dark-10 shadow-mini-inset relative h-4 w-full overflow-hidden rounded-full"
    >
        <div
            class="bg-foreground shadow-mini-inset h-full w-full flex-1 rounded-full transition-all duration-1000 ease-linear"
            style={`transform: translateX(-${countdown.percentage}%)`}
        ></div>
    </Progress.Root>
</div>
{#if room.question}
    {@render question(room.question)}
    <div class="flex flex-col gap-2.5">
        {#if room.answer}
            {@render answer(room.answer)}
        {/if}
        {#if room.answerTries}
            {#each room.answerTries as answerTry}
                {#if answerTry.result === AnswerResult.Right}
                    {@render answer(
                        answerTry.text,
                        "mdi:check-circle",
                        "text-green-600",
                        "bg-background border-green-600"
                    )}
                {:else if answerTry.result === AnswerResult.AlmostRight}
                    {@render answer(
                        answerTry.text,
                        "mdi:alert-circle",
                        "text-orange-300",
                        "bg-background border-orange-300"
                    )}
                {:else}
                    {@render answer(answerTry.text, "mdi:close-circle", "text-red-400", "bg-background border-red-400")}
                {/if}
            {/each}
        {/if}
    </div>
{/if}
