function openPopup(title, info) {
    document.getElementById('popup-title').innerText = title;
    document.getElementById('popup-info').innerText = info;
    document.getElementById('popup').style.display = 'flex';
  }
  
  function closePopup() {
    document.getElementById('popup').style.display = 'none';
  }
  