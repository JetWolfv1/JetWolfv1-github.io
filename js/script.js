// Initial variables to select elements for DOM manipulation.
const canvas = document.getElementById("canvas")
const moveDisplay = document.getElementById("user-moves")
const startBtn = document.getElementById("start")
// const hudMsg = document.getElementById("hudmessage")

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
// starting positions, etc.)  Random number can include both min
// and max entered.
const randomNum = (min, max) => {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * max - min + 1) + min
}

// Class and constructor for the player's controller. (May add more
// in future versions? Or power them up? Speed, width, etc.  Just
// basic for now.)
class PlayerMug {
    constructor(tokenName, tokenColor, tokenWidth, tokenHeight) {
        this.x = 350,
        this.y = 500,
        this.name = tokenName,
        this.color = tokenColor,
        this.width = tokenWidth,
        this.height = tokenHeight,
        this.speed = 30,
        // Mug only moves on x-axis, so not need to worry about up and down
        this.direction = {
            right: false,
            left: false,
        }
    }
    // For smoother animation, the mug will always be moving, it'll just
    // be confined until our keypresses allow it to go
	setDirection = function (key) {
		// console.log('the key pressed is', key)
		// Pressing the assigned keys (keydown) changes the direction
        // from false to true, "freeing" the player mug to move in that
        // direction.
		if (key.toLowerCase() == 'a') this.direction.left = true
		if (key.toLowerCase() == 'd') this.direction.right = true
	}
    // We need an unset to put the locks back down on the mug when the key
    // is lifted (keyup). The direction will be set back to false.
	unsetDirection = function (key) {
		// console.log('the key pressed is', key)
		if (key.toLowerCase() == 'a') this.direction.left = false
		if (key.toLowerCase() == 'd') this.direction.right = false
	}
    // moveMug tells the mug which direction to move and constrains it to
    // the canvas proportions. Once again, the mug can only go left and
    // right, so no need to worry about up and down.
	moveMug = function () {
		if (this.direction.left) {
			this.x -= this.speed
            // Keeps mug from going beyond the left edge of the game board
            if (this.x <= 0) {
				this.x = 0
			}
		}
		if (this.direction.right) {
			this.x += this.speed
			// Keeps the mug from exceeding the canvas's right-hand side
			if (this.x + this.width >= canvas.width) {
				this.x = canvas.width - this.width
			}
		}
	}
    render = function() {
        ctx.fillStyle = this.color
        ctx.fillRect(this.x, this.y, this.width, this.height)
    }
} // PlayerMug class close bracket

// Initial creation of the player's mug gamepiece
const mug = new PlayerMug("basicMug", "hotpink", 75, 75)

// The object for creating (constructing and then rendering)
// the caffeinated collectibles that the player will attempt
// to capture.
class WokeItem {
    constructor(wokeName, wokeColor, wokeWidth, wokeHeight, wokeDropRate, wokeValue, x) {
        // this.id = randomNum(1, 2000)
        this.x = x,
        this.y = 0,
        this.name = wokeName,
        this.color = wokeColor,
        this.width = wokeWidth,
        this.height = wokeHeight,
        this.rate = wokeDropRate,
        this.value = wokeValue,
        this.alive = true
    }
    render = function() {
        ctx.fillStyle = this.color
        ctx.fillRect(this.x, this.y, this.width, this.height)
    }
}

// The constructor for creating the game bars for the user interface.
class UserHUD {
    constructor(x, y, color, width) {
        this.x = x,
        this.y = y,
        this.color = color,
        this.width = width, //max 250
        this.height = 25,
        this.border = "black"
    }
    render = function () {
        ctx.fillStyle = this.color
        ctx.strokeStyle = this.border
        ctx.lineWidth = 2
        ctx.fillRect(this.x, this.y, this.width, this.height)
        ctx.strokeRect(this.x, this.y, this.width, this.height)
    }
}

// Constructor for adding text to the player HUD
class TextHUD {
    constructor(text, color, x, y, font) {
        this.x = x,
        this.y = y,
        this.color = color,
        this.font = font,
        this.text = text
        // this.border = border
    }
    render = function () {
        ctx.fillStyle = this.color
        // ctx.strokeStyle = this.border
        // ctx.lineWidth = 4
        ctx.font = this.font
        ctx.fillText(this.text, this.x, this.y)
    }
}

