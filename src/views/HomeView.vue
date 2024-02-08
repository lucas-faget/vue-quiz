<script setup lang="ts">
	import { ref } from 'vue';
	import { useRouter } from 'vue-router';
	import Navigation, { type NavItem } from '@/components/Navigation.vue';

	enum RoomAction {
		Join,
		Create
	}

	const router = useRouter();

	const items: NavItem[] = [
		{ text: 'join', value: RoomAction.Join },
		{ text: 'create', value: RoomAction.Create }
	]

	const roomAction = ref<RoomAction>(RoomAction.Join);
	const playerName = ref<string>("");
	const roomCode = ref<string>("");

	const updateRoomAction = (value: RoomAction) => {
		roomAction.value = value;
	};

	const handleRoomAction = () => {
		if (roomAction.value === RoomAction.Join) {
			router.push({ 
				name: 'room',
				params: { code: roomCode.value }
			});
		} else {
			router.push({ 
				name: 'room'
			});
		}
	};
</script>

<template>
	<main>
		<div class="form">
			<navigation :items="items" @updateAction="updateRoomAction"></navigation>

			<div style="display: flex; flex-direction: column; gap: 10px">
				<div style="font-size: 40px;">Let's Play Quiz</div>
				<div style="font-size: 16px;">
					{{ roomAction === RoomAction.Join ?
						"Enter your player name, enter the room code, then click on the button to join the room." : 
						"Enter your player name, then click on the button to create a new room." }}
				</div>
			</div>

			<div class="input-group">
				<label>Player Name</label>
				<input type="text" v-model="playerName" />
			</div>

			<div class="input-group" v-if="roomAction === RoomAction.Join">
				<label>Room Code</label>
				<input type="text" v-model="roomCode" />
			</div>

			<button @click="handleRoomAction">{{ roomAction === RoomAction.Join ? "join room" : "create a room" }}</button>
		</div>
	</main>
</template>

<style scoped>
	main {
		display: flex;
		justify-content: center;
	}

	.form {
		margin-top: 5vw;
		width: 400px;
		display: flex;
		flex-direction: column;
		gap: 30px;
	}
</style>
