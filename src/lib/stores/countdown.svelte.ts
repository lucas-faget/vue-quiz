let intervalId: number | undefined = undefined;

interface QuizCountdown {
    remainingSeconds: number;
    percentage: number;
}

export const countdown = $state<QuizCountdown>({
    remainingSeconds: 0,
    percentage: 0,
});

function calculatePercentage(remainingSeconds: number, totalSeconds: number) {
    countdown.percentage = ((remainingSeconds - 1) / totalSeconds) * 100;
}

export function startCountdown(seconds: number) {
    seconds = Math.round(seconds);
    countdown.remainingSeconds = seconds;
    calculatePercentage(countdown.remainingSeconds, seconds);

    intervalId = setInterval(() => {
        if (countdown.remainingSeconds > 0) {
            calculatePercentage(--countdown.remainingSeconds, seconds);
        } else {
            stopCountdown();
        }
    }, 1000);
}

export function stopCountdown() {
    clearInterval(intervalId);
}

export function restartCountdown(seconds: number) {
    stopCountdown();
    startCountdown(seconds);
}
