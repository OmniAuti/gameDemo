export default class Player {


    MOVE_ANIMATION_TIMER = 20;
    moveAnimationTimer = this.MOVE_ANIMATION_TIMER;
    movingImages = [];

    moveUp = false;
    moveDown = false;
    laneIndex = 0;
    MOVE_SPEED = 0.1;

    constructor(ctx, width, height, minJumpHeight, maxJumpHeight, scaleRatio) {

        this.ctx = ctx;
        this.canvas = ctx.canvas;
        this.width = width;
        this.height = height;
        this.minJumpHeight = minJumpHeight;
        this.maxJumpHeight = maxJumpHeight;
        this.scaleRatio = scaleRatio;

        this.x = 10 * scaleRatio;
        this.y = this.canvas.height - this.height - 20 * scaleRatio; 

        this.startingPosition = this.canvas.height - this.height - 20 * scaleRatio; 
        this.laneHeight = this.canvas.height * .07;

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
        if (this.moveUp || this.moveDown) return;
        //
        if (e.code === "ArrowUp") {
            if (this.laneIndex >= 3) return;
            this.moveUp = true;
            this.laneIndex += 1;
        } else if (e.code === "ArrowDown") {
            if (this.laneIndex <= 0) return;
            this.moveDown = true;
            this.laneIndex -= 1;
        }
    }

    // keyup = (e) => {
    //     if (e.code === "ArrowUp") {
    //             this.moveUp = false;
    //     } else if (e.code === "ArrowDown") {
    //             this.moveDown = false;
    //     }
    // }

    draw() {
        this.ctx.drawImage(this.image, this.x, this.y, this.width, this.height)
    }

    update(gameSpeed, frameTimeDelta) {
        this.moving(gameSpeed, frameTimeDelta)

        if (this.moveUp) {
            this.image = this.turnUpImage;
        } else if (this.moveDown) {
            this.image = this.turnDownImage;
        }  

        this.turn(frameTimeDelta);
    }

    turn(frameTimeDelta) {
        if (this.moveUp && this.y <= Math.ceil(this.startingPosition - this.laneHeight * this.laneIndex)) {
            this.moveUp = false;
        }  else if (this.moveDown && this.y >= Math.floor(this.startingPosition - this.laneHeight * this.laneIndex)) {
            this.moveDown = false;
        }

        if (this.moveUp && this.y > this.startingPosition - this.laneHeight * this.laneIndex) {
            this.y -= this.MOVE_SPEED * frameTimeDelta * this.scaleRatio;
        } else if (this.moveDown && this.y < this.startingPosition - this.laneHeight * this.laneIndex) {
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