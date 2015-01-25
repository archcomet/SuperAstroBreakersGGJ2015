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
            'box2d': 'libs/Box2dWeb-2.1.a.3',
            'tween': 'libs/tweenjs'
        },

        shim: {
            'stats': { exports: 'Stats' },
            'three': { exports: 'THREE' },
            'box2d': { exports: 'Box2D' },
            'tween': { exports: 'TWEEN' }
        }
    });

    require([
        'cog',
        'gameConfig',
        'stats',
        'systems/threeRenderSystem',
        'systems/inputSystem',
        'systems/gameStateSystem',
        'systems/positionSystem',
        'systems/collisionSystem',
        'systems/rockSystem',
        'systems/playerShipSystem',
        'systems/bulletSystem',
        'systems/uiSystem',
        'systems/pickUpSystem'

    ], function(cog,
                gameConfig,
                Stats,
                THREERenderSystem,
                InputSystem,
                GameStateSystem,
                PositionSystem,
                CollisionSystem,
                RockSystem,
                PlayerShipSystem,
                BulletSystem,
                UISystem,
                PickUpSystem
        ) {

        var stats = new Stats();
        stats.domElement.style.position = 'absolute';
        stats.domElement.style.right = '0px';
        stats.domElement.style.top = '0px';
        document.body.appendChild(stats.domElement);

        var game = cog.createDirector(gameConfig);

        game.systems.add(THREERenderSystem);
        game.systems.add(InputSystem);
        game.systems.add(GameStateSystem);
        game.systems.add(PositionSystem);
        game.systems.add(CollisionSystem);
        game.systems.add(RockSystem);
        game.systems.add(PlayerShipSystem);
        game.systems.add(BulletSystem);
        game.systems.add(UISystem);
        game.systems.add(PickUpSystem);

        game.onBeginStep(function() { stats.begin(); });
        game.onEndStep(function() { stats.end(); });
        game.start();

        game.events.emit('screen start');

        astro.game = game;
    });

}());