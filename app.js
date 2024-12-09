import Player from "./Player.js";
import PlayerShadow from "./PlayerShadow.js";
import Ground from "./Ground.js";
import FinishLine from "./FinishLine.js";
import StartingMark from "./StartingMark.js";
import BackgroundCity from "./BackgroundCity.js";
import BackgroundBlock from "./BackgroundBlock.js";
import ObstaclePotholeController from "./ObstaclePotholeController.js";
import ObstacleRampController from "./ObstacleRampController.js";

import Timer from "./Timer.js";
import Gas from "./Gas.js";
import StartingLight from "./StartingLight.js";

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const GAME_SPEED_END = .25;
const GAME_SPEED_START = .65;
const GAME_SPEED_MAX = 1;

const GAME_WIDTH = 714;
const GAME_HEIGHT = 420;
const PLAYER_WIDTH = 20 / 1;
const PLAYER_HEIGHT = 21 / 1;
const MAX_JUMP_HEIGHT = GAME_HEIGHT / 4;
const MIN_JUMP_HEIGHT = GAME_HEIGHT / 6;
const GROUND_WIDTH = 5080;
const GROUND_HEIGHT = 70;
const STARTING_MARK_WIDTH = 7;
const STARTING_MARK_HEIGHT = 10;
const FINISH_WIDTH = 1000;
const LANE_HEIGHT = 11;
const CURB_HEIGHT = 7;

const BACKGROUND_CITY_HEIGHT = 528;
const BACKGROUND_CITY_WIDTH = 2044;
const BACKGROUND_BLOCK_HEIGHT = 488;
const BACKGROUND_BLOCK_WIDTH = 2688;
const GROUND_OBSTACLE_SPEED = 0.25;
//
const MAX_PLAYER_GAS = 1;
const STARTING_GAS = .075;
const MIN_GAS = 0;
//
const DEFAULT_COLOR_YELLOW = "#ffdd2b";
const DEFAULT_COLOR_GREEN = "#359e4a";
const DEFAULT__COLOR_RED = "#e35353";
const DEFAULT_BACKGROUND_COLOR = "#b2b2b1";
//
const SHADOW_WIDTH = 10;
const SHADOW_HEIGHT = 5;

// const OBSTACLE_POTHOLE_CONFIG = [
//     {width: 24 / 1.5, height: 13 / 1.5, image: 'images/obstacle_potholeOne.png'},
//     {width: 24 / 1.5, height: 13 / 1.5, image: 'images/obstacle_potholeTwo.png'},
// ]

const OBSTACLE_RAMP_CONFIG = [
    {width: 24 / 1.5, height: 57 / 1.5, image: 'images/RampA.png', distance: 3, climb: 4, reaction: 1, laneRestrictions:1},
    {width: 72 / 1.5, height: 64, image: 'images/RampB.png', distance: 2, climb: 3, reaction: 3, laneRestrictions: 0},
    {width: 16 / 1.75, height: 40 / 2, image: 'images/RampD.png', distance: 4, climb: 1, reaction: 2, laneRestrictions: 3},
]

// GAME OBJECTS
let player = null;
let playerShadow = null;
let ground = null;
let finishLine = null;
let startingMark = null
let finishTimeout = null;
let timer = null;
let gasIndicator = null;
let startingLight = null;
// let grass = null;
// let crowd = null;
let backgroundCity = null;
let backgroundBlock = null;
let obstaclePotholeController = null;
let obstacleRampController = null;
//
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
let countdown = false;
let countdownActive = false;

let timerStop = true;

let countdownNum = 3;

var milliInt;
var secInt;
var minInt;

var millisecond = 0;
var second = 0;
var minute = 0;

let availableGas = STARTING_GAS;

