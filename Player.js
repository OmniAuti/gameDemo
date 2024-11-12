import ObstacleController from "./ObstacleController.js";

export default class Player {

    MOVE_ANIMATION_TIMER = 20;
    moveAnimationTimer = this.MOVE_ANIMATION_TIMER;
    movingImages = [];

    moveLeft = false;
    moveRight = false;
    speedUp = false;
    playerSpeed = 0;
    laneIndex = 0;
    MOVE_SPEED = 0.1;
    SPEED_INCREMENT = 0.01;

    constructor(ctx, width, height, minJumpHeight, maxJumpHeight, scaleRatio, gameSpeed, GAME_SPEED_START, GAME_SPEED_MAX) {

        this.ctx = ctx;
        this.canvas = ctx.canvas;
        this.width = width;
        this.height = height;
        this.minJumpHeight = minJumpHeight;
        this.maxJumpHeight = maxJumpHeight;
        this.scaleRatio = scaleRatio;
        this.gameSpeed = gameSpeed;
        this.GAME_SPEED_START = GAME_SPEED_START;
        this.GAME_SPEED_MAX = GAME_SPEED_MAX;

        this.x = 20 * scaleRatio;
        this.y = this.canvas.height - this.height - 20 * scaleRatio; 

        this.startingPositionX = 20 * scaleRatio; 
        this.startingPositionY = this.canvas.height - this.height - 20 * scaleRatio; 
        this.laneHeight = this.canvas.height * .07;

        this.playerSpeed = this.gameSpeed;

        const movingImage1 = new Image();
        movingImage1.src = "./images/player_move_1.png";
        const movingImage2 = new Image();
        movingImage2.src = "./images/player_move_2.png";

        this.movingImages.push(movingImage1);
        this.movingImages.push(movingImage2);

        this.straightLaneImage = new Image();
        this.straightLaneImage.src = "./images/RedBike.png";
        this.image = this.straightLaneImage;
        

        this.turnUpImage = new Image();
        this.turnUpImage.src = "./images/RedBikeTurnLeft.png";

        this.turnDownImage = new Image();
        this.turnDownImage.src = "./images/RedBikeTurnRight.png";

        // keyboard event
        window.removeEventListener('keydown', this.keydown);
        window.removeEventListener('keyup', this.keyup);

        window.addEventListener('keydown', this.keydown);
        window.addEventListener('keyup', this.keyup);
    }
    // movement
    keydown = (e) => {

        if (e.code === "ArrowRight") {
            this.speedUp = true;
        } else if (e.code === "ArrowLeft") {
            this.speedUp = false;
        }
        //
        if (this.moveLeft || this.moveRight) return;
        //
        if (e.code === "ArrowUp") {
            if (this.laneIndex >= 3) return;
            this.moveLeft = true;
            this.laneIndex += 1;
        } else if (e.code === "ArrowDown") {
            if (this.laneIndex <= 0) return;
            this.moveRight = true;
            this.laneIndex -= 1;
        } 
    }

    keyup = (e) => {
        if (e.code === "ArrowRight") {
            this.speedUp = false;
        } else if (e.code === "ArrowLeft") {
            this.speedUp = false;
        }
    }

    increaseSpeed(frameTimeDelta) {
        if (this.speedUp === true && this.x < this.canvas.width * .25) {
            // SPEED_INCREMENT
            this.x += this.MOVE_SPEED * frameTimeDelta * this.scaleRatio;
            if (this.gameSpeed < this.GAME_SPEED_MAX) {
                this.playerSpeed = this.gameSpeed += this.SPEED_INCREMENT;
            }
        }
    }

    decreaseSpeed(frameTimeDelta) {
        if (this.speedUp === false && this.x > 20) {
            this.x -= this.MOVE_SPEED * frameTimeDelta * this.scaleRatio;
            if (this.gameSpeed > this.GAME_SPEED_START) {
                this.playerSpeed = this.gameSpeed -= this.SPEED_INCREMENT;
            }
        }
    }

    draw() {
        this.ctx.drawImage(this.image, this.x, this.y, this.width, this.height)
    }

    update(gameSpeed, frameTimeDelta) {

        this.moving(gameSpeed, frameTimeDelta)
        this.increaseSpeed(frameTimeDelta)
        this.decreaseSpeed(frameTimeDelta)

        if (this.moveLeft) {
            this.image = this.turnUpImage;
        } else if (this.moveRight) {
            this.image = this.turnDownImage;
        }  

        this.turn(frameTimeDelta);
    }

    turn(frameTimeDelta) {
        if (this.moveLeft && this.y <= Math.ceil(this.startingPositionY - this.laneHeight * this.laneIndex)) {
            this.moveLeft = false;
        }  else if (this.moveRight && this.y >= Math.floor(this.startingPositionY - this.laneHeight * this.laneIndex)) {
            this.moveRight = false;
        }

        if (this.moveLeft && this.y > this.startingPositionY - this.laneHeight * this.laneIndex) {
            this.y -= this.MOVE_SPEED * frameTimeDelta * this.scaleRatio;
        } else if (this.moveRight && this.y < this.startingPositionY - this.laneHeight * this.laneIndex) {
            this.y += this.MOVE_SPEED * frameTimeDelta * this.scaleRatio;
        }
    }

    moving(gameSpeed, frameTimeDelta) {
        if (this.moveAnimationTimer <= 0) {
            if (this.image === this.movingImages[0]) {
                this.image = this.movingImages[1]
            } else {
                this.image = this.movingImages[0]
            }
            this.moveAnimationTimer = this.MOVE_ANIMATION_TIMER;
        }
        this.moveAnimationTimer -= frameTimeDelta * gameSpeed;
    }
}