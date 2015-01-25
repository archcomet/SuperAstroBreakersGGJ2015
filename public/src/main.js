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
        'systems/inputSystem',
        'systems/gameStateSystem',
        'systems/positionSystem',
        'systems/collisionSystem',
        'systems/playerShipSystem',
        'systems/uiSystem'

    ], function(cog,
                Stats,
                THREERenderSystem,
                InputSystem,
                GameStateSystem,
                PositionSystem,
                CollisionSystem,
                PlayerShipSystem,
                UISystem
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
        game.systems.add(PlayerShipSystem);
        game.systems.add(UISystem);

        game.onBeginStep(function() { stats.begin(); });
        game.onEndStep(function() { stats.end(); });
        game.start();

        game.events.emit('screen start');
        astro.game = game;
    });

}());