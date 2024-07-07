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
            <p><strong>{{ error }}</strong></p>
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