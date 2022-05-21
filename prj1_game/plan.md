<!-- Objective/Overview of game -->
Player exists in a circle and computer "Archers" spawn along an encapsulating rectangle. Big rectanglefor archers, medium circle for player.
Archers fire inwards across the circle in somewhat random directions (random Y towards other side).
Arrows are canvas objects that move across the gameboard.
Player must dodge arrows to accummulate score.
Objective is to live as long as possible, getting highest score possible.
As game progresses, more Archers exist, which puts more projectiles on the screen.
When player runs out of health by being hit by too many arrows, game ends.

<!-- Gameboard ideas -->
Gameboard is a large rectangle drawn in canvas. It takes up 90% min(vw,vh) -- which won't work well on small screens I think.
Inner circle encapsulates player.
Archers spawn along outer edge of rectangle. --new idea for this is to have each side of the rectangle an "archer". "archercount" increases over time and just causes that side to shoot arrows more often.
Player cannot move out of inner circle.

<!-- Player structure and movement -->
Player is a reasonably small object within the gameboard. Probably a square.
Player moves up,down,left,right with arrowkeys. May also have a 'dash' that allows for a short burst of movement in a direction.
Play will have health that decreases whenever they collide with an Archer's "arrow" object, similar to Canvas Crawler.
Player gains score whenever an "arrow" reaches an outer boarder (meaning it missed)

<!-- Computer Archers (multiple types if game progress moves quickly?) -->
Archers spawn along outer circle periodically (gameprogression function). --with new idea, archer counter just increases periodically.
The archers have a random chance to shoot for any given gametick 
Archers have a reload time where they cannot shoot again (maybe, 1s). -- decreases with archercount
Archers aim by selecting a random Y coordinate.
    <!-- Archer arrows -->
    Arrows are objects (rectangles?) produced by the archer object that travel along the gameboard
    As the arrow moves, it checks for collisions with a player or another arrow.
    If it hits a player, player loses 1hp.
    If play is hit, display something briefly to indicate that.

<!-- Gamescreens -->
Goes straight to game, just waits on start activation (button?)
Before start, includes games directions (arrowkeys, dodge arrows, where arrow spawns, border of player)
On start, graphics disappear and arrows the flying.
At player HP = 0, display end popup (div?) containing their score and the option to reset and play again.
Keep current best score fixed on screen.

<!-- Steps in game construction -->
Figure out canvas outer rectangle and inner circle display logic.

Create class for player that creates a shape that can be hit and stores information.
Construct event listeners for player movement across the screen.
Implement border logic to prevent player from moving outside the border of the inner circle. Cannot make given move if (x^2)+(y^2)>(r^2), adjusted for circle origin.
Calculate "hit box" that includes arrow radius. Therefore, if arrow (x,y coord) is within hit box = hit. ***Can test this with eventListener for mouseEnter. Should when constructing make this show as translucent larger circle around player.

Create class for arrows that can be used to contain directional info. **Circles may be easier to check for player hit.
Arrows contain XY current(random initial), and a calculated increment (change in Y per tick, positive or negative depending on their origin Y and destination).
Arrows move across the screen at a specified rate of X, with the calculated rate of Y per game tick.
When arrows reach certain X (other side) they disappear and score increases by 1.
A player is "hit" when an arrows x,y coordinates are within the player's "hit box"

Create class for Archer (base game contains 1, end game may have up to 4, 1 per side)
Class contains the gameboard's width and height
Has an "Archer count" that increases as the game progresses
Arrows are produced whenever a random number generator picks a number higher than some threshold.
Archercount reduces threshold to make an arrow, so more arrows are produced as the game continues
Arrows are initialized with X=0, Y=random()*game.height. xTarget=game.width, yTarget=random()*game.height. yIncrement=(yTarget-Y)/(game.width/xSpeed).

Create scoreboard that increases whenever an arrow reaches the other side.
Make pregame frames that display instructions
Make READ.ME and other docs required.

Create gameTick (aka loop) function.
With each gameTick, new arrows are checked for, player moves, arrows move, hits are checked for, score is updated.