console.log('apps.js synced')

let myCanvas = document.getElementById('gameboard')
let pencil = myCanvas.getContext('2d')
const screenScaleInfo = Math.round(Math.min(window.innerHeight * 2, window.innerWidth) / 100) * 100
pencil.canvas.width = screenScaleInfo
pencil.canvas.height = screenScaleInfo / 2
const windowDependentScaler = screenScaleInfo / 300

//x and y coordinates for center of the board, as well as gameScalers for screen sizes
const boardOrigin = { x: myCanvas.width / 2, y: myCanvas.height / 2 }
const gameScaler = Math.min(myCanvas.width, myCanvas.height)

//Class specifics for Player
class Player {

    //take in player attributes and construct object.
    constructor(color) {
        this.health = 10
        this.color = 'rgb(255,0,0)'
        this.x = boardOrigin.x
        this.y = boardOrigin.y
        //this.x = boardOrigin.x
        //this.y = boardOrigin.y
        this.moveSpeed = .7 * windowDependentScaler
        this.radius = gameScaler * .01
        this.pathHistory = []
        this.jumpBackDist = 250
        this.detonateTimer = 0
        this.detonateCD = 400
        this.detonateRadius = this.radius * 16
        this.detonationAnimationDuration = 12
        this.detonationAnimationState = 0
    }

    movement() {

        //nextMove global variable stores X or Y axis and 1 or -1 by arrowkeys. Ex: down arrowkey = ['y', 1] for increase y axis to move player down.
        let moveAxis = nextMove[0]
        let moveDist = nextMove[1] * nextMove[2] * this.moveSpeed
        moveAxis === 'x' ? (this.x + moveDist >= 0 && this.x + moveDist <= myCanvas.width ? this.x += moveDist : null) : null
        moveAxis === 'y' ? (this.y + moveDist >= 0 && this.y + moveDist <= myCanvas.height ? this.y += moveDist : null) : null
        this.pathHistory.unshift([this.x, this.y])
        this.pathHistory.length > this.jumpBackDist ? this.pathHistory.pop() : null

        //also add 1 to detonate timer for it's cooldown
        this.detonateTimer < this.detonateCD ? this.detonateTimer += 1 : null
        this.detonationAnimationState > 0 ? this.detonationAnimationState++ :null
    }

    //draw the player on at the center of the board
    render() {
        //console.log(this.pathHistory.length)
        //path history shadow, drawn first so player will overlay if on top.
        if (this.pathHistory.length > this.jumpBackDist / 2) {
            //console.log('draw history')
            pencil.beginPath()
            this.jumpBackDist === this.pathHistory.length ? pencil.strokeStyle = 'darkgreen' : pencil.strokeStyle = 'blue'
            pencil.arc(this.pathHistory[this.pathHistory.length - 1][0], this.pathHistory[this.pathHistory.length - 1][1], this.radius, 0, 2 * Math.PI)
            pencil.fill()

            //draw the pathHistory outline
            let prevNode = [this.x, this.y]
            for (let node of this.pathHistory) {
                pencil.moveTo(prevNode[0], prevNode[1])
                this.jumpBackDist === this.pathHistory.length ? pencil.fillStyle = 'darkgreen' : pencil.fillStyle = 'blue'
                pencil.lineTo(node[0], node[1])
                pencil.stroke()
                prevNode = node
            }

            //show detonate radius
            if (this.detonateTimer === this.detonateCD){
                pencil.beginPath()
                pencil.strokeStyle = 'darkgreen' 
                pencil.arc(this.x,this.y,this.detonateRadius,0,2*Math.PI)
                pencil.stroke()
            }
            //detonation animation
            if(this.detonationAnimationState > 0 ){
                pencil.beginPath()
                pencil.fillStyle=this.color
                pencil.arc(this.x,this.y,(this.detonateRadius/(this.detonationAnimationDuration/this.detonationAnimationState)), 0 , 2*Math.PI)
                pencil.fill()
                this.detonationAnimationState >= this.detonationAnimationDuration ? this.detonationAnimationState = 0 : null
            }
        }

        //Central player
        pencil.beginPath()
        pencil.fillStyle = this.color
        pencil.arc(this.x, this.y, this.radius, 0, 2 * Math.PI)
        pencil.fill()
    }

