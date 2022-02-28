// smoother animation
in crawler constructor
    * = {
        up: false,
        down: false,
        right: false,
        left: false
    }
    
    // in crawler constructor, new methods (outside properties)
    // add a setDirection method as well as an unsetDirection method.
    // movePlayer will be called repeatedly in gameLoop so we need a new
    
    setDirection = fuction (key) {
        console.log("the key pressed is", key)
        // pressing key (keydown) changes directions from false to true
        if (key.toLowerCase() == "w") this.direction.up = true
        if (key.toLowerCase() == "a") this.direction.left = true
        if (key.toLowerCase() == "s") this.direction.down = true
        if (key.toLowerCase() == "d") this.direction.right = true
    }
    
    // this method will "unset" our direction when the key is lifted (keyup)
    // sets direction to false
    unsetDirection = fuction (key) {
        console.log("the key pressed is", key)
        // pressing key (keydown) changes directions from false to true
        if (key.toLowerCase() == "w") this.direction.up = false
        if (key.toLowerCase() == "a") this.direction.left = false
        if (key.toLowerCase() == "s") this.direction.down = false
        if (key.toLowerCase() == "d") this.direction.right = false
    }

    movePlayer = function () {
        // movePlayer will take and look at the direction that is set
        // movePlayer will then send the guy flying in that direction
        // remember we had the keyevent switch case movement handler
        // by adding moveplayer into the class, we can add specific things
        if (this.direction.up) {
            this.y -= 10
            // because we're tracking "up movement", we'll add our top
            // of canvas case.
            if (this.y <= 0) {
                this.y = 0
            }
        }
        if (this.direction.left) {
            this.x -= 10
            // because we're tracking left movement, we need the left
            // edge of the canvas
            if (this.x <= 0) {
                this.x = 0
            }
        }
        if (this.direction.down) {
            this.y += 10
            // because we're trackign down movement, we need the boittom
            // edge of the canvas but we also need to consider the
            // hero's height
            if (this.y + this.height >= canvas.height) {
                this.y = canvas.height - this.height
            }
        }
        if (this.direction.right) {
            this.x += 10
            // this.speed if you make a speed property in the crawler

            // because we're tracking right movement, we need the right
            // edge of the canvas, accounting for the hero's width
            if (this.x + this.width >= canvas.width) {
                this.x = canvas.width - this.width
            }
        }
    }

// comment out movement handler! "This is our old movement handler, the
// new one is part of hero class". comment it out in the event listener too

// add new event listener
// we'll add our key events for keyup and keydown and associate them with
// our hero's set and unset direction methods
document.addEventListener("keydown", (e) => {
    // when the key is pressed. change the direction
    // according to the setDirection herocrawler method
    player.setDirection(e.key)
})

document.addEventListener("keyup", (e) => {
    //now if any of the keys that are released correspond to a movement
    // key, change the corresponding direction to false

    // delcaring an array of keys we're listening or, and only if this
    // array includes that key, do we call unset direction on that key
    if (["w", "a", "s", "d"].includes(e.key)) {
        player.unsetDirection(e.key)
    }
})

//add to gameLoop
player.render()
player.movePlayer()


// function to place ogre randomly
// put in the global scope (example has it below hero class)
// this function will place an ogre at a random x coordinate on the canvas
const randomPlaceShrekX = (max) => {
    // all this function needs to do is produce an x coordinate
    // (any whole number)
    return Math.floor(Math.random() * max)
}
//in "let ogre = new ogreCrawler" replace hard x with new function above
let ogre = new OgreCrawler (randomPlaceShrekX(game.width), 50, "lightgreen", 32, 48, "ogre")  // we added a type
// now we have an ogre class we can create multiple ogres
// here's one that's red and twice as big
let ogre2 = new OgreCrawler (randomPlaceShrekX(game.width), 50, "red", 64, 96, "big ogre")
// now we need to add a conditional that will generate ogre2 if ogre is dead
// let's go to the gameloop
if (ogre.alive) {
    ogre.render()
    detechHit()
} else if (ogre2.alive) {
    document.querySelector("#status").textContent = "Now Kill Shrek 2!"
    ogre2.render
    detectHit()
}

// ***
// *** clearing the canvas has to be the first thing in the gameloop!
// ***

// detect hit is hard coded for one ogre, we need to update it
// here's where parameters really come into play, so we can update it
// to detect a hit with any object
// --
// our updated collision detection function will take a parameter
// that parameter will represent some item on the canvas and do
// something accordingly
const detectHit = (thing) => {
    if (
        player.x < thing.x + thing.width &&
        player.x + player.width > thing.x &&
        player.y < thing.y + thing.height &&
        player.y + player.height > thing.y
    ) {
        thing.alive = false
    }
}
//now in game loop, we'll pass ogre to detect hit : detectHit(ogre)
// then in ogre2 : detectHit(ogre2)

// we're going to change up our game loop to run on a declared interval
// when we declare an interval with a function name, we can stop that
// interval
const gameInterval = () => setInterval(gameLoop, 60)
// declaring our interval in a variable allows us to stop that interval
const stopGameLoop = () => {clearInterval(gameInterval)}
// now in domcontentloaded event listener change to:
gameInterval()  // may need to place at the bottom!
// stopped the game by stopping the timing that runs the gameloop
// *** TIE GAME FUNCTIONING TO GAMELOOP ***

// now in gameloop, add to if/else after both ogres are dead
} else {
    stopGameLoop()
    document.querySelector("#status").textContent = "You win!!"


// if you wanted to add say a powerup, you could add a powerup class
// and hit detection could determine if it's an ogre or powerup then
// do different things
// in detecthit

// you could make hit detection part of the hero class
