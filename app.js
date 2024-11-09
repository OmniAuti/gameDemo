import Player from "./Player.js";
import Ground from "./Ground.js";
import Crowd from "./Crowd.js";

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const GAME_SPEED_START = .5;

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

// GAME OBJECTS
let player = null;
let ground = null;
let crowd = null;

let scaleRatio = null;
let previousTime = null;
let gameSpeed = GAME_SPEED_START;

function createSprites() {
    const playerWidthInGame = PLAYER_WIDTH * scaleRatio;
    const playerHeightInGame = PLAYER_HEIGHT * scaleRatio;
    const minJumpHeightInGame = MIN_JUMP_HEIGHT * scaleRatio;
    const maxJumpHeightInGame = MAX_JUMP_HEIGHT * scaleRatio;

    const crowdWidthInGame = CROWD_WIDTH * scaleRatio;
    const crowdHeightInGame = CROWD_HEIGHT * scaleRatio;

    const groundWidthInGame = GROUND_WIDTH * scaleRatio;
    const groundHeightInGame = GROUND_HEIGHT * scaleRatio;

    player = new Player(ctx, playerWidthInGame, playerHeightInGame, minJumpHeightInGame, maxJumpHeightInGame, scaleRatio)
    crowd = new Crowd(ctx, crowdWidthInGame, crowdHeightInGame, GROUND_CROWD_OBSTACLE_SPEED, scaleRatio)
    ground = new Ground(ctx, groundWidthInGame, groundHeightInGame, GROUND_CROWD_OBSTACLE_SPEED, scaleRatio)
}

function setScreen() {
    scaleRatio = getScaleRatio();
    canvas.width = GAME_WIDTH * scaleRatio
    canvas.height = GAME_HEIGHT * scaleRatio
    createSprites();
}

setScreen()
window.addEventListener('resize', () => setTimeout(setScreen, 100));

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

function gameLoop(currentTime) {
    if (previousTime === null) {
        previousTime = currentTime;
        requestAnimationFrame(gameLoop);
        return;
    }
    const frameTimeDelta = currentTime - previousTime;
    previousTime = currentTime;

    clearScreen();

    // UPDATE GAME OBJECTS
    // if (!gameOver && !waitingToStart) {
        ground.update(gameSpeed, frameTimeDelta);
        crowd.update(gameSpeed, frameTimeDelta);
        player.update(gameSpeed, frameTimeDelta, scaleRatio);
        // score.update(frameTimeDelta);
        // updateGameSpeed(frameTimeDelta);
    // }

    // DRAW GAME OBJECTS
    ctx.fillStyle = GRASS_COLOR;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ground.draw();
    crowd.draw();
    player.draw();

    requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);