// SCREEN
function setScreen() {
    scaleRatio = getScaleRatio();
    canvas.width = (GAME_WIDTH * scaleRatio).toFixed(0)
    canvas.height = (GAME_HEIGHT * scaleRatio).toFixed(0)
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

    const backgroundCityWidthInGame = BACKGROUND_CITY_WIDTH * scaleRatio;
    const backgroundCityHeightInGame = BACKGROUND_CITY_HEIGHT * scaleRatio;
    const backgroundBlockWidthInGame = BACKGROUND_BLOCK_WIDTH * scaleRatio;
    const backgroundBlockHeightInGame = BACKGROUND_BLOCK_HEIGHT * scaleRatio;

    const groundWidthInGame = GROUND_WIDTH * scaleRatio;
    const groundHeightInGame = GROUND_HEIGHT * scaleRatio;
    const startingMarkWidthInGame = STARTING_MARK_WIDTH * scaleRatio;
    const startingMarkHeightInGame = STARTING_MARK_HEIGHT * scaleRatio;
    const finishWidthInGame = FINISH_WIDTH * scaleRatio;
    const laneHeightInGame = LANE_HEIGHT * scaleRatio;
    const curbHeightInGame = CURB_HEIGHT * scaleRatio + canvas.height / 16;

    player = new Player(ctx, playerWidthInGame, playerHeightInGame, minJumpHeightInGame, maxJumpHeightInGame, scaleRatio, gameSpeed, GAME_SPEED_START, GAME_SPEED_MAX, laneHeightInGame, curbHeightInGame, start, availableGas)
    playerShadow = new PlayerShadow(ctx, shadowWidthInGame, shadowHeightInGame, scaleRatio);
    // grass = new Grass(ctx, canvas.width, canvas.height, GROUND_OBSTACLE_SPEED, scaleRatio, curbHeightInGame);
    // crowd = new Crowd(ctx, crowdWidthInGame, crowdHeightInGame, GROUND_OBSTACLE_SPEED, scaleRatio);
    backgroundCity = new BackgroundCity(ctx, backgroundCityWidthInGame, backgroundCityHeightInGame, GROUND_OBSTACLE_SPEED, scaleRatio);
    backgroundBlock = new BackgroundBlock(ctx, backgroundBlockWidthInGame, backgroundBlockHeightInGame, GROUND_OBSTACLE_SPEED, scaleRatio, groundHeightInGame);
    ground = new Ground(ctx, groundWidthInGame, groundHeightInGame, GROUND_OBSTACLE_SPEED, scaleRatio);
    finishLine = new FinishLine(ctx, finishWidthInGame, groundHeightInGame, GROUND_OBSTACLE_SPEED, scaleRatio, groundWidthInGame, curbHeightInGame)

    startingMark = new StartingMark(ctx, startingMarkWidthInGame, startingMarkHeightInGame, scaleRatio, GROUND_OBSTACLE_SPEED, laneHeightInGame, curbHeightInGame, playerWidthInGame);

    timer = new Timer(ctx, GROUND_OBSTACLE_SPEED, scaleRatio, finish)
    gasIndicator = new Gas(ctx, laneHeightInGame, GROUND_OBSTACLE_SPEED, scaleRatio, MAX_PLAYER_GAS, MIN_GAS, STARTING_GAS, availableGas);
    startingLight = new StartingLight(ctx, gameSpeed, scaleRatio, countdownNum)

    // const obstaclePotholeImages = OBSTACLE_POTHOLE_CONFIG.map(o => {
    //     const image = new Image();
    //     image.src = o.image;
    //     return {
    //         image: image,
    //         width: o.width * scaleRatio,
    //         height: o.height * scaleRatio,
    //     };
    // });

    // obstaclePotholeController = new ObstaclePotholeController(ctx, obstaclePotholeImages, scaleRatio, GROUND_OBSTACLE_SPEED, laneHeightInGame, curbHeightInGame);
   
    const obstacleRampImages = OBSTACLE_RAMP_CONFIG.map(o => {
        const image = new Image();
        image.src = o.image;
        return {
            id: o.id,
            image: image,
            width: o.width * scaleRatio,
            height: o.height * scaleRatio,
            distance: o.distance,
            climb: o.climb,
            reaction: o.reaction,
            laneRestrictions: o.laneRestrictions,
        };
    });

    obstacleRampController = new ObstacleRampController(ctx, obstacleRampImages, scaleRatio, GROUND_OBSTACLE_SPEED,laneHeightInGame, curbHeightInGame);
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

function updateTime(minute, second, millisecond) {

    if (start && !waitingToStart && timerStop) {
        function setMillisecond() {
            millisecond += 1;
            if (millisecond >= 99) millisecond = 0;
            timer.setMillisecond(millisecond)
        }
        function setSecond() {
            if (second > 60) second = 0;
            second += 1
            timer.setSecond(second)
        }
        function setMinute() {
            if (minute > 99) minute = 0;
            minute += 1
            timer.setMinute(minute)
        }

        timerStop = false;

        milliInt = setInterval(setMillisecond, 10)
        secInt = setInterval(setSecond, 1000)
        minInt = setInterval(setMinute, 60000)
    }   
}

function showStartGame() {
    let fontSize = 22 * scaleRatio;
    ctx.font = `${fontSize}px "bayard-regular"`;
    // FIND A BETTER WAY TO CENTER THIS
    let x = canvas.width / 3.25;
    let y = canvas.height / 1.14;
    ctx.fillStyle = "#000000";
    ctx.fillText("TAP SCREEN OR PRESS SPACE TO START", x, y);
}

function countDown(num) {
        let fontSize = 50 * scaleRatio;
        ctx.font = `${fontSize}px "bayard-regular"`;
        // FIND A BETTER WAY TO CENTER THIS
        let x = canvas.width / 2.45;
        let y = canvas.height / 1.115;
        ctx.fillStyle = "#000000";
        if (num <= 0) {
            ctx.fillText("GAS!", x, y);
        } else {
            ctx.fillText(num, x, y);
        }
}

function startRace() {
    waitingToStart = false;
    countdown = true;
}

function showGameOver() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        let fontSize = 70 * scaleRatio;
        ctx.font = `${fontSize}px "bayard-regular"`;
        // FIND A BETTER WAY TO CENTER THIS
        let x = canvas.width / 3.25;
        let y = canvas.height / 1.75;
        ctx.fillStyle = DEFAULT_COLOR_YELLOW;
        ctx.fillText("GAME OVER", x, y);

        fontSize = 16 * scaleRatio;
        ctx.font = `${fontSize}px "bayard-regular"`;
        x = canvas.width / 2.9;
        y = canvas.height / 1.25;
        ctx.fillText("PRESS ANY BUTTON TO PLAY AGAIN", x, y);

        fontSize = 16 * scaleRatio;
        ctx.font = `${fontSize}px "bayard-regular"`;
        x = canvas.width / 2.9;
        y = canvas.height / 1.5;
        ctx.fillText(timer.timerString, x, y);
}

