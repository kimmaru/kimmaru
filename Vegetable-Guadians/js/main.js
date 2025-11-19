import { Game } from './Game.js';

// Game instance
let game = null;

// DOM elements
const menuScreen = document.getElementById('menu-screen');
const gameScreen = document.getElementById('game-screen');
const gameoverScreen = document.getElementById('gameover-screen');
const canvas = document.getElementById('game-canvas');

const startButton = document.getElementById('start-button');
const helpButton = document.getElementById('help-button');
const helpPanel = document.getElementById('help-panel');
const restartButton = document.getElementById('restart-button');
const menuButton = document.getElementById('menu-button');
const resumeButton = document.getElementById('resume-button');
const mainMenuButton = document.getElementById('main-menu-button');
const pauseOverlay = document.getElementById('pause-overlay');

// Initialize game
function init() {
    game = new Game(canvas);
    setupEventListeners();
    setupMobileInstructions();
}

// Setup mobile-specific instructions
function setupMobileInstructions() {
    const pauseInstruction = document.getElementById('pause-instruction');
    
    // Check if device is mobile
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
                     (window.innerWidth <= 768);
    
    if (isMobile) {
        pauseInstruction.textContent = '더블 탭하여 재개하세요';
    }
}

// Setup event listeners
function setupEventListeners() {
    startButton.addEventListener('click', startGame);
    helpButton.addEventListener('click', toggleHelp);
    restartButton.addEventListener('click', restartGame);
    menuButton.addEventListener('click', showMenu);
    resumeButton.addEventListener('click', resumeGame);
    mainMenuButton.addEventListener('click', showMenu);
}

// Toggle help panel
function toggleHelp() {
    helpPanel.classList.toggle('hidden');
}

// Start game
function startGame() {
    menuScreen.classList.remove('active');
    gameScreen.classList.add('active');
    gameoverScreen.classList.remove('active');
    pauseOverlay.classList.add('hidden');
    
    game.start();
}

// Restart game
function restartGame() {
    gameoverScreen.classList.remove('active');
    gameScreen.classList.add('active');
    pauseOverlay.classList.add('hidden');
    
    game.start();
}

// Resume game
function resumeGame() {
    game.pause();
    pauseOverlay.classList.add('hidden');
}

// Show menu
function showMenu() {
    menuScreen.classList.add('active');
    gameScreen.classList.remove('active');
    gameoverScreen.classList.remove('active');
    pauseOverlay.classList.add('hidden');
    
    if (game) {
        game.stop();
    }
}

// Watch for pause state
function checkPauseState() {
    if (game && game.state === 'playing') {
        if (game.isPaused) {
            pauseOverlay.classList.remove('hidden');
        } else {
            pauseOverlay.classList.add('hidden');
        }
    }
    requestAnimationFrame(checkPauseState);
}

// Start the application
window.addEventListener('DOMContentLoaded', () => {
    init();
    checkPauseState();
});

