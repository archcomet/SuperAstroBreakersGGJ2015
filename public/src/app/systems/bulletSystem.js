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
        },

        'begin play event': function() {

        },

        spawnBullet: function(radius, color, x, y, dx, dy) {

            var bulletEntity = this.entities.add('Bullet');

            bulletEntity.components.assign(BulletComponent, {
                color: color
            });

            bulletEntity.components.assign(PositionComponent, {
                radius: radius,
                x: x,
                y: y,
                dx: dx,
                dy: dy
            });

            this.bullets.push(bulletEntity);
        }

    });

    astro.RockSystem = RockSystem;

    return RockSystem;
});