function restartGameSetup() {
    if (!hasAddEventListenersForRestart) {
        hasAddEventListenersForRestart = true;

        setTimeout(() => {
            window.removeEventListener("keyup", startRace, {once: true})
            window.removeEventListener("touchstart", startRace, {once: true})

            window.addEventListener("keyup", reset, {once: true})
            window.addEventListener("touchstart", reset, {once: true})
        }, 1000);
    }
}

function reset() {
    window.addEventListener("keyup", startRace, {once: true})
    window.addEventListener("touchstart", startRace, {once: true})
    ground.reset();
    backgroundCity.reset()
    backgroundBlock.reset();
    // obstaclePotholeController.reset();
    obstacleRampController.reset();

    finishLine.reset();
    player.reset();
    startingMark.reset();
    gasIndicator.reset()
    gameSpeed = GAME_SPEED_START;

    start = false;
    finish = false;
    gameOver = false;
    timerStop = true;
    hasAddEventListenersForRestart = false;
    waitingToStart = true;
    availableGas = STARTING_GAS;
    finishTimeout = null;
    countdownNum = 3;

    timer.reset();
    millisecond = 0;
    second = 0;
    minute = 0;
}

function gameLoop(currentTime) {
    if (previousTime === null) {
        previousTime = currentTime;
        requestAnimationFrame(gameLoop);
        return;
    }
    const frameTimeDelta = currentTime - previousTime;
    previousTime = currentTime;
    availableGas = player.availableGas;
    playerShadow.shadowActive = player.shadowActive;

    clearScreen();
    // COLLIDE CHECK
    //Pothole
    // if (obstaclePotholeController.collideWith(player) && !player.playerOnRamp) {
    //     player.speedUp = false;
    //     if (keyUpPlayer === null && player.keyUpSpeed === false) {
    //         setTimeout(() => {
    //             player.speedUp = true;
    //             keyUpPlayer = null;
    //         }, 500);     
    //     }
    //     keyUpPlayer = 1;
    // }
    // RAMP
    if (obstacleRampController.collideWith(player)) {
        if (!player.jumpInProgress) {
            //
            player.jumpInProgress = true;
            //
            player.obstacleReaction = obstacleRampController.reactionValue;
            player.obstacleClimb = obstacleRampController.climbValue;
            player.obstacleDistance = obstacleRampController.distanceValue;
            player.obstacleHeight = obstacleRampController.heightValue;
            player.obstacleWidth = obstacleRampController.widthValue;
        }
    }
    // UPDATE GAME OBJECTS
    if (start) {
        ground.update(gameSpeed, frameTimeDelta);
        backgroundCity.update(gameSpeed, frameTimeDelta);
        backgroundBlock.update(gameSpeed, frameTimeDelta);

        // obstaclePotholeController.update(gameSpeed, frameTimeDelta);
        obstacleRampController.update(gameSpeed, frameTimeDelta);

        finishLine.update(gameSpeed, frameTimeDelta);

        startingMark.update(gameSpeed, frameTimeDelta);

        updateTime(minute, second, millisecond);
        timer.update();

        updateGameSpeed();
       
        playerShadow.update(player.width, player.height, player.x, player.y, player.startingPositionY, player.laneHeight, player.laneIndex);
        player.update(gameSpeed, frameTimeDelta);
        gasIndicator.update(availableGas)

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
        player.speedUp = true;
        player.finishLine = true;
        ground.update(gameSpeed, frameTimeDelta);
        backgroundCity.update(gameSpeed, frameTimeDelta);
        backgroundBlock.update(gameSpeed, frameTimeDelta);
        finishLine.update(gameSpeed, frameTimeDelta);

        gasIndicator.update(availableGas);
        // obstaclePotholeController.update(gameSpeed, frameTimeDelta);
        obstacleRampController.update(gameSpeed, frameTimeDelta);

        timer.finish = finish;
        clearInterval(milliInt);
        clearInterval(secInt);
        clearInterval(minInt);
        
        // playerShadow.update(player.width, player.height, player.x, player.y, player.startingPositionY, player.laneHeight, player.laneIndex);
        if (!finishTimeout)  {
            finishTimeout = setTimeout(() => {
                gameOver = true;
                restartGameSetup();
            }, 4200)
        }
    };
    // DRAW GAME OBJECTS
    ctx.fillStyle = DEFAULT_BACKGROUND_COLOR;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    backgroundCity.draw();
    backgroundBlock.draw();
    ground.draw();
    finishLine.draw();

    // obstaclePotholeController.draw();
    obstacleRampController.draw();

    startingMark.draw();
    // NEED TO CHANGE THIS TO UPDATE METHOD THAT ACTIVATES ON RAMP VARIABLE - THEN HAVE REGULAR DRAW
    playerShadow.draw();
    // PLAYER ALWAYS DRAW LAST SO ITS OVER ALL OTHER PIXELS
    player.draw();
    timer.draw();
    gasIndicator.draw();
    //
    if (gameOver) {
        showGameOver();
    }
    //
    if (waitingToStart) { 
        showStartGame();
    }
    //
    if (countdown) {
        if (!countdownActive) {
            countdownActive = true;
            const timerInt = setInterval(() => {
            countdownNum--;
            startingMark.updateImage(countdownNum);
                if (countdownNum < 0) {
                clearInterval(timerInt);
                start = true;
                player.waitingToStart = start;
                countdown = false;
                countdownActive = false;
                countdownNum = 3;
                }
            }, 1000)
        }
        countDown(countdownNum);
    }
    //
    requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);

window.addEventListener("keyup", startRace, {once: true})
window.addEventListener("touchstart", startRace, {once: true})