    jumpBack() {
        //pick the time distance in seconds back, adjust for game tick/second, and revert state.
        if (this.pathHistory.length === this.jumpBackDist) {
            let historicState = this.pathHistory[this.jumpBackDist - 1]
            //console.log(this.pathHistory)
            //console.log(historicState)
            nextMove = [0, 0, 1]
            this.x = historicState[0]
            this.y = historicState[1]
            this.pathHistory = []
            //console.log(this.x,this.y)
        }
    }

    detonate() {
        if (this.detonateTimer === this.detonateCD) {
            checkCollisions(this.detonateRadius , 'Detonate')
            this.detonateTimer = 0
            this.detonationAnimationState = 1
        }
    }
}

//Class specifics for objects spawned into the game board that bounce around and damage Player on contact.
let spawnList = []
class Spawn {
    constructor(radius, dX, dY, color, speed) {
        this.radius = radius
        this.dX = dX
        this.dY = dY
        this.x = 0
        this.y = 0
        this.color = color
        this.speed = speed
        //console.log('My dX, dY is ' , this.dX,this.dY)
    }

    render() {
        pencil.fillStyle = this.color
        pencil.fillRect(this.x, this.y, this.radius, this.radius)
    }
    redirect() {
        //New movement direction construction
    }
}

class GeneralSpawn extends Spawn {
    constructor(radius, dX, dY, color, speed) {
        super(radius, dX, dY, color, speed)
        //this.noise = document.getElementById('sound')
        //console.log(this.noise)

        //this.color=`rgb(${Math.floor(Math.random()*255)}, ${Math.floor(Math.random()*255)},${Math.floor(Math.random()*255)})`
    }
    movement() {
        //Bounce off the walls and move across screen
        if ((this.x + this.dX + this.radius) <= myCanvas.width && (this.x + this.dX) >= 0) {
            null
        } else {
            this.dX *= (-1)
            //this.noise.play()
        }
        this.x += this.dX;
        //check y coords
        if ((this.y + this.dY + this.radius) <= myCanvas.height && (this.y + this.dY) >= 0) {
            null
        } else {
            this.dY *= (-1)
            //this.noise.play()
        }
        this.y += this.dY;
    }
}

class TrackingSpawn extends Spawn {
    constructor(radius, dX, dY, color, speed) {
        super(radius, dX, dY, color, speed)
        this.color = 'red'
    }
    movement() {
        //track the player and follow them after each collision with a wall
        let trackX = player.x - this.x;
        let trackY = player.y - this.y;
        let netTrackDist = Math.sqrt((trackX ** 2) + (trackY ** 2));
        let netTrackTime = netTrackDist / this.speed; // (tot dist)/(tot time) === (base dist)/(gametick)
        let trackDX = trackX / netTrackTime;
        let trackDY = trackY / netTrackTime;
        if ((this.x + this.dX + this.radius) <= myCanvas.width && (this.x + this.dX) >= 0) {
        } else {
            //console.log('player and this x,y', player.x, player.y, this.x, this.y, 'track then D', trackX, trackY, trackDX, trackDY)
            this.dX = trackDX
            this.dY = trackDY
        }
        //check y coords
        if ((this.y + this.dY + this.radius) <= myCanvas.height && (this.y + this.dY) >= 0) {
        } else {
            //console.log('player and this x,y', player.x, player.y, this.x, this.y, 'track then D', trackX, trackY, trackDX, trackDY)
            this.dY = trackDY
            this.dX = trackDX
        }
        this.y += this.dY;
        this.x += this.dX;
    }
}

