// Initial variables to select elements for DOM manipulation.
const game = document.getElementById("canvas")
const moveDisplay = document.getElementById("user-moves")
// const startBtn = document.getElementById("start")

// Setting the context
const ctx = game.getContext("2d")

// Styling details for the initial big white box;
// keeping in for now for reference
// ctx.fillStyle = "white"
// ctx.strokeStyle = "red"
// ctx.lineWidth = 5
// ctx.fillRect(10, 10, 100, 100)
// ctx.strokeRect(10, 10, 100, 100)

// Takes the canvas CSS elements and puts them into the pixel
// style we"ll be using so our dimensions are correct
game.setAttribute("width", getComputedStyle(game)["width"])
game.setAttribute("height", getComputedStyle(game)["height"])

// The object for creating (constructing and then rendering)
// the player token (mug) and tokens that will be collected.
class gamePiece {
    constructor(x, y, color, height, width) {
        this.x = x,
        this.y = y,
        this.color = color,
        this.height = height,
        this.width = width,
        this.alive = true,
        // Function has to be written "old school" in objects
        this.render = function() {
            ctx.fillStyle = this.color
            ctx.fillRect(this.x, this.y, this.height, this.width)
        }
    }
}

// Initial creation of the game pieces (to be replaced with images)
// (x point, y point, color, width, height) as defined by
// the gamePieces constructor.
let mug = new gamePiece(350, 500, "hotpink", 75, 75)
let refill = new gamePiece(100, -30, "rgb(92, 47, 17)", 28, 37)
// let nrgDrink = new gamePiece(175, 325, "silver", 25, 75)
// let molecule = new gamePiece(275, 200, "teal", 100, 75)
// let sheep = new gamePiece(500, 350, "white", 100, 100)
// let lullaby = new gamePiece(225, 450, "goldenrod", 25, 25)
// let pillow = new gamePiece(400, 10, "skyblue", 100, 40)

// Function to scroll the collectibles down the gamefield
const fallDown = () => {
    refill.y += 10
}

const gameLoop = () => {
    // console.log("This is the start of the game loop");
    // Clear the canvas
    ctx.clearRect(0, 0, game.width, game.height)
    // Display the coordinates of the mug
    moveDisplay.textContent = "Mug position: " + mug.x + ", " + mug.y +
        " Refill pos: " + refill.x + ", " + refill.y
    mug.render()
    // Drops the Refill collectible until it's collected or fallen off the gamefield
    if (refill.alive === true && refill.y < 600) {
        refill.render()
        fallDown()
        detectCollision()        
    }
}
// Function to say what happens when the player uses a & d to move the
// mug left and right.
const movementHandler = (e) => {
    // left (press a, code 65, x -1) and right (press d, code 68, x +1)
    // Note: keycode IS NOT THE SAME AS keyCode, ask me how I know.
    switch (e.keyCode) {
        case (65):
            mug.x -= 10
            break
        case (68):
            mug.x += 10
            break
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

    if (mugLeft && mugRight && mugTop) {
            // game stuff
            refill.alive = false
            console.log("got it!")
        }
}

document.addEventListener("DOMContentLoaded", function () {
    // Event listener that will fire when a key is pressed
    // (limited to acting on "a" and "d" by the movementHandler
    // function that the keydown event calls)
    document.addEventListener("keydown", movementHandler)
    setInterval(gameLoop, 60)
})


// Logic to work out / Things to add
//  - player UI ("health" bars, time remaining, etc.)
//  - array of objects for collectibles
//  ✔ - collectibles falling
//  ✔ - collectibles removed when leaving the gamefield (not just falling forever)
//  - random time interval before collectible falls (between xx and yy seconds)
//  - random selection of next collectible to fall
//  - collectibles falling at different rates(?)
//  - collectible pick up adjusting player bars
//  - interface messages pop-up
//  - tying beginning of game to start button click
//  - 