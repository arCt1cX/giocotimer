document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const startMenu = document.getElementById('startMenu');
    const gameScreen = document.getElementById('gameScreen');
    const startButton = document.getElementById('startButton');
    const resetButton = document.getElementById('resetButton');
    const categoryDisplay = document.getElementById('categoryDisplay');
    const categoryText = document.getElementById('category');
    
    const modeButtons = document.querySelectorAll('[data-mode]');
    const timeButtons = document.querySelectorAll('[data-time]');
    
    const player1Button = document.getElementById('button1');
    const player2Button = document.getElementById('button2');
    const time1Element = document.getElementById('time1');
    const time2Element = document.getElementById('time2');
    const status1 = document.getElementById('status1');
    const status2 = document.getElementById('status2');
    
    // Menu button elements
    const menuButton = document.getElementById('menuButton');
    const confirmDialog = document.getElementById('confirmDialog');
    const confirmButton = document.getElementById('confirmButton');
    const cancelButton = document.getElementById('cancelButton');
    
    // Game State
    let gameSettings = {
        mode: 'timer',
        initialTime: 60,
        categories: []
    };
    
    let gameState = {
        isGameStarted: false,
        isGameOver: false,
        activePlayer: null,
        player1Time: 0,
        player2Time: 0,
        lastUpdateTime: 0
    };
    
    // Load categories from file
    async function loadCategories() {
        try {
            const response = await fetch('categorie.txt');
            const text = await response.text();
            gameSettings.categories = text.split('\n').filter(line => line.trim() !== '');
        } catch (error) {
            console.error('Failed to load categories:', error);
            gameSettings.categories = ['Colors', 'Animals', 'Countries', 'Food', 'Sports'];
        }
    }
    
    // Format time as MM:SS
    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainderSeconds = Math.floor(seconds % 60);
        return `${minutes.toString().padStart(2, '0')}:${remainderSeconds.toString().padStart(2, '0')}`;
    }
    
    // Update time displays
    function updateTimeDisplay() {
        time1Element.textContent = formatTime(gameState.player1Time);
        time2Element.textContent = formatTime(gameState.player2Time);
    }
    
    // Game timer logic
    let timerInterval;
    
    function startTimer() {
        gameState.lastUpdateTime = Date.now();
        
        timerInterval = setInterval(() => {
            const now = Date.now();
            const deltaTime = (now - gameState.lastUpdateTime) / 1000;
            gameState.lastUpdateTime = now;
            
            if (gameState.activePlayer === 1) {
                // Player 1 is active (losing time), Player 2 is gaining time
                gameState.player1Time = Math.max(0, gameState.player1Time - deltaTime);
                gameState.player2Time = Math.min(gameSettings.initialTime * 2, gameState.player2Time + deltaTime);
                
                // Check if Player 1 lost
                if (gameState.player1Time <= 0) {
                    endGame(2);
                }
            } else if (gameState.activePlayer === 2) {
                // Player 2 is active (losing time), Player 1 is gaining time
                gameState.player2Time = Math.max(0, gameState.player2Time - deltaTime);
                gameState.player1Time = Math.min(gameSettings.initialTime * 2, gameState.player1Time + deltaTime);
                
                // Check if Player 2 lost
                if (gameState.player2Time <= 0) {
                    endGame(1);
                }
            }
            
            updateTimeDisplay();
        }, 50); // Update frequently for smooth countdown
    }
    
    function stopTimer() {
        clearInterval(timerInterval);
    }
    
    // Game start/end functions
    function initGame() {
        // Initialize game state
        gameState.isGameStarted = false;
        gameState.isGameOver = false;
        gameState.activePlayer = null;
        gameState.player1Time = gameSettings.initialTime;
        gameState.player2Time = gameSettings.initialTime;
        
        // Update UI
        updateTimeDisplay();
        
        // Reset status displays
        status1.textContent = '';
        status2.textContent = '';
        status1.classList.remove('status-win', 'status-lose');
        status2.classList.remove('status-win', 'status-lose');
        
        // Enable player buttons
        player1Button.classList.remove('disabled');
        player2Button.classList.remove('disabled');
        
        // Show menu button, hide reset button
        menuButton.style.display = 'block';
        resetButton.classList.add('hidden');
        
        // Remove game over effect
        gameScreen.classList.remove('game-over');
        
        // Handle category display
        if (gameSettings.mode === 'category') {
            const randomCategory = gameSettings.categories[Math.floor(Math.random() * gameSettings.categories.length)];
            categoryText.textContent = randomCategory;
            categoryDisplay.classList.remove('hidden');
        } else {
            categoryDisplay.classList.add('hidden');
        }
    }
    
    function startGame(playerNumber) {
        if (gameState.isGameStarted || gameState.isGameOver) return;
        
        gameState.isGameStarted = true;
        
        // Fix: Set the active player to the opponent of the player who started
        gameState.activePlayer = playerNumber === 1 ? 2 : 1;
        
        gameState.lastUpdateTime = Date.now();
        
        startTimer();
    }
    
    function endGame(winnerPlayer) {
        gameState.isGameOver = true;
        stopTimer();
        
        // Clear previous status classes
        status1.classList.remove('status-win', 'status-lose');
        status2.classList.remove('status-win', 'status-lose');
        
        // Update status displays with clear winner/loser text and classes
        if (winnerPlayer === 1) {
            status1.textContent = 'You won!';
            status1.classList.add('status-win');
            
            status2.textContent = 'You lost!';
            status2.classList.add('status-lose');
        } else {
            status1.textContent = 'You lost!';
            status1.classList.add('status-lose');
            
            status2.textContent = 'You won!';
            status2.classList.add('status-win');
        }
        
        // Disable player buttons
        player1Button.classList.add('disabled');
        player2Button.classList.add('disabled');
        
        // Hide menu button
        menuButton.style.display = 'none';
        
        // Show reset button and position it in the divider
        resetButton.classList.remove('hidden');
        // Position the reset button in the center of the divider (same as menu button)
        resetButton.style.position = 'absolute';
        resetButton.style.top = '50%';
        resetButton.style.left = '50%';
        resetButton.style.transform = 'translate(-50%, -50%)';
        
        // Add game over effect to darken everything except the status text
        gameScreen.classList.add('game-over');
    }
    
    // Return to main menu
    function returnToMenu() {
        // Stop the game timer
        stopTimer();
        
        // Reset game state and UI
        gameState.isGameStarted = false;
        gameState.isGameOver = false;
        
        // Remove game over effect if present
        gameScreen.classList.remove('game-over');
        
        // Reset status classes
        status1.classList.remove('status-win', 'status-lose');
        status2.classList.remove('status-win', 'status-lose');
        
        // Switch screens
        gameScreen.classList.remove('active');
        startMenu.classList.add('active');
    }
    
    // Show confirmation dialog
    function showConfirmDialog() {
        // Pause the game timer
        if (gameState.isGameStarted && !gameState.isGameOver) {
            stopTimer();
        }
        
        // Show the dialog
        confirmDialog.classList.remove('hidden');
    }
    
    // Hide confirmation dialog
    function hideConfirmDialog(shouldReturnToMenu) {
        // Hide the dialog
        confirmDialog.classList.add('hidden');
        
        if (shouldReturnToMenu) {
            returnToMenu();
        } else if (gameState.isGameStarted && !gameState.isGameOver) {
            // Resume the game timer
            startTimer();
        }
    }
    
    // Event Listeners
    
    // Mode Selection
    modeButtons.forEach(button => {
        button.addEventListener('click', () => {
            modeButtons.forEach(btn => btn.classList.remove('selected'));
            button.classList.add('selected');
            gameSettings.mode = button.dataset.mode;
        });
    });
    
    // Time Selection
    timeButtons.forEach(button => {
        button.addEventListener('click', () => {
            timeButtons.forEach(btn => btn.classList.remove('selected'));
            button.classList.add('selected');
            gameSettings.initialTime = parseInt(button.dataset.time);
        });
    });
    
    // Start Button
    startButton.addEventListener('click', async () => {
        if (gameSettings.mode === 'category' && gameSettings.categories.length === 0) {
            await loadCategories();
        }
        
        startMenu.classList.remove('active');
        gameScreen.classList.add('active');
        
        initGame();
    });
    
    // Player Buttons
    player1Button.addEventListener('click', () => {
        if (gameState.isGameOver) return;
        
        if (!gameState.isGameStarted) {
            startGame(1);
        } else if (gameState.activePlayer === 1) {
            // Switch to player 2
            gameState.activePlayer = 2;
        }
    });
    
    player2Button.addEventListener('click', () => {
        if (gameState.isGameOver) return;
        
        if (!gameState.isGameStarted) {
            startGame(2);
        } else if (gameState.activePlayer === 2) {
            // Switch to player 1
            gameState.activePlayer = 1;
        }
    });
    
    // Reset Button
    resetButton.addEventListener('click', () => {
        initGame();
    });
    
    // Menu Button
    menuButton.addEventListener('click', () => {
        showConfirmDialog();
    });
    
    // Confirmation Dialog Buttons
    confirmButton.addEventListener('click', () => {
        hideConfirmDialog(true); // true = return to menu
    });
    
    cancelButton.addEventListener('click', () => {
        hideConfirmDialog(false); // false = stay in game
    });
    
    // Initialize
    loadCategories();
}); 