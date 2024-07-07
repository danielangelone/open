import { createApp } from 'vue';
import App from './App.vue';
import AppScript from './App.js'; // Importe o arquivo App.js aqui
import './App.css';
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import 'bootstrap-icons/font/bootstrap-icons.css';
const app = createApp(App);

// Adicione o script importado ao componente principal
app.mixin(AppScript);

app.mount('#app');

