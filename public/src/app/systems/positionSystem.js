define([
    'cog',
    'components/positionComponent'

], function(cog, PositionComponent) {

    var PositionSystem = cog.System.extend('astro.PositionSystem', {

        configure: function(entities, events, config) {
            this.xMax = config.bounds.xMax;
            this.yMax = config.bounds.yMax;
        },

        update: function(entityManager, eventManager, dt) {

            var entities = entityManager.withComponents(PositionComponent);
            var i = 0, n = entities.length;
            var component;
            var delta = dt/1000;

            for (; i < n; ++i) {
                component = entities[i].components(PositionComponent);
                component.x += component.dx * delta;
                component.y += component.dy * delta;
                component.z += component.dz * delta;
                component.angle += component.da * delta;

                if (component.x > this.xMax) {
                    component.x = -this.xMax;
                }

                if (component.x < -this.xMax) {
                    component.x = this.xMax;
                }

                if (component.y > this.yMax ) {
                    component.y = -this.yMax;
                }

                if (component.y < -this.yMax ) {
                    component.y = this.yMax;
                }
            }
        }

    });

    astro.PositionSystem = PositionSystem;

    return PositionSystem;
});