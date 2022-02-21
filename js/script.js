// Initial variables to select elements for DOM manipulation.
const game = document.getElementById("canvas")
// const startBtn = document.getElementById("start")
const moveDisplay = document.getElementById("user-moves")

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
class Crawler {
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
// the constructor.
let mug = new Crawler(350, 500, "hotpink", 75, 75)
// let refill = new Crawler(100, 100, "brown", 28, 37)
// let nrgDrink = new Crawler(175, 325, "silver", 25, 75)
// let molecule = new Crawler(275, 200, "teal", 100, 75)
// let sheep = new Crawler(500, 350, "white", 100, 100)
// let lullaby = new Crawler(225, 450, "goldenrod", 25, 25)
// let pillow = new Crawler(400, 10, "skyblue", 100, 40)

document.addEventListener("DOMContentLoaded", function () {
    // Event listener that will fire when a key is pressed
    // (limited to acting on "a" and "d" by the movementHandler
    // function that the keydown event calls)
    document.addEventListener("keydown", movementHandler)
    setInterval(gameLoop, 60)
})

const gameLoop = () => {
    // console.log("This is the start of the game loop");
    // Clear the canvas
    ctx.clearRect(0, 0, game.width, game.height)
    // Display the coordinates of the mug
    moveDisplay.textContent = "Mug position: " + mug.x + ", " + mug.y
    mug.render()
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

// What happens when the start button is clicked.
// startBtn.addEventListener("click", function(e) {
//     mug.render()    
//     // refill.render()
//     // nrgDrink.render()
//     // molecule.render()
//     // sheep.render()
//     // lullaby.render()
//     // pillow.render()
// })