//generate new spawn dictated by rate, how much time has passed.
function generateSpawn(rate, spawnSize, speedScaler, type) {
    //console.log(spawnTimer)
    let size, speedX, speedY, newSpawn, spawnColor
    if (spawnTimer > rate) {

        spawnTimer = 0
        //spawn rules for infinity mode
        if (gameSettings.mode === 'infinityMode') {
            if (type === TrackingSpawn) {
                size = 5 * windowDependentScaler
                spawnColor = 'red'
                speedX = -.1
                speedY = -.1
                switch (gameSettings.difficulty) {
                    case "Easy":
                        speedScaler = 1.5 * speedScaler
                        break
                    case "Medium":
                        speedScaler = 1.3 * speedScaler
                        break
                    case "Hard":
                        speedScaler = 2.1 * speedScaler
                        break
                    case "Bananas":
                        speedScaler = 1.5 * speedScaler
                        break
                }

            } else {
                gameSettings.difficulty === 'Bananas' ? size = spawnSize * windowDependentScaler : size = (5 + Math.floor(Math.random() * spawnSize)) * windowDependentScaler
                speedX = (speedScaler * 0.5) - Math.random() * speedScaler * windowDependentScaler
                speedY = (speedScaler * 0.5) - Math.random() * speedScaler * windowDependentScaler
                spawnColor = `rgb(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)},${Math.floor(Math.random() * 255)})`
            }
        }
        //spawn rules for Zen Mode
        else if (gameSettings.mode === 'zenMode') {
            size = 10 * windowDependentScaler
            let paths = []
            let i = 2
            while (i < 9) {
                paths.push([.3625 / i, .35])
                i += 2
            }
            let randPath = Math.floor(Math.random() * paths.length)
            speedX = paths[randPath][0] * windowDependentScaler
            speedY = paths[randPath][1] * windowDependentScaler
            spawnColor = `rgb(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)},${Math.floor(Math.random() * 255)})`
            type = GeneralSpawn
        }
        //generate new spawn based off above gameMode construction logic
        newSpawn = new type(size, speedX, speedY, spawnColor, speedScaler * windowDependentScaler)
        //console.log(newSpawn.radius)
        if (gameSettings.mode === 'zenMode' || gameSettings.difficulty === 'Bananas') {
            origins = [[0, 0], [myCanvas.width - newSpawn.radius, 0], [0, myCanvas.height - newSpawn.radius], [myCanvas.width - newSpawn.radius, myCanvas.height - newSpawn.radius]]
            newSpawn.x = origins[Math.floor(Math.random() * origins.length)][0]
            newSpawn.y = origins[Math.floor(Math.random() * origins.length)][1]
        }
        spawnList.push(newSpawn)
    } else {
        spawnTimer++
    }
}

//function to see if the player's been hit by one of the obstacles
let spawnKills = []
function checkCollisions(radius, reason) {
    let tempSpawn = []
    for (let spawn of spawnList) {
        //spawn hit box dimensions include player dimensions so that only player x and y coordinates need to be calculated after.
        let spawnHitBox = { xMin: spawn.x - radius, xMax: spawn.x + spawn.radius + radius, yMin: spawn.y - radius, yMax: spawn.y + spawn.radius + radius }
        //console.log(spawnHitBox)
        if (player.x < spawnHitBox.xMax && player.x > spawnHitBox.xMin && player.y > spawnHitBox.yMin && player.y < spawnHitBox.yMax) {
            if (reason === 'Death') {
                console.log(`You've been hit!`)
                clearInterval(gameInterval)
                tempSpawn.push(spawn)
            } else if (reason === 'Detonate') {
                //remove the spawn if in detonate radius.
                spawnKills.push(spawn)
            }
        } else{
            //if spawns not in hitbox, add them to temp array to readd to spawnlist. Done so that spawn can be removed using checkcollisions function.
            tempSpawn.push(spawn)
        }
        spawnList=tempSpawn
    }


}

//function to reset the game
function resetGame() {
    clearInterval(gameInterval)
    spawnList = []
    score = 0
    updateScoreboard()
    player.pathHistory = []
    player.x = boardOrigin.x
    player.y = boardOrigin.y
    player.detonateTimer = 0
    player.detonationAnimationState = 0
    nextMove = [0, 0, 1]
    gameInterval = setInterval(gameTick, 20)

}

