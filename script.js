const emojis = ['😀', '😎', '👾', '🐱', '🐶', '🍕', '🚀', '🎉', '✨'];
let score = 0;
let tokens = 0;
let classType = null;
let clickPower = 1; // Базовая сила кликов
let bonusChance = 0.1; // Базовый шанс на бонус
let emojiSpawnRate = 2000; // Интервал появления эмодзи (в миллисекундах)
let timerDuration = 60; // Таймер (в секундах)

// Загружаем данные из localStorage
function loadProgress() {
  const savedScore = localStorage.getItem('score');
  const savedTokens = localStorage.getItem('tokens');
  const savedClass = localStorage.getItem('classType');

  if (savedScore) {
    score = parseInt(savedScore, 10);
  }

  if (savedTokens) {
    tokens = parseInt(savedTokens, 10);
  }

  if (savedClass) {
    classType = savedClass;
    startGame(classType);
  }

  updateScoreDisplay();
  updateTokensDisplay();
}

// Сохраняем данные в localStorage
function saveProgress() {
  localStorage.setItem('score', score);
  localStorage.setItem('tokens', tokens);
  if (classType) {
    localStorage.setItem('classType', classType);
  }
}

// Обновляем отображение счета
function updateScoreDisplay() {
  document.getElementById('score').textContent = `Score: ${score}`;
}

// Обновляем отображение токенов
function updateTokensDisplay() {
  document.getElementById('tokens').textContent = `Tokens: ${tokens}`;
}

// Обновляем таймер
function updateTimerDisplay(seconds) {
  document.getElementById('timer').textContent = `Timer: ${seconds}s`;
}

// Запуск таймера
function startTimer() {
  let remainingTime = timerDuration;
  updateTimerDisplay(remainingTime);

  const timerInterval = setInterval(() => {
    remainingTime--;
    updateTimerDisplay(remainingTime);

    if (remainingTime <= 0) {
      clearInterval(timerInterval);
      clickPower = 1; // Сбрасываем clickPower
      alert('Timer ended! Click power has been reset.');
    }
  }, 1000);
}

// Начало игры после выбора класса
document.querySelectorAll('.class-button').forEach(button => {
  button.addEventListener('click', () => {
    classType = button.dataset.class;
    saveProgress();
    startGame(classType);
  });
});

function startGame(selectedClass) {
  // Скрываем выбор класса и показываем игровой интерфейс
  document.getElementById('class-selection').style.display = 'none';
  document.getElementById('game-container').style.display = 'block';
  document.getElementById('listing-button').style.display = 'block';
  document.getElementById('reset-button').style.display = 'block';

  // Настройка бонусов для каждого класса
  if (selectedClass === 'warrior') {
    clickPower = 2;
  } else if (selectedClass === 'mage') {
    clickPower = 1;
    score += 10;
  } else if (selectedClass === 'rogue') {
    bonusChance = 0.2;
  }

  updateScoreDisplay();
  updateTokensDisplay();
  startTimer(); // Запускаем таймер

  setInterval(createEmoji, emojiSpawnRate);
}

// Функция для создания случайного эмодзи
function createEmoji() {
  const emojiDiv = document.createElement('div');
  emojiDiv.classList.add('emoji');
  let randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];

  emojiDiv.textContent = randomEmoji;
  emojiDiv.style.left = Math.random() * 90 + 'vw';
  emojiDiv.style.top = Math.random() * 50 + 'vh';

  // Обработка клика по эмодзи
  emojiDiv.addEventListener('click', () => {
    emojiDiv.remove();
    let points = clickPower;

    if (Math.random() < bonusChance && randomEmoji === '✨') {
      points *= 2;
    }

    score += points;
    updateScoreDisplay();
    saveProgress();
  });

  document.querySelector('#emoji-container').appendChild(emojiDiv);
}

// Апгрейды за очки
document.querySelectorAll('.upgrade-button').forEach(button => {
  button.addEventListener('click', () => {
    if (score >= 10) {
      score -= 10;

      if (button.dataset.upgrade === 'increase-click-power') {
        clickPower++;
      } else if (button.dataset.upgrade === 'faster-emojis') {
        emojiSpawnRate = Math.max(emojiSpawnRate - 200, 500);
      } else if (button.dataset.upgrade === 'bonus-chance') {
        bonusChance = Math.min(bonusChance + 0.05, 0.5);
      }

      updateScoreDisplay();
      saveProgress();
    }
  });
});

// Кнопка для сброса счета
document.getElementById('reset-button').addEventListener('click', () => {
  tokens += score; // Перевод очков в токены
  score = 0;
  updateScoreDisplay();
  updateTokensDisplay();
  saveProgress();
});

// Кнопка для перехода на страницу листинга
document.getElementById('listing-button').addEventListener('click', () => {
  window.location.href = 'listing.html';
});

// Загрузка данных при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
  loadProgress();
});
