export default class StartingMark {

    startingMarkArr = [];
    inervalCheck = false;

    constructor(ctx, width, height, scaleRatio, speed, laneHeightInGame, curbHeightInGame, playerWidth) {
        this.ctx = ctx;
        this.canvas = ctx.canvas;
        this.width = width;
        this.height = height;
        this.scaleRatio = scaleRatio;
        this.speed = speed;
        this.laneHeight = laneHeightInGame;
        this.curbHeightInGame = curbHeightInGame;
        this.playerWidth = playerWidth;
        // THE 30 COMES FROM 20 THAT PLAYER SPRITE IS FROM SIDE THEN ADDD 10
        this.x = this.playerWidth + 25 * scaleRatio;
        this.y = this.canvas.height - this.height - this.curbHeightInGame - (this.laneHeight * 1.3); 

        this.startingPositionX = this.playerWidth + 25 * scaleRatio;
        this.startingPositionY = this.canvas.height - this.height - this.curbHeightInGame - (this.laneHeight * 1.3);

        const startingMarkOne = new Image();
        startingMarkOne.src = "./images/StartingMarkOne.png";
        const startingMarkTwo = new Image();
        startingMarkTwo.src = "./images/StartingMarkTwo.png";
        const startingMarkThree = new Image();
        startingMarkThree.src = "./images/StartingMarkThree.png";
        this.startingMarkArr.push(startingMarkOne)
        this.startingMarkArr.push(startingMarkTwo)
        this.startingMarkArr.push(startingMarkThree)

        this.image = this.startingMarkArr[0];
    }

    update(gameSpeed, frameTimeDelta) {
        this.x -= this.speed * gameSpeed * frameTimeDelta * this.scaleRatio;
    }

    updateImage(num) {
        // set interval 
        if (num === 0) {
                this.image = this.startingMarkArr[1];
            setTimeout(() => {
                this.image = this.startingMarkArr[2];
            }, 500)
        }
    }

    draw() {
        this.ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }

    reset() {
        this.image = this.startingMarkArr[0];
        this.x = this.startingPositionX;
        this.y = this.startingPositionY;
    }
}