export default class BackgroundCity {
    constructor(ctx, width, height, speed, scaleRatio) {
        this.ctx = ctx;
        this.canvas = ctx.canvas;
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.scaleRatio = scaleRatio;

        this.x = 0;
        this.y = 0;

        this.cityImage = new Image();
        this.cityImage.src = "./images/background_buildings_city.png";
    }

    draw() {
        this.ctx.drawImage(this.cityImage, this.x, this.y, this.canvas.width * 1.1, this.canvas.height / 1.5);
    }

    update(gameSpeed, frameTimeDelta) {
        this.x -= (gameSpeed * 0.01) * frameTimeDelta * this.speed * this.scaleRatio;
    }

    reset() {
        this.x = 0;
    }
}