// Variable to indicate if the game is over or not.
let gameOver = false
// Variable for if the player won
let youWin = false
// Starting value for the game level timer.
let timer = 90
// Variable to iterate the gameLoop we're on, for internal checking
let loopCount = 0
// Variable to hold the adjusted values for the HUD bars
let wokeUpdate = 0
let projUpdate = 0
// Variable to adjust the amount of wokeness the player starts with
let startingWoke = 100
let hudMsg = ""

// Set up the user HUD with the caffeine and project progress bars.
// "baseBar" will render underneath them to give the appearance of
// partially empty bars.
let wokeBase = new UserHUD(25, 38, "rgb(161, 173, 189)", 250)
let wokeBar = new UserHUD(25, 38, "rgb(240, 119, 230)", startingWoke)
let projectBase = new UserHUD(525, 38, "rgb(161, 173, 189)", 250)
let projectBar = new UserHUD(525, 38, "rgb(240, 119, 230)", 0)

// Adding in text to the user HUD
// Format: (text, color, x-coord, y-coord, "style size face")
let wokeText = new TextHUD("Wokeness", "blue", 30, 30, "bold 20pt Calibri")
let projectText = new TextHUD("Project", "blue", 695, 30, "bold 20pt Calibri")
let timerText = new TextHUD(90, "blue", 375, 60, "bold 40pt Calibri")
let gameOverText = new TextHUD("Game Over", "red", 90, 325, "bold 100pt Calibri")
let winnerText = new TextHUD("You win!", "blue", 150, 325, "bold 100pt Calibri")

const drawHUD = () => {
    wokeBase.render()
    projectBase.render()
    wokeBar.render()
    projectBar.render()
    wokeText.render()
    projectText.render()
    // timerText.render()
    popupText.render()
}

// The array to hold all the randomly created woke items. makeWoke() will
// add them, and they'll be removed when they're captured or fall off the
// board.
const wokeItems = []

// when I move the items out of the wokestuff class, new instances aren't
// created it's just what's already in the array. When I keep them in the
// class, I can't get them to be referenced elsewhere.

const wokeStuff = {
    // Generates the caffeinated and sleepy items to be dropped for the
    // player to collect. Parameters are: name, color, width, height, drop
    // rate, amount of wokeness it'll add, and its randomly generated
    // position on the x-axis
    makeWoke() {
        let refill = new WokeItem("refill", "rgb(92, 47, 17)", 28, 37, 30, 10, randomNum(0, canvas.width))
        let energyDrink = new WokeItem("energyDrink", "blue", 25, 75, 40, 30, randomNum(0, canvas.width))
        let molecule = new WokeItem("molecule", "teal", 100, 75, 20, 100, randomNum(0, canvas.width))
        let sheep = new WokeItem("sheep", "white", 100, 100, 20, -10, randomNum(0, canvas.width))
        let lullaby = new WokeItem("lullaby", "goldenrod", 25, 25, 30, -20, randomNum(0, canvas.width))
        let pillow = new WokeItem("pillow", "rgb(145, 62, 161)", 75, 50, 40, -40, randomNum(0, canvas.width))
        
        // Random number generator to determine which woke item will be
        // made next and pushed into the wokeItems array. Refills are more
        // likely than energy drinks which are more likely than molecules.
        let randomWoke = randomNum(1, 6)
        // Tests to see if the random start position will put the item
        // outside the game board, and if so, reset it so it will be along
        // the edge.
        if (randomWoke <= 3) {
            if (refill.x > canvas.width - refill.width)
                {refill.x = canvas.width - refill.width}
            wokeItems.push(refill)
            // console.log("made refill: ", refill)
        } else if (randomWoke === 4 || randomWoke === 5) {
            if (energyDrink.x > canvas.width - energyDrink.width)
                {energyDrink.x = canvas.width - energyDrink.width}
            wokeItems.push(energyDrink)
            // console.log("made energy: ", energyDrink)
        } else if (randomWoke === 6) {
            if (molecule.x > canvas.width - molecule.width)
                {molecule.x = canvas.width - molecule.width}
            wokeItems.push(molecule)
            // console.log("made molecule: ", molecule)
        }

        // Same as above, for sleepy items
        let randomSleep = randomNum(1, 6)
        if (randomSleep <= 2) {
            if (sheep.x > canvas.width - sheep.width)
                {sheep.x = canvas.width - sheep.width}
            wokeItems.push(sheep)
            // console.log("made sheep: ", sheep)
        } else if (randomSleep === 3 || randomSleep === 4) {
            if (lullaby.x > canvas.width - lullaby.width)
                {lullaby.x = canvas.width - lullaby.width}
            wokeItems.push(lullaby)
            // console.log("made lullaby: ", lullaby)
        } else if (randomSleep >= 5) {
            if (pillow.x > canvas.width - pillow.width)
                {pillow.x = canvas.width - pillow.width}
            wokeItems.push(pillow)
            // console.log("made pillow: ", pillow)
        }
    },

    // Renders the items from the array to the gameboard.
    // **** put on timer?
    drawWoke() {
        for (let i = 0; i < wokeItems.length; i++) {
            wokeItems[i].render()
            wokeItems[i].y += wokeItems[i].rate
        }
    },

    // Collision detection for each of the items on the gameboard.
    detectHit() {
        // Loops through the woke items and uses their dimensions and
        // position to check against the mug's dimensions and position.
        // If they overlap, a hit is detected.
        for (let i = 0; i < wokeItems.length; i++) {
                let mugLeft = wokeItems[i].x + wokeItems[i].width >= mug.x
                let mugRight = wokeItems[i].x <= mug.x + mug.width
                let mugTop = wokeItems[i].y + wokeItems[i].height >= mug.y
                // Clearly defines the moment of collision between the mug
                // and whichever item is up on the array checkloop.
                if (
                    mug.x < wokeItems[i].x + wokeItems[i].width &&
                    mug.x + mug.width > wokeItems[i].x &&
                    mug.y < wokeItems[i].y + wokeItems[i].height &&
                    mug.y + mug.height > wokeItems[i].y
                    ) {
                        wokeItems[i].alive = false
                        // console.log(`collected ${wokeItems[i].name}\nworth ${wokeItems[i].value}`)
                        wokeUpdate = wokeUpdate + wokeItems[i].value
                        // console.log("wokeupdate on collection:", wokeUpdate)
                    }
                // Sets the item to be cleared in the next loop once it
                // has fallen outside the gameboard
                if (wokeItems[i].y > canvas.width) {
                    wokeItems[i].alive = false
                    }
                }
            },
} // wokeStuff object close bracket

