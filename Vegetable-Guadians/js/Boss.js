import { GameObject } from './GameObject.js';
import { CONFIG, EMOJIS } from './config.js';
import { randomChoice, randomInt } from './utils.js';

export class Boss extends GameObject {
    constructor(x, y, level = 1) {
        super(x, y, CONFIG.BOSS.WIDTH, CONFIG.BOSS.HEIGHT);
        
        // Boss stats scale with level
        this.maxHealth = CONFIG.BOSS.BASE_HEALTH + (level - 1) * 200;
        this.health = this.maxHealth;
        this.speed = CONFIG.BOSS.SPEED;
        this.vy = this.speed;
        this.vx = randomChoice([-1, 1]) * 0.5;
        this.emoji = randomChoice(EMOJIS.BOSSES);
        this.points = CONFIG.BOSS.POINTS * level;
        this.level = level;
        
        // Boss movement
        this.time = 0;
        this.phase = 0; // Boss attack phases
        
        // Boss shooting
        this.lastShootTime = Date.now();
        this.shootInterval = 1000;
        this.burstCount = 0;
        
        // Boss is special
        this.isBoss = true;
        
        // Boss entrance
        this.isEntering = true;
        this.targetY = 100;
    }

    update(deltaTime) {
        this.time += deltaTime;

        if (this.isEntering) {
            // Boss enters from top
            if (this.y < this.targetY) {
                this.y += this.speed * 2;
            } else {
                this.isEntering = false;
            }
        } else {
            // Boss movement pattern - side to side
            this.x += this.vx;
            
            // Bounce off walls
            if (this.x <= 0 || this.x + this.width >= CONFIG.CANVAS_WIDTH) {
                this.vx *= -1;
            }
            
            // Change phase based on health
            const healthPercent = this.health / this.maxHealth;
            if (healthPercent < 0.3) {
                this.phase = 2; // Enraged
                this.shootInterval = 500;
            } else if (healthPercent < 0.6) {
                this.phase = 1; // Angry
                this.shootInterval = 750;
            }
        }
    }

    draw(ctx) {
        // Boss health bar (at top of screen)
        const barWidth = CONFIG.CANVAS_WIDTH - 40;
        const barHeight = 20;
        const barX = 20;
        const barY = 10;
        const healthPercent = this.health / this.maxHealth;
        
        // Background
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(barX - 5, barY - 5, barWidth + 10, barHeight + 10);
        
        // Health bar
        ctx.fillStyle = 'rgba(255, 0, 0, 0.3)';
        ctx.fillRect(barX, barY, barWidth, barHeight);
        
        // Health fill with gradient
        const gradient = ctx.createLinearGradient(barX, barY, barX + barWidth * healthPercent, barY);
        if (healthPercent > 0.6) {
            gradient.addColorStop(0, '#FFD700');
            gradient.addColorStop(1, '#FFA500');
        } else if (healthPercent > 0.3) {
            gradient.addColorStop(0, '#FF6B00');
            gradient.addColorStop(1, '#FF4444');
        } else {
            gradient.addColorStop(0, '#FF0000');
            gradient.addColorStop(1, '#8B0000');
        }
        ctx.fillStyle = gradient;
        ctx.fillRect(barX, barY, barWidth * healthPercent, barHeight);
        
        // Border
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 2;
        ctx.strokeRect(barX, barY, barWidth, barHeight);
        
        // Boss name
        ctx.fillStyle = '#FFD700';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('👑 BOSS 👑', CONFIG.CANVAS_WIDTH / 2, barY + barHeight + 20);
        
        // Boss glow effect
        ctx.save();
        ctx.shadowColor = this.phase === 2 ? '#FF0000' : this.phase === 1 ? '#FF6B00' : '#FFD700';
        ctx.shadowBlur = 20 + Math.sin(this.time / 100) * 10;
        
        // Draw boss emoji with horizontal scaling
        ctx.font = `${this.height * 0.7}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.save();
        ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
        ctx.scale(1.5, 1); // Scale horizontally 1.5x, vertically 1x
        ctx.fillText(this.emoji, 0, 0);
        ctx.restore();
        
        ctx.restore();
    }

    takeDamage(amount) {
        this.health -= amount;
        if (this.health <= 0) {
            this.destroy();
            return true;
        }
        return false;
    }

    shouldShoot() {
        if (this.isEntering) return false;
        
        const currentTime = Date.now();
        if (currentTime - this.lastShootTime >= this.shootInterval) {
            this.lastShootTime = currentTime;
            return true;
        }
        return false;
    }

    getAttackPattern() {
        // Different attack patterns based on phase
        const patterns = [];
        
        if (this.phase === 2) {
            // Enraged: Most aggressive patterns
            patterns.push('spray', 'circular', 'spiral', 'laser', 'burst');
        } else if (this.phase === 1) {
            // Angry: Mixed patterns
            patterns.push('burst', 'wave', 'spiral', 'circular');
        } else {
            // Normal: Basic patterns
            patterns.push('triple', 'burst', 'wave');
        }
        
        // Randomly select from available patterns
        return randomChoice(patterns);
    }
    
    getAttackBullets() {
        const centerX = this.x + this.width / 2;
        const centerY = this.y + this.height;
        const pattern = this.getAttackPattern();
        const bullets = [];
        
        switch (pattern) {
            case 'triple':
                // Basic triple shot
                bullets.push({ x: centerX - 20, y: centerY, angle: Math.PI / 2 });
                bullets.push({ x: centerX, y: centerY, angle: Math.PI / 2 });
                bullets.push({ x: centerX + 20, y: centerY, angle: Math.PI / 2 });
                break;
                
            case 'burst':
                // 5-way burst
                for (let i = 0; i < 5; i++) {
                    const angle = Math.PI / 2 + (i - 2) * 0.3;
                    bullets.push({ x: centerX, y: centerY, angle });
                }
                break;
                
            case 'spray':
                // Wide spray - 7 bullets
                for (let i = 0; i < 7; i++) {
                    const angle = Math.PI / 2 + (i - 3) * 0.25;
                    bullets.push({ x: centerX, y: centerY, angle });
                }
                break;
                
            case 'circular':
                // Full circle - 8 directions
                for (let i = 0; i < 8; i++) {
                    const angle = (Math.PI * 2 / 8) * i;
                    bullets.push({ x: centerX, y: centerY, angle });
                }
                break;
                
            case 'spiral':
                // Spiral pattern - 6 bullets with rotation
                const spiralOffset = (Date.now() / 100) % (Math.PI * 2);
                for (let i = 0; i < 6; i++) {
                    const angle = (Math.PI * 2 / 6) * i + spiralOffset;
                    bullets.push({ x: centerX, y: centerY, angle });
                }
                break;
                
            case 'wave':
                // Wave pattern - aimed downward
                const waveCount = 3;
                for (let i = 0; i < waveCount; i++) {
                    const offsetAngle = (i - 1) * 0.2;
                    bullets.push({ x: centerX + (i - 1) * 30, y: centerY, angle: Math.PI / 2 + offsetAngle });
                }
                break;
                
            case 'laser':
                // Concentrated laser-like stream - 3 bullets in line
                for (let i = 0; i < 3; i++) {
                    bullets.push({ x: centerX, y: centerY, angle: Math.PI / 2, speed: 3 + i * 0.5 });
                }
                break;
        }
        
        return bullets;
    }
}

