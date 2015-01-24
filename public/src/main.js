(function() {
    'use strict';

    window.astro = {};

    require.config({
        paths: {
            'dat.gui': 'libs/dat.gui.min',
            'cog': 'libs/cog',
            'stats': 'libs/stats',
            'three': 'libs/three',
            'systems': 'app/systems',
            'components': 'app/components'
        },

        shim: {
            'stats': { exports: 'Stats' },
            'three': { exports: 'THREE' }
        }
    });

    require([
        'cog',
        'stats',
        'systems/threeRenderSystem',
        'systems/inputSystem'

    ], function(cog,
                Stats,
                THREERenderSystem,
                InputSystem
        ) {

        var stats = new Stats();
        stats.domElement.style.position = 'absolute';
        stats.domElement.style.right = '0px';
        stats.domElement.style.top = '0px';
        document.body.appendChild(stats.domElement);

        var game = cog.createDirector({
            fixedDt: false,
            soundEnabled: true,
            assetDirectory: '../public/src/assets/'
        });

        game.systems.add(THREERenderSystem);
        game.systems.add(InputSystem);

        game.onBeginStep(function() { stats.begin(); });
        game.onEndStep(function() { stats.end(); });
        game.start();

        astro.game = game;
    });

}());