export default class Gas {

        DEFAULT_COLOR_GREEN = "#359e4a";
        DEFAULT_COLOR_RED = "#e35353";

    constructor(ctx, height, speed, scaleRatio, maxGas, minGas, startingGas, availableGas) {
        this.ctx = ctx;
        this.canvas = ctx.canvas;
        this.height = height;
        this.speed = speed;
        this.scaleRatio = scaleRatio;
        this.maxGas = maxGas;
        this.minGas = minGas;
        this.startingGas = startingGas;

        this.x = this.canvas.width / 4;
        this.y = this.canvas.height - this.canvas.height / 21;

        this.availableGas = availableGas;
    }

    draw() {
        let fontSize = 16 * this.scaleRatio;
        this.ctx.font = `${fontSize}px "bayard-regular"`;
        // FIND A BETTER WAY TO CENTER THIS
        let x = this.x;
        let y = this.y;
        this.ctx.fillStyle = "#000000";
        this.ctx.fillText("GAS -", x - this.height * 2.5, y + this.height * .95);

        this.ctx.fillStyle = "#000000";
        this.ctx.fillRect(this.x - this.height * .18, this.y + this.height * -.115, this.canvas.width / 9.5, this.height * 1.25);
        this.ctx.fillStyle = this.DEFAULT_COLOR_RED;
        this.ctx.fillRect(this.x, this.y, this.canvas.width * .1, this.height);
        this.ctx.fillStyle = this.DEFAULT_COLOR_GREEN;
        this.ctx.fillRect(this.x, this.y, this.canvas.width * this.availableGas, this.height);

        // THEN DOWN HERE HAVE THE OVERLAPPING FULL GAS

    }

    update(currentGas) {
        if (currentGas <= 0) {
            currentGas = 0;
        }
        this.availableGas = currentGas;

        this.ctx.fillStyle = this.DEFAULT_COLOR_GREEN;
        this.ctx.fillRect(this.x, this.y, this.canvas.width * this.availableGas , this.height);
    }

    reset() {
        this.availableGas = 0.075
        this.ctx.fillStyle = this.DEFAULT_COLOR_GREEN;
        this.ctx.fillRect(this.x, this.y, this.canvas.width * this.availableGas, this.height);
    }
}