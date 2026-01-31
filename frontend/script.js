// API endpoint
const API_URL = 'http://localhost:3000/api/gamestate';

// Update interval (100ms for faster response)
const UPDATE_INTERVAL = 100;

// XP table for levels 1-30 (cumulative XP needed)
const XP_TABLE = [
    0, 200, 500, 900, 1400, 2000, 2700, 3500, 4400, 5400,
    6500, 7700, 9000, 10400, 11900, 13500, 15200, 17000, 18900, 20900,
    23000, 25200, 27500, 29900, 32400, 35000, 38000, 41500, 45500, 50000
];

// Game start time for calculating GPM/XPM
let gameStartTime = null;
let previousGold = 0;
let previousXP = 0;

// DOM elements
const statusDot = document.getElementById('statusDot');
const statusText = document.getElementById('statusText');
const gameTime = document.getElementById('gameTime');
const dayNight = document.getElementById('dayNight');
const heroName = document.getElementById('heroName');
const kills = document.getElementById('kills');
const deaths = document.getElementById('deaths');
const assists = document.getElementById('assists');
const respawnTimer = document.getElementById('respawnTimer');
const respawnCountdown = document.getElementById('respawnCountdown');
const healthValue = document.getElementById('healthValue');
const healthBar = document.getElementById('healthBar');
const healthPercent = document.getElementById('healthPercent');
const manaValue = document.getElementById('manaValue');
const manaBar = document.getElementById('manaBar');
const manaPercent = document.getElementById('manaPercent');
const heroLevel = document.getElementById('heroLevel');
const nextLevel = document.getElementById('nextLevel');
const xpRemaining = document.getElementById('xpRemaining');
const xpBar = document.getElementById('xpBar');
const xpPercent = document.getElementById('xpPercent');
const gpm = document.getElementById('gpm');
const xpm = document.getElementById('xpm');
const netWorth = document.getElementById('netWorth');
const totalGold = document.getElementById('totalGold');
const reliableGold = document.getElementById('reliableGold');
const unreliableGold = document.getElementById('unreliableGold');
const buybackCost = document.getElementById('buybackCost');
const goldAfterBuyback = document.getElementById('goldAfterBuyback');
const buybackStatus = document.getElementById('buybackStatus');
const lastUpdate = document.getElementById('lastUpdate');

/**
 * Fetch game state from the Python backend
 */
async function fetchGameState() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        
        if (data.status === 'waiting') {
            updateStatusIndicator(false, data.message);
            resetDashboard();
        } else if (data.status === 'active' && data.data) {
            updateStatusIndicator(true, 'Connected to game');
            updateDashboard(data.data);
            updateLastUpdateTime(data.last_update);
        }
        
    } catch (error) {
        console.error('Error fetching game state:', error);
        updateStatusIndicator(false, 'Connection error');
        resetDashboard();
    }
}

/**
 * Update the status indicator
 */
function updateStatusIndicator(isActive, message) {
    if (isActive) {
        statusDot.classList.add('active');
        statusText.textContent = message;
    } else {
        statusDot.classList.remove('active');
        statusText.textContent = message;
    }
}

/**
 * Format seconds to MM:SS
 */
