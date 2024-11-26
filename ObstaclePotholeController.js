import ObstaclePothole from "./ObstaclePothole.js"

export default class ObstaclePotholeController {

    OBSTACLE_INTERVAL_MIN = 500
    OBSTACLE_INTERVAL_MAX = 3000
    
    nextObstaclePotholeInterval = null;
    obstaclesPothole = [];


    constructor(ctx, obstaclePotholeImages, scaleRatio, speed, laneHeightInGame, curbHeightInGame) {
        this.ctx = ctx;
        this.canvas = ctx.canvas;
        this.obstaclePotholeImages = obstaclePotholeImages;
        this.scaleRatio = scaleRatio;
        this.speed = speed;
        this.laneHeight = laneHeightInGame;
        this.curbHeightInGame = curbHeightInGame;

        this.setNextObstaclePotholeTime();
    }
    setNextObstaclePotholeTime() {
        const num = this.getRandomNumber(this.OBSTACLE_INTERVAL_MIN, this.OBSTACLE_INTERVAL_MAX);
        this.nextObstaclePotholeInterval = num;
    }


    getRandomNumber(min, max) {
        return Math.floor(Math.random() * ((max - min + 1) + min));
    }

    createObstaclePothole() {
        const index = this.getRandomNumber(0, this.obstaclePotholeImages.length - 1);
        const obstaclePotholeImage = this.obstaclePotholeImages[index];
        const x = this.canvas.width * 1.25;
        const laneIndex = this.getRandomNumber(0, 4);
        const y = this.canvas.height - this.obstaclePotholeImages[index].height - (this.curbHeightInGame) - (this.laneHeight * 1.15) * laneIndex;

        const obstaclePothole = new ObstaclePothole(this.ctx, x, y, obstaclePotholeImage.width, obstaclePotholeImage.height, obstaclePotholeImage.image);
    
        this.obstaclesPothole.push(obstaclePothole);
    }

    update(gameSpeed, frameTimeDelta) {
        if (this.nextObstaclePotholeInterval <= 0) {
            this.createObstaclePothole();
            this.setNextObstaclePotholeTime();
        }
        this.nextObstaclePotholeInterval -= frameTimeDelta;

        this.obstaclesPothole.forEach(o => {
            o.update(this.speed, gameSpeed, frameTimeDelta, this.scaleRatio);
        })

        this.obstaclesPothole = this.obstaclesPothole.filter(o => o.x > -o.width);
    }

    draw() {
        this.obstaclesPothole.forEach(o => {
            o.draw();
        })
    }

    collideWith(sprite) {
        return this.obstaclesPothole.some(o => o.collideWithTires(sprite));
    }

    reset() {
        this.obstaclesPothole = [];
    }
} 