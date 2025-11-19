import { GameObject } from './GameObject.js';
import { CONFIG, EMOJIS } from './config.js';
import { clamp, randomChoice } from './utils.js';

export class Player extends GameObject {
    constructor(x, y) {
        super(x, y, CONFIG.PLAYER.WIDTH, CONFIG.PLAYER.HEIGHT);
        this.health = CONFIG.PLAYER.MAX_HEALTH;
        this.maxHealth = CONFIG.PLAYER.MAX_HEALTH;
        this.speed = CONFIG.PLAYER.SPEED;
        this.lastShootTime = 0;
        this.shootCooldown = CONFIG.PLAYER.SHOOT_COOLDOWN;
        this.emoji = randomChoice(EMOJIS.PLAYER);
        
        // Power-up states
        this.powerUps = {
            rapidFire: false,
            shield: false,
            doubleShot: false,
            tripleShot: false,
            quadShot: false,
            pentaShot: false,
            piercing: false,
            explosive: false,
            criticalHit: false,
            freezing: false,
            laserBeam: false,
            homingMissile: false,
            chainLightning: false,
            nova: false,
            spiralShot: false,
            shockwave: false,
            toxicCloud: false,
            boomerang: false,
            blackHole: false,
            phoenixReborn: false,
            godMode: false,
            timeSlow: false,
            drone: false,
            orbital: false,
            megaExplosion: false,
            lightningStorm: false,
            tornado: false,
            trident: false,
            starGuardian: false,
            fireworks: false,
        };
        this.powerUpTimers = {};
        
        // Ability properties
        this.piercingCount = 3;
        this.critChance = 0.25;
        this.critMultiplier = 2.5;
        this.droneCount = 0;
        this.drones = [];
        this.orbitals = [];
        this.orbitalCount = 0;
        this.lastNovaTime = 0;
        this.lastShockwaveTime = 0;
        this.lastToxicCloudTime = 0;
        this.blackHoles = [];
        this.phoenixUsed = false;
        this.lastPhoenixTime = 0;
        this.godModeEndTime = 0;
        this.lastGodModeUse = 0;
        this.spiralAngle = 0;
        this.boomerangs = [];
        this.multiShotCount = 1;
        this.lastBlackHoleShot = 0;
        this.canShootBlackHole = true;
        this.phoenixBuff = false;
        
        // Shield effect
        this.shieldAlpha = 0;
    }

    update(deltaTime, canvasWidth) {
        // Movement
        this.x += this.vx;
        this.y += this.vy;

        // Keep player within bounds
        this.x = clamp(this.x, 0, canvasWidth - this.width);
        this.y = clamp(this.y, 0, CONFIG.CANVAS_HEIGHT - this.height);

        // Update power-up timers
        const currentTime = Date.now();
        for (const [powerUp, endTime] of Object.entries(this.powerUpTimers)) {
            if (currentTime >= endTime) {
                this.powerUps[powerUp] = false;
                delete this.powerUpTimers[powerUp];
            }
        }

        // Update shield animation
        if (this.powerUps.shield) {
            this.shieldAlpha = 0.5 + Math.sin(currentTime / 100) * 0.3;
        }
        
        // God Mode (invincibility)
        if (this.powerUps.godMode) {
            if (currentTime > this.godModeEndTime) {
                this.powerUps.godMode = false;
            }
        }
        
        // Spiral shot rotation - faster rotation for visual effect
        if (this.powerUps.spiralShot) {
            this.spiralAngle += deltaTime * 0.005;
        }
        
        // Update drones
        for (let i = this.drones.length - 1; i >= 0; i--) {
            const drone = this.drones[i];
            const angle = (i / this.droneCount) * Math.PI * 2 + currentTime * 0.002;
            const radius = 80;
            drone.x = this.x + this.width / 2 + Math.cos(angle) * radius;
            drone.y = this.y + this.height / 2 + Math.sin(angle) * radius;
        }
        
        // Update orbitals
        for (let i = this.orbitals.length - 1; i >= 0; i--) {
            const orbital = this.orbitals[i];
            const angle = (i / this.orbitalCount) * Math.PI * 2 + currentTime * 0.004;
            const radius = 60;
            orbital.x = this.x + this.width / 2 + Math.cos(angle) * radius;
            orbital.y = this.y + this.height / 2 + Math.sin(angle) * radius;
        }
        
        // Update boomerangs
        for (let i = this.boomerangs.length - 1; i >= 0; i--) {
            const boom = this.boomerangs[i];
            boom.time += deltaTime;
            
            // Boomerang motion
            if (boom.time < 1000) {
                boom.y -= 5;
                boom.x += boom.vx;
            } else {
                // Return to player
                const dx = (this.x + this.width / 2) - boom.x;
                const dy = (this.y + this.height / 2) - boom.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 20) {
                    this.boomerangs.splice(i, 1);
                } else {
                    boom.x += (dx / dist) * 8;
                    boom.y += (dy / dist) * 8;
                }
            }
        }
        