// function to do all the rendering, resetting, etc. for starting the game
const startGame = () => {
    // stuff for setting up the game
}

// Popup message placed down here so it'll load on top of everything else.
let popupText = new TextHUD(hudMsg, "white", 300, 150, "bold 25px Calibri")

// Function to update the woke bar based on items collectded this loop.
const wokeBarUpdate = () => {
    wokeUpdate--
    let adjustedWoke = wokeBar.width + wokeUpdate
    // Check to see if the player has fallen asleep, and if so, the game
    // is over.
    if (adjustedWoke <= 0) {
        gameOver = true
        console.log("You fell asleep!")
    }
    // Condition to constrain the bar update to the maximum possible.
    if (adjustedWoke <= wokeBase.width) {
        wokeBar = new UserHUD(25, 38, "rgb(240, 119, 230)", adjustedWoke)
    } else {
        wokeBar = new UserHUD(25, 38, "rgb(240, 119, 230)", wokeBase.width)
    }
    // Reset the amount of woke collected after update
    wokeUpdate = 0
}

// Function to adjust the project bar and trigger when the player wins
const projBarUpdate = () => {
    projUpdate++
    let adjustedProj = projectBar.width + projUpdate
    // Check to see if the player has fallen asleep, and if so, tdhe game
    // is over.
    if (adjustedProj === projectBase.width) {
        gameOver = true
        youWin = true
        console.log("Project complete, you win!")
    }
    // Condition to constrain the bar update to the maximum possible.
    if (adjustedProj <= projectBase.width) {
        projectBar = new UserHUD(525, 38, "rgb(240, 119, 230)", adjustedProj)
    } else {
        projBar = new UserHUD(525, 38, "rgb(240, 119, 230)", projectBase.width)
    }
    // Reset the project increase back to zero for the next loop
    projUpdate = 0
}

// Function that will run every loop to check for which items are "dead"
// and need to be cleared out of the array.
const clearDead = () => {
    for (let i = 0; i < wokeItems.length; i++) {
        if (wokeItems[i].alive === false) {
            // console.log(`deleting ${wokeItems[i].name}, alive=${wokeItems[i].alive}`)
            wokeItems.splice(i, 1)
        }
    }
}

// ***** Put in a check on the gameloop? One that checks timers/counters
// and fires if they're ready, otherwise stuff goes too fast.

