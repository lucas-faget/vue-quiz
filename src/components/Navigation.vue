<script setup lang="ts">
    import { ref, computed } from 'vue';

    let layerIndex = ref<number>(0);

    const layerLeft = computed(() => {
        return `${layerIndex.value * 150}px`;
    })

    const moveLayer = (linkIndex: number) => {
        layerIndex.value = linkIndex;
    }

    const textColor = (linkIndex: number) => {
        return layerIndex.value === linkIndex ? 'color-black' : 'color-light';
    }
</script>

<template>
    <div class="navigation">
        <div class="link" @click="moveLayer(0)">
            <div class="text" :class="textColor(0)">Create</div>
        </div>
        <div class="link" @click="moveLayer(1)">
            <div class="text" :class="textColor(1)">Join</div>
        </div>
        <div class="layer" :style="{ left: layerLeft }"></div>
    </div>
</template>

<style scoped>
    .navigation {
        position: relative;
        background: var(--color-dark-gray);
        width: 300px;
        height: 50px;
        display: flex;
        border-radius: 20px;
        font-size: 18px;
        text-transform: capitalize;
    }

    .link {
        width: 150px;
        padding-inline: 30px;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
    }

    .layer {
        position: absolute;
        background-color: var(--color-white);
        width: 150px;
        height: 100%;
        border-radius: 20px;
        z-index: 1;
        transition: left 0.3s ease;
    }

    .text {
        position: absolute;
        z-index: 2;
        transition: color 0.3s ease;
    }
</style>
