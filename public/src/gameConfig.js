define({
    fixedDt: false,
    soundEnabled: true,
    assetDirectory: '../public/src/assets/',

    player: {
        bombCount: 3,
        bombRateOffFire: 0.75,
        rateOfFire: 15,
        angularVelocity: 7,
        linearAcceleration: 20,
        color1: 0xffff00,
        color2: 0x00ffff
    },
    sounds: [

        //https://abstractionmusic.bandcamp.com/album/three-red-hearts
        //Out of Time
        {fileName:'sfx/IntroMusic.mp3', name:'introMusic', loop:true, gain:.4},
        //https://abstractionmusic.bandcamp.com/album/three-red-hearts
        //Princess Quest
        {fileName:'sfx/WorldMusic.mp3', name:'worldMusic', gain:.4, loop:true},
        /*
            ::This must be preset in game::
            Acquired From - freesound.org
            author: ani_music
            licence: http://creativecommons.org/licenses/by/3.0/
            copyright: http://sbassdrum.com
            Slight modifications were made.
         */
        {fileName:'sfx/ShotStd.mp3', name:'shotStd'},
        //0common
        {fileName:'sfx/BigWeapon.mp3', name:'bomb', gain: 3},
        //0common
        {fileName:'sfx/Thrust.mp3', name:'thrust', gain:.75, loop:true},
        //0common
        {fileName:'sfx/Chain.mp3', name:'chain'},
        //0common
        {fileName:'sfx/SuckedIn.mp3', name:'blackHole'},
        //0common
        {fileName:'sfx/Help.mp3', name:'sayHelp'},
        //0common
        {fileName:'sfx/PowerUp.mp3', name:'showPowerUp'},
        //0common
        {fileName:'sfx/PickUp.mp3', name:'powerUp', gain:1.25},
        //0common
        {fileName:'sfx/Explode.mp3', name:'explode', gain:1.5},
        /*
             ::This must be preset in game::
             Acquired From - freesound.org
             author: Setuniman
             licence: http://creativecommons.org/licenses/by-nc/3.0/
         */

        {fileName:'sfx/EndMusic.mp3', name:'endMusic'}
    ],

    rocks: {
        maxLinearSpeed: 700,
        maxAngularSpeed: 10,
        minSplitRadius: 50,
        radiusSpeedModifier: 50,
        rockSplitCount: 3
    },

    bullets: {
        radius: 10,
        superRadius: 50,
        speed: 3000,
        duration: 1000
    },

    pickUps: {
        spawnTime: 10000,
        duration: 10000,
        invincibility: 8000
    },

    scene: {
        starCount: 3000
    },

    blackhole: {
        radius: 300,
        speed: 100
    },

    rockBonus: 10
});