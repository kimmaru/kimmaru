import { CONFIG } from './config.js';
import { Player } from './Player.js';
import { Enemy } from './Enemy.js';
import { Boss } from './Boss.js';
import { Bullet } from './Bullet.js';
import { ExplosionEffect, TextEffect } from './Particle.js';
import { checkCollision, randomInt, randomChoice, shakeScreen } from './utils.js';

export class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.canvas.width = CONFIG.CANVAS_WIDTH;
        this.canvas.height = CONFIG.CANVAS_HEIGHT;

        // Game state
        this.state = 'menu'; // menu, playing, paused, gameover
        this.score = 0;
        this.level = 1;
        this.isPaused = false;
        
        // Experience system
        this.experience = 0;
        this.experienceToNextLevel = 100;
        this.playerLevel = 1;

        // Game objects
        this.player = null;
        this.enemies = [];
        this.boss = null;
        this.bullets = [];
        this.effects = [];
        
        // Boss tracking
        this.lastBossWave = 0;
        this.bossActive = false;

        // Spawning
        this.lastEnemySpawn = 0;
        
        // Wave system
        this.waveEnemiesTotal = 0;
        this.waveEnemiesSpawned = 0;
        this.waveEnemiesRemaining = 0;
        this.waveInProgress = false;
        this.enemySpawnInterval = CONFIG.ENEMY.SPAWN_INTERVAL;

        // Auto shooting
        this.autoShoot = true;
        this.lastAutoShoot = 0;

        // Input
        this.keys = {};
        this.touchControls = {
            isActive: false,
            touchId: null,
            startX: 0,
            startY: 0,
            currentX: 0,
            currentY: 0
        };
        
        // Background
        this.stars = this.generateStars(100);

        // Time tracking
        this.lastTime = 0;

        // Bind methods
        this.update = this.update.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);
    }

    generateStars(count) {
        const stars = [];
        for (let i = 0; i < count; i++) {
            stars.push({
                x: Math.random() * CONFIG.CANVAS_WIDTH,
                y: Math.random() * CONFIG.CANVAS_HEIGHT,
                size: Math.random() * 2,
                speed: Math.random() * 0.5 + 0.2,
                brightness: Math.random()
            });
        }
        return stars;
    }

    start() {
        // Reset game
        this.score = 0;
        this.level = 1;
        this.experience = 0;
        this.experienceToNextLevel = 100;
        this.playerLevel = 1;
        this.enemies = [];
        this.boss = null;
        this.bullets = [];
        this.effects = [];
        this.lastEnemySpawn = 0;
        this.enemySpawnInterval = CONFIG.ENEMY.SPAWN_INTERVAL;
        this.lastBossWave = 0;
        this.bossActive = false;
        
        // Initialize first wave
        this.startWave(1);

        // Create player
        const startX = CONFIG.CANVAS_WIDTH / 2 - CONFIG.PLAYER.WIDTH / 2;
        const startY = CONFIG.CANVAS_HEIGHT - CONFIG.PLAYER.HEIGHT - 50;
        this.player = new Player(startX, startY);

        // Set up input listeners
        window.addEventListener('keydown', this.handleKeyDown);
        window.addEventListener('keyup', this.handleKeyUp);
        
        // Touch controls
        this.canvas.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: false });
        this.canvas.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: false });
        this.canvas.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: false });

        this.state = 'playing';
        this.isPaused = false;
        this.lastTime = performance.now();
        
        // Start game loop
        requestAnimationFrame(this.update);

        // Update UI
        this.updateUI();
    }

    stop() {
        this.state = 'gameover';
        window.removeEventListener('keydown', this.handleKeyDown);
        window.removeEventListener('keyup', this.handleKeyUp);
        
        // Remove touch event listeners
        this.canvas.removeEventListener('touchstart', this.handleTouchStart.bind(this));
        this.canvas.removeEventListener('touchmove', this.handleTouchMove.bind(this));
        this.canvas.removeEventListener('touchend', this.handleTouchEnd.bind(this));
    }

    pause() {
        this.isPaused = !this.isPaused;
    }

    handleKeyDown(e) {
        this.keys[e.key] = true;

        // Pause
        if (e.key === 'p' || e.key === 'P') {
            this.pause();
        }

        // Prevent spacebar scrolling
        if (e.key === ' ') {
            e.preventDefault();
        }
    }

    handleKeyUp(e) {
        this.keys[e.key] = false;
    }

    handleTouchStart(e) {
        e.preventDefault();
        if (this.state !== 'playing') return;
        
        const touch = e.touches[0];
        const rect = this.canvas.getBoundingClientRect();
        // Scale touch position to match canvas internal coordinates
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;
        const x = (touch.clientX - rect.left) * scaleX;
        const y = (touch.clientY - rect.top) * scaleY;
        
        if (this.isPaused) return;
        
        this.touchControls.isActive = true;
        this.touchControls.touchId = touch.identifier;
        this.touchControls.startX = x;
        this.touchControls.startY = y;
        this.touchControls.currentX = x;
        this.touchControls.currentY = y;
    }

    handleTouchMove(e) {
        e.preventDefault();
        if (!this.touchControls.isActive || this.state !== 'playing' || this.isPaused) return;
        
        const touch = Array.from(e.touches).find(t => t.identifier === this.touchControls.touchId);
        if (!touch) return;
        
        const rect = this.canvas.getBoundingClientRect();
        // Scale touch position to match canvas internal coordinates
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;
        const x = (touch.clientX - rect.left) * scaleX;
        const y = (touch.clientY - rect.top) * scaleY;
        
        this.touchControls.currentX = x;
        this.touchControls.currentY = y;
    }

    handleTouchEnd(e) {
        e.preventDefault();
        if (!this.touchControls.isActive) return;
        
        this.touchControls.isActive = false;
        this.touchControls.touchId = null;
    }

    applyBulletEnhancements(bullet) {
        // Apply ALL player bullet enhancements to any bullet
        if (!this.player) return;
        
        // Homing
        if (this.player.powerUps.homingMissile) {
            bullet.isHoming = true;
            bullet.homingStrength = 0.15;
        }
        
        // Spiral
        if (this.player.powerUps.spiralShot) {
            bullet.isSpiral = true;
            bullet.spiralRadius = 30;
            bullet.spiralSpeed = 5;
            bullet.spiralCenterVx = 0;
            bullet.spiralCenterVy = -CONFIG.BULLET.SPEED;
            bullet.spiralTime = this.player.spiralAngle;
        }
        
        // Piercing
        if (this.player.powerUps.piercing) {
            bullet.isPiercing = true;
            bullet.piercingCount = 3;
        }
        
        // Explosive
        if (this.player.powerUps.explosive) {
            bullet.isExplosive = true;
        }
        
        // Critical
        if (this.player.powerUps.criticalHit) {
            bullet.isCritical = true;
        }
        
        // Freezing
        if (this.player.powerUps.freezing) {
            bullet.isFreezing = true;
        }
        
        // Boomerang
        if (this.player.powerUps.boomerang) {
            bullet.isBoomerang = true;
            bullet.boomerangDistance = 450;
            bullet.boomerangTime = 0;
        }
    }

    shoot() {
        if (!this.player || !this.player.canShoot()) return;

        const bulletX = this.player.x + this.player.width / 2 - CONFIG.BULLET.WIDTH / 2;
        const bulletY = this.player.y;

        // Boomerang
        if (this.player.powerUps.boomerang) {
            const now = Date.now();
            this.player.boomerangs.push({
                x: this.player.x + this.player.width / 2,
                y: this.player.y,
                time: 0,
                vx: Math.random() * 4 - 2
            });
        }

        // Calculate total bullets (1 base + additions from powerups)
        let bulletCount = 1;
        if (this.player.powerUps.pentaShot) bulletCount += 5;
        if (this.player.powerUps.quadShot) bulletCount += 4;
        if (this.player.powerUps.tripleShot) bulletCount += 3;
        if (this.player.powerUps.doubleShot) bulletCount += 1;
        
        // Generate positions based on total bullet count
        const bulletPositions = [];
        const spacing = 15;
        const startOffset = -(bulletCount - 1) * spacing / 2;
        for (let i = 0; i < bulletCount; i++) {
            bulletPositions.push(bulletX + startOffset + i * spacing);
        }
        
        // Fire bullets with ALL abilities combined
        for (let i = 0; i < bulletCount; i++) {
            const bx = bulletPositions[i];
            const bullet = new Bullet(bx, bulletY, true);
            
            // Apply ALL special bullet types (they all stack now!)
            
            // Laser Beam - follows player
            if (this.player.powerUps.laserBeam) {
                bullet.isLaser = true;
                bullet.width = 8;
                bullet.laserDuration = 500; // 0.5 seconds
                bullet.laserDamage = 2; // Lower damage for multi-hit
                bullet.lastLaserHit = 0;
                bullet.laserHitInterval = 100; // Hit every 0.1s
                bullet.followsPlayer = true;
                bullet.offsetX = bx - bulletX; // Store offset from player
            }
            
            // Homing - ALL bullets can home
            if (this.player.powerUps.homingMissile) {
                bullet.isHoming = true;
                bullet.homingStrength = 0.15;
            }
            
            // Spiral - ALL bullets can spiral
            if (this.player.powerUps.spiralShot) {
                bullet.isSpiral = true;
                bullet.spiralRadius = 30;
                bullet.spiralSpeed = 5;
                bullet.spiralCenterVx = 0;
                bullet.spiralCenterVy = -CONFIG.BULLET.SPEED;
                bullet.spiralTime = this.player.spiralAngle + i * 0.5;
            }
            
            // Piercing - ALL bullets can pierce
            if (this.player.powerUps.piercing) {
                bullet.isPiercing = true;
                bullet.piercingCount = 3;
            }
            
            // Explosive - ALL bullets explode
            if (this.player.powerUps.explosive) {
                bullet.isExplosive = true;
            }
            
            // Critical - ALL bullets can crit
            if (this.player.powerUps.criticalHit) {
                bullet.isCritical = true;
            }
            
            // Freezing - ALL bullets freeze
            if (this.player.powerUps.freezing) {
                bullet.isFreezing = true;
            }
            
            // Boomerang - ALL bullets boomerang
            if (this.player.powerUps.boomerang) {
                bullet.isBoomerang = true;
                bullet.boomerangDistance = 450; // 50% increase from 300
                bullet.boomerangTime = 0;
            }
            
            // Black Hole bullet
            if (this.player.powerUps.blackHole && this.player.canShootBlackHole &&
                Date.now() - this.player.lastBlackHoleShot > 8000) {
                bullet.isBlackHole = true;
                bullet.color = '#9400D3'; // Purple color
                this.player.lastBlackHoleShot = Date.now();
                this.player.canShootBlackHole = false;
                setTimeout(() => { this.player.canShootBlackHole = true; }, 8000);
            }
            
            this.bullets.push(bullet);
        }
        
        // Multi-shot: fire additional volleys
        if (this.player.multiShotCount && this.player.multiShotCount > 1) {
            for (let volley = 1; volley < this.player.multiShotCount; volley++) {
                setTimeout(() => {
                    if (this.player && this.player.active) {
                        this.shoot();
                    }
                }, volley * 150); // 150ms delay between volleys
            }
        }
        
    }

    startWave(waveNumber) {
        this.level = waveNumber;
        this.waveInProgress = true;
        
        // Check if this is a boss wave (every 5 waves, and not same as last boss wave)
        if (waveNumber % 5 === 0 && waveNumber !== this.lastBossWave) {
            this.waveEnemiesTotal = 0;
            this.waveEnemiesRemaining = 0;
            this.waveEnemiesSpawned = 0;
            this.spawnBoss();
        } else {
            // Calculate total enemies for normal wave
            this.waveEnemiesTotal = 10 + (waveNumber - 1) * 5; // 10, 15, 20, 25...
            this.waveEnemiesSpawned = 0;
            this.waveEnemiesRemaining = this.waveEnemiesTotal;
        }
        
        this.updateUI();
    }

    spawnEnemy() {
        if (!this.waveInProgress || this.bossActive) return;
        if (this.waveEnemiesSpawned >= this.waveEnemiesTotal) return;
        
        const x = randomInt(0, CONFIG.CANVAS_WIDTH - CONFIG.ENEMY.WIDTH);
        const y = -CONFIG.ENEMY.HEIGHT;
        const speed = CONFIG.ENEMY.BASE_SPEED + (this.level - 1) * CONFIG.LEVELS.ENEMY_SPEED_INCREASE;
        
        this.enemies.push(new Enemy(x, y, speed, this.level));
        this.waveEnemiesSpawned++;
    }

    spawnBoss() {
        if (this.bossActive || this.boss) return;
        
        const x = CONFIG.CANVAS_WIDTH / 2 - CONFIG.BOSS.WIDTH / 2;
        const y = -CONFIG.BOSS.HEIGHT;
        
        this.boss = new Boss(x, y, this.level);
        this.bossActive = true;
        this.lastBossScore = this.score;
        
        // Clear existing enemies
        this.enemies = [];
        
        // Show boss warning
        this.effects.push(new TextEffect(
            CONFIG.CANVAS_WIDTH / 2,
            CONFIG.CANVAS_HEIGHT / 2,
            '⚠️ BOSS INCOMING! ⚠️',
            '#FF0000'
        ));
        
        shakeScreen(15, 500);
    }

    bossDefeated() {
        if (!this.boss) return;
        
        const bossX = this.boss.x + this.boss.width / 2;
        const bossY = this.boss.y + this.boss.height / 2;
        
        // Add score
        this.addScore(this.boss.points);
        
        // Add lots of XP
        this.addExperience(100);
        
        // Create massive explosion
        for (let i = 0; i < 10; i++) {
            setTimeout(() => {
                this.effects.push(new ExplosionEffect(
                    bossX + randomInt(-50, 50),
                    bossY + randomInt(-50, 50),
                    '#FFD700'
                ));
            }, i * 100);
        }
        
        // Show victory message
        this.effects.push(new TextEffect(
            CONFIG.CANVAS_WIDTH / 2,
            CONFIG.CANVAS_HEIGHT / 2,
            '🎉 BOSS DEFEATED! 🎉',
            '#FFD700'
        ));
        
        // Reset boss state
        this.bossActive = false;
        this.boss = null;
        this.lastBossWave = this.level;
        
        shakeScreen(20, 1000);
        
        // Grant special boss reward (will pause game and show selection)
        this.grantBossReward();
        
        // Wave will start after reward is selected (handled in showBossRewardSelection)
    }

    grantBossReward() {
        if (!this.player) return;
        
        // Show special boss reward selection
        this.showBossRewardSelection();
    }
    
    showBossRewardSelection() {
        const abilityOverlay = document.getElementById('ability-overlay');
        const abilityChoices = document.getElementById('ability-choices');
        
        // Boss rewards - ALL enhance bullets!
        const bossRewards = [
            {
                name: '👑 Royal Power',
                description: '공격력 +30, 체력 +50',
                effect: () => {
                    this.player.maxHealth += 50;
                    this.player.health = this.player.maxHealth;
                    CONFIG.BULLET.DAMAGE += 30;
                }
            },
            {
                name: '⚡ Ultra Fire Rate',
                description: '연사력 50% 증가',
                effect: () => {
                    this.player.shootCooldown = Math.max(50, this.player.shootCooldown * 0.5);
                }
            },
            {
                name: '🌀 Multi-Spiral',
                description: '나선탄 강화 (반경 +50%)',
                effect: () => {
                    this.player.powerUps.spiralShot = true;
                    // Will apply in applyBulletEnhancements
                }
            },
            {
                name: '💥 Mega Piercing',
                description: '관통 +3 (총 6회)',
                effect: () => {
                    this.player.powerUps.piercing = true;
                    this.player.piercingCount = 6;
                }
            },
            {
                name: '🔥 Inferno Blast',
                description: '폭발 범위 +100%',
                effect: () => {
                    this.player.powerUps.explosive = true;
                    this.player.powerUps.megaExplosion = true;
                }
            },
            {
                name: '🎯 Perfect Aim',
                description: '모든 탄환 유도 + 치명타',
                effect: () => {
                    this.player.powerUps.homingMissile = true;
                    this.player.powerUps.criticalHit = true;
                }
            },
            {
                name: '⚡ Chain Master',
                description: '연쇄 번개 점프 +2',
                effect: () => {
                    this.player.powerUps.chainLightning = true;
                }
            },
            {
                name: '🌌 Galaxy Shot',
                description: '트리플+퀴드 동시 획득',
                effect: () => {
                    this.player.powerUps.tripleShot = true;
                    this.player.powerUps.quadShot = true;
                }
            },
            {
                name: '💫 Ultimate Power',
                description: '모든 스탯 +20%',
                effect: () => {
                    CONFIG.BULLET.DAMAGE += 20;
                    this.player.maxHealth += 30;
                    this.player.health = Math.min(this.player.health + 30, this.player.maxHealth);
                    this.player.shootCooldown = Math.max(100, this.player.shootCooldown * 0.8);
                }
            }
        ];
        
        // Select 3 random boss rewards
        const selectedRewards = [];
        const usedIndices = new Set();
        
        while (selectedRewards.length < 3 && selectedRewards.length < bossRewards.length) {
            const index = Math.floor(Math.random() * bossRewards.length);
            if (!usedIndices.has(index)) {
                selectedRewards.push(bossRewards[index]);
                usedIndices.add(index);
            }
        }
        
        // Create reward buttons
        abilityChoices.innerHTML = '';
        selectedRewards.forEach((reward, index) => {
            const button = document.createElement('button');
            button.className = 'ability-button tier-SSS';
            button.style.borderColor = '#FF0066';
            button.style.opacity = '1'; // Force opacity to prevent transparency
            button.style.animation = `slideInFromBottom 0.5s ease-out ${index * 0.1}s forwards`;
            button.innerHTML = `
                <div class="ability-tier" style="color: #FF0066">[BOSS REWARD]</div>
                <div class="ability-name">${reward.name}</div>
                <div class="ability-description">${reward.description || '특별한 보스 보상'}</div>
            `;
            button.addEventListener('click', () => {
                try {
                    reward.effect();
                    this.hideAbilitySelection();
                    this.isPaused = false;
                    this.updateUI();
                    
                    // Show reward message
                    this.effects.push(new TextEffect(
                        CONFIG.CANVAS_WIDTH / 2,
                        CONFIG.CANVAS_HEIGHT / 2 + 50,
                        `획득: ${reward.name}`,
                        '#FF00FF'
                    ));
                    
                    // Start next wave after reward selection
                    setTimeout(() => {
                        if (this.state === 'playing') {
                            this.startWave(this.level + 1);
                        }
                    }, 2000);
                } catch (error) {
                    console.error('Boss reward error:', error);
                    this.hideAbilitySelection();
                    this.isPaused = false;
                    this.updateUI();
                    
                    // Start wave even if error
                    setTimeout(() => {
                        if (this.state === 'playing') {
                            this.startWave(this.level + 1);
                        }
                    }, 2000);
                }
            });
            abilityChoices.appendChild(button);
        });
        
        // Pause game and show overlay
        this.isPaused = true;
        abilityOverlay.classList.remove('hidden');
    }

    // PowerUp system removed for gameplay balance

    triggerNova() {
        if (!this.player) return;
        
        const centerX = this.player.x + this.player.width / 2;
        const centerY = this.player.y + this.player.height / 2;
        
        // Create 16 bullets in all directions
        for (let i = 0; i < 16; i++) {
            const angle = (i / 16) * Math.PI * 2;
            const bullet = new Bullet(centerX, centerY, true);
            bullet.vx = Math.cos(angle) * 6;
            bullet.vy = Math.sin(angle) * 6;
            this.bullets.push(bullet);
        }
        
        // Visual effect - use ExplosionEffect instead of Particle
        this.effects.push(new ExplosionEffect(
            centerX,
            centerY,
            '#FFD700'
        ));
        
        // Add nova text effect
        this.effects.push(new TextEffect(
            centerX,
            centerY - 30,
            '🌟 NOVA 🌟',
            '#FFD700'
        ));
    }
    
    triggerShockwave() {
        if (!this.player) return;
        
        const centerX = this.player.x + this.player.width / 2;
        const centerY = this.player.y + this.player.height / 2;
        const shockwaveRadius = 450; // Extended to map center (900/2 = 450)
        
        // Push back and damage enemies
        for (const enemy of this.enemies) {
            const dx = (enemy.x + enemy.width / 2) - centerX;
            const dy = (enemy.y + enemy.height / 2) - centerY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < shockwaveRadius) {
                enemy.takeDamage(30);
                // Push enemy away
                enemy.x += (dx / dist) * 30;
                enemy.y += (dy / dist) * 30;
            }
        }
        
        // Enhanced visual effects - multiple expanding rings
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                this.effects.push(new ExplosionEffect(
                    centerX,
                    centerY,
                    '#88CCFF'
                ));
            }, i * 50);
        }
        
        // Add shockwave text effect
        this.effects.push(new TextEffect(
            centerX,
            centerY - 30,
            '💨 SHOCKWAVE 💨',
            '#88CCFF'
        ));
    }
    
    triggerChainLightning(sourceEnemy, jumpsRemaining, range) {
        if (jumpsRemaining <= 0 || !sourceEnemy || !sourceEnemy.active) return;
        
        const sourceX = sourceEnemy.x + sourceEnemy.width / 2;
        const sourceY = sourceEnemy.y + sourceEnemy.height / 2;
        
        // Find nearest enemy within range that hasn't been hit yet
        let nearestEnemy = null;
        let minDist = Infinity;
        
        // Track hit enemies to prevent re-hitting (using a simple approach)
        if (!this.lightningHitEnemies) {
            this.lightningHitEnemies = new Set();
        }
        
        for (const enemy of this.enemies) {
            if (!enemy.active || enemy === sourceEnemy || this.lightningHitEnemies.has(enemy)) continue;
            
            const dx = (enemy.x + enemy.width / 2) - sourceX;
            const dy = (enemy.y + enemy.height / 2) - sourceY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < range && dist < minDist) {
                minDist = dist;
                nearestEnemy = enemy;
            }
        }
        
        if (nearestEnemy) {
            // Mark as hit
            this.lightningHitEnemies.add(nearestEnemy);
            
            // Deal damage
            nearestEnemy.takeDamage(20);
            
            // Visual effect
            this.effects.push(new TextEffect(
                nearestEnemy.x + nearestEnemy.width / 2,
                nearestEnemy.y - 10,
                '⚡20',
                '#FFFF00'
            ));
            
            // Lightning visual effect
            this.effects.push(new ExplosionEffect(
                nearestEnemy.x + nearestEnemy.width / 2,
                nearestEnemy.y + nearestEnemy.height / 2,
                '#FFFF00'
            ));
            
            // Continue chain
            setTimeout(() => {
                this.triggerChainLightning(nearestEnemy, jumpsRemaining - 1, range);
            }, 100);
        } else {
            // Chain ended, clear tracking
            this.lightningHitEnemies = new Set();
        }
    }
    
    triggerToxicCloud() {
        if (!this.player) return;
        
        const centerX = this.player.x + this.player.width / 2;
        const centerY = this.player.y + this.player.height / 2;
        
        // Damage nearby enemies over time
        for (const enemy of this.enemies) {
            const dx = (enemy.x + enemy.width / 2) - centerX;
            const dy = (enemy.y + enemy.height / 2) - centerY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < 120) {
                enemy.takeDamage(10);
            }
        }
        
        // Visual effect - use ExplosionEffect instead of Particle
        this.effects.push(new ExplosionEffect(
            centerX,
            centerY,
            '#66FF66'
        ));
        
        // Add toxic text effect
        this.effects.push(new TextEffect(
            centerX,
            centerY - 30,
            '☠️ TOXIC ☠️',
            '#66FF66'
        ));
    }

    createBlackHole(x, y) {
        const duration = 3000;
        const radius = 150;
        const startTime = Date.now();
        
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                this.effects.push(new ExplosionEffect(x, y, '#9400D3'));
            }, i * 100);
        }
        
        this.effects.push(new TextEffect(x, y - 30, '🌀 BLACK HOLE 🌀', '#9400D3'));
        
        const blackHoleInterval = setInterval(() => {
            if (Date.now() - startTime > duration) {
                clearInterval(blackHoleInterval);
                return;
            }
            
            for (const enemy of this.enemies) {
                if (!enemy.active) continue;
                const dx = x - (enemy.x + enemy.width / 2);
                const dy = y - (enemy.y + enemy.height / 2);
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist < radius) {
                    enemy.x += (dx / dist) * 2;
                    enemy.y += (dy / dist) * 2;
                    if (dist < 30) {
                        enemy.takeDamage(5);
                    }
                }
            }
        }, 50);
    }

    createExplosion(x, y) {
        // Damage nearby enemies
        const explosionRadius = this.player && this.player.powerUps.megaExplosion ? 200 : 80;
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const enemy = this.enemies[i];
            const dx = (enemy.x + enemy.width / 2) - x;
            const dy = (enemy.y + enemy.height / 2) - y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < explosionRadius) {
                const damage = this.player && this.player.powerUps.megaExplosion ? 80 : 30;
                enemy.takeDamage(damage);
                this.effects.push(new TextEffect(
                    enemy.x + enemy.width / 2,
                    enemy.y - 10,
                    damage.toString(),
                    '#FF4444'
                ));
            }
        }
        
        // Visual effect
        this.effects.push(new ExplosionEffect(x, y, '#FF6B00'));
    }

    update(currentTime) {
        if (this.state !== 'playing') return;
        if (this.isPaused) {
            this.lastTime = currentTime;
            requestAnimationFrame(this.update);
            return;
        }

        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;

        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw background
        this.drawBackground();

        // Handle player input
        this.handlePlayerMovement();
        
        // Auto shooting - simplified to just shoot when ready
        if (this.autoShoot && this.player) {
            this.shoot();
            
            const now = Date.now();
            
            // Drone shooting - uses enhanced bullets
            if (this.player.drones.length > 0) {
                for (const drone of this.player.drones) {
                    if (now - drone.lastShot > 800) {
                        const bullet = new Bullet(drone.x - 3, drone.y - 10, true);
                        this.applyBulletEnhancements(bullet);
                        this.bullets.push(bullet);
                        drone.lastShot = now;
                    }
                }
            }
            
            // Orbital shooting - uses enhanced bullets
            if (this.player.orbitals.length > 0) {
                for (const orbital of this.player.orbitals) {
                    if (!orbital.lastShot) orbital.lastShot = 0;
                    if (now - orbital.lastShot > 1000) {
                        const bullet = new Bullet(orbital.x - 3, orbital.y - 10, true);
                        this.applyBulletEnhancements(bullet);
                        this.bullets.push(bullet);
                        orbital.lastShot = now;
                    }
                }
            }
            
            // Nova periodic trigger
            if (this.player.powerUps.nova && now - this.player.lastNovaTime > 4000) {
                this.triggerNova();
                this.player.lastNovaTime = now;
            }
            
            // Shockwave periodic trigger
            if (this.player.powerUps.shockwave && now - this.player.lastShockwaveTime > 3000) {
                this.triggerShockwave();
                this.player.lastShockwaveTime = now;
            }
            
            // Toxic Cloud periodic trigger
            if (this.player.powerUps.toxicCloud && now - this.player.lastToxicCloudTime > 2000) {
                this.triggerToxicCloud();
                this.player.lastToxicCloudTime = now;
            }
            
            // Orbital damage to nearby enemies
            if (this.player.orbitals.length > 0) {
                for (const orb of this.player.orbitals) {
                    for (let i = this.enemies.length - 1; i >= 0; i--) {
                        const enemy = this.enemies[i];
                        const dx = orb.x - (enemy.x + enemy.width / 2);
                        const dy = orb.y - (enemy.y + enemy.height / 2);
                        const dist = Math.sqrt(dx * dx + dy * dy);
                        
                        if (dist < 20) {
                            enemy.takeDamage(orb.damage);
                        }
                    }
                }
            }
            
            // Boomerang damage
            if (this.player.boomerangs.length > 0) {
                for (const boom of this.player.boomerangs) {
                    for (let i = this.enemies.length - 1; i >= 0; i--) {
                        const enemy = this.enemies[i];
                        const dx = boom.x - (enemy.x + enemy.width / 2);
                        const dy = boom.y - (enemy.y + enemy.height / 2);
                        const dist = Math.sqrt(dx * dx + dy * dy);
                        
                        if (dist < 25) {
                            enemy.takeDamage(40);
                        }
                    }
                }
            }
        }

        // Update player
        if (this.player) {
            this.player.update(deltaTime, CONFIG.CANVAS_WIDTH);
            this.player.draw(this.ctx);
        }

        // Check for boss spawn
        if (!this.bossActive && this.score >= this.lastBossScore + CONFIG.BOSS.SPAWN_SCORE) {
            this.spawnBoss();
        }
        
        // Spawn enemies (not when boss is active)
        if (!this.bossActive && currentTime - this.lastEnemySpawn > this.enemySpawnInterval) {
            this.spawnEnemy();
            this.lastEnemySpawn = currentTime;
        }
        
        // Update and draw boss
        if (this.boss) {
            this.boss.update(deltaTime);
            this.boss.draw(this.ctx);
            
            // Boss shooting with varied patterns
            if (this.boss.shouldShoot()) {
                const bulletData = this.boss.getAttackBullets();
                
                bulletData.forEach(data => {
                    const bullet = new Bullet(data.x - CONFIG.ENEMY_BULLET.WIDTH / 2, data.y, false);
                    
                    // Apply angle-based velocity
                    const speed = data.speed || CONFIG.ENEMY_BULLET.SPEED;
                    bullet.vx = Math.cos(data.angle) * speed;
                    bullet.vy = Math.sin(data.angle) * speed;
                    
                    this.bullets.push(bullet);
                });
            }
            
            // Remove if destroyed
            if (!this.boss.active) {
                this.bossActive = false;
                this.boss = null;
            }
        }

        // Update and draw enemies
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const enemy = this.enemies[i];
            
            // Time Slow effect
            if (this.player && this.player.powerUps.timeSlow) {
                enemy.vy *= 0.3; // Slow down 70%
                enemy.update(deltaTime);
                enemy.vy /= 0.3; // Restore
            } else {
                enemy.update(deltaTime);
            }
            
            // Black hole pull
            if (this.player && this.player.blackHoles.length > 0) {
                for (const bh of this.player.blackHoles) {
                    const dx = bh.x - (enemy.x + enemy.width / 2);
                    const dy = bh.y - (enemy.y + enemy.height / 2);
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    
                    if (dist < bh.pullRadius) {
                        const pullStrength = (1 - dist / bh.pullRadius) * 3;
                        enemy.x += (dx / dist) * pullStrength;
                        enemy.y += (dy / dist) * pullStrength;
                        
                        // Damage if very close
                        if (dist < bh.size) {
                            enemy.takeDamage(5);
                        }
                    }
                }
            }
            
            enemy.draw(this.ctx);

            // Enemy shooting with varied patterns
            if (enemy.shouldShoot() && this.player) {
                const playerCenterX = this.player.x + this.player.width / 2;
                const playerCenterY = this.player.y + this.player.height / 2;
                const bulletPatterns = enemy.getBulletPattern(playerCenterX, playerCenterY);
                
                for (const pattern of bulletPatterns) {
                    const bullet = new Bullet(pattern.x, pattern.y, false);
                    bullet.vx = pattern.vx;
                    bullet.vy = pattern.vy;
                    this.bullets.push(bullet);
                }
            }

            // Respawn at top if enemy reaches bottom (no damage)
                if (enemy.y > CONFIG.CANVAS_HEIGHT && enemy.active) {
                enemy.y = -enemy.height;
                enemy.x = randomInt(0, CONFIG.CANVAS_WIDTH - enemy.width);
                }
            
            // Remove only if destroyed
            if (!enemy.active) {
                this.enemies.splice(i, 1);
                if (this.waveInProgress) {
                    this.waveEnemiesRemaining--;
                }
            }
        }
        
        // Check if wave is complete
        if (this.waveInProgress && 
            !this.bossActive &&
            this.waveEnemiesSpawned >= this.waveEnemiesTotal &&
            this.enemies.length === 0) {
            // Wave complete, start next wave
            this.waveInProgress = false;
            setTimeout(() => {
                this.startWave(this.level + 1);
            }, 2000);
        }

        // Update and draw bullets
        for (let i = this.bullets.length - 1; i >= 0; i--) {
            const bullet = this.bullets[i];
            bullet.update(deltaTime, this.enemies, this.player);
            bullet.draw(this.ctx);

            if (!bullet.active) {
                this.bullets.splice(i, 1);
            }
        }

        // PowerUp system removed

        // Update and draw effects
        for (let i = this.effects.length - 1; i >= 0; i--) {
            const effect = this.effects[i];
            effect.update(deltaTime);
            effect.draw(this.ctx);

            if (!effect.active) {
                this.effects.splice(i, 1);
            }
        }

        // Check collisions
        this.checkCollisions();

        // Check game over
        if (this.player && !this.player.active) {
            this.gameOver();
        }

        // Continue game loop
        requestAnimationFrame(this.update);
    }

    handlePlayerMovement() {
        if (!this.player) return;

        this.player.vx = 0;
        this.player.vy = 0;

        // Keyboard controls
        if (this.keys['ArrowLeft'] || this.keys['a'] || this.keys['A']) {
            this.player.vx = -this.player.speed;
        }
        if (this.keys['ArrowRight'] || this.keys['d'] || this.keys['D']) {
            this.player.vx = this.player.speed;
        }
        if (this.keys['ArrowUp'] || this.keys['w'] || this.keys['W']) {
            this.player.vy = -this.player.speed;
        }
        if (this.keys['ArrowDown'] || this.keys['s'] || this.keys['S']) {
            this.player.vy = this.player.speed;
        }

        // Touch controls - horizontal movement only
        if (this.touchControls.isActive) {
            const targetX = this.touchControls.currentX;
            const playerCenterX = this.player.x + this.player.width / 2;
            
            const dx = targetX - playerCenterX;
            const distance = Math.abs(dx);
            
            // Direct position update for immediate response
            if (distance > 5) { // Small dead zone
                // Move player directly to touch position (with bounds checking)
                const newX = targetX - this.player.width / 2;
                this.player.x = Math.max(0, Math.min(newX, CONFIG.CANVAS_WIDTH - this.player.width));
            }
        }
    }

    checkCollisions() {
        // Player bullets vs boss
        if (this.boss) {
            for (let i = this.bullets.length - 1; i >= 0; i--) {
                const bullet = this.bullets[i];
                if (!bullet.isPlayer) continue;
                
                if (checkCollision(bullet, this.boss)) {
                    // Calculate damage
                    let damage = bullet.damage;
                    let isCrit = false;
                    if (this.player && this.player.powerUps.criticalHit && Math.random() < (this.player.critChance || 0.2)) {
                        damage *= (this.player.critMultiplier || 2);
                        isCrit = true;
                    }
                    
                    const destroyed = this.boss.takeDamage(damage);
                    
                    // Show damage
                    this.effects.push(new TextEffect(
                        this.boss.x + this.boss.width / 2,
                        this.boss.y + 20,
                        isCrit ? `${damage}!` : `${damage}`,
                        isCrit ? '#FF6B00' : '#FFFFFF'
                    ));
                    
                    if (!this.player || !this.player.powerUps.piercing) {
                        bullet.destroy();
                    }
                    
                    if (destroyed) {
                        // Boss defeated!
                        this.bossDefeated();
                    }
                    
                    if (!this.player || !this.player.powerUps.piercing) {
                        break;
                    }
                }
            }
        }
        
        // Player bullets vs enemies
        for (let i = this.bullets.length - 1; i >= 0; i--) {
            const bullet = this.bullets[i];
            if (!bullet.isPlayer) continue;

            for (let j = this.enemies.length - 1; j >= 0; j--) {
                const enemy = this.enemies[j];
                
                if (checkCollision(bullet, enemy)) {
                    // Calculate damage (with critical hit)
                    let damage = bullet.damage;
                    let isCrit = false;
                    if (this.player && this.player.powerUps.criticalHit && Math.random() < 0.2) {
                        damage *= 2;
                        isCrit = true;
                    }
                    
                    // Damage enemy
                    const destroyed = enemy.takeDamage(damage);
                    
                    // Show damage number
                    this.effects.push(new TextEffect(
                        enemy.x + enemy.width / 2,
                        enemy.y - 10,
                        isCrit ? `${damage}!` : `${damage}`,
                        isCrit ? '#FF6B00' : '#FFFFFF'
                    ));
                    
                    // Vampire effect
                    if (this.player && this.player.powerUps.vampire) {
                        this.player.heal(Math.floor(damage * 0.1));
                        this.updateUI();
                    }
                    
                    // Explosive effect on hit (not on destroy)
                    if (bullet.isExplosive || (this.player && this.player.powerUps.explosive)) {
                        this.createExplosion(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2);
                    }
                    
                    // Chain Lightning - jumps to nearby enemies
                    if (this.player && this.player.powerUps.chainLightning) {
                        this.lightningHitEnemies = new Set(); // Reset for each new chain
                        this.lightningHitEnemies.add(enemy); // Mark first hit
                        this.triggerChainLightning(enemy, 3, 200); // Jump up to 3 times, 200px range
                    }
                    
                    // Black Hole activation
                    if (bullet.isBlackHole && !bullet.blackHoleActivated) {
                        bullet.blackHoleActivated = true;
                        this.createBlackHole(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2);
                        bullet.destroy();
                        continue;
                    }
                    
                    // Piercing bullets don't get destroyed
                    if (!this.player || !this.player.powerUps.piercing) {
                    bullet.destroy();
                    }

                    if (destroyed) {
                        // Add score
                        this.addScore(enemy.points);
                        
                        // Add experience
                        this.addExperience(10);
                        
                        // Create explosion
                        this.effects.push(new ExplosionEffect(
                            enemy.x + enemy.width / 2,
                            enemy.y + enemy.height / 2,
                            '#FFD700'
                        ));
                        
                        // Show points
                        this.effects.push(new TextEffect(
                            enemy.x + enemy.width / 2,
                            enemy.y,
                            `+${enemy.points}`,
                            '#FFD700'
                        ));
                        
                        // PowerUp system removed
                    }
                    
                    if (!this.player || !this.player.powerUps.piercing) {
                    break;
                    }
                }
            }
        }

        // Enemy bullets vs player
        if (this.player) {
            for (let i = this.bullets.length - 1; i >= 0; i--) {
                const bullet = this.bullets[i];
                if (bullet.isPlayer) continue;

                if (checkCollision(bullet, this.player)) {
                    const killed = this.player.takeDamage(bullet.damage);
                    bullet.destroy();
                    this.updateUI();
                    
                    if (!killed) {
                        shakeScreen(5, 200);
                    }
                }
            }

            // PowerUp system removed

            // Player vs enemies (collision)
            for (let i = this.enemies.length - 1; i >= 0; i--) {
                const enemy = this.enemies[i];
                
                if (checkCollision(this.player, enemy)) {
                    const killed = this.player.takeDamage(20);
                    enemy.destroy();
                    this.updateUI();
                    
                    this.effects.push(new ExplosionEffect(
                        enemy.x + enemy.width / 2,
                        enemy.y + enemy.height / 2,
                        '#FF4444'
                    ));
                    
                    if (!killed) {
                        shakeScreen(8, 300);
                    }
                }
            }
        }
    }

    drawBackground() {
        // Draw starfield
        this.ctx.fillStyle = '#0a0a1a';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.stars.forEach(star => {
            star.y += star.speed;
            if (star.y > CONFIG.CANVAS_HEIGHT) {
                star.y = 0;
                star.x = Math.random() * CONFIG.CANVAS_WIDTH;
            }

            star.brightness += Math.random() * 0.1 - 0.05;
            star.brightness = Math.max(0.3, Math.min(1, star.brightness));

            this.ctx.fillStyle = `rgba(255, 255, 255, ${star.brightness})`;
            this.ctx.beginPath();
            this.ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            this.ctx.fill();
        });
    }

    addScore(points) {
        this.score += Math.floor(points * this.level * CONFIG.LEVELS.SCORE_MULTIPLIER);
        this.updateUI();
        this.checkLevelUp();
    }

    addExperience(amount) {
        this.experience += amount;
        this.updateUI();
        
        // Check for level up
        if (this.experience >= this.experienceToNextLevel) {
            this.levelUp();
        }
    }

    levelUp() {
        this.playerLevel++;
        this.experience -= this.experienceToNextLevel;
        this.experienceToNextLevel = Math.floor(this.experienceToNextLevel * 1.15); // Further reduced from 1.2 to 1.15
        
        // Pause game and show ability selection
        this.isPaused = true;
        this.showAbilitySelection();
        
        // Show level up message
        this.effects.push(new TextEffect(
            CONFIG.CANVAS_WIDTH / 2,
            CONFIG.CANVAS_HEIGHT / 2,
            `레벨 업! Lv.${this.playerLevel}`,
            '#FFD700'
        ));
    }

    checkLevelUp() {
        const newLevel = Math.floor(this.score / 500) + 1;
        if (newLevel > this.level) {
            this.level = newLevel;
            this.enemySpawnInterval = Math.max(
                CONFIG.ENEMY.MIN_SPAWN_INTERVAL,
                CONFIG.ENEMY.SPAWN_INTERVAL - (this.level - 1) * CONFIG.LEVELS.SPAWN_RATE_DECREASE
            );
            
            // Show level up message
            this.effects.push(new TextEffect(
                CONFIG.CANVAS_WIDTH / 2,
                CONFIG.CANVAS_HEIGHT / 2,
                `웨이브 ${this.level}!`,
                '#4ECDC4'
            ));
        }
    }

    showAbilitySelection() {
        const abilityOverlay = document.getElementById('ability-overlay');
        const abilityChoices = document.getElementById('ability-choices');
        
        // Define available abilities with rarity
        const abilities = [
            // SSS Tier (0.5% chance)
            { 
                id: 'godMode', 
                tier: 'SSS',
                name: '👑 절대 방어', 
                description: '5초간 무적 상태 (재사용 60초)',
                effect: () => {
                    const currentTime = Date.now();
                    if (currentTime - this.player.lastGodModeUse > 60000) {
                        this.player.powerUps.godMode = true;
                        this.player.godModeEndTime = currentTime + 5000;
                        this.player.lastGodModeUse = currentTime;
                    }
                }
            },
            { 
                id: 'timeSlow', 
                tier: 'SSS',
                name: '⏰ 시간 왜곡', 
                description: '적 속도 70% 감소',
                effect: () => {
                    this.player.powerUps.timeSlow = true;
                }
            },
            // SS Tier (2% chance)
            { 
                id: 'pentaShot', 
                tier: 'SS',
                name: '🌟 펜타샷', 
                description: '5발 동시 발사',
                effect: () => {
                    this.player.powerUps.pentaShot = true;
                }
            },
            { 
                id: 'orbital', 
                tier: 'SS',
                name: '🛸 궤도 위성', 
                description: '3개의 위성이 주위를 공격',
                effect: () => {
                    this.player.powerUps.orbital = true;
                    this.player.orbitalCount += 3;
                    for (let i = 0; i < 3; i++) {
                        this.player.orbitals.push({x: this.player.x, y: this.player.y, damage: 30});
                    }
                }
            },
            { 
                id: 'megaExplosion', 
                tier: 'SS',
                name: '💥 메가 폭발', 
                description: '폭발 범위 +100%, 데미지 +50',
                effect: () => {
                    this.player.powerUps.megaExplosion = true;
                }
            },
            {
                id: 'blackHole',
                tier: 'SS',
                name: '🌀 블랙홀',
                description: '적을 빨아들이는 블랙홀 생성',
                effect: () => {
                    this.player.powerUps.blackHole = true;
                    // Create a black hole
                    this.player.blackHoles.push({
                        x: CONFIG.CANVAS_WIDTH / 2,
                        y: CONFIG.CANVAS_HEIGHT / 3,
                        time: 0,
                        size: 40,
                        pullRadius: 200
                    });
                }
            },
            {
                id: 'phoenixReborn',
                tier: 'SS',
                name: '🔥 불사조',
                description: '사망 시 1회 부활 (재사용 90초)',
                effect: () => {
                    this.player.powerUps.phoenixReborn = true;
                }
            },
            // S Tier (5% chance)
            { 
                id: 'quadShot', 
                tier: 'S',
                name: '🎯 쿼드샷', 
                description: '4발 동시 발사',
                effect: () => {
                    this.player.powerUps.quadShot = true;
                }
            },
            { 
                id: 'laserBeam', 
                tier: 'S',
                name: '🔆 레이저 빔', 
                description: '관통 레이저 발사',
                effect: () => {
                    this.player.powerUps.laserBeam = true;
                }
            },
            { 
                id: 'homingMissile', 
                tier: 'S',
                name: '🚀 유도 미사일', 
                description: '적을 추적하는 미사일',
                effect: () => {
                    this.player.powerUps.homingMissile = true;
                }
            },
            { 
                id: 'chainLightning', 
                tier: 'S',
                name: '⚡ 연쇄 번개', 
                description: '적에서 적으로 튕기는 번개',
                effect: () => {
                    this.player.powerUps.chainLightning = true;
                }
            },
            {
                id: 'nova',
                tier: 'S',
                name: '🌟 노바',
                description: '주기적으로 전방위 탄환 발사',
                effect: () => {
                    this.player.powerUps.nova = true;
                    if (!this.player.lastNovaTime) {
                        this.player.lastNovaTime = 0;
                    }
                    // Trigger nova immediately
                    this.triggerNova();
                }
            },
            {
                id: 'spiralShot',
                tier: 'S',
                name: '🌀 나선 탄환',
                description: '회전하며 발사되는 탄환',
                effect: () => {
                    this.player.powerUps.spiralShot = true;
                }
            },
            // A Tier (10% chance)
            { 
                id: 'tripleShot', 
                tier: 'A',
                name: '🎯 트리플샷', 
                description: '3발 동시 발사',
                effect: () => {
                    this.player.powerUps.tripleShot = true;
                }
            },
            { 
                id: 'piercing', 
                tier: 'A',
                name: '🔥 관통 탄환', 
                description: '총알이 3명까지 관통',
                effect: () => {
                    this.player.powerUps.piercing = true;
                    this.player.piercingCount = 3;
                }
            },
            { 
                id: 'explosive', 
                tier: 'A',
                name: '💣 폭발 탄환', 
                description: '탄환 명중시 광역 폭발',
                effect: () => {
                    this.player.powerUps.explosive = true;
                }
            },
            { 
                id: 'multiShot', 
                tier: 'A',
                name: '🔫 멀티샷', 
                description: '발사 횟수 +1',
                effect: () => {
                    this.player.multiShotCount = (this.player.multiShotCount || 1) + 1;
                }
            },
            { 
                id: 'drone', 
                tier: 'A',
                name: '🤖 전투 드론', 
                description: '자동 공격 드론 소환',
                effect: () => {
                    this.player.droneCount += 1;
                    this.player.drones.push({
                        x: this.player.x,
                        y: this.player.y,
                        lastShot: 0
                    });
                }
            },
            {
                id: 'shockwave',
                tier: 'A',
                name: '💨 충격파',
                description: '주변 적을 밀어내는 충격파',
                effect: () => {
                    this.player.powerUps.shockwave = true;
                    if (!this.player.lastShockwaveTime) {
                        this.player.lastShockwaveTime = 0;
                    }
                }
            },
            // B Tier (20% chance)
            { 
                id: 'damageUp2', 
                tier: 'B',
                name: '⚔️ 공격력 강화', 
                description: '공격력 +20',
                effect: () => {
                    CONFIG.BULLET.DAMAGE += 20;
                }
            },
            { 
                id: 'fireRateUp2', 
                tier: 'B',
                name: '⚡ 연사 강화', 
                description: '발사 속도 +30%',
                effect: () => {
                    this.player.shootCooldown = Math.max(100, this.player.shootCooldown * 0.7);
                }
            },
            { 
                id: 'bulletSize', 
                tier: 'B',
                name: '💥 대형 탄환', 
                description: '총알 크기 +40%',
                effect: () => {
                    CONFIG.BULLET.WIDTH *= 1.4;
                    CONFIG.BULLET.HEIGHT *= 1.4;
                }
            },
            { 
                id: 'criticalHit', 
                tier: 'B',
                name: '✨ 치명타', 
                description: '25% 확률로 2.5배 데미지',
                effect: () => {
                    this.player.powerUps.criticalHit = true;
                    this.player.critChance = 0.25;
                    this.player.critMultiplier = 2.5;
                }
            },
            { 
                id: 'boomerang', 
                tier: 'B',
                name: '🪃 부메랑', 
                description: '돌아오는 부메랑 발사',
                effect: () => {
                    this.player.powerUps.boomerang = true;
                }
            },
            {
                id: 'doubleShot',
                tier: 'B',
                name: '🎯 더블샷',
                description: '탄환 +1',
                effect: () => {
                    this.player.powerUps.doubleShot = true;
                }
            },
            // Special enhancements - only appear if base ability active
            {
                id: 'explosiveUpgrade',
                tier: 'A',
                name: '💣 폭발 강화',
                description: '폭발 범위 +50%',
                effect: () => {
                    // Handled in createExplosion
                }
            },
            {
                id: 'chainUpgrade',
                tier: 'A',
                name: '⚡ 연쇄 강화',
                description: '번개 점프 +2',
                effect: () => {
                    // Handled in triggerChainLightning
                }
            },
            {
                id: 'piercingUpgrade',
                tier: 'A',
                name: '🔥 관통 강화',
                description: '관통 횟수 +2',
                effect: () => {
                    this.player.piercingCount += 2;
                }
            },
            // C Tier (30% chance)
            { 
                id: 'damageUp', 
                tier: 'C',
                name: '⚔️ 공격력 증가', 
                description: '공격력 +12',
                effect: () => {
                    CONFIG.BULLET.DAMAGE += 12;
                }
            },
            { 
                id: 'fireRateUp', 
                tier: 'C',
                name: '⚡ 연사 증가', 
                description: '발사 속도 +20%',
                effect: () => {
                    this.player.shootCooldown = Math.max(100, this.player.shootCooldown * 0.8);
                }
            },
            { 
                id: 'bulletSpeed', 
                tier: 'C',
                name: '💨 탄환 가속', 
                description: '총알 속도 +30%',
                effect: () => {
                    CONFIG.BULLET.SPEED *= 1.3;
                }
            },
            { 
                id: 'freezing', 
                tier: 'C',
                name: '❄️ 냉동 탄환', 
                description: '적 속도 40% 감소',
                effect: () => {
                    this.player.powerUps.freezing = true;
                }
            },
            // D Tier (32.5% chance)
            { 
                id: 'damageUpSmall', 
                tier: 'D',
                name: '⚔️ 공격력 소폭 증가', 
                description: '공격력 +8',
                effect: () => {
                    CONFIG.BULLET.DAMAGE += 8;
                }
            },
            { 
                id: 'fireRateUpSmall', 
                tier: 'D',
                name: '⚡ 연사 소폭 증가', 
                description: '발사 속도 +15%',
                effect: () => {
                    this.player.shootCooldown = Math.max(100, this.player.shootCooldown * 0.85);
                }
            },
        ];
        
        // Tier weights for rarity - favor lower tiers
        const tierWeights = {
            'SSS': 2,    // Very rare
            'SS': 5,     // Rare
            'S': 10,     // Uncommon
            'A': 18,     // Common
            'B': 25,     // Very common
            'C': 25,     // Very common
            'D': 15      // Common
        };
        
        // Select 3 unique abilities based on weighted random
        const selectedAbilities = [];
        const usedIds = new Set();
        
        let attempts = 0;
        const maxAttempts = 50;
        
        while (selectedAbilities.length < 3 && attempts < maxAttempts) {
            attempts++;
            
            const roll = Math.random() * 100;
            let cumulative = 0;
            let selectedTier = 'D';
            
            for (const [tier, weight] of Object.entries(tierWeights)) {
                cumulative += weight;
                if (roll < cumulative) {
                    selectedTier = tier;
                    break;
                }
            }
            
            // Filter abilities by selected tier and exclude already selected
            // Also check special requirements
            const tierAbilities = abilities.filter(a => {
                if (a.tier !== selectedTier || usedIds.has(a.id)) return false;
                
                // Conditional abilities
                if (a.id === 'megaExplosion' && !this.player.powerUps.explosive) return false;
                if (a.id === 'explosiveUpgrade' && !this.player.powerUps.explosive) return false;
                if (a.id === 'chainUpgrade' && !this.player.powerUps.chainLightning) return false;
                if (a.id === 'piercingUpgrade' && !this.player.powerUps.piercing) return false;
                
                return true;
            });
            
            if (tierAbilities.length > 0) {
                const randomAbility = tierAbilities[Math.floor(Math.random() * tierAbilities.length)];
                selectedAbilities.push(randomAbility);
                usedIds.add(randomAbility.id);
            }
        }
        
        // Fallback: if we couldn't get 3 unique abilities, fill with any remaining
        if (selectedAbilities.length < 3) {
            const remainingAbilities = abilities.filter(a => !usedIds.has(a.id));
            while (selectedAbilities.length < 3 && remainingAbilities.length > 0) {
                const randomIndex = Math.floor(Math.random() * remainingAbilities.length);
                const ability = remainingAbilities.splice(randomIndex, 1)[0];
                selectedAbilities.push(ability);
                usedIds.add(ability.id);
            }
        }
        
        // Tier colors
        const tierColors = {
            'SSS': '#FF0066',
            'SS': '#FF6B00',
            'S': '#FFD700',
            'A': '#00FF88',
            'B': '#00CCFF',
            'C': '#9370DB',
            'D': '#A0A0A0'
        };
        
        // Create ability buttons
        abilityChoices.innerHTML = '';
        selectedAbilities.forEach(ability => {
            const button = document.createElement('button');
            button.className = `ability-button tier-${ability.tier}`;
            button.style.borderColor = tierColors[ability.tier];
            button.innerHTML = `
                <div class="ability-tier" style="color: ${tierColors[ability.tier]}">[${ability.tier}]</div>
                <div class="ability-name">${ability.name}</div>
                <div class="ability-description">${ability.description}</div>
            `;
            button.addEventListener('click', () => {
                try {
                    ability.effect();
                    this.hideAbilitySelection();
                    this.isPaused = false;
                    this.updateUI();
                } catch (error) {
                    console.error('Ability effect error:', error);
                    // Still hide the overlay and resume game
                    this.hideAbilitySelection();
                    this.isPaused = false;
                    this.updateUI();
                }
            });
            abilityChoices.appendChild(button);
        });
        
        abilityOverlay.classList.remove('hidden');
    }

    hideAbilitySelection() {
        const abilityOverlay = document.getElementById('ability-overlay');
        abilityOverlay.classList.add('hidden');
    }

    updateUI() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('level').textContent = this.level;
        
        // Update remaining enemies count
        const remainingCount = this.bossActive ? (this.boss && this.boss.active ? 1 : 0) : this.waveEnemiesRemaining;
        document.getElementById('remaining-enemies').textContent = remainingCount;
        
        // Update experience bar
        const expPercent = (this.experience / this.experienceToNextLevel) * 100;
        const expFill = document.getElementById('exp-fill');
        if (expFill) {
            expFill.style.width = `${expPercent}%`;
        }
        
        // Update player level display
        const playerLevelEl = document.getElementById('player-level');
        if (playerLevelEl) {
            playerLevelEl.textContent = this.playerLevel;
        }
        
        if (this.player) {
            const healthPercent = this.player.getHealthPercentage();
            document.getElementById('health-fill').style.width = `${healthPercent}%`;
        }
    }

    gameOver() {
        this.stop();
        document.getElementById('final-score').textContent = this.score;
        document.getElementById('final-level').textContent = this.level;
        
        // Show game over screen
        document.getElementById('game-screen').classList.remove('active');
        document.getElementById('gameover-screen').classList.add('active');
    }
}

