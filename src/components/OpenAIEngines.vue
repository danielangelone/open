<template>
  <div :class="themeClass">
    <div class="container mt-4">
      <h2 class="text-center mb-4">Consulta de Engines da OpenAI</h2>
      <div class="mb-3 me-3 flex-grow-1">
        <label for="api_key" class="form-label">Digite sua chave de API:</label>
      </div>
      <div class="d-flex justify-content-center">
        <form @submit.prevent="validateAndSubmit" class="bg-light p-4 rounded shadow-sm d-flex align-items-center" style="width: 38em;">

          <div class="d-flex w-100">


            <div class="d-grid gap-2 d-md-flex justify-content-md-end" style="width: 38em;">
              <input type="text" id="api_key" v-model="apiKey" required class="form-control">
              <button type="submit" class="btn btn-primary btn-lg">
                OK
              </button>
            </div>

          </div>
        </form>
      </div>
      <div v-if="error" class="mt-4 alert alert-danger d-flex align-items-center" role="alert">
        <i class="bi bi-x-circle me-2"></i>
        {{ error }}
      </div>
    </div>

    <div v-if="showPopup" class="modal fade show d-block" tabindex="-1" style="background-color: rgba(0, 0, 0, 0.5);">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Resultado da Consulta</h5>
            <button type="button" class="btn-close" @click="closePopup"></button>
          </div>
          <div class="modal-body">
            <ul class="list-group">
              <li v-for="engine in engines" :key="engine.id" class="list-group-item">
                {{ engine.id }}: {{ engine.object }}
              </li>
            </ul>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closePopup">Fechar</button>
          </div>
        </div>
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
      theme: 'light',
      errorMessage: ''
    }
  },
  computed: {
    themeClass() {
      return this.theme === 'dark' ? 'bg-dark text-white' : 'bg-white text-dark';
    }
  },
  mounted() {
    this.setTheme();
    window.addEventListener('resize', this.setTheme);
  },
  beforeUnmount() {
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
        this.error = 'Erro ao fazer a solicitação.';
        this.errorMessage = error.message;
        console.error(error);
      }
    },
    closePopup() {
      this.showPopup = false;
      location.reload();
    }
  }
}
</script>

<style scoped>
body {
  transition: background-color 0.5s, color 0.5s;
}
.btn-rounded {
  border-radius: 50%;
  background-color: black;
  color: white;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
}
.btn-rounded i {
  font-size: 1.2rem;
}
</style>
