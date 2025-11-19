// Game Configuration
export const CONFIG = {
    // Canvas settings
    CANVAS_WIDTH: 900,
    CANVAS_HEIGHT: 700,
    
    // Player settings
    PLAYER: {
        WIDTH: 50,
        HEIGHT: 50,
        SPEED: 3.9, // Player speed // Increased by 30% (3 * 1.3)
        MAX_HEALTH: 100,
        SHOOT_COOLDOWN: 970, // Increased by 20% for slower firing (808 * 1.2)
        COLOR: '#4CAF50',
    },
    
    // Enemy settings
    ENEMY: {
        WIDTH: 90, // Increased by 50% from 60 (60 * 1.5)
        HEIGHT: 90, // Increased by 50% from 60 (60 * 1.5)
        BASE_SPEED: 0.78, // Increased by 20% from 0.65 (0.65 * 1.2)
        BASE_HEALTH: 25, // Reduced from 50 to 25 (half)
        SPAWN_INTERVAL: 1500, // Faster spawn for more action
        MIN_SPAWN_INTERVAL: 600, // Minimum spawn interval
        POINTS: 10,
    },
    
    // Boss settings
    BOSS: {
        WIDTH: 100,
        HEIGHT: 100,
        SPEED: 0.65, // Increased by 30% (0.5 * 1.3)
        BASE_HEALTH: 500,
        SPAWN_SCORE: 2000, // Boss appears every 2000 points (increased from 1000)
        POINTS: 100,
    },
    
    // Bullet settings
    BULLET: {
        WIDTH: 6,
        HEIGHT: 15,
        SPEED: 3.5, // Reduced by 30% from 5 (5 * 0.7)
        COLOR: '#FFD700',
        DAMAGE: 25,
    },
    
    // Enemy bullet settings
    ENEMY_BULLET: {
        WIDTH: 5,
        HEIGHT: 12,
        SPEED: 3.25, // Increased by 30% (2.5 * 1.3)
        COLOR: '#FF4444',
        DAMAGE: 10,
    },
    
    // Power-up settings
    POWERUP: {
        WIDTH: 30,
        HEIGHT: 30,
        SPEED: 1.95, // Increased by 30% (1.5 * 1.3)
        SPAWN_CHANCE: 0.15, // 15% chance on enemy kill
        DURATION: 10000, // 10 seconds
        TYPES: {
            HEALTH: { color: '#FF6B6B', emoji: '❤️', effect: 'health' },
            RAPID_FIRE: { color: '#4ECDC4', emoji: '⚡', effect: 'rapidFire' },
            SHIELD: { color: '#95E1D3', emoji: '🛡️', effect: 'shield' },
            DOUBLE_SHOT: { color: '#F38181', emoji: '✨', effect: 'doubleShot' },
        }
    },
    
    // Level progression
    LEVELS: {
        SCORE_MULTIPLIER: 1.2,
        ENEMY_SPEED_INCREASE: 0.02, // Further reduced from 0.03 to 0.02
        SPAWN_RATE_DECREASE: 100, // Reduced from 150 for even more gradual increase
    },
    
    // Particle effects
    PARTICLES: {
        COUNT: 15,
        SIZE: 3,
        SPEED: 2,
        LIFETIME: 500,
    },
};

// Emoji sets for game objects
export const EMOJIS = {
    PLAYER: ['🥕', '🌽', '🥬', '🥦', '🥒'],
    // Wave-based enemy progression
    ENEMIES_WAVE_1: ['👾'],  // Wave 1: Only aliens
    ENEMIES_WAVE_2: ['👾', '👻'],  // Wave 2: Aliens + ghosts
    ENEMIES_WAVE_3: ['👾', '👻', '🦠'],  // Wave 3: + viruses
    ENEMIES_WAVE_4: ['👾', '👻', '🦠', '💀'],  // Wave 4: + skulls
    ENEMIES_WAVE_5: ['👾', '👻', '🦠', '💀', '🐛', '🦂', '🕷️', '🦗'],  // Wave 5+: All enemies
    BOSSES: ['👹', '🐉', '🦖', '👺', '😈', '🦑'],
    EXPLOSIONS: ['💥', '✨', '💫', '⭐', '🌟'],
};