const checkTimers = () => {
    // stuff'll go here for keeping track of the game's timing
}

// The main gameloop, runs every gameLoopInterval and drives primary
// actions of the game
const gameLoop = () => {
    // Up the loop counter at the start of the gameloop and display which
    // one we're on (for internal use)
    // loopCount++
    // console.log("Starting loop #", loopCount)
    // console.log("This is the start of the game loop");
    // console.log("woke update at loop start", wokeUpdate)

    // first check to see if the game is over
    // ** Pass number to stopGame() to change display, etc?
    if (gameOver === true) {
        stopGame()
    } else {
        // Runs the check for removal of the "dead" items
        clearDead()
        // Clear the canvas
        clearCanvas()
        // Display the coordinates of the mug
        drawHUD()
        // Update the player HUD bars
        wokeBarUpdate()
        projBarUpdate()
        // Updates the player with the mug's x,y position
        // moveDisplay.textContent = "Mug position: " + mug.x + ", " + mug.y
        // makes new woke items and puts them into their array
        wokeStuff.drawWoke()
        // Create the player's mug
        // Placed after the collectibles so the mug will be the top layer
        mug.render()
        mug.moveMug()
        wokeStuff.detectHit()
        // console.log("can I get speed from in the gameloop?", wokeItems[0].rate)
        // will need a timer or some sort of checker to control how often this fires
        // checkTimers()
    }
} // gameLoop end bracket

// Setting the timed items so we can stop them.
const gameLoopInterval = setInterval(gameLoop, 60)
const makeWokeInterval = setInterval(wokeStuff.makeWoke, 1000)
// const projectBarInterval = setInterval(wokeUpdate--, 1000)
// const wokeBarInterval = setInterval(projUpdate++, 1000)

// Function to perform end of game checks and actions
const stopGame = () => {
    clearInterval(gameLoopInterval)
    clearInterval(makeWokeInterval)
    clearCanvas()
    if (youWin === true) {
        winnerText.render()
    } else {
        gameOverText.render()
    }
    console.log("Game over!")
    // console.log("generated wokeitems left:", wokeItems)
}

// The event listeners that load with the page
document.addEventListener("DOMContentLoaded", function () {    
    // setInterval(gameLoop, 60)
    // stops the game after a set amount of time, for testing
    // setTimeout(stopGame, 10000)
    // listens for the start button to be clicked
    startBtn.addEventListener("click", startGame)
})

// detects when a key is pressed
document.addEventListener('keydown', (e) => {
    // when the key is pressed, change the direction
    // according to the setDirection HeroCrawler method
    mug.setDirection(e.key)
})

// detects when a key is released
document.addEventListener('keyup', (e) => {
    // now if any of the keys that are released correspond to a movement key
    // change the corresponding direction to false
    if (['a', 'd'].includes(e.key)) {
        mug.unsetDirection(e.key)
    }
})


//
// Logic to work out / Things to add
// ========
//  TO MVP
// ========
//  ✔ - player UI ("health" bars, time remaining, etc.)
//  ✔ - project bar moving up toward completion
//  ✔ - woke bar moving down toward sleep
//  ✔ - woke array of objects for collectibles
//  ✔ - woke items falling
//  ✔ - woke items affecting woke bar
//  ✔ - woke items removed when leaving the gamefield (not falling forever)
//  ✔ - sleepy array of objects for collectibles (just put in same array)
//  ✔     - sleepy itmes falling
//  ✔     - sleepy items affecting woke bar
//  ✔     - sleepy items removed when leaving gamefield
//  ✔ - random selection of next collectible to fall
//  ✔ - random position of next collectible to fall
//
// ================================
// TECHNICALLY PLAYABLE WITHOUT BUT
// ================================
//  - interface messages pop-up
//  - tying beginning of game to start button click
//
// =======
// STRETCH
// =======
// - user HUD messages on item pick-up
// - make images
// - load images instead of colored boxes
// - add sound effects
// - tweaking of speeds, drop frequency, etc.
//
// ======
// FUTURE
// ======
// - powerups/downs that change the mug (size, speed, shield, etc.)
// - new item category that affects the project
//      - positive: inspiration, breakthrough, getting help 
//      - negative: that song you really like, a youtube hole,
//        random unnecessary cleaning
// - more item variety
// - levels from easy to hard
// - have the background grow dark (and blurry?) based on your
//   wokeness, getting worse the more tired you become
