// Initial variables to select elements for DOM manipulation.
const canvas = document.getElementById("canvas")
const moveDisplay = document.getElementById("user-moves")
const startBtn = document.getElementById("start")

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
        this.speed = 15,
        this.direction = {
            // up: false,
            // down: false,
            right: false,
            left: false,
        }
    }
    	// add a setDirection method as well as an unsetDirection method.
	setDirection = function (key) {
		// console.log('the key pressed is', key)
		// pressing key(keydown), changes direction from false to true
		// if (key.toLowerCase() == 'w') this.direction.up = true
		if (key.toLowerCase() == 'a') this.direction.left = true
		// if (key.toLowerCase() == 's') this.direction.down = true
		if (key.toLowerCase() == 'd') this.direction.right = true
	}
	// this method will 'unset' our direction when the key is lifted(keyup)
	// sets direction to false
	unsetDirection = function (key) {
		// console.log('the key pressed is', key)
		// pressing key(keydown), changes direction from false to true
		// if (key.toLowerCase() == 'w') this.direction.up = false
		if (key.toLowerCase() == 'a') this.direction.left = false
		// if (key.toLowerCase() == 's') this.direction.down = false
		if (key.toLowerCase() == 'd') this.direction.right = false
	}
	moveMug = function () {
		// moveMug will take and look at the direction that is set
		// moveMug will then send the guy flying in that direction
		// move up
		// if (this.direction.up) {
		// 	this.y -= this.speed
		// 	// because we're tracking 'up' movement, we'll add our top of canvas case
		// 	if (this.y <= 0) {
		// 		this.y = 0
		// 	}
		// }
		// move left
		if (this.direction.left) {
			this.x -= this.speed
			// bc we're tracking left movement, we need the left edge of the canvas
			if (this.x <= 0) {
				this.x = 0
			}
		}
		// // move down
		// if (this.direction.down) {
		// 	this.y += this.speed
		// 	// bc we're tracking down movement, we need the bottom edge of the canvas
		// 	// but we also need to consider the hero's height
		// 	if (this.y + this.height >= game.height) {
		// 		this.y = game.height - this.height
		// 	}
		// }
		// move right
		if (this.direction.right) {
			this.x += this.speed
			// bc we're tracking left movement, we need the left edge of the canvas
			if (this.x + this.width >= canvas.width) {
				this.x = game.width - this.width
			}
		}
	}
    render = function() {
        ctx.fillStyle = this.color
        ctx.fillRect(this.x, this.y, this.width, this.height)
    }
}

// Initial creation of the player's mug gamepiece
const mug = new PlayerMug("basicMug", "hotpink", 75, 75)


