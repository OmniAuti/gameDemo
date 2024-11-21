export default class FinishLine {
    constructor(ctx, width, height, speed, scaleRatio, trackLength, curbHeightInGame) {
        this.ctx = ctx;
        this.canvas = ctx.canvas;
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.scaleRatio = scaleRatio;
        this.trackLength = trackLength;
        this.curbHeightInGame = curbHeightInGame;

        this.x = this.trackLength - 2;
        this.y = this.canvas.height - this.height - this.canvas.height / 16;

        this.groundImage = new Image();
        this.groundImage.src = "./images/finishLine.png";
    }


    draw() {
        this.ctx.drawImage(this.groundImage, this.x, this.y, this.width, this.height);
    }

    update(gameSpeed, frameTimeDelta) {
        this.x -= gameSpeed * frameTimeDelta * this.speed * this.scaleRatio;
    }

    collideWithFinish(sprite, bool) {
        if (bool) return;
        const adjustBy = 1.2;
        // console.log("TOP", sprite.y + (sprite.height / 1.25) , this.y)
        // console.log("BOTTOM", sprite.y + sprite.height - (sprite.height * 0.25) < this.y + this.height)
        if (sprite.x < this.x + this.width / adjustBy &&
            sprite.x + sprite.width / adjustBy > this.x &&
            sprite.y + sprite.height - (sprite.height * 0.25) < this.y + this.height &&
            sprite.y + (sprite.height / 1.25) > this.y
        ) {
            return true;
        }else {
            return false;
        }
    }

    reset() {
        this.x = this.trackLength;
    }
}