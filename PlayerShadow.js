export default class PlayerShadow {

    MOVE_SPEED = 0.1;
    SPEED_INCREMENT = 0.01;

    shadowActive = false;
    shadowImages = [];

    constructor(ctx, width, height, scaleRatio) {

        this.ctx = ctx;
        this.canvas = ctx.canvas;
        this.width = width;
        this.height = height;
        this.scaleRatio = scaleRatio;

        this.x = 20 * scaleRatio;
        this.y = this.canvas.height - this.height - 20 * scaleRatio; 

        this.startingPositionX = 20 * scaleRatio; 
        this.startingPositionY = this.canvas.height - this.height - 20 * scaleRatio; 
        this.laneHeight = this.canvas.height * .07;

        this.playerSpeed = this.gameSpeed;

        const bikeShadowActive = new Image();
        bikeShadowActive.src = "./images/Player_Shadow.png";
        const bikeShadowNone = new Image();
        bikeShadowNone.src = "./images/Player_Shadow_None.png";
        this.shadowImages.push(bikeShadowActive);
        this.shadowImages.push(bikeShadowNone);

        this.image = bikeShadowActive;
    }

    update(playerWidth, playerHeight, playerX, playerY, playerStartingPosition, laneHeight, laneIndex) {
        this.y = (playerStartingPosition + playerHeight - this.height / 1.75) - laneHeight * laneIndex;
        this.x = playerWidth / 4 + playerX;
        let size = (this.y - playerY) / 100;

        
    }

    draw() {
        if (this.shadowActive) {
            this.image = this.shadowImages[0];
        } else {
            this.image = this.shadowImages[1];
        }

        this.ctx.drawImage(this.image, this.x, this.y, this.width, this.height);

    }
}