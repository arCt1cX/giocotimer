# Gioco Timer

A mobile-optimized verbal challenge game with a chess clock mechanic for two players.

## Features

- Two player chess-clock style timer
- Two game modes: Just Timer or With Categories
- Configurable initial time (1, 2, or 5 minutes)
- When one player presses their button, their timer pauses and starts increasing while the opponent's timer starts decreasing
- Clean, modern, responsive UI with smooth transitions
- Pure HTML, CSS, and JavaScript (no frameworks)

## How to Play

1. **Setup**:
   - Choose a game mode: Just Timer or With Categories
   - Select initial time (1, 2, or 5 minutes)
   - Click "Start Game"

2. **Game Start**:
   - The game starts when one of the players presses their button
   - If playing with categories, a random category will be displayed at the top

3. **During Play**:
   - The active player's timer counts down (losing time)
   - The inactive player's timer counts up (gaining time)
   - Players switch by pressing their button when they complete their turn
   - Timers increase and decrease at the same rate
   - A small menu button is available in the center to return to the main menu at any time

4. **Game End**:
   - If a player's timer reaches 0, they lose and the game ends
   - The winner's screen shows "You won"
   - The loser's screen shows "You lost"
   - A reset button appears to start a new game

## Running the Game

Simply open the `index.html` file in any modern web browser. The game works best on mobile devices where players can face each other and use the interface like a physical timer.

## Technical Notes

- The categories are loaded from the `categorie.txt` file
- The application is fully responsive and designed for mobile touch interaction
- No internet connection required after initial load 