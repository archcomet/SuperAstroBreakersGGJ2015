define([
    'cog',
    'components/playerShipComponent',
    'components/positionComponent',
    'components/collisionComponent',
    'components/shieldComponent'

], function(cog, PlayerShipComponent, PositionComponent, CollisionComponent, ShieldComponent) {

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

            this.isThrusting = false;
            this.emitThrustSound = false;
            this.playerDied = false;
            this.invincibility = 1000;
            this.shield = null;
        },

        'begin play event': function() {
            this.spawnPlayer();
        },

        'player spawn event': function() {
            this.spawnPlayer();
        },

        collisionStartHandler: function(player, otherObject) {
            if (otherObject.tag === 'Rock' && this.invincibility <= 0) {
                this.playerDied = true;
            }
        },

        destroyPlayer: function() {
            if (this.playerShipEntity) {
                this.entities.remove(this.playerShipEntity);
                this.playerShipEntity = null;
                this.events.emit('player died');
                this.events.emit('stopSound', 'thrust');
                this.events.emit('explode');

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
            this.playerDied = false;
            this.invincibility = 3000;
        },

        update: function(entities, events, dt) {

            if (this.playerDied) {
                this.destroyPlayer();
            }

            if (!this.playerShipEntity) {
                return;
            }

            this.player1.fireTimer -= dt;
            this.player2.fireTimer -= dt;
            this.invincibility -= dt;

            if (this.invincibility && !this.shield) {
                this.spawnShield();
            }

            if (this.invincibility <= 0 && this.shield) {
                this.despawnShield();
            }

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

            this.ship.player1.rotation.z += da1 * (dt / 1000);
            this.ship.player2.rotation.z += da2 * (dt / 1000);

            if (this.player1.forward) {
                ax += Math.cos(this.ship.player1.rotation.z) * this.playerConfig.linearAcceleration;
                ay += Math.sin(this.ship.player1.rotation.z) * this.playerConfig.linearAcceleration;
            }

            if (this.player2.forward) {
                ax += Math.cos(this.ship.player2.rotation.z) * this.playerConfig.linearAcceleration;
                ay += Math.sin(this.ship.player2.rotation.z) * this.playerConfig.linearAcceleration;
            }

            if ((this.player1.forward || this.player2.forward) && !this.isThrusting) {
                this.isThrusting = true;
            } else if (!this.player1.forward && !this.player2.forward){
                this.isThrusting = false;
            }

            if (this.isThrusting && !this.emitThrustSound)
            {
                this.events.emit('thrust');
                this.emitThrustSound = true;
            }
            else if ( !this.isThrusting && this.emitThrustSound){
                this.emitThrustSound = false;
                this.events.emit('stopSound', 'thrust');
            }

            this.position.dx += ax;
            this.position.dy += ay;

            if (this.shield) {
                var shieldPos = this.shield.components(PositionComponent);
                shieldPos.dx += ax;
                shieldPos.dy += ay;
            }

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
        },

        spawnShield: function(x, y) {

            if (this.shield) {
                return;
            }

            var shieldEntity = this.entities.add('Shield');

            shieldEntity.components.assign(ShieldComponent, {});

            shieldEntity.components.assign(PositionComponent, {
                x: x,
                y: y
            });

            this.shield = shieldEntity;
        },

        despawnShield: function() {
            this.entities.remove(this.shield);
            this.shield = null;
        }

    });

    astro.PlayerShipSystem = PlayerShipSystem;

    return PlayerShipSystem;
});