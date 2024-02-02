<script setup lang="ts">
    import { onBeforeUnmount, onMounted, ref } from 'vue';

    const props = defineProps({
        seconds: {
            type: Number,
            default: 0
        }
    });

    const seconds = ref(props.seconds);
    let intervalId: number|undefined;
    let layerWidth: string = '0%';

    const startCountdown = () => {
        intervalId = setInterval(() => {
            if (seconds.value > 0) {
                seconds.value--;
                const remainingPercentage = (seconds.value / props.seconds) * 100;
                layerWidth = `${100 - remainingPercentage}%`;
            } else {
                stopCountdown();
            }
        }, 1000);
    };

    const stopCountdown = () => {
        clearInterval(intervalId);
    };

    onMounted(() => {
        startCountdown();
    });

    onBeforeUnmount(() => {
        stopCountdown();
    });
</script>

<template>
    <div class="container">
        <div class="layer" :style="{ width: layerWidth }"></div>
        <div class="number">{{ seconds }}</div>
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
