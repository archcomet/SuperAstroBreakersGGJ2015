define([
    'cog',
    'components/bulletComponent',
    'components/positionComponent',
    'components/collisionComponent'

], function(cog, BulletComponent, PositionComponent, CollisionComponent) {

    var BulletSystem = cog.System.extend('astro.BulletSystem', {

        configure: function(entities, events, config) {

            this.entities = entities;
            this.events = events;
            this.bulletConfig = config.bullets;
            this.bullets = [];
            this.bulletsToRemove = [];
        },

        'end play event': function() {
            this.despawnAllBullets();
        },

        update: function(entities, events, dt) {

            var bullet, bulletComponent,
                i = 0,
                n = this.bullets.length;

            for (; i < n; ++i) {
                bullet = this.bullets[i];
                bulletComponent = bullet.components(BulletComponent);
                bulletComponent.duration -= dt;

                if (bulletComponent.duration < 0) {
                    this.bulletsToRemove.push(bullet);
                }
            }

            while(bullet = this.bulletsToRemove.pop()) {
                if (bullet.valid) {
                    this.despawnBullet(bullet);
                }
            }
        },

        spawnBullet: function(color, x, y, angle) {

            var bulletEntity = this.entities.add('Bullet');

            bulletEntity.components.assign(BulletComponent, {
                radius: this.bulletConfig.radius,
                color: color,
                spawnX: x,
                spawnY: y,
                spawnRZ: angle,
                duration: this.bulletConfig.duration
            });

            var dx = Math.cos(angle) * this.bulletConfig.speed,
                dy = Math.sin(angle) * this.bulletConfig.speed;

            bulletEntity.components.assign(PositionComponent, {
                radius: this.bulletConfig.radius,
                x: x,
                y: y,
                dx: dx,
                dy: dy,
                rz: angle
            });

            bulletEntity.components.assign(CollisionComponent, {
                startHandler: this.collisionHandler.bind(this)
            });

            this.bullets.push(bulletEntity);
        },

        collisionHandler: function(bullet, other) {

            if (other.tag === 'Rock') {
                this.bulletsToRemove.push(bullet);
                this.events.emit('rock destroyed');
            }

            if (other.tag === 'Blackhole') {
                this.bulletsToRemove.push(bullet);
            }
        },

        despawnBullet: function(bullet) {
            this.entities.remove(bullet);

            var i = this.bullets.indexOf(bullet);
            if (i > -1) {
                this.bullets.splice(i, 1);
            }
        },

        despawnAllBullets: function() {
            var i = 0, n = this.bullets.length;
            for (; i < n; ++i) {
                this.entities.remove(this.bullets[i]);
            }
            this.bullets.length = 0;
            this.bulletsToRemove.length = 0;
        },

        'fire event': function(options) {
            this.spawnBullet(options.color, options.position.x, options.position.y, options.angle);
        }

    });

    astro.BulletSystem = BulletSystem;

    return BulletSystem;
});