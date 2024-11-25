const emojis = ['😀', '😎', '👾', '🐱', '🐶', '🍕', '🚀', '🎉', '✨'];
let score = 0;
let classType = null;
let clickPower = 1; // Базовая сила кликов
let bonusChance = 0.1; // Базовый шанс на бонус
let emojiSpawnRate = 2000; // Интервал появления эмодзи (в миллисекундах)

// Загружаем данные из localStorage
function loadProgress() {
  const savedScore = localStorage.getItem('score');
  const savedClass = localStorage.getItem('classType');

  if (savedScore) {
    score = parseInt(savedScore, 10); // Восстанавливаем очки
  }

  if (savedClass) {
    classType = savedClass; // Восстанавливаем класс
    startGame(classType); // Запускаем игру с восстановленным классом
  }
}

// Сохраняем данные в localStorage
function saveProgress() {
  localStorage.setItem('score', score);
  if (classType) {
    localStorage.setItem('classType', classType);
  }
}

// Обновляем отображение счета и сохраняем прогресс
function updateScoreDisplay() {
  document.getElementById('score').textContent = `Score: ${score}`;
  saveProgress(); // Сохраняем прогресс
}

// Начало игры после выбора класса
document.querySelectorAll('.class-button').forEach(button => {
  button.addEventListener('click', () => {
    classType = button.dataset.class;
    saveProgress(); // Сохраняем выбор класса
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
    clickPower = 2; // У воинов удвоенная сила кликов
  } else if (selectedClass === 'mage') {
    clickPower = 1;
    score += 10; // Маги начинают с бонусом очков
  } else if (selectedClass === 'rogue') {
    bonusChance = 0.2; // Разбойники получают повышенный шанс на бонусные эмодзи
  }

  updateScoreDisplay(); // Обновляем отображение счета

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
    updateScoreDisplay(); // Обновляем счет и сохраняем прогресс
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

      updateScoreDisplay(); // Обновляем счет и сохраняем прогресс
    }
  });
});

// Кнопка для сброса счета
document.getElementById('reset-button').addEventListener('click', () => {
  score = 0;
  updateScoreDisplay(); // Обновляем отображение и сохраняем
});

// Кнопка для перехода на страницу листинга
document.getElementById('listing-button').addEventListener('click', () => {
  window.location.href = 'listing.html';
});

// Загрузка данных при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
  loadProgress(); // Загружаем сохраненные данные
});
