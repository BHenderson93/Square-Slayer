console.log('apps.js synced')

let myCanvas = document.getElementById('gameboard')
let pencil = myCanvas.getContext('2d')

//x and y coordinates for center of the board, as well as gameScalers for screen sizes
const boardOrigin = { x: myCanvas.width / 2, y: myCanvas.height / 2 }
const gameScaler = Math.min(myCanvas.width, myCanvas.height)

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
        this.pathHistory = []
    }
    movement(){

        //nextMove global variable stores X or Y axis and 1 or -1 by arrowkeys. Ex: down arrowkey = ['y', 1] for increase y axis to move player down.
        let moveAxis = nextMove[0]
        let moveDist = nextMove[1]*nextMove[2]*this.moveSpeed
        moveAxis === 'x' ? (this.x + moveDist >= 0 && this.x + moveDist <= myCanvas.width ? this.x += moveDist : null) : null
        moveAxis === 'y' ? (this.y + moveDist >= 0 && this.y + moveDist <= myCanvas.height ? this.y += moveDist : null) : null
        movePath.unshift([this.x,this.y])
        movePath.length > 250 ? movePath.pop() : null
    }

    //draw the player on at the center of the board
    render() {

        //Central player
        pencil.beginPath()
        pencil.fillStyle = this.color
        pencil.arc(this.x, this.y, this.radius, 0, 2 * Math.PI)
        pencil.fill()
    }

    jumpBack(timeDist){
        //pick the time distance in seconds back, adjust for game tick/second, and revert state.
        if(movePath.length === 250){
            let historicState = movePath[timeDist*50]
            console.log(movePath)
            console.log(historicState)
            nextMove = [0,0,1]
            this.x = historicState[0]
            this.y = historicState[1]
            console.log(this.x,this.y)
        }
        
    }
}

//Class specifics for objects spawned into the game board that bounce around and damage Player on contact.
let spawnList = []
class Spawn {
    constructor(radius, dX, dY) {
        this.radius = radius
        this.dX = dX
        this.dY = dY
        this.x = 0
        this.y = myCanvas.height / 2
        this.color = `rgb(${Math.floor(Math.random()*255)}, ${Math.floor(Math.random()*255)},${Math.floor(Math.random()*255)})`
        //console.log('My dX, dY is ' , this.dX,this.dY)
    }
    movement() {
        //console.log(this.x,this.dX,this.y,this.dY);
        //check x coordinates for next move. If outside of board boundry, flip the sign of dX to make it go the other way next tick.
        (this.x + this.dX + this.radius) <= myCanvas.width && (this.x + this.dX) >= 0 ? null : this.dX *= (-1)
        this.x += this.dX;
        //check y coords
        (this.y + this.dY + this.radius) <= myCanvas.height && (this.y + this.dY) >= 0 ? null : this.dY *= (-1)
        this.y += this.dY;
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
function generateSpawn(rate, spawnSize, speedScaler) {
    //console.log(spawnTimer)
    if (spawnTimer > rate) {
        spawnTimer = 0
        let size = 10 + Math.floor(Math.random() * spawnSize)
        let speedX = (speedScaler*0.5)-Math.random()*speedScaler
        let speedY = (speedScaler*0.5)-Math.random()*speedScaler
        let newSpawn = new Spawn(size, speedX, speedY)
        spawnList.push(newSpawn)
    } else {
        spawnTimer++
    }
}

//function to see if the player's been hit by one of the obstacles
function checkCollisions() {
    let playerCoords = [player.x, player.y]

    for(let spawn of spawnList){
        //spawn hit box dimensions include player dimensions so that only player x and y coordinates need to be calculated after.
        let spawnHitBox = {xMin:spawn.x-player.radius, xMax:spawn.x + spawn.radius + player.radius, yMin:spawn.y-player.radius, yMax:spawn.y+spawn.radius +player.radius}
        //console.log(spawnHitBox)
        if (player.x < spawnHitBox.xMax && player.x > spawnHitBox.xMin && player.y > spawnHitBox.yMin && player.y < spawnHitBox.yMax){
            console.log('Hit!')
            clearInterval(gameInterval)
        }
    }
}

//function to reset the game
function resetGame(){
    clearInterval(gameInterval)
    score = 0
    updateScoreboard()
    spawnList = [] 
    gameInterval = setInterval(gameTick, 20)
    
}

//function to update scoreboard and track current score
let score = 0
let scoreBoard = document.getElementById('scoreboard')
function updateScoreboard (){
    score+= spawnList.length/50
    scoreBoard.textContent = `Score: ${Math.floor(score)}`
}

//Function to advance the game by one 'tick' each 60ms.
let spawnTimer = 0
function gameTick()  {
    //clear board and redraw
    pencil.clearRect(0, 0, myCanvas.width, myCanvas.height)
    player.movement()
    player.render()
    checkCollisions()
    updateScoreboard()

    //spawn stuff
    generateSpawn(50, 5 , 0.5)
    for(let spawn of spawnList){
        spawn.movement()
        spawn.render()
    }
}

//store the last arrowkey press in the nextMove array. Use that for movement direction. Spacebar to clear. format [axis, direction, speed]
let nextMove = [0, 0 , 1]
//array for tracking past movements so player can jump back in time
let movePath = []
//function to handle movement. Data is pushed by Player class. Can handle other keypressse
function movementHandlerKeyDown(e) {
    //console.log('keyboard move was ', e.key)
    switch (e.key) {
        case "ArrowUp":
            nextMove[0] = 'y'
            nextMove[1] = -1
            break
        case "ArrowDown":
            nextMove[0] = 'y'
            nextMove[1] = 1
            break
        case "ArrowLeft":
            nextMove[0] = 'x'
            nextMove[1] = -1
            break
        case "ArrowRight":
            nextMove[0] = 'x'
            nextMove[1] = 1
            break
        case " ":
            nextMove = [0, 0 , 1]
            break
        case "f":
            player.jumpBack(3)  
            break
        case 'Shift':
            nextMove[2]=0.3
            break
        case 'r':
            resetGame()
            break
    }
}

//modify movement based on held keys
function movementHandlerKeyUp(e){
    //console.log(e.key)
    switch (e.key){
        case 'Shift':
            nextMove[2]=1
    }
}

//event listeners for keyboard presses
document.addEventListener( 'keydown', movementHandlerKeyDown)
document.addEventListener( 'keyup' , movementHandlerKeyUp)

//resetGame also starts the game by setting the interval.

let player = new Player()
player.render()
let gameInterval = setInterval(gameTick, 20)

