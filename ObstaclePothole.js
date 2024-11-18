export default class ObstacleMud {
    constructor(ctx, x, y, width, height, image) {
        this.ctx = ctx;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.image = image;
    }

    update(speed, gameSpeed, frameTimeDelta, scaleRatio) {
        this.x -= speed * gameSpeed * frameTimeDelta * scaleRatio;
    }

    draw() {
        this.ctx.drawImage(this.image, this.x, this.y, this.width, this.height)
    }

    collideWithTires(sprite) {
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
}