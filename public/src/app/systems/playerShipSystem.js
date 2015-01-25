define([
    'cog',
    'components/playerShipComponent',
    'components/positionComponent',
    'components/collisionComponent'

], function(cog, PlayerShipComponent, PositionComponent, CollisionComponent) {

    var PlayerShipSystem = cog.System.extend('astro.PlayerShipSystem', {

        configure: function(entities, events, config) {

            this.events = events;
            this.entities = entities;
            this.playerConfig = config.player;

            this.player1 = {
                rotateRight: false,
                rotateLeft: false,
                forward: false,
                fire: false,
                fireTimer: 0
            };

            this.player2 = {
                rotateRight: false,
                rotateLeft: false,
                forward: false,
                fire: false,
                fireTimer: 0
            };
        },

        'begin play event': function() {
            this.spawnPlayer();
        },

        'end play event': function() {
            this.destroyPlayer();
        },

        'player destroy event': function() {
            this.destroyPlayer();
        },

        'player spawn event': function() {
            this.spawnPlayer();
        },

        collisionStartHandler: function(player, otherObject) {
            console.log('hit: ' + otherObject.tag);
        },

        destroyPlayer: function() {
            if (this.playerShipEntity) {
                this.entities.remove(this.playerShipEntity);
                this.playerShipEntity = null;
            }
        },

        spawnPlayer: function() {
            this.playerShipEntity = this.entities.add('PlayerShip');
            this.ship = this.playerShipEntity.components.assign(PlayerShipComponent);
            this.position = this.playerShipEntity.components.assign(PositionComponent, {
                radius: 75
            });

            this.playerShipEntity.components.assign(CollisionComponent, {
                startHandler: this.collisionStartHandler.bind(this)
            });

            this.player1.fireTimer = 0;
            this.player2.fireTimer = 0;
        },

        update: function(entities, events, dt) {

            if (!this.playerShipEntity) {
                return;
            }

            this.player1.fireTimer -= dt;
            this.player2.fireTimer -= dt;

            var da1 = 0,
                da2 = 0,
                ax = 0,
                ay = 0;

            if (this.player1.rotateRight) {
                da1 += -this.playerConfig.angularVelocity;
            }

            if (this.player1.rotateLeft) {
                da1 += this.playerConfig.angularVelocity;
            }

            if (this.player2.rotateRight) {
                da2 += -this.playerConfig.angularVelocity;
            }

            if (this.player2.rotateLeft) {
                da2 += this.playerConfig.angularVelocity;
            }

            this.ship.player1.rotation.z += da1 * (dt/1000);
            this.ship.player2.rotation.z += da2 * (dt/1000);

            if (this.player1.forward) {
                ax += Math.cos(this.ship.player1.rotation.z) * this.playerConfig.linearAcceleration;
                ay += Math.sin(this.ship.player1.rotation.z) * this.playerConfig.linearAcceleration;
            }

            if (this.player2.forward) {
                ax += Math.cos(this.ship.player2.rotation.z) * this.playerConfig.linearAcceleration;
                ay += Math.sin(this.ship.player2.rotation.z) * this.playerConfig.linearAcceleration;
            }

            this.position.dx += ax;
            this.position.dy += ay;

            if (this.player1.fire && this.player1.fireTimer <= 0) {
                this.player1.fireTimer = 1000 / this.playerConfig.rateOfFire;
                this.events.emit('fire', {
                    color: this.playerConfig.color1,
                    position: this.position,
                    angle: this.ship.player1.rotation.z
                });
            }

            if (this.player2.fire && this.player2.fireTimer <= 0) {
                this.player2.fireTimer = 1000 / this.playerConfig.rateOfFire;
                this.events.emit('fire', {
                    color: this.playerConfig.color2,
                    position: this.position,
                    angle: this.ship.player2.rotation.z
                });
            }
        },

        'input event': function (player, action, state) {
            this[player][action] = state;
        }

    });

    astro.PlayerShipSystem = PlayerShipSystem;

    return PlayerShipSystem;
});