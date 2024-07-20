let playerHealth = 100;
let playerAttackPower = 10;
let playerCoins = 0;
let playerInventory = Array(15).fill('💉'); // Начало с 15 предметами для лечения
let isGameOver = false;
let isGodMode = false;
let showHelp = false;
let actionCount = 0;
let cheatSequence = 'manma101';
let currentCheatIndex = 0;
let removeBarrier = false;
let maxEnemies = 5;
const enemies = [];

// Функция для добавления двух начальных врагов
function initializeEnemies() {
    for (let i = 0; i < 2; i++) {
        addRandomEnemy();
    }
}

// Функция для добавления случайного врага
function addRandomEnemy() {
    const emojis = ['🧛‍♂️', '🧟‍♂️', '👨‍⚕️', '👩‍⚕️', '👾', '🦹‍♂️', '🐉'];
    const emoji = emojis[Math.floor(Math.random() * emojis.length)];
    const health = Math.floor(Math.random() * 50) + 30;
    enemies.push({ id: `enemy-${Date.now()}`, health: health, initialHealth: health, emoji: emoji });
    updateUI();
}

// Функция для обновления интерфейса
function updateUI() {
    document.getElementById('player-health').textContent = playerHealth;
    document.getElementById('player-attack').textContent = playerAttackPower;
    document.getElementById('player-coins').textContent = playerCoins;
    document.getElementById('player-inventory').textContent = playerInventory.join('');
    
    const enemyContainer = document.getElementById('enemies');
    enemyContainer.innerHTML = ''; // Clear existing enemies

    enemies.forEach(enemy => {
        const enemyDiv = document.createElement('div');
        enemyDiv.className = 'enemy';
        enemyDiv.id = enemy.id;
        enemyDiv.innerHTML = `<p>Health: <span id="${enemy.id}-health">${Math.max(enemy.health, 0)}</span></p><p>${enemy.emoji}</p>`;
        enemyContainer.appendChild(enemyDiv);
    });

    // Disable buttons if game over
    if (isGameOver) {
        document.querySelectorAll('button').forEach(button => button.disabled = true);
    }

    // Show help menu if enabled
    document.getElementById('help-menu').style.display = showHelp ? 'block' : 'none';
}

// Функция для атаки врага
function attack() {
    if (isGameOver) return;

    // Check if there are enemies to attack
    if (enemies.length === 0) {
        return; // No enemies left to attack
    }

    // Attack a random enemy
    const enemy = enemies[Math.floor(Math.random() * enemies.length)];
    const damage = Math.floor(Math.random() * playerAttackPower) + 1;
    enemy.health -= damage;

    // Check if enemy is defeated
    if (enemy.health <= 0) {
        playerCoins += Math.floor(enemy.initialHealth / 4); // Coins dropped
        // 30% chance to drop a sharpening stone
        if (Math.random() < 0.3) {
            playerInventory.push('🗿');
        }
        // Special case for doctor
        if (enemy.emoji.includes('‍⚕️')) {
            playerInventory.push('💉'); // Add healing item to inventory
        }
        enemies.splice(enemies.indexOf(enemy), 1); // Remove defeated enemy
    }

    // Enemy attacks player (only if there are still enemies left)
    if (enemies.length > 0 && !isGodMode) {
        const enemyDamage = Math.floor(Math.random() * 10) + 1;
        playerHealth -= enemyDamage;
        
        if (playerHealth <= 0) {
            alert('You are defeated! 💔');
            playerHealth = 0;
            isGameOver = true;
        }
    }

    actionCount++;
    if (actionCount % 30 === 0 && (enemies.length < maxEnemies || removeBarrier)) {
        addRandomEnemy();
    }

    updateUI();
}

// Функция для лечения игрока
function heal(amount = 1) {
    if (isGameOver) return;
    
    // Check if there are any healing items
    const healItems = playerInventory.filter(item => item === '💉');
    if (healItems.length < amount) {
        alert('Not enough healing items!');
        return;
    }

    // Apply healing
    playerHealth = Math.min(playerHealth + amount * 10, 100); // Heal by 10 per item, max 100 health
    playerInventory = playerInventory.filter(item => item !== '💉' || amount-- > 0); // Remove used items
    updateUI();
}

// Функция для использования точильного камня
function useSharpeningStone() {
    if (isGameOver) return;

    const index = playerInventory.indexOf('🗿');
    if (index === -1) {
        alert('No sharpening stones available!');
        return;
    }

    playerAttackPower += 5;
    playerInventory.splice(index, 1);
    updateUI();
}

