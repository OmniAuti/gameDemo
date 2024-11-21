export default class Grass {
        constructor(ctx, width, height, speed, scaleRatio, curbHeightInGame) {
            this.ctx = ctx;
            this.canvas = ctx.canvas;
            this.width = width;
            this.height = height;
            this.speed = speed;
            this.scaleRatio = scaleRatio;
            this.curbHeightInGame = curbHeightInGame;
    
            this.x = 0 ;
            this.y = 0 - this.curbHeightInGame;
    
            this.grassImage = new Image();
            this.grassImage.src = "./images/grass.png"
        }
    
        draw() {
            this.ctx.drawImage(this.grassImage, this.x, this.y, this.width, this.height);

            this.ctx.drawImage(this.grassImage, this.x + this.width - 5, this.y, this.width, this.height);
    
            if (this.x < -this.width) {
                this.x = 0;
            }        }
    
        update(gameSpeed, frameTimeDelta) {
            this.x -= gameSpeed * frameTimeDelta * this.speed * this.scaleRatio;
        }
    
        reset() {
            this.x = 0;
        }
}