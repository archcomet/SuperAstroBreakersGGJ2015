define([
    'cog',
    'components/playerShipComponent',
    'components/positionComponent'

], function(cog, PlayerShipComponent, PositionComponent) {

    var ROTATION_SPEED = 7,
        ACCELERATION_SPEED = 10;

    var PlayerShipSystem = cog.System.extend('astro.PlayerShipSystem', {

        configure: function(entities, events, config) {

            this.entities = entities;
            this.spawnPlayer();

            this.player1 = {
                rotateRight: false,
                rotateLeft: false,
                forward: false,
                fire: false
            };

            this.player2 = {
                rotateRight: false,
                rotateLeft: false,
                forward: false,
                fire: false
            };
        },

        spawnPlayer: function() {
            this.playerShipEntity = this.entities.add('PlayerShip');
            this.ship = this.playerShipEntity.components.assign(PlayerShipComponent);
            this.position = this.playerShipEntity.components.assign(PositionComponent);
        },

        update: function(entities, events, dt) {

            if (!this.playerShipEntity) {
                return;
            }

            var da1 = 0,
                da2 = 0,
                ax = 0,
                ay = 0;

            if (this.player1.rotateRight) {
                da1 += -ROTATION_SPEED;
            }

            if (this.player1.rotateLeft) {
                da1 += ROTATION_SPEED;
            }

            if (this.player2.rotateRight) {
                da2 += -ROTATION_SPEED;
            }

            if (this.player2.rotateLeft) {
                da2 += ROTATION_SPEED;
            }

            this.ship.player1.rotation.z += da1 * (dt/1000);
            this.ship.player2.rotation.z += da2 * (dt/1000);

            if (this.player1.forward) {
                ax += Math.cos(this.ship.player1.rotation.z) * ACCELERATION_SPEED;
                ay += Math.sin(this.ship.player1.rotation.z) * ACCELERATION_SPEED;
            }

            if (this.player2.forward) {
                ax += Math.cos(this.ship.player2.rotation.z) * ACCELERATION_SPEED;
                ay += Math.sin(this.ship.player2.rotation.z) * ACCELERATION_SPEED;
            }

            this.position.dx += ax;
            this.position.dy += ay;
        },

        'input event': function (player, action, state) {
            this[player][action] = state;
        }

    });

    astro.PlayerShipSystem = PlayerShipSystem;

    return PlayerShipSystem;
});