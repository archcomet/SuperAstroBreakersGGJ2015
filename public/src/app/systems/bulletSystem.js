define([
    'cog',
    'components/bulletComponent',
    'components/positionComponent'

], function(cog, BulletComponent, PositionComponent) {

    var BulletSystem = cog.System.extend('astro.BulletSystem', {

        configure: function(entities, events, config) {

            this.entities = entities;
            this.bulletConfig = config.bullets;
            this.bullets = [];
            this.bulletsToRemove = [];
        },

        update: function(entities, events, dt) {

            var bullet, bulletComponent,
                i = 0,
                n = this.bullets.length;

            this.bulletsToRemove.length = 0;

            for (; i < n; ++i) {
                bullet = this.bullets[i];
                bulletComponent = bullet.components(BulletComponent);
                bulletComponent.duration -= dt;

                if (bulletComponent.duration < 0) {
                    this.bulletsToRemove.push(bullet);
                }
            }

            while(bullet = this.bulletsToRemove.pop()) {
                this.despawnBullet(bullet);
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

            this.bullets.push(bulletEntity);
        },

        despawnBullet: function(bullet) {
            this.entities.remove(bullet);

            var i = this.bullets.indexOf(bullet);
            if (i > -1) {
                this.bullets.splice(i, 1);
            }
        },

        'fire event': function(options) {
            this.spawnBullet(options.color, options.position.x, options.position.y, options.angle);
        }

    });

    astro.BulletSystem = BulletSystem;

    return BulletSystem;
});