<script setup lang="ts">
    import { ref, computed } from 'vue';

    export type NavItem = {
        text: string,
        value: number|string
    }

    const props = defineProps({
        items: Array<NavItem>
    });

    const emit = defineEmits(['updateAction']);

    let layerIndex = ref<number>(0);

    const layerLeft = computed(() => {
        return `${layerIndex.value * 150}px`;
    });

    const moveLayer = (itemIndex: number) => {
        layerIndex.value = itemIndex;
        if (props.items)
            emit('updateAction', props.items[itemIndex].value);
    };

    const textColor = (linkIndex: number) => {
        return layerIndex.value === linkIndex ? 'color-black' : 'color-light';
    };
</script>

<template>
    <div class="navigation">
        <div class="item" v-for="(item, index) in props.items" :key="index" @click="moveLayer(index)" >
            <div class="text" :class="textColor(index)">{{ item.text }}</div>
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
        font-size: 16px;
        text-transform: capitalize;
    }

    .item {
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
        font-weight: bold;
        z-index: 2;
        transition: color 0.3s ease;
    }
</style>
