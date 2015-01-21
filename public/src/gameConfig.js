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
        {fileName:'sfx/PositiveHit_01.mp3', name:'shotHit'},
        {fileName:'sfx/Explode.mp3', name:'explode'},
        {fileName:'sfx/IntroMusic.mp3', name:'intro'},
        {fileName:'sfx/WorldMusic.mp3', name:'worldMusic'}
    ],

    rocks: {
        maxLinearSpeed: 1000,
        maxAngularSpeed: 10,
        minSplitRadius: 100,
        radiusSpeedModifier: 50
    },

    bullets: {

    }
});