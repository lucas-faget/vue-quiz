import './assets/main.css'

import { createApp } from 'vue'
import { createStore } from 'vuex'
import App from './App.vue'
import router from './router'

interface State {
    playerName: string;
}

const store = createStore({
    state: {
        playerName: '',
    },
    mutations: {
        setPlayerName(state: State, name: string) {
            state.playerName = name;
        },
    }
});

const app = createApp(App)

app.use(store);
app.use(router)

app.mount('#app')
