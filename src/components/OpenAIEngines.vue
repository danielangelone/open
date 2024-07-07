<template>
  <div>
    <div class="container mt-4">
      <h2 class="text-center mb-4" :class="{ 'text-white': theme === 'dark' }">Consulta de Engines da OpenAI</h2>
      <div class="d-flex justify-content-end mb-2">
        <label class="switch">
          <input type="checkbox" v-model="themeSwitch" @change="toggleTheme">
          <span class="slider round"></span>
        </label>
      </div>
      <div class="mb-3 me-3 flex-grow-1">
        <label for="api_key" class="form-label" :class="{ 'text-white': theme === 'dark' }">Digite sua chave de API:</label>
      </div>
      <div class="d-flex justify-content-center">
        <form @submit.prevent="validateAndSubmit" :class="[theme === 'dark' ? 'bg-dark text-white' : 'bg-light', 'p-4 rounded shadow-sm d-flex align-items-center']" style="width: 90%;">
          <div class="d-flex w-100">
            <div class="d-grid gap-2 d-md-flex justify-content-md-end" style="width: 100%;">
              <input type="text" id="api_key" v-model="apiKey" required :class="[theme === 'dark' ? 'form-control-dark' : 'form-control', 'rounded']" style="width: 100%;">
              <button type="submit" :class="[theme === 'dark' ? 'btn-dark' : 'btn-primary', 'btn btn-lg']" style="width: 30%;">
                OK
              </button>
            </div>
          </div>
        </form>
      </div>
      <div class="d-flex justify-content-center">
        <div v-if="error" class="mt-4 alert alert-danger d-flex align-items-center justify-content-center" role="alert" style="width: 40%;">
          <i class="bi-emoji-expressionless">&nbsp; </i>
          <div>
            <p><strong>Texto digitado:</strong> {{ apiKey }}</p>
            <p>Erro ao fazer a solicitação.</p>
            <pre>{{ errorDetails }}</pre>
          </div>
        </div>
      </div>
    </div>
    <div v-if="showPopup" class="modal fade show d-block" tabindex="-1" :class="{'modal-dark': theme === 'dark'}">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" :class="{ 'text-white': theme === 'dark' }"><i class="bi bi-emoji-smile-upside-down">&nbsp; </i>Resultado da Consulta</h5>
            <button type="button" class="btn-close" @click="closePopup"></button>
          </div>
          <div class="modal-body" :class="{ 'bg-dark text-white': theme === 'dark' }">
            <ul class="list-group">
              <li v-for="engine in engines" :key="engine.id" class="list-group-item" :class="{ 'bg-dark text-white': theme === 'dark' }">
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
      errorMessage: '',
      themeSwitch: false,
      errorDetails: ''
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
      this.themeSwitch = this.theme === 'dark';
      document.body.className = this.theme === 'dark' ? 'theme-dark' : 'theme-light';
    },
    toggleTheme() {
      this.theme = this.themeSwitch ? 'dark' : 'light';
      document.body.className = this.theme === 'dark' ? 'theme-dark' : 'theme-light';
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
        this.errorDetails = error.response ? error.response.data : error.message;
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

<style>
body {
  transition: background-color 0.5s, color 0.5s;
}

.theme-dark {
  background-color: #121212;
  color: white;
}

.theme-light {
  background-color: white;
  color: black;
}

.bg-dark {
  background-color: #343a40 !important;
  color: white !important;
}

.btn-dark {
  background-color: #343a40 !important;
  border-color: #343a40 !important;
  color: white !important;
}

.form-control-dark {
  background-color: #495057 !important;
  border-color: #6c757d !important;
  color: white !important;
  border-radius: 0.25rem !important;
}

.form-control-dark:focus {
  background-color: #343a40 !important;
  color: white !important;
}

.modal-dark .modal-content {
  background-color: #343a40 !important;
  color: white !important;
}

.btn-rounded {
  border-radius: 50%;
  background-color: #474747;
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

/* Switch Styles */
.switch {
  position: relative;
  display: inline-block;
  width: 34px;
  height: 20px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: 0.4s;
  border-radius: 34px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 14px;
  width: 14px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: 0.4s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: #2196F3;
}

input:checked + .slider:before {
  transform: translateX(14px);
}
</style>
