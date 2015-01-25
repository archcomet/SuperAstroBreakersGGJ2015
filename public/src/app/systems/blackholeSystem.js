define([
    'cog',
    'components/blackholeComponent',
    'components/positionComponent',
    'components/cameraComponent',
    'components/collisionComponent'

], function(cog, BlackholeComponent, PositionComponent, CameraComponent, CollisionComponent) {

    var BlackholeSystem = cog.System.extend('astro.BlackholeSystem', {

        configure: function(entities, events, config) {
            this.entities = entities;
            this.events = events;
            this.blackholeConfig = config.blackhole;
            this.cameraComponent = entities.withTag('camera')[0].components(CameraComponent);
        },

        update: function(entityManager, events, dt) {

            if (!this.blackhole || !this.blackhole.valid) {
                return;
            }

            var entities = entityManager.withComponents(PositionComponent);

            var i = 0, n = entities.length;
            for (; i < n; ++i) {

                var entity = entities[i];
                if (entity === this.blackhole) {
                    continue;
                }

                var p = entity.components(PositionComponent);
                var bp = this.blackhole.components(PositionComponent);

                var pv = new THREE.Vector3(p.x, p.y, 0);
                var bpv = new THREE.Vector3(bp.x, bp.y, 0);
                var v = new THREE.Vector3();
                v.subVectors(bpv, pv);
                var sqrLength = v.lengthSq();
                var acc = 2000000 / sqrLength ;

                v.normalize();
                v.multiplyScalar(acc);
                p.dx += v.x;
                p.dy += v.y;
            }
        },

        'begin play event': function() {
            this.spawnBlackhole();
        },

        'end play event': function() {
            this.despawnBlackhole(this.blackhole);
        },

        spawnBlackhole: function() {

            var v =this.cameraComponent.randomOffScreenPosition(this.blackholeConfig.radius);
            var a = cog.rand.arc4rand(0, 2 * Math.PI);
            var dx = Math.cos(a) * this.blackholeConfig.speed;
            var dy = Math.sin(a) * this.blackholeConfig.speed;


            var blackholeEntity = this.entities.add('Blackhole');

            blackholeEntity.components.assign(BlackholeComponent, {
                radius: this.blackholeConfig.radius,
                viewVector: new THREE.Vector3(0, 0, 1)
            });

            blackholeEntity.components.assign(PositionComponent, {
                x: v.x,
                y: v.y,
                z: -this.blackholeConfig.radius/2,
                radius: this.blackholeConfig.radius,
                dx: dx,
                dy: dy
            });

            blackholeEntity.components.assign(CollisionComponent);
            this.blackhole = blackholeEntity;
        },

        despawnBlackhole: function(blackhole) {
            if (blackhole && blackhole.valid) {
                this.entities.remove(blackhole);
            }
        }
    });

    astro.BlackholeSystem = BlackholeSystem;

    return BlackholeSystem;
});