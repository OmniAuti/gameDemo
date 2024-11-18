import ObstacleRamp from "./ObstacleRamp.js";

export default class ObstacleRampController {

    OBSTACLE_INTERVAL_MIN = 4000
    OBSTACLE_INTERVAL_MAX = 6000
    
    nextObstacleRampInterval = null;
    obstaclesRamp = [];


    constructor(ctx, obstacleRampImages, scaleRatio, speed) {
        this.ctx = ctx;
        this.canvas = ctx.canvas;
        this.obstacleRampImages = obstacleRampImages;
        this.scaleRatio = scaleRatio;
        this.speed = speed;
        this.laneHeight = this.canvas.height * .07;

        this.setNextObstacleRampTime();
    }

    setNextObstacleRampTime() {
        const num = this.getRandomNumber(this.OBSTACLE_INTERVAL_MIN, this.OBSTACLE_INTERVAL_MAX);
        this.nextObstacleRampInterval = num;
    }

    getRandomNumber(min, max) {
        return Math.floor(Math.random() * ((max - min + 1) + min));
    }

    createObstacleRamp() {
        const index = this.getRandomNumber(0, this.obstacleRampImages.length - 1);
        const obstacleRampImage = this.obstacleRampImages[index];
        const x = this.canvas.width * 1.5;
        const startingPositionY = this.canvas.height - this.obstacleRampImages[index].height - 20 * this.scaleRatio; 
        const laneIndex = this.getRandomNumber(0, 1);
        const y = startingPositionY - (laneIndex * this.laneHeight);
        const obstacleRamp = new ObstacleRamp(this.ctx, x, y, obstacleRampImage.width, obstacleRampImage.height, obstacleRampImage.image);
    
        this.obstaclesRamp.push(obstacleRamp);
    }

    update(gameSpeed, frameTimeDelta) {
        if (this.nextObstacleRampInterval <= 0) {
            this.createObstacleRamp();
            this.setNextObstacleRampTime();
        }
        this.nextObstacleRampInterval -= frameTimeDelta;

        this.obstaclesRamp.forEach(o => {
            o.update(this.speed, gameSpeed, frameTimeDelta, this.scaleRatio);
        })

        this.obstaclesRamp = this.obstaclesRamp.filter(o => o.x > -o.width);
    }

    draw() {
        this.obstaclesRamp.forEach(o => {
            o.draw();
        })
    }

    collideWith(sprite) {
        return this.obstaclesRamp.some(o => o.collideWithTires(sprite));
    }

    reset() {
        this.obstaclesRamp = [];
    }
}