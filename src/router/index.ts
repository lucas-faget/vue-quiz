import { createRouter, createWebHistory } from 'vue-router'
import store from '../store';
import { startConnection, stopConnection } from '@/signalr/QuizHubClient';
import HomeView from '../views/HomeView.vue'
import RoomView from '../views/RoomView.vue'

const isValidCode = (code: string): boolean => {
	return /^[A-Z0-9]{4}$/.test(code);
};

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: '/',
			name: 'home',
			component: HomeView
		},
		{
			path: '/room/:code?',
			name: 'room',
			component: RoomView,
			// component: () => import('../views/RoomView.vue')
			beforeEnter: async (to, from, next) => {
				if (to.params.code === undefined) {
					next();
				} else {
					if (isValidCode(to.params.code as string)) {
						await startConnection(store.state.connection);
						const roomExists = await store.state.connection.invoke("RoomExists", to.params.code);
						await stopConnection(store.state.connection);
						if (roomExists) {
							next();
						} else {
							next({ name: 'home' });
						}
					} else {
						next({ name: 'home' });
					}
				}
			}
		}
	]
})

export default router
