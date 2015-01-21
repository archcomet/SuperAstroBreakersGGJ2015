define({
    fixedDt: false,
    soundEnabled: true,
    assetDirectory: '../public/src/assets/',

    sounds: [
        {fileName:'sfx/PositiveHit_01.mp3', name:'shotHit'},
        {fileName:'sfx/Explode.mp3', name:'explode'},
        {fileName:'sfx/IntroMusic.mp3', name:'intro'},
        {fileName:'sfx/WorldMusic.mp3', name:'worldMusic'}
    ],
    bounds: {
        xMax: 1900,
        yMax: 1300
    },

    rockSpeedMax: 500
});