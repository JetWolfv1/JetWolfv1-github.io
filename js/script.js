// Initial variables to select elements for DOM manipulation.
const game = document.getElementById("canvas")
const moveDisplay = document.getElementById("user-moves")
// const startBtn = document.getElementById("start")

// Setting the context
const ctx = game.getContext("2d")

// Takes the canvas CSS elements and puts them into the pixel
// style we'll be using so our dimensions are correct
game.setAttribute("width", getComputedStyle(game)["width"])
game.setAttribute("height", getComputedStyle(game)["height"])

// Function to clear the gameboard
const clearCanvas = () => {
    ctx.clearRect(0, 0, game.width, game.height)
}


// Random number generator to be called for each of the conditions
// with a random element (which collectible to generate next,
// starting positions, etc.)
const randomNum = (min, max) => {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * max - min + 1) + min
}

// Class and constructor for the player's controller. (May add more
// in future versions? Or power them up? Speed, width, etc.  Just
// basic for now.)
class PlayerToken {
    constructor(tokenName, tokenColor, tokenWidth, tokenHeight) {
        this.x = 350,
        this.y = 500,
        this.name = tokenName,
        this.color = tokenColor,
        this.width = tokenWidth,
        this.height = tokenHeight

        this.render = function() {
            ctx.fillStyle = this.color
            ctx.fillRect(this.x, this.y, this.width, this.height)
        }
    }
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


// class gamePiece {
//     constructor(x, y, color, height, width, wokeValue) {
//         this.x = x,
//         this.y = y,
//         this.color = color,
//         this.width = width,
//         this.height = height,
//         this.wokeValue = wokeValue,
//         this.alive = true,
//         // Function has to be written "old school" in objects
//         this.render = function() {
//             ctx.fillStyle = this.color
//             ctx.fillRect(this.x, this.y, this.height, this.width)
//         }
//     }
// }

// The constructor for creating the game bars for the user interface.
class UserHUD {
    constructor(x, y, color, width) {
        this.x = x,
        this.y = y,
        this.color = color,
        this.width = width, //max 250
        this.height = 25,
        this.border = "black"
        this.render = function () {
            ctx.fillStyle = this.color
            ctx.strokeStyle = this.border
            ctx.lineWidth = 2
            ctx.fillRect(this.x, this.y, this.width, this.height)
            ctx.strokeRect(this.x, this.y, this.width, this.height)
        }
    }
}

// Constructor for adding text to the player HUD
class TextHUD {
    constructor(text, color, x, y, font) {
        this.x = x,
        this.y = y,
        this.color = color,
        this.font = font,
        this.text = text,
        // this.border = border
        this.render = function () {
            ctx.fillStyle = this.color
            // ctx.strokeStyle = this.border
            // ctx.lineWidth = 4
            ctx.font = this.font
            ctx.fillText(this.text, this.x, this.y)
        }
    }
}

// Variable to indicate if the game is over or not.
let gameOver = false
// Starting value for the game level timer.
let timer = 90

// Function to create woke items and populate them into the array
// for access to the rest of the game.

// !! IDEA !! Put everything (or darn near?) under a giant blanket
// object, which should allow for "this" to work with that that key
// value and the name of the blanket object.
// !! TRY THIS TOMORROW !!

let wokeItems = []
const makeWoke = () => {
    // Creation of the "woke" gamepieces (to be replaced with
    // images) with the declared values: (wokeName, wokeColor,
    // wokeWidth, wokeHeight, wokeDropRate, wokeValue)
    const refill = new WokeItem("refill", "rgb(92, 47, 17)", 37, 28, 50, 10)
    const energyDrink = new WokeItem("energyDrink", "silver", 25, 75, 100, 50)
    const molecule = new WokeItem("molecule", "teal", 100, 75, 30, 100)
    // Create one of the items at random
    random = randomNum(1, 3)
    if (random === 1) {
        this.wokeItems.push(refill)
    } else if (random === 2) {
        this.wokeItems.push(energyDrink)
    } else if (random === 3) {
        this.wokeItems.push(molecule)
    }
    console.log("contents of wokeItems", wokeItems);
}

// Initial creation of the player's mug gamepiece
let mug = new PlayerToken("basicMug", "hotpink", 75, 75)



// let sheep = new gamePiece(randomNum(40, 770), -30, "white", 100, 100)
// let lullaby = new gamePiece(randomNum(40, 770), -30, "goldenrod", 25, 25)
// let pillow = new gamePiece(randomNum(40, 770), -30, "skyblue", 100, 40)

// Set up the user HUD with the caffeine and project progress bars.
// "baseBar" will render underneath them to give the appearance of
// partially empty bars.
let wokeBase = new UserHUD(25, 38, "rgb(161, 173, 189)", 250)
let projectBase = new UserHUD(525, 38, "rgb(161, 173, 189)", 250)
let wokeBar = new UserHUD(25, 38, "rgb(240, 119, 230)", 50)
let projectBar = new UserHUD(525, 38, "rgb(240, 119, 230)", 200)

// Adding in text to the user HUD
// Format: (text, color, x-coord, y-coord, "style size face")
let wokeText = new TextHUD("Wokeness", "blue", 30, 30, "bold 20pt Calibri")
let projectText = new TextHUD("Project", "blue", 695, 30, "bold 20pt Calibri")
let timerText = new TextHUD(90, "blue", 375, 60, "bold 40pt Calibri")
let gameOverText = new TextHUD("Game Over", "red", 90, 325, "bold 100pt Calibri")

// // The collectibles will go in this object array with the
// // following key pairs: name, x-coord, y-coord, color, alive
// // boolean, fall rate
// const Collectibles

// let collectibles = [
//     {name: "refill" }
// ]

// Function to collect all the rendering elements and their conditions.
const renderAll = () => {
    mug.render()
    wokeBase.render()
    projectBase.render()
    wokeBar.render()
    projectBar.render()
    wokeText.render()
    projectText.render()
    timerText.render()
}

// Function to tick down the time remaining, in seconds, and end the
// game on reaching zero.
// -- have it change color in final seconds?
const timerTick = () => {
    if (gameOver !== true) {
        if (timer === 0) {
            // end game stuff
            timer = 0
            gameOver = true
            refill.alive = false
            console.log("game over!");
        } else {
            timerText.text = timer--
        }
    }
}

// Function to scroll the collectibles down the gamefield
const fallDown = () => {
    refill.y += 10
}

// Function to generate a new collectible in a random position on the x-axis
const collectGenerator = () => {
    // refill = new WokeItem(randomNum(40, 770), -40, "rgb(92, 47, 17)", 28, 37, 10)
}

// Function to update the UserHUD bars
const barUpdate = (wokeValue) => {
    let updateWidth = wokeBar.width + wokeValue
    // Condition to constrain the bar update to the maximum possible.
    if (updateWidth <= wokeBase.width) {
        wokeBar = new UserHUD(25, 38, "rgb(240, 119, 230)", updateWidth)
    } else {
        wokeBar = new UserHUD(25, 38, "rgb(240, 119, 230)", wokeBase.width)
    }
}

const gameLoop = () => {
    // console.log("This is the start of the game loop");
    // Clear the canvas
    clearCanvas()
    // Display the coordinates of the mug
    moveDisplay.textContent = "Mug position: " + mug.x + ", " + mug.y
    // Checks to see if the game is over or in-progress.
    if (gameOver === true) {
        gameOverText.render()
    } else {
        // Drops the Refill collectible until it's collected or fallen off the gamefield
        // if (refill.alive === true && refill.y < 600) {
        //     setTimeout(refill.render(), 1000)
        //     fallDown()
        //     detectCollision()
        //     // No refill? We'll pause for a second then make a new one!
        // } else {
        //     setTimeout(collectGenerator, 1000)
        // }
        renderAll()
    }
}

