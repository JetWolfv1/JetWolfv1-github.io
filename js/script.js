// Initial variables to select elements for DOM manipulation.
const game = document.getElementById("canvas")
const startBtn = document.getElementById("start")
const moveDisplay = document.getElementById("user-moves")

// Setting the context
const ctx = game.getContext('2d')

// Styling details for the initial big white box;
// keeping in for now for reference
// ctx.fillStyle = "white"
// ctx.strokeStyle = "red"
// ctx.lineWidth = 5
// ctx.fillRect(10, 10, 100, 100)
// ctx.strokeRect(10, 10, 100, 100)

// Takes the canvas CSS elements and puts them into the pixel
// style we'll be using so our dimensions are correct
game.setAttribute("height", getComputedStyle(game)["height"])
game.setAttribute("width", getComputedStyle(game)["width"])

// The object for creating (constructing and then rendering)
// the player token (mug) and tokens that will be collected.
class gamePiece {
    constructor(x, y, color, width, height) {
        this.x = x
        this.y = y
        this.color = color
        this.width = width
        this.height = height
        this.alive = true
    }
    render () {
        ctx.fillStyle = this.color
        ctx.fillRect(this.x, this.y, this.width, this.height)
    }
}

// Initial creation of the game pieces (to be replaced with images)
// (x point, y point, color, width, height) as defined by
// the constructor.
let mug = new gamePiece(350, 500, "hotpink", 75, 75)
let refill = new gamePiece(100, 100, "brown", 28, 37)
let nrgDrink = new gamePiece(175, 325, "silver", 25, 75)
let molecule = new gamePiece(275, 200, "teal", 100, 75)
let sheep = new gamePiece(500, 350, "white", 100, 100)
let lullaby = new gamePiece(225, 450, "goldenrod", 25, 25)
let pillow = new gamePiece(400, 10, "skyblue", 100, 40)

// What happens when the start button is clicked. Create and
// place all the game pieces. 
startBtn.addEventListener("click", function(e) {
    mug.render()
    refill.render()
    nrgDrink.render()
    molecule.render()
    sheep.render()
    lullaby.render()
    pillow.render()
})
