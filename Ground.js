export default class Ground {
    constructor(ctx, width, height, speed, scaleRatio) {
        this.ctx = ctx;
        this.canvas = ctx.canvas;
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.scaleRatio = scaleRatio;

        this.x = 0;
        this.y = this.canvas.height - this.height - this.canvas.height / 16;

        this.groundImage = new Image();
        this.groundImage.src = "./images/street_texture.png";
    }

    draw() {
        this.ctx.drawImage(this.groundImage, this.x, this.y, this.width, this.height);
    }

    update(gameSpeed, frameTimeDelta) {
        this.x -= gameSpeed * frameTimeDelta * this.speed * this.scaleRatio;
    }

    reset() {
        this.x = 0;
    }
}