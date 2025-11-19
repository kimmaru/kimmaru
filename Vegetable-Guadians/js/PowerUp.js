import { GameObject } from './GameObject.js';
import { CONFIG } from './config.js';

export class PowerUp extends GameObject {
    constructor(x, y, type) {
        super(x, y, CONFIG.POWERUP.WIDTH, CONFIG.POWERUP.HEIGHT);
        this.type = type;
        this.config = CONFIG.POWERUP.TYPES[type];
        this.vy = CONFIG.POWERUP.SPEED;
        this.time = 0;
        this.baseY = y;
    }

    update(deltaTime) {
        this.time += deltaTime;
        
        // Floating animation
        this.y = this.baseY + Math.sin(this.time * 0.003) * 5;
        this.baseY += this.vy;

        // Remove if off screen
        if (this.y > CONFIG.CANVAS_HEIGHT) {
            this.destroy();
        }
    }

    draw(ctx) {
        // Draw glow effect
        ctx.save();
        ctx.shadowBlur = 20;
        ctx.shadowColor = this.config.color;
        
        // Draw background circle
        ctx.fillStyle = this.config.color;
        ctx.globalAlpha = 0.6;
        ctx.beginPath();
        ctx.arc(
            this.x + this.width / 2,
            this.y + this.height / 2,
            this.width / 2,
            0,
            Math.PI * 2
        );
        ctx.fill();
        ctx.globalAlpha = 1;

        // Draw emoji with horizontal scaling
        ctx.shadowBlur = 0;
        ctx.font = `${this.height * 0.6}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.save();
        ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
        ctx.scale(1.5, 1); // Scale horizontally 1.5x, vertically 1x
        ctx.fillText(this.config.emoji, 0, 0);
        ctx.restore();
        
        ctx.restore();
    }

    applyEffect(player) {
        switch (this.type) {
            case 'HEALTH':
                player.heal(30);
                break;
            case 'RAPID_FIRE':
                player.activatePowerUp('rapidFire', CONFIG.POWERUP.DURATION);
                break;
            case 'SHIELD':
                player.activatePowerUp('shield', CONFIG.POWERUP.DURATION);
                break;
            case 'DOUBLE_SHOT':
                player.activatePowerUp('doubleShot', CONFIG.POWERUP.DURATION);
                break;
        }
    }
}

