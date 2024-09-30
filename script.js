// Импортируйте функции, которые вам нужны из SDK
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs } from "firebase/firestore";

// Конфигурация вашего веб-приложения Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBl4kCDH21kZq1DMhfnwMqsXn9fHzO5vk4",
  authDomain: "emoji-coin-rpg.firebaseapp.com",
  projectId: "emoji-coin-rpg",
  storageBucket: "emoji-coin-rpg.appspot.com",
  messagingSenderId: "992797122367",
  appId: "1:992797122367:web:87b9ae48cd631b3b8bfd8a",
  measurementId: "G-ZXVS5SKTB0"
};

// Инициализация Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Переменные игры
let playerHP = 100;
let playerCoins = 0;
let enemyHP = 50;
const enemyEmojis = ["👾", "👹", "👺", "👿", "👻"];
let currentEnemy = getRandomEnemy();
let totalRating = 0;
let ratingCount = 0;
let hasRated = false;

// Функция для получения случайного врага
function getRandomEnemy() {
    const randomIndex = Math.floor(Math.random() * enemyEmojis.length);
    return enemyEmojis[randomIndex];
}

// Обновление отображаемых статистик
function updateDisplay() {
    document.getElementById("player-hp").textContent = playerHP;
    document.getElementById("coins").textContent = playerCoins;
    document.getElementById("enemy").textContent = currentEnemy;
}

// Функция для атаки
document.getElementById("attack-button").addEventListener("click", () => {
    const damage = 10; // Урон игрока
    enemyHP -= damage;
    if (enemyHP <= 0) {
        playerCoins += 10; // Получаем монеты
        enemyHP = 50; // Восстанавливаем здоровье врага
        currentEnemy = getRandomEnemy(); // Получаем нового врага
        document.getElementById("message").textContent = `Вы победили ${currentEnemy}! Вы получили 10 монет!`;
    } else {
        playerHP -= 5; // Урон врага
        document.getElementById("message").textContent = `${currentEnemy} атакует! Ваше здоровье: ${playerHP}`;
    }
    updateDisplay();
});

// Функция для добавления нового отзыва
async function addRating(ratingValue) {
    try {
        await addDoc(collection(db, "ratings"), { rating: ratingValue });
        console.log("Отзыв добавлен: ", ratingValue);
    } catch (error) {
        console.error("Ошибка добавления отзыва: ", error);
    }
}

// Функция для загрузки отзывов
async function loadRatings() {
    const ratingsRef = collection(db, "ratings");
    const snapshot = await getDocs(ratingsRef);
    
    totalRating = 0;
    ratingCount = 0;

    snapshot.forEach(doc => {
        totalRating += doc.data().rating;
        ratingCount++;
    });

    displayAverageRating(totalRating, ratingCount);
}

// Отображение среднего рейтинга
function displayAverageRating(total, count) {
    const averageRating = (count > 0) ? (total / count).toFixed(1) : 0;
    document.getElementById("average-rating").textContent = averageRating;
    document.getElementById("rating-count").textContent = count;
}

// Система рейтинга
const stars = document.querySelectorAll('.star');

stars.forEach(star => {
    star.addEventListener('click', async () => {
        const ratingValue = parseInt(star.getAttribute('data-value'));

        // Проверка, оставил ли пользователь отзыв
        if (!hasRated) {
            await addRating(ratingValue);
            totalRating += ratingValue;
            ratingCount++;
            hasRated = true; // Пометить как оцененный
            displayAverageRating(totalRating, ratingCount);
            document.getElementById("message").textContent = `Спасибо за отзыв! Вы оценили ${ratingValue} звезды.`;

            // Отключение возможности повторного голосования
            stars.forEach(s => s.style.pointerEvents = 'none');
        } else {
            document.getElementById("message").textContent = `Вы уже оставили отзыв на этот сайт.`;
        }
    });
});

// Загрузка отзывов при первоначальной загрузке страницы
loadRatings();
updateDisplay();
