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
    
    // Turn indicators
    const indicator1 = document.getElementById('indicator1');
    const indicator2 = document.getElementById('indicator2');
    
    // Game over messages
    const gameOverPlayer1 = document.getElementById('gameOverPlayer1');
    const gameOverPlayer2 = document.getElementById('gameOverPlayer2');
    
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
    
    // Update turn indicators and button states
    function updateTurnIndicators() {
        // Reset all indicators and button classes
        indicator1.classList.remove('visible');
        indicator2.classList.remove('visible');
        
        player1Button.classList.remove('active-turn', 'inactive-turn', 'ready-turn');
        player2Button.classList.remove('active-turn', 'inactive-turn', 'ready-turn');
        
        if (!gameState.isGameStarted) {
            // Game hasn't started - both buttons are in "ready" state
            player1Button.classList.add('ready-turn');
            player2Button.classList.add('ready-turn');
        } else if (!gameState.isGameOver) {
            // Game is in progress
            if (gameState.activePlayer === 1) {
                // Player 1's turn - show active state
                player1Button.classList.add('active-turn');
                player2Button.classList.add('inactive-turn');
                indicator1.classList.add('visible');
            } else {
                // Player 2's turn - show active state
                player1Button.classList.add('inactive-turn');
                player2Button.classList.add('active-turn');
                indicator2.classList.add('visible');
            }
        }
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
        updateTurnIndicators();
        
        // Reset status displays
        status1.textContent = '';
        status2.textContent = '';
        
        // Reset game over messages
        gameOverPlayer1.classList.add('hidden');
        gameOverPlayer1.classList.remove('loser');
        gameOverPlayer2.classList.add('hidden');
        gameOverPlayer2.classList.remove('loser');
        gameOverPlayer1.textContent = 'YOU WON!';
        gameOverPlayer2.textContent = 'YOU WON!';
        
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
        
        // Update visual indicators
        updateTurnIndicators();
        
        startTimer();
    }
    
    function endGame(winnerPlayer) {
        gameState.isGameOver = true;
        stopTimer();
        
        // Add game over effect to darken everything
        gameScreen.classList.add('game-over');
        
        // Reset button states and indicators
        player1Button.classList.remove('active-turn', 'inactive-turn', 'ready-turn');
        player2Button.classList.remove('active-turn', 'inactive-turn', 'ready-turn');
        indicator1.classList.remove('visible');
        indicator2.classList.remove('visible');
        
        // Show appropriate game over messages
        if (winnerPlayer === 1) {
            // Player 1 won
            gameOverPlayer1.textContent = 'YOU WON!';
            gameOverPlayer1.classList.remove('loser');
            gameOverPlayer1.classList.remove('hidden');
            
            gameOverPlayer2.textContent = 'YOU LOST!';
            gameOverPlayer2.classList.add('loser');
            gameOverPlayer2.classList.remove('hidden');
        } else {
            // Player 2 won
            gameOverPlayer1.textContent = 'YOU LOST!';
            gameOverPlayer1.classList.add('loser');
            gameOverPlayer1.classList.remove('hidden');
            
            gameOverPlayer2.textContent = 'YOU WON!';
            gameOverPlayer2.classList.remove('loser');
            gameOverPlayer2.classList.remove('hidden');
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
    }
    
    // Switch active player
    function switchActivePlayer() {
        if (gameState.activePlayer === 1) {
            gameState.activePlayer = 2;
        } else {
            gameState.activePlayer = 1;
        }
        
        // Update visual indicators
        updateTurnIndicators();
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
        
        // Hide game over messages
        gameOverPlayer1.classList.add('hidden');
        gameOverPlayer2.classList.add('hidden');
        
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
            switchActivePlayer();
        }
    });
    
    player2Button.addEventListener('click', () => {
        if (gameState.isGameOver) return;
        
        if (!gameState.isGameStarted) {
            startGame(2);
        } else if (gameState.activePlayer === 2) {
            // Switch to player 1
            switchActivePlayer();
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