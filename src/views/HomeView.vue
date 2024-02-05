<script setup lang="ts">
	import Navigation from '@/components/Navigation.vue';
</script>

<template>
	<main>
		<div class="form">
			<navigation></navigation>

			<div style="display: flex; flex-direction: column; gap: 10px">
				<div style="font-size: 40px;">Let's Play Quiz</div>
				<div style="font-size: 16px;">Enter your player name, then create a new room or join a room with a code</div>
			</div>

			<div class="input-group">
				<label>Player Name</label>
				<input type="text" />
			</div>

			<div class="input-group">
				<label>Room Code</label>
				<input type="text" />
			</div>

			<button>Create a room</button>
		</div>
	</main>
</template>

<style scoped>
	main {
		min-height: 100vh;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.form {
		width: 400px;
		display: flex;
		flex-direction: column;
		gap: 30px;
	}

	.input-group {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	.input-group > label {
		color: var(--color-gray);
	}

	.input-group > input {
		color: var(--color-white);
		background-color: var(--color-dark-blue);
		height: 50px;
		padding-inline: 20px;
		border-radius: 10px;
		border: 2px solid var(--color-gray);
		font-size: 16px;
		outline: none;
	}

	button {
		color: var(--color-dark-blue);
		background: linear-gradient(to right, #178276, #52e0d0);
		height: 50px;
		border: none;
		border-radius: 10px;
		font-size: 15px;
		text-transform: uppercase;
		font-weight: bold;
		cursor: pointer;
	}
</style>
