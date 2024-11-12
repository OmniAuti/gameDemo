import Player from "./Player.js";
import Ground from "./Ground.js";
import Crowd from "./Crowd.js";
import ObstacleController from "./ObstacleController.js";

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const GAME_SPEED_START = .5;
const GAME_SPEED_MAX = .75;

const GAME_WIDTH = 800;
const GAME_HEIGHT = 200;
const PLAYER_WIDTH = 20 / 1;
const PLAYER_HEIGHT = 21 / 1;
const MAX_JUMP_HEIGHT = GAME_HEIGHT;
const MIN_JUMP_HEIGHT = 150;
const GROUND_WIDTH = 2286;
const GROUND_HEIGHT = 90;
const CROWD_HEIGHT = 64;
const CROWD_WIDTH = 2047;
const GROUND_CROWD_OBSTACLE_SPEED = 0.25;

const GRASS_COLOR = "#84bc2c";


const OBSTACLE_CONFIG = [
    {width: 24 / 1.5, height: 13/1.5, image: 'images/mudOne.png'},
    {width: 24 / 1.5, height: 13/1.5, image: 'images/mudTwo.png'},
]

// GAME OBJECTS
let player = null;
let ground = null;
let crowd = null;
let obstacleController = null;

let resizeCheck = null;
let scaleRatio = null;
let previousTime = null;
let gameSpeed = GAME_SPEED_START;
// will change when game is more finished
let start = true;

function createSprites() {
    const playerWidthInGame = PLAYER_WIDTH * scaleRatio;
    const playerHeightInGame = PLAYER_HEIGHT * scaleRatio;
    const minJumpHeightInGame = MIN_JUMP_HEIGHT * scaleRatio;
    const maxJumpHeightInGame = MAX_JUMP_HEIGHT * scaleRatio;

    const crowdWidthInGame = CROWD_WIDTH * scaleRatio;
    const crowdHeightInGame = CROWD_HEIGHT * scaleRatio;

    const groundWidthInGame = GROUND_WIDTH * scaleRatio;
    const groundHeightInGame = GROUND_HEIGHT * scaleRatio;

    player = new Player(ctx, playerWidthInGame, playerHeightInGame, minJumpHeightInGame, maxJumpHeightInGame, scaleRatio, gameSpeed, GAME_SPEED_START, GAME_SPEED_MAX)
    crowd = new Crowd(ctx, crowdWidthInGame, crowdHeightInGame, GROUND_CROWD_OBSTACLE_SPEED, scaleRatio)
    ground = new Ground(ctx, groundWidthInGame, groundHeightInGame, GROUND_CROWD_OBSTACLE_SPEED, scaleRatio)

    const obstacleImages = OBSTACLE_CONFIG.map(o => {
        const image = new Image();
        image.src = o.image;
        return {
            image:image,
            width: o.width * scaleRatio,
            height: o.height * scaleRatio,
        };
    });

    obstacleController = new ObstacleController(ctx, obstacleImages, scaleRatio, GROUND_CROWD_OBSTACLE_SPEED);
}

function setScreen() {
    scaleRatio = getScaleRatio();
    canvas.width = GAME_WIDTH * scaleRatio
    canvas.height = GAME_HEIGHT * scaleRatio
    createSprites();
    resizeCheck = null;
}

setScreen()
window.addEventListener('resize', () => {
    if (resizeCheck === null) {
        setTimeout(setScreen, 250)
        resizeCheck = 1;
    }
})


if (screen.orientation) {
    screen.orientation.addEventListener('change', setScreen);
}

function getScaleRatio() {
    const screenHeight = Math.min(window.innerHeight, document.documentElement.clientHeight);
    const screenWidth = Math.min(window.innerWidth, document.documentElement.clientWidth);
    // check is window is wider than game
    if (screenWidth / screenHeight < GAME_WIDTH / GAME_HEIGHT) {
        return screenWidth / GAME_WIDTH;
    } else {
        return screenHeight / GAME_HEIGHT;
    }
} 

function clearScreen() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function updateGameSpeed() {
    let playerSpeed = player.playerSpeed;
        gameSpeed = playerSpeed;
}

function gameLoop(currentTime) {
    if (previousTime === null) {
        previousTime = currentTime;
        requestAnimationFrame(gameLoop);
        return;
    }
    const frameTimeDelta = currentTime - previousTime;
    previousTime = currentTime;

    clearScreen();

    if (obstacleController.collideWith(player)) {
        player.speedUp = false;     
    }
    // UPDATE GAME OBJECTS
    if (start) {
        ground.update(gameSpeed, frameTimeDelta);
        crowd.update(gameSpeed, frameTimeDelta);
        // score.update(frameTimeDelta);
        updateGameSpeed();
        obstacleController.update(gameSpeed, frameTimeDelta);
        player.update(gameSpeed, frameTimeDelta, scaleRatio);
    }

    // DRAW GAME OBJECTS
    ctx.fillStyle = GRASS_COLOR;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ground.draw();
    crowd.draw();
    obstacleController.draw();

    // PLAYER ALWAYS DRAW LAST SO ITS OVER ALL OTHER PIXELS
    player.draw();

    requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);