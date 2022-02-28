const game = document.getElementById("canvas")
const moveDisplay = document.getElementById("user-moves")

const ctx = game.getContext('2d')

game.setAttribute("width", getComputedStyle(game)["width"])
game.setAttribute("height", getComputedStyle(game)["height"])

class Crawler {
    constructor(x, y, color, height, width) {
        this.x = x,
        this.y = y,
        this.color = color,
        this.height = height,
        this.width = width,
        this.alive = true,
        this.render = function() {
            ctx.fillStyle = this.color
            ctx.fillRect(this.x, this.y, this.height, this.width)
        }
    }
}

let mug = new Crawler(350, 500, 'hotpink', 75, 75)

document.addEventListener('DOMContentLoaded', function () {
    document.addEventListener('keydown', movementHandler)
    setInterval(gameLoop, 60)
})

const gameLoop = () => {
    ctx.clearRect(0, 0, game.width, game.height)
    moveDisplay.textContent = mug.x + ', ' + mug.y
    mug.render()
}

const movementHandler = (e) => {
    switch (e.keyCode) {
        // case (87):
        //     mug.y -= 10
        //     break
        case (65):
            mug.x -= 10
            break
        // case (83):
        //     mug.y += 10
        //     break
        case (68):
            mug.x += 10
            break
    }
}

const detectHit = () => {
    if (player.x < ogre.x + ogre.width
        && player.x + player.width > ogre.x
        && player.y < ogre.y + ogre.height
        && player.y + player.height > ogre.y) {
            ogre.alive = false
            document.getElementById('status').textContent = 'You win!'
        }
}