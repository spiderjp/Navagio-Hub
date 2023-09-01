const params = new URLSearchParams(window.location.search);
const userName = params.get('name');

if (userName) {
    document.getElementById('userName').textContent = userName;
}