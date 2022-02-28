
// Initial setting of the canvas and context
const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")

// Takes the canvas CSS elements and puts them into the pixel
// style we'll be using so our dimensions are correct
canvas.setAttribute("width", getComputedStyle(canvas)["width"])
canvas.setAttribute("height", getComputedStyle(canvas)["height"])

// Initial variables to select elements for DOM manipulation.
const gameBoard = document.getElementById("game-board")
const moveDisplay = document.getElementById("user-moves")
const startBtn = document.getElementById("start-button")
const startScreen = document.getElementById("start-screen")
const howToBtn = document.getElementById("howto-button")
const howTo1Screen = document.getElementById("how-to-play1")
const prev1Btn = document.getElementById("howto-prev1")
const next1Btn = document.getElementById("howto-next1")
const howTo2Screen = document.getElementById("how-to-play2")
const prev2Btn = document.getElementById("howto-prev2")
const next2Btn = document.getElementById("howto-next2")
const howTo3Screen = document.getElementById("how-to-play3")
const prev3Btn = document.getElementById("howto-prev3")
const replayBtnW = document.getElementById("replay-button-w")
const replayBtnL = document.getElementById("replay-button-l")
const winScreen = document.getElementById("win-screen")
const lossScreen = document.getElementById("loss-screen")

// Setting images to variables to easily call them
const imgWokeBar = document.getElementById("woke-bar")
const imgProjBar = document.getElementById("proj-bar")
const imgMug = document.getElementById("mug1")
const imgRefill = document.getElementById("refill")
const imgEnergy = document.getElementById("energy")
const imgMolecule = document.getElementById("molecule")
const imgSheep = document.getElementById("sheep")
const imgLullaby = document.getElementById("lullaby")
const imgPillow = document.getElementById("pillow")


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
    constructor(mugName, mugImage, mugWidth, mugHeight) {
        this.x = 350,
        this.y = 450,
        this.name = mugName,
        this.width = mugWidth,
        this.height = mugHeight,
        this.image = mugImage,
        this.speed = 30,
        // Mug only moves on x-axis, so no need to worry about up and down
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
    // Function to draw mug, to be replaced by an image (theoretically!)
    // render = function() {
    //     ctx.fillStyle = this.color
    //     ctx.fillRect(this.x, this.y, this.width, this.height)
    draw() {
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height)
        }
    
} // PlayerMug class close bracket

// Initial creation of the player's mug gamepiece
const mug = new PlayerMug("basicMug", imgMug, 150, 150)

// The object for creating (constructing and then rendering)
// the caffeinated collectibles that the player will attempt
// to capture.
class WokeItem {
    constructor(wokeName, wokeImg, wokeWidth, wokeHeight, wokeDropRate, wokeValue, x) {
        this.id = randomNum(1, 2000)
        this.x = x,
        this.y = 0,
        this.name = wokeName,
        this.image = wokeImg,
        this.width = wokeWidth,
        this.height = wokeHeight,
        this.rate = wokeDropRate,
        this.value = wokeValue,
        this.dropped = false,
        this.alive = true
    }
    draw() {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height)
        // ctx.fillStyle = this.color
        // ctx.fillRect(this.x, this.y, this.width, this.height)
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
    render() {
        ctx.fillStyle = this.color
        ctx.strokeStyle = this.border
        ctx.lineWidth = 2
        ctx.fillRect(this.x, this.y, this.width, this.height)
        ctx.strokeRect(this.x, this.y, this.width, this.height)
    }
}

// Constructor for adding text to the player HUD
class TextHUD {
    // constructor(text, color, x, y, font) {
    constructor(textName, textImg, textWidth, textHeight, x, y) {
        this.x = x,
        this.y = y,
        this.name = textName,
        this.image = textImg,
        this.width = textWidth,
        this.height = textHeight
        // this.font = font,
        // this.text = text
        // this.border = border
    }
    draw() {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height)
        // ctx.fillStyle = this.color
        // ctx.font = this.font
        // ctx.fillText(this.text, this.x, this.y)
        // ctx.strokeStyle = this.border
        // ctx.lineWidth = 4
    }
}

// Variable to indicate if the game is over or not.
let gameOver = false
// Variable for if the player won
let youWin = false
// Starting value for the game level timer.
// let timer = 90
// Variable to iterate the gameLoop we're on, for internal checking
// let gameLoopCount = 0
// Variable to hold the adjusted values for the HUD bars
let wokeUpdate = 0
let projUpdate = 0
// Variable to adjust the amount of wokeness the player starts with
let startingWoke = 100
// Variable to initialize the check to see if an identical item gets
// picked to drop next
let lastDrop = 5000
// Boolean to say if we want a new item to drop.
let goodToDrop = false

