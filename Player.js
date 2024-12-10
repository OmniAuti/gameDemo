export default class Player {
    // PLAYER ANIMATION
    MOVE_ANIMATION_TIMER = 20;
    moveAnimationTimer = this.MOVE_ANIMATION_TIMER;
    WHEELIE_ANIMATION_TIMER = 500;
    wheelieAnimationTimer = this.WHEELIE_ANIMATION_TIMER;
    INCLINE_ANIMATION_TIMER = 0;
    inclineAnimationTimer = this.INCLINE_ANIMATION_TIMER;
    JUMP_ANIMATION_TIMER = 20;
    jumpAnimationTimer = this.JUMP_ANIMATION_TIMER
    movingImages = [];
    inclineImages = [];
    // RAMP ANIMATION
    jumpInProgress = false;
    falling = false;
    JUMP_SPEED = 0.11;
    GRAVITY = 0.15;
    // MOVEMENT
    moveLeft = false;
    moveRight = false;
    speedUp = false;
    keyUpSpeed = true;
    playerSpeed = 0;
    laneIndex = 0;
    MOVE_SPEED = 0.1;
    SPEED_INCREMENT = 0.01;
    // WHEELIE
    playerWheelie = false;
    playerWheelieUp = false;
    playerwheelieDown = false;
    playerResetAfterWheelie = false;
    // FINISH
    finishLine = false;
    // OBSTACLE VARIABLES
    obstacleReaction = null;
    obstacleClimb = null;
    obstacleDistance = null;
    obstacleHeight = null;
    obstacleWidth = null;
    // JUMP
    jumpPlayerSpeedVariable = null;
    jumpHeightVariable = null;
    jumpDistanceVariable = null;
    jumpGravityVariable = null;
    maxHeightVariable = null;
    maxWheelie = null;
    // INCLINE JUMP
    incline = false;
    inclineReverse = false;
    setJumpVar = false;
    // CONSTRUCTOR
    constructor(ctx, width, height, minJumpHeight, maxJumpHeight, scaleRatio, gameSpeed, GAME_SPEED_START, GAME_SPEED_MAX, laneHeightInGame, curbHeightInGame, waitingToStart, availableGas) {

        this.ctx = ctx;
        this.canvas = ctx.canvas;
        this.width = width;
        this.height = height;
        this.minJumpHeight = minJumpHeight / 1.25;
        this.maxJumpHeight = maxJumpHeight / 1.25;
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
        //
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
    // MOVEMENT
    keydown = (e) => {
        if (this.finishLine) return;
        if (this.jumpInProgress) return; 
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
    //
    keyup = (e) => {
        if (this.finishLine) return;
        if (this.jumpInProgress) return; 
        if (!this.waitingToStart) return;
        // WHEELIE
        if (e.code === "Space" && this.availableGas > 0) {
            this.playerWheelie = false;
            this.wheelieAnimationTimer = this.WHEELIE_ANIMATION_TIMER;
            this.playerwheelieDown = true;
            this.playerResetAfterWheelie = true;
        }
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
    // SPEED FUNCTIONS
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
    // SPEED FUNCTIONS
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
    // WHEELIES
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
    jump(gameSpeed, frameTimeDelta) {
        // JUMP VARIABLES
        if (!this.setJumpVar) {
            this.incline = true;
            this.jumpPlayerSpeedVariable = this.playerSpeed / 12.5;
            this.jumpHeightVariable = (((this.maxJumpHeight / this.obstacleReaction) + this.maxJumpHeight) * this.jumpPlayerSpeedVariable);
            this.jumpDistanceVariable = this.JUMP_SPEED + (this.obstacleDistance / 100) + this.jumpPlayerSpeedVariable;
            this.jumpGravityVariable = this.GRAVITY + (this.obstacleDistance / 100) - this.jumpPlayerSpeedVariable;
            this.maxHeightVariable = this.maxJumpHeight + (this.jumpHeightVariable * this.obstacleReaction);
            this.maxIncline = this.obstacleClimb * 100;
            this.setJumpVar = true;
            this.shadowActive = true;
            this.image = this.straightLaneImage;
        }
        // JUMP CALCULATIONS
        if (this.jumpInProgress && !this.falling) {
            if (this.y > this.canvas.height - this.minJumpHeight || (this.y > this.canvas.height - this.maxHeightVariable && this.jumpInProgress)) {
                this.y -= this.jumpDistanceVariable * frameTimeDelta * this.scaleRatio;
                    if (this.inclineAnimationTimer > 0 && this.incline) {
                        if (this.inclineAnimationTimer <= 100 && this.inclineAnimationTimer > 0 && this.inclineAnimationTimer <= this.maxIncline) {
                            this.image = this.inclineImages[0]
                        } else if (this.inclineAnimationTimer <= 200 && this.inclineAnimationTimer > 100 && this.inclineAnimationTimer <= this.maxIncline) {
                            this.image = this.inclineImages[1]
                        } else if (this.inclineAnimationTimer <= 300 && this.inclineAnimationTimer > 200 && this.inclineAnimationTimer <= this.maxIncline) {
                            this.image = this.inclineImages[2]
                        } else if (this.inclineAnimationTimer <= 400 && this.inclineAnimationTimer >= 300 && this.inclineAnimationTimer <= this.maxIncline) {
                            this.image = this.inclineImages[3]
                        }
                        this.inclineAnimationTimer += frameTimeDelta * gameSpeed * 3;
                }
            } else {
                this.falling = true;
                this.wheelsDown = true;
                this.inclineAnimationTimer = this.maxIncline;
                this.inclineReverse = true;
                this.incline = false;
            }
        // FALLING CALCULATIONS
        } else if (this.jumpInProgress && this.falling) {
             if (this.y < this.startingPositionY - this.laneHeight * this.laneIndex) {
                this.y += this.jumpGravityVariable * frameTimeDelta * this.scaleRatio;
                if (this.inclineAnimationTimer > 0 && this.inclineReverse) {
                    if (this.inclineAnimationTimer <= 400 && this.inclineAnimationTimer > 300) {
                        this.image = this.inclineImages[3]
                    } else if (this.inclineAnimationTimer <= 300 && this.inclineAnimationTimer > 200) {
                        this.image = this.inclineImages[2]
                    } else if (this.inclineAnimationTimer <= 200 && this.inclineAnimationTimer > 100) {
                        this.image = this.inclineImages[1]
                    } else if (this.inclineAnimationTimer <= 100 && this.inclineAnimationTimer >= 0) {
                        this.image = this.inclineImages[0]
                    }
                    this.inclineAnimationTimer -= frameTimeDelta * gameSpeed * 3;
                }
                if (this.y + this.height > this.canvas.height) {
                    this.y = this.startingPositionY - this.laneHeight * this.laneIndex;
                }
             } else {
                this.falling = false;
                this.jumpInProgress = false;
                this.setJumpVar = false;
                this.inclineAnimationTimer = 0;
                this.incline = false;
                this.inclineReverse = false;
                this.shadowActive = false;
             }
        }
    }
    // UPDATE
    update(gameSpeed, frameTimeDelta) {
        // TURNING
        if (this.moveLeft) {
            this.image = this.turnUpImage;
        } else if (this.moveRight) {
            this.image = this.turnDownImage;
        }  
        this.turn(frameTimeDelta);
        // JUMP
        if (this.finishLine) {
            this.image = this.wheelieImage;  
            this.shadowActive = false;
        } else if (this.jumpInProgress) {
            this.jump(gameSpeed, frameTimeDelta);
            this.image = this.straightLaneImage;
        } else if (!this.jumpInProgress && !this.falling && !this.playerWheelie && !this.playerwheelieDown) {
            this.moving(gameSpeed, frameTimeDelta);
        } else if (this.playerWheelie && !this.falling) {
            this.wheelieUp(gameSpeed, frameTimeDelta);
        } else if (this.playerwheelieDown && !this.playerWheelie && !this.falling) {
            this.wheelieDown(gameSpeed, frameTimeDelta);
        }
        // SPEED
        this.increaseSpeed(frameTimeDelta);
        this.decreaseSpeed(frameTimeDelta);
        // GAS
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
    }
    // DRAW
    draw() {
        this.ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
    // RESET
    reset() {
        this.playerSpeed = this.GAME_SPEED_START;
        this.finishLine = false;
        this.x = this.startingPositionX
        this.y = this.startingPositionY 
        this.image = this.straightLaneImage;
        this.laneIndex = 0;
        this.keyUpSpeed = true;
        // RAMP ANIMATION
        this.jumpInProgress = false;
        this.falling = false;
        // MOVEMENT
        this.moveLeft = false;
        this.moveRight = false;
        this.speedUp = false;
        this.playerSpeed = this.GAME_SPEED_START;
        // WHEELIE
        this.availableGas = 0.075;
        this.playerWheelie = false;
        this.playerWheelieUp = false;
        this.playerwheelieDown = false;
        this.playerResetAfterWheelie = false;
        this.waitingToStart = true;
        //
        this.inclineAnimationTimer = 0;
        // RAMP VARIABLES
        this.obstacleReaction = null;
        this.obstacleClimb = null;
        this.obstacleDistance = null;
        this.obstacleHeight = null;
        this.obstacleWidth = null;
        // JUMP VARIABLES
        this.jumpPlayerSpeedVariable = null;
        this.jumpHeightVariable = null;
        this.jumpDistanceVariable = null;
        this.jumpGravityVariable = null;
        this.maxHeightVariable = null;
        this.maxWheelie = null;
        //
        this.setJumpVar = false;
    }
}