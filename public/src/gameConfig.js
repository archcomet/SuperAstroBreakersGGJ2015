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
    sounds: [
        {fileName:'sfx/ShotStd.mp3', name:'shotStd'},
        {fileName:'sfx/Explode.mp3', name:'explode'},
        {fileName:'sfx/Thrust.mp3', name:'thrust'},
        {fileName:'sfx/PowerUp.mp3', name:'showPowerUp'},
        {fileName:'sfx/PickUp.mp3', name:'powerUp'},
        {fileName:'sfx/Help.mp3', name:'sayHelp'},
        {fileName:'sfx/Chain.mp3', name:'chain'},
        {fileName:'sfx/IntroMusic.mp3', name:'intro', loop:true},
        {fileName:'sfx/WorldMusic.mp3', name:'worldMusic', loop:true},
        {fileName:'sfx/EndMusic.mp3', name:'endMusic', loop:true}
    ],

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
    }
});