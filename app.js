import Player from "./Player.js";
import PlayerShadow from "./PlayerShadow.js";
import Ground from "./Ground.js";
import FinishLine from "./FinishLine.js";
import Crowd from "./Crowd.js";
import ObstaclePotholeController from "./ObstaclePotholeController.js";
import ObstacleRampController from "./ObstacleRampController.js";

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const GAME_SPEED_END = .25;
const GAME_SPEED_START = 0.5;
const GAME_SPEED_MAX = .75;

const GAME_WIDTH = 800;
const GAME_HEIGHT = 200;
const PLAYER_WIDTH = 20 / 1;
const PLAYER_HEIGHT = 21 / 1;
const MAX_JUMP_HEIGHT = GAME_HEIGHT / 4;
const MIN_JUMP_HEIGHT = GAME_HEIGHT / 2;
const GROUND_WIDTH = 5080;
const GROUND_HEIGHT = 70;
const FINISH_WIDTH = 1000;
const LANE_HEIGHT = 11;
const CURB_HEIGHT = 7;
const CROWD_HEIGHT = 64;
const CROWD_WIDTH = 2047;
const GROUND_OBSTACLE_SPEED = 0.25;

const SHADOW_WIDTH = 10;
const SHADOW_HEIGHT = 5;

const GRASS_COLOR = "#b2b2b1";

const OBSTACLE_POTHOLE_CONFIG = [
    {width: 24 / 1.5, height: 13/1.5, image: 'images/obstacle_potholeOne.png'},
    {width: 24 / 1.5, height: 13/1.5, image: 'images/obstacle_potholeTwo.png'},
]

const OBSTACLE_RAMP_CONFIG = [
    {width: 24 / 1.5, height: 57/1.5, image: 'images/rampA.png'},
]

// GAME OBJECTS
let player = null;
let playerShadow = null;
let ground = null;
let finishLine = null;
let finishTimeout = null;
let crowd = null;
let obstaclePotholeController = null;
let obstacleRampController = null;

