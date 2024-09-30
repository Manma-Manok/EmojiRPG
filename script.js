const emojis = ['😀', '😎', '👾', '🐱', '🐶', '🍕', '🚀', '🎉'];
let score = 0;

// Функция для создания случайного эмодзи
function createEmoji() {
  const emojiDiv = document.createElement('div');
  emojiDiv.classList.add('emoji');
  emojiDiv.textContent = emojis[Math.floor(Math.random() * emojis.length)];
  emojiDiv.style.left = Math.random() * 90 + 'vw';
  emojiDiv.style.top = Math.random() * 50 + 'vh';
  
  emojiDiv.addEventListener('click', () => {
    document.querySelector('#emoji-container').removeChild(emojiDiv);
    score += 1;
    document.getElementById('score').textContent = `Score: ${score}`;
  });

  document.querySelector('#emoji-container').appendChild(emojiDiv);
}

// Создание эмодзи каждые 2 секунды
setInterval(createEmoji, 2000);

// Кнопка, которая открывает сайт с информацией о листинге
document.getElementById('listing-button').addEventListener('click', () => {
  window.open('https://your-listing-site.com', '_blank');
});