function formatTime(seconds) {
    const mins = Math.floor(Math.abs(seconds) / 60);
    const secs = Math.floor(Math.abs(seconds) % 60);
    const sign = seconds < 0 ? '-' : '';
    return `${sign}${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Calculate XP needed for next level
 */
function getXPForLevel(level) {
    if (level < 1 || level > 30) return 0;
    return XP_TABLE[level - 1];
}

/**
 * Update the dashboard with game data
 */
function updateDashboard(gameData) {
    const hero = gameData.hero || {};
    const player = gameData.player || {};
    const map = gameData.map || {};
    
    // Update game time and day/night
    if (map.clock_time !== undefined) {
        gameTime.textContent = formatTime(map.clock_time);
        const isDaytime = map.daytime !== false;
        dayNight.textContent = isDaytime ? '☀️' : '🌙';
        dayNight.title = isDaytime ? 'Daytime' : 'Nighttime';
    }
    
    // Update hero name
    if (hero.name) {
        heroName.textContent = hero.name.replace('npc_dota_hero_', '').replace(/_/g, ' ').toUpperCase();
    }
    
    // Update K/D/A
    kills.textContent = player.kills || 0;
    deaths.textContent = player.deaths || 0;
    assists.textContent = player.assists || 0;
    
    // Update respawn timer
    if (hero.respawn_seconds && hero.respawn_seconds > 0) {
        respawnTimer.classList.remove('hidden');
        respawnCountdown.textContent = Math.ceil(hero.respawn_seconds) + 's';
    } else {
        respawnTimer.classList.add('hidden');
    }
    
    // Update health
    const health = hero.health || 0;
    const maxHealth = hero.max_health || 1;
    const healthPercentValue = Math.round((health / maxHealth) * 100);
    
    healthValue.textContent = `${health} / ${maxHealth}`;
    healthBar.style.width = `${healthPercentValue}%`;
    healthPercent.textContent = `${healthPercentValue}%`;
    
    // Update mana
    const mana = hero.mana || 0;
    const maxMana = hero.max_mana || 1;
    const manaPercentValue = Math.round((mana / maxMana) * 100);
    
    manaValue.textContent = `${mana} / ${maxMana}`;
    manaBar.style.width = `${manaPercentValue}%`;
    manaPercent.textContent = `${manaPercentValue}%`;
    
    // Update level
    const currentLevel = hero.level || 1;
    heroLevel.textContent = currentLevel;
    
    // Update XP progress
    if (currentLevel < 30) {
        const currentXP = hero.xp || 0;
        const xpForCurrentLevel = getXPForLevel(currentLevel);
        const xpForNextLevel = getXPForLevel(currentLevel + 1);
        const xpNeeded = xpForNextLevel - xpForCurrentLevel;
        const xpProgress = currentXP - xpForCurrentLevel;
        const xpPercentValue = Math.round((xpProgress / xpNeeded) * 100);
        
        nextLevel.textContent = currentLevel + 1;
        xpRemaining.textContent = Math.max(0, xpNeeded - xpProgress);
        xpBar.style.width = `${Math.max(0, Math.min(100, xpPercentValue))}%`;
        xpPercent.textContent = `${Math.max(0, Math.min(100, xpPercentValue))}%`;
    } else {
        nextLevel.textContent = 'MAX';
        xpRemaining.textContent = '0';
        xpBar.style.width = '100%';
        xpPercent.textContent = '100%';
    }
    
    // Calculate GPM/XPM
    const gold = player.gold || 0;
    const xp = hero.xp || 0;
    
    if (map.clock_time && map.clock_time > 0) {
        const gameMinutes = Math.abs(map.clock_time) / 60;
        const calculatedGPM = Math.round(gold / gameMinutes);
        const calculatedXPM = Math.round(xp / gameMinutes);
        
        gpm.textContent = calculatedGPM;
        xpm.textContent = calculatedXPM;
    } else {
        gpm.textContent = '0';
        xpm.textContent = '0';
    }
    
    // Calculate net worth (simplified - just gold for now)
    // In a full implementation, you'd add item values
    netWorth.textContent = gold;
    
    // Update gold
    const goldReliable = player.gold_reliable || 0;
    const goldUnreliable = gold - goldReliable;
    
    totalGold.textContent = gold;
    reliableGold.textContent = goldReliable;
    unreliableGold.textContent = goldUnreliable;
    
    // Calculate buyback
    calculateBuyback(currentLevel, gold, goldUnreliable);
}

/**
 * Calculate buyback cost and status
 */
function calculateBuyback(level, totalGoldAmount, unreliableGoldAmount) {
    const baseCost = 100;
    const levelCost = level * 15;
    const cost = baseCost + levelCost;
    
    buybackCost.textContent = cost;
    
    const reliableGoldAmount = totalGoldAmount - unreliableGoldAmount;
    const goldAfter = totalGoldAmount - cost;
    
    goldAfterBuyback.textContent = goldAfter >= 0 ? goldAfter : 0;
    
    const statusBadge = buybackStatus.querySelector('.status-badge');
    
    if (totalGoldAmount >= cost) {
        statusBadge.textContent = '✓ Buyback Available';
        statusBadge.className = 'status-badge can-buyback';
    } else {
        const needed = cost - totalGoldAmount;
        statusBadge.textContent = `✗ Need ${needed} more gold`;
        statusBadge.className = 'status-badge cannot-buyback';
    }
}

/**
 * Reset dashboard to default state
 */
function resetDashboard() {
    gameTime.textContent = '00:00';
    dayNight.textContent = '☀️';
    heroName.textContent = 'No Hero Selected';
    kills.textContent = '0';
    deaths.textContent = '0';
    assists.textContent = '0';
    respawnTimer.classList.add('hidden');
    healthValue.textContent = '- / -';
    healthBar.style.width = '0%';
    healthPercent.textContent = '0%';
    manaValue.textContent = '- / -';
    manaBar.style.width = '0%';
    manaPercent.textContent = '0%';
    heroLevel.textContent = '-';
    nextLevel.textContent = '-';
    xpRemaining.textContent = '-';
    xpBar.style.width = '0%';
    xpPercent.textContent = '0%';
    gpm.textContent = '0';
    xpm.textContent = '0';
    netWorth.textContent = '0';
    totalGold.textContent = '0';
    reliableGold.textContent = '0';
    unreliableGold.textContent = '0';
    buybackCost.textContent = '-';
    goldAfterBuyback.textContent = '-';
    
    const statusBadge = buybackStatus.querySelector('.status-badge');
    statusBadge.textContent = 'Unknown';
    statusBadge.className = 'status-badge';
}

/**
 * Update last update time
 */
function updateLastUpdateTime(isoTime) {
    if (isoTime) {
        const date = new Date(isoTime);
        lastUpdate.textContent = date.toLocaleTimeString();
    }
}

// Start fetching game state every 100ms
setInterval(fetchGameState, UPDATE_INTERVAL);

// Initial fetch
fetchGameState();

console.log('Dota 2 Dashboard [Enhanced Edition] initialized.');
console.log('New features: K/D/A, Game Time, Respawn Timer, GPM/XPM, XP Progress');
