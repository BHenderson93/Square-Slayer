console.log('apps.js synced')

let myCanvas = document.getElementById('gameboard')
let pencil = myCanvas.getContext('2d')

//x and y coordinates for center of the board, as well as gameScalers for screen sizes
const boardOrigin ={x:myCanvas.width/2, y:myCanvas.height/2}
const gameScaler = Math.min(myCanvas.width,myCanvas.height)

//Draw the center circle of the game board, which limits Player movement
function drawCage (){
    let radius = gameScaler*.4
    pencil.beginPath()
    pencil.arc(boardOrigin.x,boardOrigin.y, radius, 0 , 2*Math.PI)
    //pencil.stroke()
    pencil.fill()
}
drawCage()

//Class specifics for Player
class Player{

    //take in player attributes and construct object.
    constructor(color){
        this.health = 10
        this.speed = 10
        this.color = 'rgb(255,0,0)'

        this.radius = gameScaler*.05
    }

    //draw the player on at the center of the board
    render(){
        
        //additional outer hitbox for testing
        pencil.beginPath()
        pencil.fillStyle = `rgb(100,0,0, 50)`
        pencil.arc(boardOrigin.x,boardOrigin.y, this.radius*2, 0 , 2*Math.PI)
        pencil.fill()

        //Central player
        pencil.beginPath()
        pencil.fillStyle = this.color
        pencil.arc(boardOrigin.x,boardOrigin.y, this.radius, 0 , 2*Math.PI)
        pencil.fill()
    }
}

//Class specifics for objects spawned into the game board that bounce around and damage Player on contact.
class Spawn{
    constructor (radius, dX, dY){
        this.radius = radius
        this.dX = dX
        this.dY = dY
    }
    render(){

    }
    redirect(){
        //New movement direction construction
    }
}

function movePieces(){}
function checkCollisions(){//border and other pieces
}
function gameTick(){}


let player = new Player()
player.render()




