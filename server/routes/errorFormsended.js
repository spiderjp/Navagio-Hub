const form = document.getElementById('form_sendMessage');
const errorMessage = document.getElementById('errorMessage');

form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const response = await fetch('/submit-form', {
        method: 'POST',
        body: formData
    });

    if (response.ok) {
        form.reset();
        // Limpar mensagens de erro
        errorMessage.textContent = '';
    } else {
        // Exibir mensagem de erro do servidor
        const data = await response.json();
        errorMessage.textContent = data.error || 'Erro desconhecido ao enviar os dados. Por favor, tente novamente.';
    }
});