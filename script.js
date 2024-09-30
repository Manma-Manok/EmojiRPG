let playerHP = 100;
let playerCoins = 0;
let enemyHP = 50;
const enemyEmojis = ["👾", "👹", "👺", "👿", "👻"];
let currentEnemy = getRandomEnemy();
let totalRating = 0;
let ratingCount = 0;

// Load saved rating from localStorage
if (localStorage.getItem("totalRating")) {
    totalRating = parseInt(localStorage.getItem("totalRating"));
}
if (localStorage.getItem("ratingCount")) {
    ratingCount = parseInt(localStorage.getItem("ratingCount"));
}

// Check if user has already rated
let hasRated = localStorage.getItem("hasRated") === "true";

// Display average rating
function displayAverageRating() {
    const averageRating = (ratingCount > 0) ? (totalRating / ratingCount).toFixed(1) : 0;
    document.getElementById("average-rating").textContent = averageRating;
    document.getElementById("rating-count").textContent = ratingCount;
}

// Function to get a random enemy emoji
function getRandomEnemy() {
    const randomIndex = Math.floor(Math.random() * enemyEmojis.length);
    return enemyEmojis[randomIndex];
}

// Update displayed stats
function updateDisplay() {
    document.getElementById("player-hp").textContent = playerHP;
    document.getElementById("coins").textContent = playerCoins;
    document.getElementById("enemy").textContent = currentEnemy;
    displayAverageRating();
}

// Attack functionality
document.getElementById("attack-button").addEventListener("click", () => {
    const damage = Math.floor(Math.random() * 20) + 1;
    enemyHP -= damage;
    document.getElementById("message").textContent = `You dealt ${damage} damage!`;
    
    if (enemyHP <= 0) {
        playerCoins += 10;
        enemyHP = 50; // Reset enemy HP
        currentEnemy = getRandomEnemy(); // Get a new enemy
        document.getElementById("message").textContent += ` You defeated the enemy! You earned 10 coins.`;
    }
    
    // Enemy attacks back
    const enemyDamage = Math.floor(Math.random() * 15) + 1;
    playerHP -= enemyDamage;
    if (playerHP <= 0) {
        playerHP = 0;
        document.getElementById("message").textContent += ` You have been defeated!`;
    } else {
        document.getElementById("message").textContent += ` The enemy dealt ${enemyDamage} damage.`;
    }

    updateDisplay();
});

// Shop functionality
document.getElementById("heal-button").addEventListener("click", () => {
    if (playerCoins >= 10) {
        playerCoins -= 10;
        playerHP = Math.min(playerHP + 20, 100);
        document.getElementById("message").textContent = `You bought a first aid kit!`;
    } else {
        document.getElementById("message").textContent = `Not enough coins!`;
    }
    updateDisplay();
});

document.getElementById("damage-button").addEventListener("click", () => {
    if (playerCoins >= 20) {
        playerCoins -= 20;
        document.getElementById("message").textContent = `You increased your damage!`;
    } else {
        document.getElementById("message").textContent = `Not enough coins!`;
    }
    updateDisplay();
});

document.getElementById("hp-button").addEventListener("click", () => {
    if (playerCoins >= 30) {
        playerCoins -= 30;
        playerHP += 20;
        document.getElementById("message").textContent = `You increased your max HP!`;
    } else {
        document.getElementById("message").textContent = `Not enough coins!`;
    }
    updateDisplay();
});

// Exit functionality
document.getElementById("exit-button").addEventListener("click", () => {
    window.close();
});

// Rating System
const stars = document.querySelectorAll('.star');

if (hasRated) {
    stars.forEach(star => star.style.pointerEvents = 'none');
}

stars.forEach(star => {
    star.addEventListener('click', () => {
        const ratingValue = parseInt(star.getAttribute('data-value'));

        // Save the rating
        if (!hasRated) {
            totalRating += ratingValue;
            ratingCount++;
            localStorage.setItem("totalRating", totalRating);
            localStorage.setItem("ratingCount", ratingCount);
            localStorage.setItem("hasRated", true); // Mark as rated

            displayAverageRating();
            document.getElementById("message").textContent = `Thank you for rating! You rated ${ratingValue} star(s).`;

            // Disable further rating
            stars.forEach(s => s.style.pointerEvents = 'none');
        } else {
            document.getElementById("message").textContent = `You have already rated this site.`;
        }
    });
});

// Initial update
updateDisplay();
