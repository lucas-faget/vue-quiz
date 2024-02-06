<script setup lang="ts">
    import { onBeforeUnmount, ref } from 'vue';

    let remainingSeconds = ref<number>(0);

    let intervalId: number|undefined;
    let layerWidth: string = '0%';

    const startCountdown = (seconds: number) => {
        seconds = Math.round(seconds);
        remainingSeconds.value = seconds;
        intervalId = setInterval(() => {
            if (remainingSeconds.value > 0) {
                remainingSeconds.value--;
                let remainingPercentage = (remainingSeconds.value / seconds) * 100;
                layerWidth = `${100 - remainingPercentage}%`;
                console.log(layerWidth)
            } else {
                stopCountdown();
            }
        }, 1000);
    };

    const stopCountdown = () => {
        clearInterval(intervalId);
    };

    const restartCountdown = (seconds: number) => {
        stopCountdown();
        startCountdown(seconds);
    };

    onBeforeUnmount(() => {
        stopCountdown();
    });

    defineExpose({
        startCountdown,
        stopCountdown,
        restartCountdown
    });
</script>

<template>
    <div class="countdown">
        <div class="layer" :style="{ width: layerWidth }"></div>
        <div class="number">{{ remainingSeconds }}</div>
        <div class="icon-container">
            <img src="/icons/schedule.svg" />
        </div>
    </div>
</template>

<style scoped>
    .countdown {
        position: relative;
        background-color: var(--color-dark-blue);
        height: 40px;
        border-radius: 20px;
        overflow: hidden;
    }

    .layer {
        position: absolute;
        top: 0;
        left: 0;
        background: var(--color-linear-gradient-green);
        width: 100%;
        height: 40px;
        border-radius: 20px;
        transition: width 1s linear;
        z-index: 1;
    }

    .number {
        position: absolute;
        left: 0;
        right: 0;
        color: var(--color-white);
        height: 100%;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 20px;
        z-index: 2;
    }

    .icon-container {
        position: absolute;
        top: 0;
        right: 0;
        height: 100%;
        aspect-ratio: 1/1;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .icon-container > img {
        width: 25px;
        aspect-ratio: 1/1;
    }
</style>
