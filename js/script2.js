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
    constructor(wokeName, wokeColor, wokeWidth, wokeHeight, wokeDropRate, wokeValue) {
        this.x = randomNum(40, 770),
        this.y = -50
        this.name = wokeName,
        this.color = wokeColor,
        this.width = wokeWidth,
        this.height = wokeHeight,
        this.rate = wokeDropRate,
        this.value = wokeValue,
        this.alive = true

        this.render = function() {
            ctx.fillStyle = this.color
            ctx.fillRect(this.x, this.y, this.height, this.width)
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
        const refill = new WokeItem("refill", "rgb(92, 47, 17)", 37, 28, 50, 10)
        const energyDrink = new WokeItem("energyDrink", "silver", 25, 75, 100, 50)
        const molecule = new WokeItem("molecule", "teal", 100, 75, 30, 100)
        
        let random = randomNum(1, 3)
        if (random === 1) {
            wokeItems.push(refill)
            console.log("wokeItems @refill push:", wokeItems)
        } else if (random === 2) {
            wokeItems.push(energyDrink)
            console.log("wokeItems @energyDrink push:", wokeItems)
        } else if (random === 3) {
            wokeItems.push(molecule)
            console.log("wokeItems @molecule push:", wokeItems)
        }
    }
}
    
const gameLoop = () => {
    // console.log("This is the start of the game loop");
    // Clear the canvas
    clearCanvas()
    
}

document.addEventListener("DOMContentLoaded", function () {
    setInterval(gameLoop, 60)
    // setInterval(game.makeWoke, 3000)
})

// const game = {
    
//     startGame() {
//         this.makeWoke();
//         console.log("contents of wokeItems:", wokeItems)
//     },

//     makeWoke() {
//         // Creation of the "woke" canvaspieces (to be replaced with
//         // images) with the declared values: (wokeName, wokeColor,
//         // wokeWidth, wokeHeight, wokeDropRate, wokeValue)
//         if (gameOver === false) {
//             const refill = new WokeItem("refill", "rgb(92, 47, 17)", 37, 28, 50, 10)
//             const energyDrink = new WokeItem("energyDrink", "silver", 25, 75, 100, 50)
//             const molecule = new WokeItem("molecule", "teal", 100, 75, 30, 100)
//             // Create one of the items at random
//             random = randomNum(1, 3)
//             if (random === 1) {
//                 this.wokeItems.push(refill)
//             } else if (random === 2) {
//                 this.wokeItems.push(energyDrink)
//             } else if (random === 3) {
//                 this.wokeItems.push(molecule)
//             }
//         }
//     },
// }   // game Object end bracket


// const gameLoop = () => {
//     // console.log("This is the start of the game loop");
//     // Clear the canvas
//     clearCanvas()
//     // game.startGame()
// }

// document.addEventListener("DOMContentLoaded", function () {
//     setInterval(gameLoop, 60)
// })