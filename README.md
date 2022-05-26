# Square Slayer

## Premise
This game is about survival as much as it is about Slaying Squares. Use arrowkeys to dodge squares and position yourself, or use an ability if the time is right. The more squares you slay without taking damage, the higher your multiplier. Hit multiple squares with a single ability to get a much larger multiplier gain. Every square slain is a win - take as many down with you as you can. How long can you survive? How many squares can you slay before they slay you?

## User Story   
As a gamer, I want to have fun playing a real-time game that challenges me. Too often, the new games I play end up being more graphically impressive than fun. I just want a quick, addicting game that I can play when my university or coding bootcamp lecture gets a little dull.

## Technology
1. HTML
2. CSS
3. JavaScript
*   Logic, DOM Manipulation, Keyboard Events
4. Canvas

## Future Buildout Directions
- [ ] High Score file.
- [ ] New purple exploding square that sends small fragment squares bouncing around briefly.
- [ ] New giant real-time tracking square that is fast in X component and too slow in the Y component (overshoots), like a charging bull.
- [ ] Power-ups that reduce cooldown on abilities or increase player stats.
- [ ] Alternative styling with borders and gradients.

## Game Buildout Progression
- [x] Gameboard constructed using Canvas element.
- [x] Player rendering on Canvas.
- [x] Player able to move using arrowkeys, shift, spacebar.
- [x] New Square Class added - Simple Squares bounce as expected upon collision with border.
- [x] Player/Square collision logic implemented.
- [x] Score tracking and display implemented (1 score per Square per gametick).
- [x] Canvas element and game dynamics scale to player screen size.
- [x] Player Jump Back ability added. Path history drawn, with "echo" of player following.
- [x] New Square Class added - Tracking Squares aim at player on border collision.
- [x] Classes of squares given color for player identification.
- [x] Zen Mode and Game Difficulty options available.
- [x] Implemented new square spawn logic for each game mode and difficulty.
- [x] Quick reset 'r' added for fast restarts.
- [x] Player Detonate ability added.
- [x] Score multiplier introduced to reward Square Slaying (increases by (Detonate kills)^2).
- [x] Scoring logic updated to include slain squares.
- [x] Player health stat added. Default set to 3.
- [x] Player health regen added. Default set to 20s.
- [x] Constructed Introduction mode with game instructions.
- [x] Constructed death transition to display post-game stats.
- [x] Added game speed and square spawn rate scaling as a function of game time (start slow, end fast).