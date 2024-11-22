export default class Gas {

        DEFAULT_COLOR_GREEN = "#359e4a";
        DEFAULT_COLOR_RED = "#e35353";

    constructor(ctx, height, speed, scaleRatio, maxGas, minGas, startingGas) {
        this.ctx = ctx;
        this.canvas = ctx.canvas;
        this.height = height;
        this.speed = speed;
        this.scaleRatio = scaleRatio;
        this.maxGas = maxGas;
        this.minGas = minGas;
        this.startingGas = startingGas;

        this.x = this.canvas.width / 4;
        this.y = this.canvas.height - this.canvas.height / 14;
    }

    draw() {
        let fontSize = 16 * this.scaleRatio;
        this.ctx.font = `${fontSize}px "bayard-regular"`;
        // FIND A BETTER WAY TO CENTER THIS
        let x = this.x;
        let y = this.y;
        this.ctx.fillStyle = "#000000";
        this.ctx.fillText("GAS", x - this.height * 2, y + this.height * .92);

        this.ctx.fillStyle = this.DEFAULT_COLOR_RED;
        this.ctx.fillRect(this.x, this.y, this.canvas.width / 10, this.height);

        // THEN DOWN HERE HAVE THE OVERLAPPING FULL GAS
    }
}