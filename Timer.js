export default class Timer {

    millisecond = 0;
    second = 0;
    minute = 0;

    constructor(ctx, speed, scaleRatio, finish) {
        this.ctx = ctx;
        this.canvas = ctx.canvas;
        this.speed = speed;
        this.scaleRatio = scaleRatio;
        this.finish = finish;

        this.x = this.canvas.width / 2;
        this.y = this.canvas.height - this.canvas.height * 0.025;


        if (this.minute < 10) {
            this.minute = `0${String(this.minute)}`
        }
        if (this.second < 10) {
            this.second = `0${String(this.second)}`
        }
        if (this.millisecond < 10) {
            this.millisecond = `0${String(this.millisecond)}`
        }
    }

    
    setMillisecond(millisecond) {
        if (this.finish) return;
        this.millisecond = millisecond;
    }

    setSecond(second) {
        if (this.finish) return;
        this.second = second;
    }

    setMinute(minute) {
        if (this.finish) return;
        this.minute = minute;
    }


    update() {
        if (this.finish) return;
        if (this.minute < 10) {
            this.minute = String(`0${String(this.minute)}`).slice(-2);
        } else {
            this.minute = this.minute;
        }
        if (this.second < 10) {
            this.second = String(`0${String(this.second)}`).slice(-2);
        } else {
            this.second = this.second;
        }
        if (this.millisecond < 10) {
            this.millisecond = String(`0${String(this.millisecond)}`).slice(-2);
        } else {
            this.millisecond = this.millisecond;
        }
    }

    draw() {
        let fontSize = 16 * this.scaleRatio;
        this.ctx.font = `${fontSize}px "Courier"`;
        // FIND A BETTER WAY TO CENTER THIS
        let x = this.x;
        let y = this.y;
        this.ctx.fillStyle = "#000000";
        this.ctx.fillText(`TIME ${this.minute}:${this.second}:${this.millisecond}`, x, y);
    }

    // MAYBE HAVE THE RECORD SET BELOW
    reset() {
        this.millisecond = 0;
        this.second = 0;
        this.minute = 0;

        if (this.minute < 10) {
            this.minute = `0${String(this.minute)}`
        }
        if (this.second < 10) {
            this.second = `0${String(this.second)}`
        }
        if (this.millisecond < 10) {
            this.millisecond = `0${String(this.millisecond)}`
        }

        let fontSize = 16 * this.scaleRatio;
        this.ctx.font = `${fontSize}px "Courier"`;
        // FIND A BETTER WAY TO CENTER THIS
        let x = this.x;
        let y = this.y;
        this.ctx.fillStyle = "#000000";
        this.ctx.fillText(`TIME ${this.minute}:${this.second}:${this.millisecond}`, x, y);
    }
}