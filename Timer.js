export default class Timer {

    millisecond = 0;
    second = 0;
    minute = 0;

    constructor(ctx, speed, scaleRatio) {
        this.ctx = ctx;
        this.canvas = ctx.canvas;
        this.speed = speed;
        this.scaleRatio = scaleRatio;

        this.x = this.canvas.width / 2;
        this.y = this.canvas.height - this.canvas.height / 50;
    }

    draw() {
        let fontSize = 16 * this.scaleRatio;
        this.ctx.font = `${fontSize}px "Courier"`;
        // FIND A BETTER WAY TO CENTER THIS
        let x = this.x;
        let y = this.y;
        this.ctx.fillStyle = "#000000";
        this.ctx.fillText(`TIME 0${0}:0${0}:0${0}`, x, y);
    }

    // MAYBE HAVE THE RECORD SET BELOW
}