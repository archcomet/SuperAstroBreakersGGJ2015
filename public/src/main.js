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
            'components': 'app/components',
            'box2d': 'libs/Box2dWeb-2.1.a.3'
        },

        shim: {
            'stats': { exports: 'Stats' },
            'three': { exports: 'THREE' },
            'box2d': { exports: 'Box2D' }
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
        'systems/playerShipSystem'

    ], function(cog,
                Stats,
                THREERenderSystem,
                InputSystem,
                GameStateSystem,
                PositionSystem,
                CollisionSystem,
                PlayerShipSystem
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
        game.systems.add(GameStateSystem);
        game.systems.add(PositionSystem);
        game.systems.add(CollisionSystem);
        game.systems.add(PlayerShipSystem);

        game.onBeginStep(function() { stats.begin(); });
        game.onEndStep(function() { stats.end(); });
        game.start();

        astro.game = game;
    });

}());