//function to update scoreboard and track current score
let score = 0
let scoreBoard = document.getElementById('scoreboard')
function updateScoreboard() {
    score += spawnList.length / 50
    scoreBoard.textContent = `Score: ${Math.floor(score)}`
}

//Function to advance the game by one 'tick' each 60ms.
let spawnTimer = 0
//let tSpawn = new TrackingSpawn(10, 0.5, 0.5, .5)
//spawnList.push(tSpawn)
function gameTick() {
    //clear board and redraw
    pencil.clearRect(0, 0, myCanvas.width, myCanvas.height)
    player.movement()
    player.render()
    checkCollisions(player.radius, 'Death')
    updateScoreboard()

    //spawn stuff
    let spawnLogic
    let randomSpawn = [GeneralSpawn, TrackingSpawn]
    switch (gameSettings.difficulty) {
        case "Easy":
            spawnLogic = [200, 15, 0.5, randomSpawn[0]]
            break
        case "Medium":
            spawnLogic = [125, 15, .5, randomSpawn[Math.floor(Math.random() * 2)]]
            break
        case "Hard":
            spawnLogic = [50, 15, 0.5, randomSpawn[Math.floor(Math.random() * 2)]]
            break
        case "Bananas":
            spawnLogic = [10, 5, 1, randomSpawn[0]]
            break
    }

    generateSpawn(spawnLogic[0], spawnLogic[1], spawnLogic[2], spawnLogic[3])

    for (let spawn of spawnList) {
        spawn.movement()
        spawn.render()
    }
}

//store the last arrowkey press in the nextMove array. Use that for movement direction. Spacebar to clear. format [axis, direction, speed]
let nextMove = [0, 0, 1]
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
            nextMove = [0, 0, 1]
            break
        case "f":
            player.jumpBack()
            break
        case "d":
            player.detonate()
            break
        case 'Shift':
            nextMove[2] = 0.3
            break
        case 'r':
            resetGame()
            break
    }
}

//modify movement based on held keys
function movementHandlerKeyUp(e) {
    //console.log(e.key)
    switch (e.key) {
        case 'Shift':
            nextMove[2] = 1
    }
}

//Handle buttonclicks
function settingClick(e) {
    //console.log('in settings')
    let rosettaSettings = {
        challengeMode: "Challenge Mode",
        infinityMode: "Infinity Mode",
        zenMode: "Zen Mode"
    }
    switch (e.target.id) {
        //game mode selections
        case 'challenge-mode':
            gameSettings.mode = 'challengeMode'
            resetGame()
            break
        case 'infinity-mode':
            gameSettings.mode = 'infinityMode'
            resetGame()
            break
        case 'zen-mode':
            gameSettings.mode = 'zenMode'
            resetGame()
            break
        //difficulty selections
        case 'easy-difficulty':
            gameSettings.difficulty = 'Easy'
            resetGame()
            break
        case 'medium-difficulty':
            gameSettings.difficulty = 'Medium'
            resetGame()
            break
        case 'hard-difficulty':
            gameSettings.difficulty = 'Hard'
            resetGame()
            break
        case 'bananas':
            gameSettings.difficulty = 'Bananas'
            resetGame()
            break
    }
    document.getElementById('current-mode').textContent = rosettaSettings[gameSettings.mode]
    document.getElementById('current-difficulty').textContent = gameSettings.difficulty
}

//event listeners for keyboard presses and clicks
document.addEventListener('keydown', movementHandlerKeyDown)
document.addEventListener('keyup', movementHandlerKeyUp)
document.getElementById('scoreboard-container').addEventListener('click', settingClick)

//resetGame also starts the game by setting the interval.
let gameSettings = { mode: 'zenMode', difficulty: 'Easy' }
let player = new Player()
player.render()
let gameInterval = setInterval(gameTick, 20)