let resizeCheck = null;
let keyUpPlayer = null;
let scaleRatio = null;
let previousTime = null;
let gameSpeed = GAME_SPEED_START;
// will change when game is more finished
let start = false;
let finish = false;
let gameOver = false;
let hasAddEventListenersForRestart = false;
let waitingToStart = true;
// SCREEN
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
// SCREEN
function createSprites() {
    const playerWidthInGame = PLAYER_WIDTH * scaleRatio;
    const playerHeightInGame = PLAYER_HEIGHT * scaleRatio;
    const shadowHeightInGame = SHADOW_HEIGHT * scaleRatio;
    const shadowWidthInGame = SHADOW_WIDTH * scaleRatio;
    const minJumpHeightInGame = MIN_JUMP_HEIGHT * scaleRatio;
    const maxJumpHeightInGame = MAX_JUMP_HEIGHT * scaleRatio;

    const crowdWidthInGame = CROWD_WIDTH * scaleRatio;
    const crowdHeightInGame = CROWD_HEIGHT * scaleRatio;

    const groundWidthInGame = GROUND_WIDTH * scaleRatio;
    const finishWidthInGame = FINISH_WIDTH * scaleRatio;
    const groundHeightInGame = GROUND_HEIGHT * scaleRatio;
    const laneHeightInGame = LANE_HEIGHT * scaleRatio;
    const curbHeightInGame = CURB_HEIGHT * scaleRatio;

    player = new Player(ctx, playerWidthInGame, playerHeightInGame, minJumpHeightInGame, maxJumpHeightInGame, scaleRatio, gameSpeed, GAME_SPEED_START, GAME_SPEED_MAX, laneHeightInGame, curbHeightInGame)
    playerShadow = new PlayerShadow(ctx, shadowWidthInGame, shadowHeightInGame, scaleRatio);
    crowd = new Crowd(ctx, crowdWidthInGame, crowdHeightInGame, GROUND_OBSTACLE_SPEED, scaleRatio);
    ground = new Ground(ctx, groundWidthInGame, groundHeightInGame, GROUND_OBSTACLE_SPEED, scaleRatio);
    finishLine = new FinishLine(ctx, finishWidthInGame, groundHeightInGame, GROUND_OBSTACLE_SPEED, scaleRatio, groundWidthInGame)

    const obstaclePotholeImages = OBSTACLE_POTHOLE_CONFIG.map(o => {
        const image = new Image();
        image.src = o.image;
        return {
            image: image,
            width: o.width * scaleRatio,
            height: o.height * scaleRatio,
        };
    });

    obstaclePotholeController = new ObstaclePotholeController(ctx, obstaclePotholeImages, scaleRatio, GROUND_OBSTACLE_SPEED, laneHeightInGame, curbHeightInGame);
   
    const obstacleRampImages = OBSTACLE_RAMP_CONFIG.map(o => {
        const image = new Image();
        image.src = o.image;
        return {
            image:image,
            width: o.width * scaleRatio,
            height: o.height * scaleRatio,
        };
    });

    obstacleRampController = new ObstacleRampController(ctx, obstacleRampImages, scaleRatio, GROUND_OBSTACLE_SPEED);
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

function showStartGame() {
    let fontSize = 20 * scaleRatio;
    ctx.font = `${fontSize}px Veranda`;
    // FIND A BETTER WAY TO CENTER THIS
    let x = canvas.width / 5;
    let y = canvas.height / 2;
    ctx.fillStyle = "#000000";
    ctx.fillText("TAP SCREEN OR PRESS SPACE TO START", x, y);
}

function startRace() {
    waitingToStart = false;
    start = true;
}

function showGameOver() {
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        let fontSize = 70 * scaleRatio;
        ctx.font = `${fontSize}px Veranda`;
        // FIND A BETTER WAY TO CENTER THIS
        let x = canvas.width / 4.2;
        let y = canvas.height / 2;
        ctx.fillStyle = "#ffdd2b";
        ctx.fillText("GAME OVER", x, y);

        fontSize = 16 * scaleRatio;
        ctx.font = `${fontSize}px Veranda`;
        x = canvas.width / 3;
        y = canvas.height / 1.25;
        ctx.fillText("PRESS ANY BUTTON TO PLAY AGAIN", x, y);
}

function restartGameSetup() {
    if (!hasAddEventListenersForRestart) {
        hasAddEventListenersForRestart = true;

        setTimeout(() => {
            window.addEventListener("keyup", reset, {once: true})
            window.addEventListener("touchstart", reset, {once: true})

            window.removeEventListener("keyup", startRace, {once: true})
            window.removeEventListener("touchstart", startRace, {once: true})
        }, 1000);
    }
}

function reset() {

    ground.reset();
    obstaclePotholeController.reset();
    finishLine.reset();

    player.laneIndex = 0;
    player.reset();

    gameSpeed = GAME_SPEED_START;

    start = false;
    finish = false;
    gameOver = false;
    hasAddEventListenersForRestart = false;
    waitingToStart = true;

    window.addEventListener("keyup", startRace, {once: true})
    window.addEventListener("touchstart", startRace, {once: true})
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
    // COLLIDE CHECK
    //Pothole

    if (obstaclePotholeController.collideWith(player) && !player.playerOnRamp) {
        player.speedUp = false;
        if (keyUpPlayer === null && player.keyUpSpeed === false) {
            setTimeout(() => {
                player.speedUp = true;
                keyUpPlayer = null;
            }, 500);     
        }
        keyUpPlayer = 1;
    }
    // // RAMP
    // if (obstacleRampController.collideWith(player)) {
    //     playerShadow.shadowActive = true;
    //     player.playerOnRamp = true;
    // } 
    // if (!player.jumpInProgress) {
    //     playerShadow.shadowActive = false;
    // }

    // UPDATE GAME OBJECTS
    if (start) {
        ground.update(gameSpeed, frameTimeDelta);
        obstaclePotholeController.update(gameSpeed, frameTimeDelta);
        finishLine.update(gameSpeed, frameTimeDelta);
        crowd.update(gameSpeed, frameTimeDelta);
        // score.update(frameTimeDelta);
        updateGameSpeed();
       
        // obstacleRampController.update(gameSpeed, frameTimeDelta);
        playerShadow.update(player.width, player.height, player.x, player.y, player.startingPositionY, player.laneHeight, player.laneIndex);
        player.update(gameSpeed, frameTimeDelta, scaleRatio);
        // start finish
        if (finishLine.collideWithFinish(player)) {
            start = false;
            finish = true;
        }
    }
    
    if (finish) {
        gameSpeed = GAME_SPEED_END;
        player.playerSpeed = GAME_SPEED_END;
        player.update(gameSpeed, frameTimeDelta)
        ground.update(gameSpeed, frameTimeDelta);
        finishLine.update(gameSpeed, frameTimeDelta);
        crowd.update(gameSpeed, frameTimeDelta);
        obstaclePotholeController.update(gameSpeed, frameTimeDelta);
        playerShadow.update(player.width, player.height, player.x, player.y, player.startingPositionY, player.laneHeight, player.laneIndex);
        if (!finishTimeout)  {
            finishTimeout = setTimeout(() => {
                gameOver = true;
                restartGameSetup();
            }, 4200)
        }
    };

     // DRAW GAME OBJECTS

    ctx.fillStyle = GRASS_COLOR;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ground.draw();
    finishLine.draw();
    crowd.draw();
    obstaclePotholeController.draw();
    // obstacleRampController.draw();
    // NEED TO CHANGE THIS TO UPDATE METHOD THAT ACTIVATES ON RAMP VARIABLE - THEN HAVE REGULAR DRAW
    playerShadow.draw();
    // PLAYER ALWAYS DRAW LAST SO ITS OVER ALL OTHER PIXELS
    player.draw();
    //
    if (gameOver) {
        showGameOver();
    }
    //
    if (waitingToStart) { 
        showStartGame();
    }
    //
    requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);

window.addEventListener("keyup", startRace, {once: true})
window.addEventListener("touchstart", startRace, {once: true})