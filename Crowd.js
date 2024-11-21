export default class Crowd {
    constructor(ctx, width, height, speed, scaleRatio) {
        this.ctx = ctx;
        this.canvas = ctx.canvas;
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.scaleRatio = scaleRatio;

        this.x = 0;
        this.y = 0;

        this.crowdImage = new Image();
        this.crowdImage.src = "./images/crowd.png";
    }

    draw() {
        this.ctx.drawImage(this.crowdImage, this.x, this.y, this.width, this.height);

        this.ctx.drawImage(this.crowdImage, this.x + this.width, this.y, this.width, this.height);

        if (this.x < -this.width) {
            this.x = 0;
        }
    }

    update(gameSpeed, frameTimeDelta) {
        this.x -= (gameSpeed * 0.95) * frameTimeDelta * this.speed * this.scaleRatio;
    }

    reset() {
        this.x = 0;
    }
}