// The object for creating (constructing and then rendering)
// the caffeinated collectibles that the player will attempt
// to capture.
class WokeItem {
    constructor(wokeName, wokeColor, wokeWidth, wokeHeight, wokeDropRate, wokeValue, x) {
        this.id = randomNum(1000, 4000)
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

// Variable to indicate if the canvas is over or not.
let gameOver = false
// Starting value for the canvas level timer.
let timer = 90


const wokeItems = []

// when I move the items out of the wokestuff class, new instances aren't
// created it's just what's already in the array. When I keep them in the
// class, I can't get them to be referenced elsewhere.


const wokeStuff = {
    makeWoke() {
        let refill = new WokeItem("refill", "rgb(92, 47, 17)", 28, 37, 30, 10, randomNum(0, canvas.width))
        let energyDrink = new WokeItem("energyDrink", "silver", 25, 75, 40, 30, randomNum(0, canvas.width))
        let molecule = new WokeItem("molecule", "teal", 100, 75, 20, 100, randomNum(0, canvas.width))
        // refill.render()
        // energyDrink.render()
        // molecule.render()

        // Random number generator to determine which woke item will be
        // made next and pushed into the wokeItems array
        let random = randomNum(1, 6)
        // Test to see if the random start position will put the item
        // outside the game board, and if so, reset it so it will be along
        // the edge.
        if (random <= 3) {
            if (refill.x > canvas.width - refill.width)
                {refill.x = canvas.width - refill.width}
            wokeItems.push(refill)
            // console.log("refill: ", refill)
            // console.log("made refill")
        } else if (random === 4 || random === 5) {
            if (energyDrink.x > canvas.width - energyDrink.width)
                {energyDrink.x = canvas.width - energyDrink.width}
            wokeItems.push(energyDrink)
            // console.log("nrg: ", energyDrink)
            // console.log("made nrg")
        } else if (random === 6) {
            if (molecule.x > canvas.width - molecule.width)
                {molecule.x = canvas.width - molecule.width}
            wokeItems.push(molecule)
            // console.log("molecule: ", molecule)
            // console.log("made molecule")
        }
    },

    drawWoke() {
        for (let i = 0; i < wokeItems.length; i++) {
            wokeItems[i].render()
            wokeItems[i].y += wokeItems[i].rate
        }
    },

    detectHit() {
        for (let i = 0; i < wokeItems.length; i++) {
            let mugLeft = wokeItems[i].x + wokeItems[i].width >= mug.x
            let mugRight = wokeItems[i].x <= mug.x + mug.width
            let mugTop = wokeItems[i].y + wokeItems[i].height >= mug.y
            // we need an if statement that clearly defines the moment of collision
            // that means utilizing the x,y, width, and height of whatever we're detecting
            if (
                mug.x < wokeItems[i].x + wokeItems[i].width &&
                mug.x + mug.width > wokeItems[i].x &&
                mug.y < wokeItems[i].y + wokeItems[i].height &&
                mug.y + mug.height > wokeItems[i].y
                ) {
                    wokeItems[i].alive = false
                    console.log(`collected ${wokeItems[i].name}!`)
                }
            }
        },

} // game object end bracket


// function to do all the rendering, resetting, etc. for starting the game
const startGame = () => {
    // stuff for setting up the game
}


// ***** Put in a check on the gameloop? One that checks timers/counters
// and fires if they're ready, otherwise stuff goes too fast.

const checkTimers = () => {
    // stuff'll go here for keeping track of the game's timing
}

const gameLoop = () => {
    // console.log("This is the start of the game loop");
    // Clear the canvas
    clearCanvas()
    // Display the coordinates of the mug
    moveDisplay.textContent = "Mug position: " + mug.x + ", " + mug.y
    // makes new woke items and puts them into their array
    wokeStuff.drawWoke()
    //creates the player's mug
    mug.render()
    mug.moveMug()
    wokeStuff.detectHit()
    // console.log("can I get speed from in the gameloop?", wokeItems[0].rate)
    // will need a timer or some sort of checker to control how often this fires
    // checkTimers()
}

const gameLoopInterval = setInterval(gameLoop, 60)
const makeWokeInterval = setInterval(wokeStuff.makeWoke, 1000)

document.addEventListener("DOMContentLoaded", function () {    
    // setInterval(gameLoop, 60)
    setTimeout(stopGame, 10000)
    startBtn.addEventListener("click", startGame)
})

document.addEventListener('keydown', (e) => {
    // when the key is pressed, change the direction
    // according to the setDirection HeroCrawler method
    mug.setDirection(e.key)
})

document.addEventListener('keyup', (e) => {
    // now if any of the keys that are released correspond to a movement key
    // change the corresponding direction to false
    if (['a', 'd'].includes(e.key)) {
        mug.unsetDirection(e.key)
    }
})


// const detectCollision = () => {

//     // if the item falls within the borders of the mug
//     // - the item diappears
//     // - the corresponding bar increases/decreases
//     //
//     // Defining the borders of the mug
//     for (let i = 0; i < wokeItems.length; i++) {
        
//         let mugLeft = wokeItems[i].x + wokeItems[i] >= mug.x
//         let mugRight = wokeItems[i] <= mug.x + mug.width
//         let mugTop = wokeItems[i] + wokeItems[i].height >= mug.y
//     // Conditional for picking up the item and making gameplay
//     // adjustments accordingly.
//     if (mugLeft && mugRight && mugTop) {
//             wokeItems[i].alive = false
//             barUpdate(wokeItems[i].wokeValue)
//             console.log("gamepiece wokeValue:", wokeItems[i].wokeValue);
//             console.log(`got it!`)
//         }
//     }
// }




const stopGame = () => {
    clearInterval(gameLoopInterval)
    clearInterval(makeWokeInterval)
    console.log("Game over!")
    // console.log("wokeitems generated:", wokeItems)
}
