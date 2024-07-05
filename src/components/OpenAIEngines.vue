<template>
  <div :class="themeClass">
    <div class="container mx-auto p-4">
      <h2 class="text-2xl font-bold mb-4">Consulta de Engines da OpenAI</h2>
      <form @submit.prevent="validateAndSubmit" class="bg-white p-4 rounded shadow-md">
        <label for="api_key" class="block text-sm font-medium text-gray-700 mb-2">Digite sua chave de API:</label>
        <input type="text" id="api_key" v-model="apiKey" required class="border p-2 w-full mb-4">
        <button type="submit" class="bg-blue-500 text-white py-2 px-4 rounded">Enviar</button>
      </form>
      <div v-if="engines.length > 0" class="mt-4">
        <h3 class="text-xl font-bold mb-2">Engines disponíveis:</h3>
        <ul class="list-disc pl-5">
          <li v-for="engine in engines" :key="engine.id" class="mb-2">
            {{ engine.id }}: {{ engine.object }}
          </li>
        </ul>
      </div>
      <div v-if="error" class="mt-4 bg-red-100 text-red-700 p-2 rounded">
        <p>{{ error }}</p>
      </div>
    </div>

    <div v-if="showPopup" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
      <div class="bg-white p-6 rounded shadow-lg">
        <div class="flex items-center">
          <img src="https://img.icons8.com/color/48/000000/api.png" alt="Icon" class="mr-4">
          <h3 class="text-lg font-bold">Resultado da Consulta</h3>
        </div>
        <ul class="mt-4 list-disc pl-5">
          <li v-for="engine in engines" :key="engine.id" class="mb-2">
            {{ engine.id }}: {{ engine.object }}
          </li>
        </ul>
        <button @click="closePopup" class="mt-4 bg-blue-500 text-white py-2 px-4 rounded">Fechar</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      apiKey: '',
      engines: [],
      error: '',
      showPopup: false,
      theme: 'light'
    }
  },
  computed: {
    themeClass() {
      return this.theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-black';
    }
  },
  mounted() {
    this.setTheme();
    window.addEventListener('resize', this.setTheme);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.setTheme);
  },
  methods: {
    setTheme() {
      const hour = new Date().getHours();
      this.theme = (hour >= 18 || hour < 6) ? 'dark' : 'light';
    },
    validateAndSubmit() {
      if (this.apiKey.startsWith('sk-')) {
        this.fetchEngines();
      } else {
        this.error = 'Chave de API digitada incorretamente. Deve começar com "sk-".';
      }
    },
    async fetchEngines() {
      try {
        const response = await axios.get('https://api.openai.com/v1/engines', {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`
          }
        })
        this.engines = response.data.data;
        this.showPopup = true;
      } catch (error) {
        this.error = 'Erro ao fazer a solicitação. Veja o log para mais detalhes.';
        console.error(error);
      }
    },
    closePopup() {
      this.showPopup = false;
    }
  }
}
</script>

<style scoped>
body {
  transition: background-color 0.5s, color 0.5s;
}
</style>
