# GA-Project-1

## Premise
This game is about survival. The user plays a small circle in a world full of deadly squares. Avoid the squares and rack up as many points as possible.

## User Story
As a user, I want to be able to select a game mode and play using various forms of movement through the game. 








## Technology
HTML
CSS
JavaScript
    Logic and DOM Manipulation
    Canvas, Keyboard Events

## Future directions
Square color personalities
Save the princess! (Go from bottom right to top left). Get back home? Essentially, storyline
Menus
Game difficulty
Animations when hit
Sound effects on border collision
Change innerWidth to clearup the blurr (hopefully)
Purple exploding square that emits particles


movement() {
        //Bounce off the walls and move across screen
        (this.x + this.dX + this.radius) <= myCanvas.width && (this.x + this.dX) >= 0 ? null : this.dX *= (-1)
        this.x += this.dX;
        //check y coords
        (this.y + this.dY + this.radius) <= myCanvas.height && (this.y + this.dY) >= 0 ? null : this.dY *= (-1)
        this.y += this.dY;
    }
    ###functional above

let bounceNoise = new Audio ('BubbleSound.wav')
        if(this.x + this.dX + this.radius <= myCanvas.width && this.x + this.dX >= 0){
            this.x += this.dX;
        }else{
            this.dX *= (-1)
            //bounceNoise.play()
        }
        //check y coords
        if((this.y + this.dY + this.radius) <= myCanvas.height && (this.y + this.dY) >= 0 ){
            this.y += this.dY;    
        } else{
            this.dY *= (-1)
            //bounceNoise.play()
        }
(this.x + this.dX + this.radius) <= myCanvas.width && (this.x + this.dX) >= 0 ? null : ()=>{
            this.dX *= (-1)
            this.noise.play()
        };
        this.x += this.dX;
        //check y coords
        (this.y + this.dY + this.radius) <= myCanvas.height && (this.y + this.dY) >= 0 ? null : ()=>{
            this.dY *= (-1)
            this.noise.play()
        };
        this.y += this.dY;