define([
    'cog',
    'math',
    'components/rockComponent',
    'components/positionComponent',
    'components/cameraComponent',
    'components/collisionComponent'

], function(cog, math, RockComponent, PositionComponent, CameraComponent, CollisionComponent) {

    var RockSystem = cog.System.extend('astro.RockSystem', {

        configure: function(entities, events, config) {

            this.entities = entities;
            this.events = events;
            this.rocksConfig = config.rocks;
            this.cameraComponent = entities.withTag('camera')[0].components(CameraComponent);
            this.rocks = [];
            this.rocksToDestroy = [];
            this.spawnNext = 3000;
        },

        update: function(entities, events, dt) {
            var rock, radius;
            while(rock = this.rocksToDestroy.pop()) {
                this.breakRock(rock);
            }

            if (--this.spawnNext < 0) {
                radius  = math.randomNumber(400, 50);
                this.spawnRandomRock(radius);
                this.spawnNext = this.rocks.length * 100;
            }
        },

        'begin play event': function() {
            this.spawnRandomRock(400);
            this.spawnRandomRock(200);
            this.spawnRandomRock(200);
        },

        'end play event': function() {
            this.despawnAllRocks();
        },

        spawnRandomRock: function(radius) {
            var v = this.cameraComponent.randomOffScreenPosition(radius);
            this.spawnRock(radius, v.x, v.y);
        },

        spawnRock: function(radius, x, y) {

            var rockEntity = this.entities.add('Rock');
            var maxLinearSpeed = this.rocksConfig.maxLinearSpeed * this.rocksConfig.radiusSpeedModifier / radius;
            var maxAngularSpeed = this.rocksConfig.maxAngularSpeed * this.rocksConfig.radiusSpeedModifier / radius;

            var dx = cog.rand.arc4rand(-maxLinearSpeed, maxLinearSpeed),
                dy = cog.rand.arc4rand(-maxLinearSpeed, maxLinearSpeed);

            var length = Math.sqrt(dx*dx + dy*dy);
            if (length > Number.MIN_VALUE) {
                var invLength = 1.0 / length;
                x += radius * dx * invLength;
                y += radius * dy * invLength;
            }

            rockEntity.components.assign(RockComponent, {
                radius: radius,
                spawnX: x,
                spawnY: y
            });

            rockEntity.components.assign(PositionComponent, {
                radius: radius,
                x:  x,
                y:  y,
                dx: dx,
                dy: dy,
                drx: cog.rand.arc4rand(-maxAngularSpeed, maxAngularSpeed),
                dry: cog.rand.arc4rand(-maxAngularSpeed, maxAngularSpeed),
                drz: cog.rand.arc4rand(-maxAngularSpeed, maxAngularSpeed)
            });

            rockEntity.components.assign(CollisionComponent, {
                startHandler: this.collisionHandler.bind(this)
            });

            this.rocks.push(rockEntity);
            return rockEntity;
        },

        despawnRock: function(rock) {
            var index = this.rocks.indexOf(rock);
            this.rocks.splice(index, 1);
            this.entities.remove(rock);
        },

        despawnAllRocks: function() {
            var i = 0, n = this.rocks.length;
            for (; i < n; ++i) {

                this.entities.remove(this.rocks[i]);
            }
            this.rocks.length = 0;
            this.rocksToDestroy.length = 0;
        },

        collisionHandler: function(rock, otherEntity) {
            if (otherEntity.tag === 'PlayerShip') {
                this.rocksToDestroy.push(rock);
            }

            if (otherEntity.tag === 'Bullet') {
                this.rocksToDestroy.push(rock);
                this.events.emit('rock destroyed');
            }

            if (otherEntity.tag === 'Blackhole') {
                this.rocksToDestroy.push(rock);
            }
        },

        breakRock: function(rock) {
            if (!rock.valid) {
                return;
            }
            var positionComponent = rock.components(PositionComponent);
            if (positionComponent.radius > this.rocksConfig.minSplitRadius) {
                var i = 0, n = this.rocksConfig.rockSplitCount;
                for (; i < n; ++i) {
                    this.spawnRock(positionComponent.radius / 2, positionComponent.x, positionComponent.y);
                }
            }
            this.despawnRock(rock);
        }
    });

    astro.RockSystem = RockSystem;

    return RockSystem;
});