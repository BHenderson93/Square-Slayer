console.log('apps.js synced')

let myCanvas = document.getElementById('gameboard')
let pencil = myCanvas.getContext('2d')

//x and y coordinates for center of the board, as well as gameScalers for screen sizes
const boardOrigin = { x: myCanvas.width / 2, y: myCanvas.height / 2 }
const gameScaler = Math.min(myCanvas.width, myCanvas.height)

//Draw outer border
function drawOuterEdge() {

}
//Draw the center circle of the game board, which limits Player movement
function drawCage() {
    let radius = gameScaler
    pencil.beginPath()
    pencil.rect(boardOrigin.x, boardOrigin.y, radius, 0, 2 * Math.PI)
    //pencil.stroke()
    pencil.fill()
}
drawCage()

//Class specifics for Player
class Player {

    //take in player attributes and construct object.
    constructor(color) {
        this.health = 10
        this.speed = 10
        this.color = 'rgb(255,0,0)'
        this.x = boardOrigin.x
        this.y = boardOrigin.y
        this.moveSpeed = 1
        this.radius = gameScaler * .01
    }
    movement(){
        //nextMove global variable stores X or Y axis and 1 or -1 by arrowkeys. Ex: down arrowkey = ['y', 1] for increase y axis to move player down.
        let moveAxis = nextMove[0]
        let moveDist = nextMove[1]*this.moveSpeed
        moveAxis === 'x' ? (this.x + moveDist >= 0 && this.x + moveDist <= myCanvas.width ? this.x += moveDist : null) : null
        moveAxis === 'y' ? (this.y + moveDist >= 0 && this.y + moveDist <= myCanvas.height ? this.y += moveDist : null) : null
    }

    //draw the player on at the center of the board
    render() {

        //Central player
        pencil.beginPath()
        pencil.fillStyle = this.color
        pencil.arc(this.x, this.y, this.radius, 0, 2 * Math.PI)
        pencil.fill()
    }
}

//Class specifics for objects spawned into the game board that bounce around and damage Player on contact.
class Spawn {
    constructor(radius, dX, dY) {
        this.radius = radius
        this.dX = dX
        this.dY = dY
        this.x = 0
        this.y = myCanvas.height / 2
        this.color = `rgb(${Math.floor(Math.random()*255)}, ${Math.floor(Math.random()*255)},${Math.floor(Math.random()*255)})`
        console.log('My dX, dY is ' , this.dX,this.dY)
    }
    movement() {
        //console.log(this.x,this.dX,this.y,this.dY);
        //check x coordinates for next move. If outside of board boundry, flip the sign of dX to make it go the other way next tick.
        ((this.x + this.dX + this.radius) <= myCanvas.width && (this.x + this.dX) >= 0) ? null : this.dX *= (-1);
        this.x += this.dX;
        //check y coords
        ((this.y + this.dY + this.radius) <= myCanvas.height && (this.y + this.dY) >= 0) ? null : this.dY *= (-1);
        this.y += this.dY;
        return null
    }
    render() {
        pencil.fillStyle = this.color
        pencil.fillRect(this.x, this.y, this.radius, this.radius)
    }
    redirect() {
        //New movement direction construction
    }
}

//generate new spawn dictated by rate, how much time has passed.
function generateSpawn(rate, spawnSize) {
    //console.log(spawnTimer)
    if (spawnTimer > rate) {
        spawnTimer = 0
        let size = 10 + Math.floor(Math.random() * spawnSize)
        let speedX = 0.5 - Math.random()
        let speedY = 0.5 - Math.random()
        let newSpawn = new Spawn(size, speedX, speedY)
        spawnList.push(newSpawn)
    } else {
        spawnTimer++
    }
}
function movePieces() { }
function checkCollisions() {//border and other pieces
}

//Function to advance the game by one 'tick' each 60ms.
let spawnTimer = 0
function gameTick()  {
    pencil.clearRect(0, 0, myCanvas.width, myCanvas.height)
    //redraw static pieces of the gameboard
    //check to see if the next move is within the bounds specified.

    //let playerChain = (player.x**2)+(player.y**2)
    player.movement()
    player.render()

    //spawn stuff
    
    generateSpawn(150, 5)
    for(let spawn of spawnList){
        spawn.movement()
        spawn.render()
    }
/*     spawn.movement()
    spawn.render()
    spawn2.movement()
    spawn2.render() */
}

//store the last arrowkey press in the nextMove array. Use that for movement direction. Spacebar to clear.
let nextMove = [0, 0]
function movementHandler(e) {
    console.log('keyboard move was ', e.key)
    switch (e.key) {
        case "ArrowUp":
            nextMove = ['y', -1]
            break
        case "ArrowDown":
            nextMove = ['y', 1]
            break
        case "ArrowLeft":
            nextMove = ['x', -1]
            break
        case "ArrowRight":
            nextMove = ['x', 1]
            break
        case " ":
            nextMove = [0, 0]
            break
    }
}


document.addEventListener('keydown', movementHandler)
let player = new Player()
let spawnList = []
let score = 0
/* let spawn = new Spawn(20, 1, 1)
let spawn2 = new Spawn(20, 1.1, 1.1)
spawn.render() */
player.render()
setInterval(gameTick, 20)




