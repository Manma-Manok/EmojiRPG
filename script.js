const emojis = ['😀', '😎', '👾', '🐱', '🐶', '🍕', '🚀', '🎉'];
let score = 0;

// Функция для создания случайного эмодзи
function createEmoji() {
  const emojiDiv = document.createElement('div');
  emojiDiv.classList.add('emoji');
  emojiDiv.textContent = emojis[Math.floor(Math.random() * emojis.length)];
  emojiDiv.style.left = Math.random() * 90 + 'vw'; // Случайное положение по горизонтали
  emojiDiv.style.top = Math.random() * 50 + 'vh';  // Случайное положение по вертикали
  
  emojiDiv.addEventListener('click', () => {
    emojiDiv.remove(); // Удаление эмодзи при клике
    score += 1;
    document.getElementById('score').textContent = `Score: ${score}`;
  });

  document.querySelector('#emoji-container').appendChild(emojiDiv);
}

// Создание эмодзи каждые 2 секунды
setInterval(createEmoji, 2000);

// Кнопка для открытия страницы с информацией о листинге
document.getElementById('listing-button').addEventListener('click', () => {
  window.location.href = 'listing.html'; // Переход на страницу с информацией о листинге
});