        // Update black holes
        for (let i = this.blackHoles.length - 1; i >= 0; i--) {
            const bh = this.blackHoles[i];
            bh.time += deltaTime;
            bh.size = 30 + Math.sin(bh.time * 0.005) * 10;
            if (bh.time > 5000) {
                this.blackHoles.splice(i, 1);
            }
        }
    }

    draw(ctx) {
        // Draw shield
        if (this.powerUps.shield) {
            ctx.save();
            ctx.globalAlpha = this.shieldAlpha;
            ctx.strokeStyle = '#95E1D3';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(
                this.x + this.width / 2,
                this.y + this.height / 2,
                this.width / 2 + 10,
                0,
                Math.PI * 2
            );
            ctx.stroke();
            ctx.restore();
        }

        // Draw God Mode effect
        if (this.powerUps.godMode) {
            ctx.save();
            ctx.globalAlpha = 0.4;
            ctx.fillStyle = '#FFD700';
            ctx.shadowBlur = 20;
            ctx.shadowColor = '#FFD700';
            ctx.beginPath();
            ctx.arc(this.x + this.width / 2, this.y + this.height / 2, this.width / 2 + 15, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
        
        // Draw black holes
        for (const bh of this.blackHoles) {
            ctx.save();
            ctx.fillStyle = '#000000';
            ctx.shadowBlur = 30;
            ctx.shadowColor = '#9D00FF';
            ctx.beginPath();
            ctx.arc(bh.x, bh.y, bh.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
        
        // Draw orbitals
        for (const orb of this.orbitals) {
            ctx.save();
            ctx.fillStyle = '#4ECDC4';
            ctx.shadowBlur = 10;
            ctx.shadowColor = '#4ECDC4';
            ctx.beginPath();
            ctx.arc(orb.x, orb.y, 8, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
        
        // Draw drones
        for (const drone of this.drones) {
            ctx.font = '20px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('🤖', drone.x, drone.y);
        }
        
        // Draw boomerangs
        for (const boom of this.boomerangs) {
            ctx.save();
            ctx.translate(boom.x, boom.y);
            ctx.rotate(boom.time * 0.01);
            ctx.font = '20px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('🪃', 0, 0);
            ctx.restore();
        }

        // Draw player emoji with horizontal scaling
        ctx.save();
        ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
        ctx.scale(1.5, 1); // Scale horizontally 1.5x, vertically 1x
        ctx.font = `${this.height * 0.7}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.emoji, 0, 0);
        ctx.restore();

        // Draw power-up indicators
        this.drawPowerUpIndicators(ctx);
    }

    drawPowerUpIndicators(ctx) {
        let indicatorY = this.y + this.height + 10;
        
        if (this.powerUps.rapidFire) {
            ctx.font = '16px Arial';
            ctx.fillText('⚡', this.x + this.width / 2, indicatorY);
            indicatorY += 20;
        }
        
        if (this.powerUps.doubleShot) {
            ctx.font = '16px Arial';
            ctx.fillText('✨', this.x + this.width / 2, indicatorY);
        }
    }

    canShoot() {
        const currentTime = Date.now();
        const cooldown = this.powerUps.rapidFire ? 
            this.shootCooldown / 2 : this.shootCooldown;
        
        if (currentTime - this.lastShootTime >= cooldown) {
            this.lastShootTime = currentTime;
            return true;
        }
        return false;
    }

    takeDamage(amount) {
        // God Mode makes player invincible
        if (this.powerUps.godMode) {
            return false;
        }
        
        if (this.powerUps.shield) {
            // Shield absorbs damage
            return false;
        }
        
        this.health -= amount;
        if (this.health <= 0) {
            // Phoenix Reborn - resurrect once
            const currentTime = Date.now();
            if (this.powerUps.phoenixReborn && !this.phoenixUsed && 
                currentTime - this.lastPhoenixTime > 90000) {
                this.health = this.maxHealth + 50;
                this.maxHealth += 50;
                this.phoenixUsed = true;
                this.lastPhoenixTime = currentTime;
                this.phoenixBuff = true;
                CONFIG.BULLET.DAMAGE += 20; // Permanent damage boost
                // Visual effect will be added in Game.js
                return false;
            }
            
            this.health = 0;
            this.destroy();
            return true;
        }
        return false;
    }

    heal(amount) {
        this.health = Math.min(this.health + amount, this.maxHealth);
    }

    activatePowerUp(type, duration) {
        this.powerUps[type] = true;
        this.powerUpTimers[type] = Date.now() + duration;
    }

    getHealthPercentage() {
        return (this.health / this.maxHealth) * 100;
    }
}

