import { CONFIG } from './config.js';
import { randomFloat, randomChoice } from './utils.js';

export class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.vx = randomFloat(-CONFIG.PARTICLES.SPEED, CONFIG.PARTICLES.SPEED);
        this.vy = randomFloat(-CONFIG.PARTICLES.SPEED, CONFIG.PARTICLES.SPEED);
        this.size = randomFloat(2, CONFIG.PARTICLES.SIZE);
        this.color = color;
        this.life = CONFIG.PARTICLES.LIFETIME;
        this.maxLife = CONFIG.PARTICLES.LIFETIME;
        this.active = true;
    }

    update(deltaTime) {
        this.x += this.vx;
        this.y += this.vy;
        this.life -= deltaTime;
        
        if (this.life <= 0) {
            this.active = false;
        }
    }

    draw(ctx) {
        const alpha = this.life / this.maxLife;
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

export class ExplosionEffect {
    constructor(x, y, color = '#FFD700') {
        this.x = x;
        this.y = y;
        this.particles = [];
        this.active = true;
        
        // Create particles
        for (let i = 0; i < CONFIG.PARTICLES.COUNT; i++) {
            this.particles.push(new Particle(x, y, color));
        }
    }

    update(deltaTime) {
        this.particles = this.particles.filter(p => p.active);
        this.particles.forEach(p => p.update(deltaTime));
        
        if (this.particles.length === 0) {
            this.active = false;
        }
    }

    draw(ctx) {
        this.particles.forEach(p => p.draw(ctx));
    }
}

export class TextEffect {
    constructor(x, y, text, color = '#FFD700') {
        this.x = x;
        this.y = y;
        this.text = text;
        this.color = color;
        this.vy = -2;
        this.life = 1000;
        this.maxLife = 1000;
        this.active = true;
    }

    update(deltaTime) {
        this.y += this.vy;
        this.life -= deltaTime;
        
        if (this.life <= 0) {
            this.active = false;
        }
    }

    draw(ctx) {
        const alpha = this.life / this.maxLife;
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.font = 'bold 20px Arial';
        ctx.fillStyle = this.color;
        ctx.textAlign = 'center';
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 3;
        ctx.strokeText(this.text, this.x, this.y);
        ctx.fillText(this.text, this.x, this.y);
        ctx.restore();
    }
}

