import ObstacleRamp from "./ObstacleRamp.js";

export default class ObstacleRampController {

    OBSTACLE_INTERVAL_MIN = 1500
    OBSTACLE_INTERVAL_MAX = 3000
    
    nextObstacleRampInterval = null;
    reactionValue = null;
    obstaclesRamp = [];


    constructor(ctx, obstacleRampImages, scaleRatio, speed, laneHeightInGame, curbHeightInGame) {
        this.ctx = ctx;
        this.canvas = ctx.canvas;
        this.obstacleRampImages = obstacleRampImages;
        this.scaleRatio = scaleRatio;
        this.speed = speed;
        this.laneHeight = laneHeightInGame;
        this.curbHeightInGame = curbHeightInGame;

        this.setNextObstacleRampTime();
    }

    setNextObstacleRampTime() {
        // const num = this.getRandomNumber(this.OBSTACLE_INTERVAL_MIN, this.OBSTACLE_INTERVAL_MAX);
        this.nextObstacleRampInterval = 3000;
    }

    getRandomNumber(min, max) {
        return Math.floor(Math.random() * ((max - min + 1) + min));
    }

    createObstacleRamp() {
        // const index = this.getRandomNumber(0, this.obstacleRampImages.length - 1);
        const index = 0;
        const obstacleRampImage = this.obstacleRampImages[index];
        let reactionValue = obstacleRampImage.reaction;
        const x = this.canvas.width * 1.15;
        const laneIndex = this.getRandomNumber(0, 1);
        // const laneIndex = 0;
        const y = this.canvas.height - obstacleRampImage.height - (this.curbHeightInGame) - (this.laneHeight * laneIndex);
        const obstacleRamp = new ObstacleRamp(this.ctx, x, y, obstacleRampImage.width, obstacleRampImage.height, obstacleRampImage.image, reactionValue);
    
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
        for (const ramp of this.obstaclesRamp) {
            if (ramp.collideWithTires(sprite)) {
                this.reactionValue = ramp.reaction;
                return true;
            }
        }
    }

    reset() {
        this.obstaclesRamp = [];
    }
}