    // Function to say what happens when the player uses a & d to move the
// mug left and right.
const movementHandler = (e) => {
    // left (press a, code 65, x -1) and right (press d, code 68, x +1)
    // Note: keycode IS NOT THE SAME AS keyCode, ask me how I know.
    switch (e.keyCode) {
        case (65):
            // Constrains the mug to the canvas borders
            if (mug.x > 0) {
                mug.x -= 10
                break
            // Sets a fixed position when the border is reached to keep
            // the mug from readjusting itself and look like it's bouncing
            // back if you keep pushing against the edge
            } else {
                mug.x = 0
                break
            }
        case (68):
            if (mug.x < 725) {
                mug.x += 10
                break
            } else {
                mug.x = 725
                break
            }
    }
}

const detectCollision = () => {
    // if the item falls within the borders of the mug
    // - the item diappears
    // - the corresponding bar increases/decreases
    //
    // Defining the borders of the mug
    let mugLeft = refill.x + refill.width >= mug.x
    let mugRight = refill.x <= mug.x + mug.width
    let mugTop = refill.y + refill.height >= mug.y
    // Conditional for picking up the item and making gameplay
    // adjustments accordingly.
    if (mugLeft && mugRight && mugTop) {
            refill.alive = false
            barUpdate(refill.wokeValue)
            console.log("gamepiece wokeValue:", this.wokeValue);
            console.log(`got refill!`)
        }
}

document.addEventListener("DOMContentLoaded", function () {
    // Event listener that will fire when a key is pressed
    // (limited to acting on "a" and "d" by the movementHandler
    // function that the keydown event calls)
    document.addEventListener("keydown", movementHandler)
    // Will need to be moved to game start rather than on page load
    setInterval(gameLoop, 60)
    setInterval(timerTick, 500)
    setInterval(makeWoke, 3000)
})


// Logic to work out / Things to add
//  - player UI ("health" bars, time remaining, etc.)
//  - array of objects for collectibles
//  ✔ - collectibles falling
//  ✔ - collectibles removed when leaving the gamefield (not just falling forever)
//  - random time interval before collectible falls (between xx and yy seconds)
//  - random selection of next collectible to fall
//  ✔ - random position of next collectible to fall
//  ✔ - collectibles falling at different rates(?)  -> decided nah
//  - collectible pick up adjusting player bars
//  - interface messages pop-up
//  - tying beginning of game to start button click
//  - 