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