// Функция для использования зелья здоровья
function useHealthPotion() {
    if (isGameOver) return;

    const index = playerInventory.indexOf('🧪');
    if (index === -1) {
        alert('No health potions available!');
        return;
    }

    playerHealth = Math.min(playerHealth + 50, 100); // Heal by 50, max 100 health
    playerInventory.splice(index, 1);
    updateUI();
}
function heal(amount = 1) {
    if (isGameOver) return;
    
    // Check if there are any healing items
    const healItems = playerInventory.filter(item => item === '💉');
    if (healItems.length < amount) {
        alert('Not enough healing items!');
        return;
    }

    // Apply healing
    playerHealth = Math.min(playerHealth + amount * 10, 100); // Heal by 10 per item, max 100 health

    // Remove healing items one by one
    while (amount > 0 && playerInventory.includes('💉')) {
        const index = playerInventory.indexOf('💉');
        if (index !== -1) {
            playerInventory.splice(index, 1); // Remove one healing item
            amount--; // Decrement the amount needed
        }
    }

    updateUI();
}


// Функция для использования бомбы
function useBomb() {
    if (isGameOver) return;

    const index = playerInventory.indexOf('💣');
    if (index === -1) {
        alert('No bombs available!');
        return;
    }

    enemies.forEach(enemy => {
        playerCoins += Math.floor(enemy.initialHealth / 4); // Add coins for each enemy
    });

    enemies.length = 0; // Remove all enemies
    playerInventory.splice(index, 1);
    updateUI();
}

// Функция для добавления врага
function addEnemy() {
    if (isGameOver) return;

    if (enemies.length >= maxEnemies) {
        alert('Cannot add more enemies, max limit reached!');
        return;
    }

    addRandomEnemy();
}

// Функция для покупки предметов
function buyItem(item) {
    if (isGameOver) return;

    const prices = { '💉': 50, '🗿': 100, '🧪': 250, '💣': 150, '💕': 350 };
    if (!prices[item]) {
        alert('Invalid item!');
        return;
    }

    if (playerCoins < prices[item]) {
        alert('Not enough coins!');
        return;
    }

    playerCoins -= prices[item];
    playerInventory.push(item);
    updateUI();
}

// Функция для переключения темы
function toggleTheme() {
    const body = document.body;
    body.classList.toggle('dark-mode');
    const themeButton = document.getElementById('theme-toggle');
    themeButton.textContent = body.classList.contains('dark-mode') ? '☀' : '🌑';
}

// Функция для выполнения чит-кодов
function executeCheat() {
    const command = document.getElementById('cheat-command').value;
    const args = command.split(' ');

    switch (args[0]) {
        case 'rmall':
            playerInventory = [];
            enemies.length = 0;
            break;
        case 'rm':
            const itemToRemove = args[1];
            const count = parseInt(args[2]) || 1;
            for (let i = 0; i < count; i++) {
                const index = playerInventory.indexOf(itemToRemove);
                if (index !== -1) playerInventory.splice(index, 1);
            }
            break;
        case 'killall':
            enemies.length = 0;
            break;
        case 'kill':
            const enemyType = args[1];
            for (let i = enemies.length - 1; i >= 0; i--) {
                if (enemies[i].emoji === enemyType) {
                    enemies.splice(i, 1);
                }
            }
            break;
        case 'give':
            const itemToGive = args[1];
            const giveCount = parseInt(args[2]) || 1;
            for (let i = 0; i < giveCount; i++) {
                playerInventory.push(itemToGive);
            }
            break;
        case 'add':
            const newEnemy = args[1];
            const addCount = parseInt(args[2]) || 1;
            const enemyHealth = parseInt(args[3]) || Math.floor(Math.random() * 50) + 30;
            for (let i = 0; i < addCount; i++) {
                enemies.push({ id: `enemy-${Date.now()}`, health: enemyHealth, initialHealth: enemyHealth, emoji: newEnemy });
            }
            break;
        case 'godmode':
            isGodMode = !isGodMode;
            alert('God mode ' + (isGodMode ? 'enabled' : 'disabled'));
            break;
        case 'help':
            showHelp = !showHelp;
            document.getElementById('help-menu').style.display = showHelp ? 'block' : 'none';
            break;
    }
    updateUI();
}

// Инициализация игры при загрузке страницы
window.onload = function() {
    initializeEnemies();
    updateUI();
};
