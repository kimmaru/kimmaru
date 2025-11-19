// Base GameObject class
export class GameObject {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.active = true;
        this.vx = 0;
        this.vy = 0;
    }

    update(deltaTime) {
        this.x += this.vx;
        this.y += this.vy;
    }

    draw(ctx) {
        // Override in subclasses
    }

    isOffScreen(canvasWidth, canvasHeight) {
        return (
            this.x + this.width < 0 ||
            this.x > canvasWidth ||
            this.y + this.height < 0 ||
            this.y > canvasHeight
        );
    }

    destroy() {
        this.active = false;
    }
}