// Creating interval variables so we can control them, but without
// value now so they won't fire until we tell them to.
let gameLoopInterval = null
let makeWokeInterval = null

// Set up the user HUD with the caffeine and project progress bars.
// "baseBar" will render underneath them to give the appearance of
// partially empty bars.
let wokeBase = new UserHUD(25, 70, "rgb(161, 173, 189)", 250)
let wokeBar = new UserHUD(25, 70, "rgb(240, 119, 230)", startingWoke)
let projectBase = new UserHUD(525, 70, "rgb(161, 173, 189)", 250)
let projectBar = new UserHUD(525, 70, "rgb(240, 119, 230)", 0)

let wokeText = new TextHUD("Wokeness", imgWokeBar, 150, 50, 25, 15)
let projectText = new TextHUD("Project", imgProjBar, 100, 50, 675, 15)

const drawHUD = () => {
    wokeBase.render()
    projectBase.render()
    wokeBar.render()
    projectBar.render()
    wokeText.draw()
    projectText.draw()
}

// The array to hold all the randomly created woke items. makeWoke() will
// add them, and they'll be removed when they're captured or fall off the
// board.
const wokeItems = []

const wokeStuff = {
    // Generates the caffeinated and sleepy items to be dropped for the
    // player to collect. Parameters are: name, image, width, height, drop
    // rate, amount of wokeness it'll add, and its randomly generated
    // position on the x-axis
    makeWoke() {
        // console.log(`wokeItems has ${wokeItems.length} items at top of makeWoke`)
        let refill = new WokeItem("refill", imgRefill, 75, 125, 30, 10, randomNum(0, canvas.width))
        let energyDrink = new WokeItem("energyDrink", imgEnergy, 50, 100, 40, 30, randomNum(0, canvas.width))
        let molecule = new WokeItem("molecule", imgMolecule, 125, 100, 20, 100, randomNum(0, canvas.width))
        let sheep = new WokeItem("sheep", imgSheep, 125, 125, 20, -10, randomNum(0, canvas.width))
        let lullaby = new WokeItem("lullaby", imgLullaby, 50, 75, 30, -20, randomNum(0, canvas.width))
        let pillow = new WokeItem("pillow", imgPillow, 100, 75, 40, -40, randomNum(0, canvas.width))
        
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
                // console.log("made refill", refill)
        } else if (randomWoke === 4 || randomWoke === 5) {
            if (energyDrink.x > canvas.width - energyDrink.width)
                {energyDrink.x = canvas.width - energyDrink.width}
                wokeItems.push(energyDrink)
                // console.log("made energy", energyDrink)
        } else if (randomWoke === 6) {
            if (molecule.x > canvas.width - molecule.width)
                {molecule.x = canvas.width - molecule.width}
                wokeItems.push(molecule)
                // console.log("made molecule", molecule)
        }

        // Same as above, for sleepy items
        let randomSleep = randomNum(1, 6)
        if (randomSleep <= 2) {
            if (sheep.x > canvas.width - sheep.width)
                {sheep.x = canvas.width - sheep.width}
                wokeItems.push(sheep)
                // console.log("made sheep", sheep)
        } else if (randomSleep === 3 || randomSleep === 4) {
            if (lullaby.x > canvas.width - lullaby.width)
                {lullaby.x = canvas.width - lullaby.width}
                wokeItems.push(lullaby)
                // console.log("made lullaby", lullaby)
        } else if (randomSleep >= 5) {
            if (pillow.x > canvas.width - pillow.width)
                {pillow.x = canvas.width - pillow.width}
                wokeItems.push(pillow)
                // console.log("made pillow", pillow)
        }
        // console.log("what's in the item array:", wokeItems)
    },

    // Renders the items from the array to the gameboard.
    drawWoke() {
        if (goodToDrop === true) {
        //     console.log("goodtodrop is false")
        // } else {
        //     console.log("goodtodrop is true")
            // Randomzing the item dropped
            let i = randomNum(1, (wokeItems.length - 1))
            // Keeps the dropped items from repeating
            wokeItems[i].dropped = true
            // Reset the lock on dropping another item
            goodToDrop = false
        }

        for (let i = 0; i < wokeItems.length; i++) {
            if (wokeItems[i].dropped === true) {
                wokeItems[i].draw()
                wokeItems[i].y += wokeItems[i].rate
            }
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

// Popup message placed down here so it'll load on top of everything else.
// let popupText = new TextHUD(hudMsg, "white", 300, 150, "bold 25px Calibri")

// Function to update the woke bar based on items collectded this loop.
const wokeBarUpdate = () => {
    wokeUpdate--
    let adjustedWoke = wokeBar.width + wokeUpdate
    // Check to see if the player has fallen asleep, and if so, the game
    // is over.
    if (adjustedWoke <= 0) {
        gameOver = true
        // console.log("You fell asleep!")
    }
    // Condition to constrain the bar update to the maximum possible.
    if (adjustedWoke <= wokeBase.width) {
        wokeBar = new UserHUD(25, 70, "rgb(240, 119, 230)", adjustedWoke)
    } else {
        wokeBar = new UserHUD(25, 70, "rgb(240, 119, 230)", wokeBase.width)
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
        projectBar = new UserHUD(525, 70, "rgb(240, 119, 230)", adjustedProj)
    } else {
        projBar = new UserHUD(525, 75, "rgb(240, 119, 230)", projectBase.width)
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


// The main gameloop, runs every gameLoopInterval and drives primary
// actions of the game
const gameLoop = () => {
    // Up the loop counter at the start of the gameloop and display which
    // one we're on (for internal use)
    // gameLoopCount++
    // console.log("Starting loop #", gameLoopCount)
    // console.log("This is the start of the game loop");
    // console.log("woke update at loop start", wokeUpdate)
    // console.log(`At the start of gameloop the are ${wokeItems.length} woke items.`)

    // Before anything runs, check to see if the game is over.
    if (gameOver === true) {
        stopGame()
    } else {
        // These are the things that will happen every tick.
        //
        // Runs the check for removal of the "dead" items
        clearDead()
        // Clear the canvas
        clearCanvas()
        drawHUD()
        // Update the player HUD bars
        wokeBarUpdate()
        projBarUpdate()
        // Draws the falling items on the gameboard
        wokeStuff.drawWoke()
        // Create the player's mug. Placed after the collectibles so the
        // mug will be the top layer
        mug.draw()
        mug.moveMug()
        wokeStuff.detectHit()
    }
} // gameLoop end bracket


// Function to reset the inner variables and arays then trigger the start
// of the game as per usual.
const restartGame = () => {
    gameOver = false
    youWin = false
    wokeItems.length = 0
    wokeUpdate = 0
    projUpdate = 0
    startingWoke = 100
    goodToDrop = false
    gameLoopInterval = null
    makeWokeInterval = null
    winScreen.classList.add("hidden")
    winScreen.style.height = "0px"
    lossScreen.classList.add("hidden")
    lossScreen.style.height = "0px"
    replayBtnW.classList.add("hidden")
    replayBtnL.classList.add("hidden")
    startStuff.startGame()
    wokeBase = new UserHUD(25, 70, "rgb(161, 173, 189)", 250)
    wokeBar = new UserHUD(25, 70, "rgb(240, 119, 230)", startingWoke)
    projectBase = new UserHUD(525, 70, "rgb(161, 173, 189)", 250)
    projectBar = new UserHUD(525, 70, "rgb(240, 119, 230)", 0)
}

// Class for the setup stuff
const startStuff = {
    // function to do all the rendering, resetting, etc. for starting the game
    startGame() {
        // Remove the start screen and buttons and prep the gameboard
        startBtn.classList.add("hidden")
        howToBtn.classList.add("hidden")
        startScreen.classList.add("hidden")
        startScreen.style.height = "0px"
        canvas.classList.remove("hidden")
        canvas.style.height = "600px"
        gameBoard.classList.remove("hidden")

        // Front-loading items into the array for smooth drops and variety
        // Run makeWoke $count number of times
        for (let count = 0; count < 10; count++) {
            wokeStuff.makeWoke()
            // console.log(wokeItems.length, "items made before game starts")
        }
        if (!gameLoopInterval) {
            setTimeout(gameLoopInterval = setInterval(gameLoop, 60), 1000)
            setTimeout(makeWokeInterval = setInterval(wokeStuff.makeWoke, 500), 10000)
            setInterval(() => {goodToDrop = true}, 500)
        }
    },

    showStartScreen() {
        startBtn.classList.remove("hidden")
        howToBtn.classList.remove("hidden")
        startScreen.classList.remove("hidden")
        startScreen.style.height = "600px"
        howTo1Screen.classList.add("hidden")
        howTo1Screen.style.height = "0px"
        prev1Btn.classList.add("hidden")
        next1Btn.classList.add("hidden")
    },

    showHowTo1() {
        startBtn.classList.add("hidden")
        howToBtn.classList.add("hidden")
        startScreen.classList.add("hidden")
        startScreen.style.height = "0px"
        howTo2Screen.classList.add("hidden")
        howTo2Screen.style.height = "0px"
        prev2Btn.classList.add("hidden")
        next2Btn.classList.add("hidden")
        howTo1Screen.classList.remove("hidden")
        howTo1Screen.style.height = "600px"
        prev1Btn.classList.remove("hidden")
        next1Btn.classList.remove("hidden")
    },

    showHowTo2() {
        howTo1Screen.classList.add("hidden")
        howTo1Screen.style.height = "0px"
        prev1Btn.classList.add("hidden")
        next1Btn.classList.add("hidden")
        howTo3Screen.classList.add("hidden")
        howTo3Screen.style.height = "0px"
        prev3Btn.classList.add("hidden")
        howTo2Screen.classList.remove("hidden")
        howTo2Screen.style.height = "600px"
        prev2Btn.classList.remove("hidden")
        next2Btn.classList.remove("hidden")
    },

    showHowTo3() {
        howTo2Screen.classList.add("hidden")
        howTo2Screen.style.height = "0px"
        prev2Btn.classList.add("hidden")
        next2Btn.classList.add("hidden")
        howTo3Screen.classList.remove("hidden")
        howTo3Screen.style.height = "600px"
        prev3Btn.classList.remove("hidden")
    },

    // Function to control the How To Play section
    howTo1() {
        startStuff.showHowTo1()
        prev1Btn.addEventListener("click", startStuff.showStartScreen)
        next1Btn.addEventListener("click", startStuff.howTo2)
    },

    howTo2() {
        startStuff.showHowTo2()
        prev2Btn.addEventListener("click", startStuff.howTo1)
        next2Btn.addEventListener("click", startStuff.howTo3)
    },

    howTo3() {
        startStuff.showHowTo3()
        prev3Btn.addEventListener("click", startStuff.howTo2)
    },
}

// Function to perform end of game checks and actions
const stopGame = () => {
    clearInterval(gameLoopInterval)
    clearInterval(makeWokeInterval)
    clearCanvas()

    if (youWin === true) {
        canvas.classList.add("hidden")
        canvas.style.height = "0px"
        gameBoard.classList.add("hidden")
		winScreen.classList.remove("hidden")
        winScreen.style.height = "600px"
        replayBtnW.classList.remove("hidden")
        replayBtnW.addEventListener("click", restartGame)
        // winnerText.render()
    } else {
        canvas.classList.add("hidden")
        canvas.style.height = "0px"
        gameBoard.classList.add("hidden")
		lossScreen.classList.remove("hidden")
        lossScreen.style.height = "600px"
        replayBtnL.classList.remove("hidden")
        replayBtnL.addEventListener("click", restartGame)
        // gameOverText.render()
    }
    console.log("Game over!")
    // console.log("wokeitems left at game end:", wokeItems.length)
}

// The event listeners that load with the page
document.addEventListener("DOMContentLoaded", function () {

    // setInterval(gameLoop, 60)
    // stops the game after a set amount of time, for testing
    // setTimeout(stopGame, 10000)
    // listens for the start button to be clicked
    startBtn.addEventListener("click", startStuff.startGame)
    howToBtn.addEventListener("click", startStuff.howTo1)

})

// detects when a key is pressed
document.addEventListener("keydown", (e) => {
    // when the key is pressed, change the direction
    // according to the setDirection HeroCrawler method
    mug.setDirection(e.key)
})

// detects when a key is released
document.addEventListener("keyup", (e) => {
    // now if any of the keys that are released correspond to a movement key
    // change the corresponding direction to false
    if (["a", "d"].includes(e.key)) {
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
//  ✔ - tying beginning of game to start button click
//  ✔ - Full how-to-play section with game premise and item images
//
// =======
// STRETCH
// =======
// - user HUD messages on item pick-up
// ✔ - make images
// ✔ - load images instead of colored boxes
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
