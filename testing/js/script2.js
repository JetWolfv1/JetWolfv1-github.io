// Initial variables to select elements for DOM manipulation.
const canvas = document.getElementById("canvas")
const moveDisplay = document.getElementById("user-moves")
// const startBtn = document.getElementById("start")

// Setting the context
const ctx = canvas.getContext("2d")

// Takes the canvas CSS elements and puts them into the pixel
// style we'll be using so our dimensions are correct
canvas.setAttribute("width", getComputedStyle(canvas)["width"])
canvas.setAttribute("height", getComputedStyle(canvas)["height"])

// Function to clear the game board
const clearCanvas = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
}

// Random number generator to be called for each of the conditions
// with a random element (which collectible to generate next,
// starting positions, etc.)
const randomNum = (min, max) => {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * max - min + 1) + min
}

// The object for creating (constructing and then rendering)
// the caffeinated collectibles that the player will attempt
// to capture.
class WokeItem {
    constructor(wokeName, wokeColor, wokeWidth, wokeHeight, wokeDropRate, wokeValue, x) {
        this.x = x,
        this.y = 0,
        this.name = wokeName,
        this.color = wokeColor,
        this.width = wokeWidth,
        this.height = wokeHeight,
        this.rate = wokeDropRate,
        this.value = wokeValue,
        this.alive = true

        this.render = function() {
            ctx.fillStyle = this.color
            ctx.fillRect(this.x, this.y, this.width, this.height)
        }
    }
}

// Variable to indicate if the canvas is over or not.
let gameOver = false
// Starting value for the canvas level timer.
let timer = 90


const wokeItems = []
const game = {
    makeWoke() {
        
        

        const refill = new WokeItem("refill", "rgb(92, 47, 17)", 28, 37, 50, 10, randomNum(0, canvas.width))
        const energyDrink = new WokeItem("energyDrink", "silver", 25, 75, 100, 50, randomNum(0, canvas.width))
        const molecule = new WokeItem("molecule", "teal", 100, 75, 30, 100, randomNum(0, canvas.width))
        
        let random = randomNum(1, 3)
        if (random === 1) {
            if (refill.x > canvas.width - refill.width) {
                refill.x = canvas.width - refill.width
            }
            wokeItems.push(refill)
            // console.log("made refill")
        } else if (random === 2) {
            if (energyDrink.x > canvas.width - energyDrink.width) {
                energyDrink.x = canvas.width - energyDrink.width
            }
            wokeItems.push(energyDrink)
            // console.log("made nrg")
        } else if (random === 3) {
            if (molecule.x > canvas.width - molecule.width) {
                molecule.x = canvas.width - molecule.width
            }
            wokeItems.push(molecule)
            // console.log("made molecule")
        }
    },

    dropWoke() {
        for (let i = 0; i < wokeItems.length; i++) {
            wokeItems[i].render()
        }
    },

    // dropWoke() {
    //     // for each element in the wokeitems array
    //     // render that item into the gamefield
    //     wokeItems.forEach(item =>
    //         console.log(`${item.name} dropping!`))
    //     // got to render item; new variable? the one I have for refill above isn't asking for x,y, so probably needs to be reworked
    // },
}

const gameLoop = () => {
    // console.log("This is the start of the game loop");
    // Clear the canvas
    clearCanvas()
    // will need a timer or some sort of checker to control how often this fires
    game.dropWoke()
}

const gameLoopInterval = setInterval(gameLoop, 60)
const makeWokeInterval = setInterval(game.makeWoke, 1000)

document.addEventListener("DOMContentLoaded", function () {    
    // setInterval(gameLoop, 60)
    setTimeout(stopGame, 5000)
})

const stopGame = () => {
    clearInterval(gameLoopInterval)
    clearInterval(makeWokeInterval)
    console.log("Game over!")
    console.log("wokeitems generated:", wokeItems)
    console.log("wokeitems[0]:", wokeItems[0].name)
}
