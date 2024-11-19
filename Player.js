export default class Player {
    // PLAYER ANIMATION
    MOVE_ANIMATION_TIMER = 20;
    moveAnimationTimer = this.MOVE_ANIMATION_TIMER;
    movingImages = [];
    // RAMP ANIMATION
    playerOnRamp = false;
    jumpInProgress = false;
    falling = false;
    JUMP_SPEED = 0.2;
    GRAVITY = 0.1;
    // MOVEMENT
    moveLeft = false;
    moveRight = false;
    speedUp = false;
    keyUpSpeed = true;
    playerSpeed = 0;
    laneIndex = 0;
    MOVE_SPEED = 0.1;
    SPEED_INCREMENT = 0.01;

    finishLine = false;

    constructor(ctx, width, height, minJumpHeight, maxJumpHeight, scaleRatio, gameSpeed, GAME_SPEED_START, GAME_SPEED_MAX, laneHeightInGame, curbHeightInGame) {

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
        this.laneHeight = laneHeightInGame;
        this.curbHeight = curbHeightInGame;
        this.x = 20 * scaleRatio;
        // this.y = this.canvas.height - this.height - (this.laneHeight * this.laneIndex) * scaleRatio; 
        this.y = this.canvas.height - this.height - this.curbHeight - (this.laneHeight * 1.5); 

        this.startingPositionX = 20 * scaleRatio; 
        this.startingPositionY = this.canvas.height - this.height - this.curbHeight - (this.laneHeight * 1.5); 

        this.playerSpeed = this.gameSpeed;

        const movingImage1 = new Image();
        movingImage1.src = "./images/player_move_1.png";
        const movingImage2 = new Image();
        movingImage2.src = "./images/player_move_2.png";

        this.movingImages.push(movingImage1);
        this.movingImages.push(movingImage2);

        this.straightLaneImage = new Image();
        this.straightLaneImage.src = "./images/player_still.png";
        this.image = this.straightLaneImage;
        
        this.turnUpImage = new Image();
        this.turnUpImage.src = "./images/player_turn_left.png";

        this.turnDownImage = new Image();
        this.turnDownImage.src = "./images/player_turn_right.png";

        // keyboard event
        window.removeEventListener('keydown', this.keydown);
        window.removeEventListener('keyup', this.keyup);

        window.addEventListener('keydown', this.keydown);
        window.addEventListener('keyup', this.keyup);
    }
    // movement
    keydown = (e) => {

        if (this.playerOnRamp) return;

        if (e.code === "ArrowRight") {
            this.speedUp = true;
            this.keyUpSpeed = false;
        } else if (e.code === "ArrowLeft") {
            this.speedUp = false;
            this.keyUpSpeed = false;
        }
        //
        if (this.moveLeft || this.moveRight) return;
        //
        if (e.code === "ArrowUp") {
            if (this.laneIndex >= 3) return;
            this.laneIndex += 1;
            this.moveLeft = true;
        } else if (e.code === "ArrowDown") {
            if (this.laneIndex <= -1) return;
            this.laneIndex -= 1;
            this.moveRight = true;
        } 
    }

    keyup = (e) => {
        if (e.code === "ArrowRight") {
            this.speedUp = false;
            this.keyUpSpeed = true;
        } else if (e.code === "ArrowLeft") {
            this.speedUp = false;
            this.keyUpSpeed = true;
        } else {
            this.keyUpSpeed = false;
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

    update(gameSpeed, frameTimeDelta) {
        // USE THIS STOP CONTROLS AND DO WHEELY
        console.log(this.finishLine)

        this.moving(gameSpeed, frameTimeDelta)
        this.increaseSpeed(frameTimeDelta)
        this.decreaseSpeed(frameTimeDelta)
        
        if (this.moveLeft) {
            this.image = this.turnUpImage;
        } else if (this.moveRight) {
            this.image = this.turnDownImage;
        }  
        //
        this.turn(frameTimeDelta);
        //
        this.jump(frameTimeDelta)
    }
    // CHANGE LANES
    turn(frameTimeDelta) {
        if (this.moveLeft && this.y <= Math.floor(this.startingPositionY - ((this.laneHeight) * this.laneIndex))) {
            this.moveLeft = false;
        }  else if (this.moveRight && this.y >= Math.floor(this.startingPositionY - ((this.laneHeight) * this.laneIndex))) {
            this.moveRight = false;
        }

        if (this.moveLeft && this.y > Math.floor(this.startingPositionY - ((this.laneHeight) * this.laneIndex))) {
            this.y -= this.MOVE_SPEED * frameTimeDelta * this.scaleRatio;
        } else if (this.moveRight && this.y < Math.floor(this.startingPositionY - ((this.laneHeight) * this.laneIndex))) {
            this.y += this.MOVE_SPEED * frameTimeDelta * this.scaleRatio;
        }
    }
    // MOVING ANIMATION
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
    // JUMP

    // NEED TO REDUCE SPEED SLIGHTLY 
    // NEED TO ROTATE
    // HEIGHT BASED ON SPEED 

    handleRamp(frameTimeDelta) {
        // NEED TO REDUCE SPEED SLIGHTLY 
        // NEED TO ROTATE
        // HEIGHT BASED ON SPEED 
    }

    jump(frameTimeDelta) {
        if (this.playerOnRamp) {
            this.jumpInProgress = true;
     
        }

        if (this.jumpInProgress && !this.falling) {
            if (this.y > this.canvas.height - this.minJumpHeight 
                || 
                (this.y > this.canvas.height - this.maxJumpHeight && this.playerOnRamp)) {
                this.y -= this.JUMP_SPEED * frameTimeDelta * this.scaleRatio;
                // this.ctx.rotate(45)
            } else {
                this.falling = true;
            }
        } else if (this.jumpInProgress && this.falling) {
             if (this.y < this.startingPositionY - this.laneHeight * this.laneIndex) {
                this.y += this.GRAVITY * frameTimeDelta * this.scaleRatio;
                if (this.y + this.height > this.canvas.height) {
                    this.y = this.startingPositionY - this.laneHeight * this.laneIndex;
                }
             } else {
                this.falling = false;
                this.jumpInProgress = false;
                this.playerOnRamp = false;
             }
        }
    }

    draw() {
        this.ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }

    reset() {
        this.x = this.startingPositionX
        this.y = this.startingPositionY 
    }
}