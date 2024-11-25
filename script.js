const emojis = ['😀', '😎', '👾', '🐱', '🐶', '🍕', '🚀', '🎉', '✨'];
let score = 0;
let classType = null;
let clickPower = 1; // Базовая сила кликов
let bonusChance = 0.1; // Базовый шанс на бонус
let tokens = 0; // Токены
let emojiSpawnRate = 2000; // Интервал появления эмодзи (в миллисекундах)

// Длительность таймера и оставшееся время
let timerDuration = 60;
let remainingTime = timerDuration;

// Начало игры после выбора класса
document.querySelectorAll('.class-button').forEach(button => {
  button.addEventListener('click', () => {
    classType = button.dataset.class;
    startGame(classType);
  });
});

// Загрузка прогресса (сохраненные данные)
function loadProgress() {
  // Загружаем очки, токены и таймер из localStorage
  const savedScore = localStorage.getItem('score');
  const savedTokens = localStorage.getItem('tokens');
  const savedTime = localStorage.getItem('remainingTime');

  if (savedScore) {
    score = parseInt(savedScore, 10);
  }

  if (savedTokens) {
    tokens = parseInt(savedTokens, 10);
  }

  if (savedTime) {
    remainingTime = parseInt(savedTime, 10);
  }

  // Обновляем отображение счета и токенов
  document.getElementById('score').textContent = `Score: ${score}`;
  document.getElementById('tokens').textContent = `Tokens: ${tokens}`;
  updateTimerDisplay(remainingTime);
}

// Сохранение прогресса (очки, токены, время)
function saveProgress() {
  localStorage.setItem('score', score);
  localStorage.setItem('tokens', tokens);
  localStorage.setItem('remainingTime', remainingTime);
}

// Обновляем отображение таймера
function updateTimerDisplay(seconds) {
  document.getElementById('timer').textContent = `Timer: ${seconds}s`;
}

// Запуск игры
function startGame(selectedClass) {
  // Скрываем выбор класса и показываем игровой интерфейс
  document.getElementById('class-selection').style.display = 'none';
  document.getElementById('game-container').style.display = 'block';
  document.getElementById('listing-button').style.display = 'block';
  document.getElementById('reset-button').style.display = 'block';

  // Настройка бонусов для каждого класса
  if (selectedClass === 'warrior') {
    clickPower = 2; // У воинов удвоенная сила кликов
  } else if (selectedClass === 'mage') {
    clickPower = 1;
    score += 10; // Маги начинают с бонусом очков
  } else if (selectedClass === 'rogue') {
    bonusChance = 0.2; // Разбойники получают повышенный шанс на бонусные эмодзи
  }

  // Обновляем счет, если игрок — маг (начинает с бонуса очков)
  document.getElementById('score').textContent = `Score: ${score}`;

  // Запуск игры — появление эмодзи
  setInterval(createEmoji, emojiSpawnRate);
}

// Функция для создания случайного эмодзи
function createEmoji() {
  const emojiDiv = document.createElement('div');
  emojiDiv.classList.add('emoji');
  let randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];

  emojiDiv.textContent = randomEmoji;
  emojiDiv.style.left = Math.random() * 90 + 'vw'; // Случайное положение по горизонтали
  emojiDiv.style.top = Math.random() * 50 + 'vh';  // Случайное положение по вертикали

  // Обработка клика по эмодзи
  emojiDiv.addEventListener('click', () => {
    emojiDiv.remove();
    let points = clickPower;

    // Шанс на бонусные очки (для разбойника или магического эмодзи)
    if (Math.random() < bonusChance && randomEmoji === '✨') {
      points *= 2;
    }

    score += points;
    document.getElementById('score').textContent = `Score: ${score}`;
    saveProgress(); // Сохраняем прогресс
  });

  document.querySelector('#emoji-container').appendChild(emojiDiv);
}

// Апгрейды за очки
document.querySelectorAll('.upgrade-button').forEach(button => {
  button.addEventListener('click', () => {
    if (score >= 10) { // Минимальная стоимость апгрейда — 10 очков
      score -= 10;

      if (button.dataset.upgrade === 'increase-click-power') {
        clickPower++;
      } else if (button.dataset.upgrade === 'faster-emojis') {
        emojiSpawnRate = Math.max(emojiSpawnRate - 200, 500); // Ускорение появления эмодзи
      } else if (button.dataset.upgrade === 'bonus-chance') {
        bonusChance = Math.min(bonusChance + 0.05, 0.5); // Увеличение шанса на бонус
      }

      document.getElementById('score').textContent = `Score: ${score}`;
      saveProgress(); // Сохраняем прогресс
    }
  });
});

// Кнопка для сброса счета
document.getElementById('reset-button').addEventListener('click', () => {
  tokens += Math.floor(score / 10); // Преобразуем очки в токены
  score = 0;
  document.getElementById('score').textContent = `Score: 0`;
  document.getElementById('tokens').textContent = `Tokens: ${tokens}`;
  saveProgress(); // Сохраняем прогресс
});

// Кнопка для перехода на страницу листинга
document.getElementById('listing-button').addEventListener('click', () => {
  window.location.href = 'listing.html';
});

// Таймер
function startTimer() {
  loadTimer(); // Загружаем оставшееся время
  updateTimerDisplay(remainingTime);

  const timerInterval = setInterval(() => {
    if (remainingTime > 0) {
      remainingTime--;
      updateTimerDisplay(remainingTime);
      saveProgress(); // Сохраняем время после каждого изменения
    } else {
      // Действия по окончанию таймера
      clearInterval(timerInterval);
      clickPower = 1; // Сбрасываем clickPower
      alert('Timer ended! Click power has been reset.');

      // Перезапускаем таймер
      remainingTime = timerDuration;
      saveProgress(); // Сохраняем новый таймер
      startTimer(); // Рекурсивно запускаем новый таймер
    }
  }, 1000);
}

// Восстановление оставшегося времени из localStorage
function loadTimer() {
  const savedTime = localStorage.getItem('remainingTime');
  if (savedTime) {
    remainingTime = parseInt(savedTime, 10);
  } else {
    remainingTime = timerDuration;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadProgress(); // Загружаем очки, токены и таймер
  startTimer(); // Запускаем таймер
});


// Загрузка данных при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
  loadProgress();
});
