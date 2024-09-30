let playerHP = 100;
let playerCoins = 0;
let enemyHP = 50;
const enemyEmojis = ["👾", "👹", "👺", "👿", "👻"];
let currentEnemy = getRandomEnemy();

function getRandomEnemy() {
    const randomIndex = Math.floor(Math.random() * enemyEmojis.length);
    return enemyEmojis[randomIndex];
}

function updateDisplay() {
    document.getElementById("player-hp").textContent = playerHP;
    document.getElementById("coins").textContent = playerCoins;
    document.getElementById("enemy").textContent = currentEnemy;
}

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

document.getElementById("exit-button").addEventListener("click", () => {
    window.close();
});

// Initial update
updateDisplay();
