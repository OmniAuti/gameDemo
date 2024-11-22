export default class BackgroundBlock {
    constructor(ctx, width, height, speed, scaleRatio, groundHeight) {
        this.ctx = ctx;
        this.canvas = ctx.canvas;
        // this.width = width;
        this.width = this.canvas.width;
        // this.height = height;
        this.height = this.canvas.height * .4;
        this.speed = speed;
        this.scaleRatio = scaleRatio;
        this.groundHeight = groundHeight;

        this.x = 0;
        this.y = this.canvas.height - this.canvas.height * .4 - this.groundHeight - this.canvas.height / 16;

        this.blockImage = new Image();
        this.blockImage.src = "./images/background_buildings_block.png";
    }

    draw() {

        this.ctx.drawImage(this.blockImage, this.x, this.y, this.width, this.height);

        this.ctx.drawImage(this.blockImage, this.x + this.width, this.y, this.width, this.height);

        if (this.x < -this.width) {
            this.x = 0;
        }
    }

    update(gameSpeed, frameTimeDelta) {
        this.x -= gameSpeed * frameTimeDelta * this.speed * this.scaleRatio;    
    }

    reset() {
        this.x = 0;
    }
}