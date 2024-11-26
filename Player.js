export default class Player {
    // PLAYER ANIMATION
    MOVE_ANIMATION_TIMER = 20;
    moveAnimationTimer = this.MOVE_ANIMATION_TIMER;
    WHEELIE_ANIMATION_TIMER = 500;
    wheelieAnimationTimer = this.WHEELIE_ANIMATION_TIMER;
    JUMP_ANIMATION_TIMER = 20;
    jumpAnimationTimer = this.JUMP_ANIMATION_TIMER
    movingImages = [];
    inclineImages = [];
    // RAMP ANIMATION
    playerOnRamp = false;
    playerRampReaction = 0;
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

    playerWheelie = false;
    playerWheelieUp = false;
    playerwheelieDown = false;
    playerResetAfterWheelie = false;

    finishLine = false;

    constructor(ctx, width, height, minJumpHeight, maxJumpHeight, scaleRatio, gameSpeed, GAME_SPEED_START, GAME_SPEED_MAX, laneHeightInGame, curbHeightInGame, waitingToStart, availableGas) {

        this.ctx = ctx;
        this.canvas = ctx.canvas;
        this.width = width;
        this.height = height;
        this.minJumpHeight = minJumpHeight / 1.5;
        this.maxJumpHeight = maxJumpHeight / 1.5;
        this.scaleRatio = scaleRatio;
        this.gameSpeed = gameSpeed;
        this.GAME_SPEED_START = GAME_SPEED_START;
        this.GAME_SPEED_MAX = GAME_SPEED_MAX;
        this.GAME_SPEED_GAS = GAME_SPEED_MAX * 1.5;
        this.laneHeight = laneHeightInGame;
        this.curbHeight = curbHeightInGame;
        this.waitingToStart = waitingToStart;
        this.x = 20 * scaleRatio;
        // this.y = this.canvas.height - this.height - (this.laneHeight * this.laneIndex) * scaleRatio; 
        this.y = this.canvas.height - this.height - this.curbHeight - (this.laneHeight * 1.5); 
        this.startingPositionX = 20 * scaleRatio; 
        this.startingPositionY = this.canvas.height - this.height - this.curbHeight - (this.laneHeight * 1.5); 
        //
        this.playerSpeed = this.gameSpeed;
        //
        this.availableGas = availableGas;
        //
        const movingImage1 = new Image();
        movingImage1.src = "./images/player_move_1.png";
        const movingImage2 = new Image();
        movingImage2.src = "./images/player_move_2.png";

        this.movingImages.push(movingImage1);
        this.movingImages.push(movingImage2);
        //
        const inclineA = new Image();
        inclineA.src = "./images/player_InclineA.png";
        this.inclineImages.push(inclineA);
        const inclineB = new Image();
        inclineB.src = "./images/player_InclineB.png";
        this.inclineImages.push(inclineB);
        const inclineC = new Image();
        inclineC.src = "./images/player_InclineC.png";
        this.inclineImages.push(inclineC);
        const inclineD = new Image();
        inclineD.src = "./images/player_InclineD.png";
        this.inclineImages.push(inclineD);

        this.straightLaneImage = new Image();
        this.straightLaneImage.src = "./images/player_still.png";
        this.image = this.straightLaneImage;
        //
        this.turnUpImage = new Image();
        this.turnUpImage.src = "./images/player_turn_left.png";

        this.turnDownImage = new Image();
        this.turnDownImage.src = "./images/player_turn_right.png";
        //
        this.wheelieImage = new Image();
        this.wheelieImage.src = "./images/Wheelie.png";
        //
        // keyboard event
        window.removeEventListener('keydown', this.keydown);
        window.removeEventListener('keyup', this.keyup);

        window.addEventListener('keydown', this.keydown);
        window.addEventListener('keyup', this.keyup);
    }
    // movement
    keydown = (e) => {
        if (this.finishLine) return;
        if (this.playerOnRamp) return; 
        if (!this.waitingToStart) return;

        // WHEELIE
        if (e.code === "Space" && this.availableGas > 0 && !this.playerWheelie && this.speedUp) {
            this.playerWheelie = true;
            this.playerwheelieDown = false;

        } else if (this.availableGas <= 0 && !this.playerWheelie) {
            this.playerWheelie = false;
            this.playerwheelieDown = false;
            this.playerResetAfterWheelie = false;
        }

        if (this.playerWheelie || this.playerwheelieDown) return; 
        // TURNING
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
        if (this.finishLine) return;
        if (this.playerOnRamp) return; 
        if (!this.waitingToStart) return;

        // WHEELIE
        if (e.code === "Space" && this.availableGas > 0) {
            this.playerWheelie = false;
            this.wheelieAnimationTimer = this.WHEELIE_ANIMATION_TIMER;
            this.playerwheelieDown = true;
            this.playerResetAfterWheelie = true;
        }

        // if (this.playerWheelie || this.playerwheelieDown) return; 
        // TURNING
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
        if (this.finishLine) return;
        if (this.speedUp === true && this.x < this.canvas.width * .25) {
            // SPEED_INCREMENT
            this.x += this.MOVE_SPEED * frameTimeDelta * this.scaleRatio;
            if (this.gameSpeed < this.GAME_SPEED_MAX) {
                this.playerSpeed = this.gameSpeed += this.SPEED_INCREMENT;
            }
        } else if (this.playerWheelie === true && this.x < this.canvas.width * .5) {
            // SPEED_INCREMENT
            this.x += this.MOVE_SPEED * frameTimeDelta * this.scaleRatio;
            if (this.gameSpeed < this.GAME_SPEED_GAS) {
                this.playerSpeed = this.gameSpeed += this.SPEED_INCREMENT;
            }
        }
    }
    //
    decreaseSpeed(frameTimeDelta) {
        if (this.finishLine) return;

        if (!this.playerResetAfterWheelie && this.speedUp === false && this.x > 20) {
            this.x -= this.MOVE_SPEED * frameTimeDelta * this.scaleRatio;
            if (this.gameSpeed > this.GAME_SPEED_START) {
                this.playerSpeed = this.gameSpeed -= this.SPEED_INCREMENT;
            }
        } else if (this.playerResetAfterWheelie && this.speedUp === true && this.x > this.canvas.width * .25) {
            this.x -= this.MOVE_SPEED * frameTimeDelta * this.scaleRatio;
            if (this.gameSpeed > this.GAME_SPEED_MAX) {
                this.playerSpeed = this.gameSpeed -= this.SPEED_INCREMENT;
            }
            if (this.playerResetAfterWheelie && this.x <= this.canvas.width * .25 && this.gameSpeed <= this.GAME_SPEED_MAX){
                this.playerResetAfterWheelie = false;
            }
        } else if (this.speedUp === false && this.x > 20) {
            this.x -= this.MOVE_SPEED * frameTimeDelta * this.scaleRatio;
            if (this.gameSpeed > this.GAME_SPEED_START) {
                this.playerSpeed = this.gameSpeed -= this.SPEED_INCREMENT;
            }
        }
    }
    //
    update(gameSpeed, frameTimeDelta) {
        // USE THIS STOP CONTROLS AND DO WHEELY - Also controls sprite image
        if (this.finishLine) {
            this.image = this.wheelieImage;        
        } else if (this.playerOnRamp || this.jumpInProgress) {
            this.handleRamp(gameSpeed, frameTimeDelta);
        } else if (!this.jumpInProgress && !this.falling && !this.playerWheelie && !this.playerwheelieDown) {
            this.moving(gameSpeed, frameTimeDelta);
        } else if (this.playerWheelie && !this.falling) {
            this.wheelieUp(gameSpeed, frameTimeDelta);
        } else if (this.playerwheelieDown && !this.playerWheelie && !this.falling) {
            this.wheelieDown(gameSpeed, frameTimeDelta);
        }
        
        this.increaseSpeed(frameTimeDelta)
        this.decreaseSpeed(frameTimeDelta)
        

        if (this.availableGas > 0 && this.playerWheelie && this.speedUp) {
            this.availableGas -=  .0005;
            if (this.availableGas <= 0 && this.playerWheelie) {
                this.speedUp = false;
                this.keyUpSpeed = true;
                this.playerWheelie = false;
                this.wheelieAnimationTimer = this.WHEELIE_ANIMATION_TIMER;
                this.playerwheelieDown = true;
                this.playerResetAfterWheelie = true;
            }
        }

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
        if (this.finishLine) return;

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
        this.moveAnimationTimer -= frameTimeDelta * gameSpeed / 1.5;
    }
    //
    wheelieUp(gameSpeed, frameTimeDelta) {
        if (this.finishLine) return;

        if (this.wheelieAnimationTimer > 0) {
            if (this.wheelieAnimationTimer <= 500 && this.wheelieAnimationTimer > 400) {
                this.image = this.inclineImages[0]
            } else if (this.wheelieAnimationTimer <= 400 && this.wheelieAnimationTimer > 300) {
                this.image = this.inclineImages[1]
            } else if (this.wheelieAnimationTimer <= 300 && this.wheelieAnimationTimer > 200) {
                this.image = this.inclineImages[2]
            } else if (this.wheelieAnimationTimer <= 200 && this.wheelieAnimationTimer > 100) {
                this.image = this.inclineImages[3]
            } else if (this.wheelieAnimationTimer <= 100) {
                // TRIGGER LOWERING OF WHEELIE
            }
            this.wheelieAnimationTimer -= frameTimeDelta * gameSpeed * 4;
        }
    }
    //
    wheelieDown(gameSpeed, frameTimeDelta) {
        if (this.wheelieAnimationTimer > 0) {
            if (this.wheelieAnimationTimer <= 500 && this.wheelieAnimationTimer > 400) {
                this.image = this.inclineImages[3]
            } else if (this.wheelieAnimationTimer <= 400 && this.wheelieAnimationTimer > 300) {
                this.image = this.inclineImages[2]
            } else if (this.wheelieAnimationTimer <= 300 && this.wheelieAnimationTimer > 200) {
                this.image = this.inclineImages[1]
            } else if (this.wheelieAnimationTimer <= 200 && this.wheelieAnimationTimer > 100) {
                this.image = this.inclineImages[0]
            } else if (this.wheelieAnimationTimer <= 100) {
                // TRIGGER LOWERING OF WHEELIE
                this.playerwheelieDown = false;
                this.wheelieAnimationTimer = this.WHEELIE_ANIMATION_TIMER;
            }
            this.wheelieAnimationTimer -= frameTimeDelta * gameSpeed * 4;
        } 
    }
    // JUMP

    // NEED TO REDUCE SPEED SLIGHTLY 
    // NEED TO ROTATE
    // HEIGHT BASED ON SPEED 

    handleRamp(gameSpeed, frameTimeDelta) {
        // NEED TO REDUCE SPEED SLIGHTLY 
        // NEED TO ROTATE
        // HEIGHT BASED ON SPEED 

        // this.image = this.wheelieImage;    {
            this.playerWheelie = false;
            this.playerWheelieUp = false;
            this.playerwheelieDown = false;
            this.image = this.inclineImages[0]
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
        this.playerSpeed = this.GAME_SPEED_START;
        this.finishLine = false;
        this.x = this.startingPositionX
        this.y = this.startingPositionY 
        this.image = this.straightLaneImage;
        this.laneIndex = 0;
        this.keyUpSpeed = true;

        // RAMP ANIMATION
        this.playerOnRamp = false;
        this.playerRampReaction = 0;
        this.jumpInProgress = false;
        this.falling = false;
    
        // MOVEMENT
        this.moveLeft = false;
        this.moveRight = false;
        this.speedUp = false;
        this.playerSpeed = this.GAME_SPEED_START;
        // WHEELIE
        this.availableGas = 0.75;
        this.playerWheelie = false;
        this.playerWheelieUp = false;
        this.playerwheelieDown = false;
        this.playerResetAfterWheelie = false;
        this.waitingToStart = true;
    }
}