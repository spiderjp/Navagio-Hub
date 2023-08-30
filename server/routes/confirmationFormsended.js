const form = document.getElementById('form_sendMessage');
const confirmationMessage = document.getElementById('confirmationMessage');

 form.addEventListener('submit', async (event) => {
    event.preventDefault();

     const formData = new FormData(form);
    const response = await fetch('/submit', {
        method: 'POST',
        body: formData
    });

     if (response.ok) {
        form.reset();
        confirmationMessage.style.display = 'block';
    }
});