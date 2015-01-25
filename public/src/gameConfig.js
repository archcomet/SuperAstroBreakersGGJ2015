define({
    fixedDt: false,
    soundEnabled: true,
    assetDirectory: '../public/src/assets/',

    player: {
        rateOfFire: 3,
        angularVelocity: 7,
        linearAcceleration: 10,
        color1: 0xffff00,
        color2: 0xff00ff
    },

    rocks: {
        maxLinearSpeed: 1000,
        maxAngularSpeed: 10,
        minSplitRadius: 50,
        radiusSpeedModifier: 50,
        rockSplitCount: 3
    },

    bullets: {
        radius: 10,
        speed: 2000,
        duration: 1000
    },

    pickUps: {
        spawnTime: 10000,
        duration: 11000
    },

    scene: {
        starCount: 2500
    },
    rockBonus: 10
});