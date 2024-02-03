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
    <div class="container">
        <div class="layer" :style="{ width: layerWidth }"></div>
        <div class="number">{{ remainingSeconds }}</div>
    </div>
</template>

<style>
    .container {
        position: relative;
        width: 50px;
        aspect-ratio: 1/1;
        background-color: hsl(0,0%,20%);
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .layer {
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        background-color: hsl(0,0%,30%);
        transition: width 1s linear;
        z-index: 1;
    }

    .number {
        color: white;
        font-size: 30px;
        z-index: 2;
    }
</style>
