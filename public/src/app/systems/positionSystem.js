define([
    'cog',
    'components/positionComponent'

], function(cog, PositionComponent) {

    var X_RANGE = 1900,
        Y_RANGE = 1300,
        SLOP = 5;

    var PositionSystem = cog.System.extend('astro.PositionSystem', {

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

                if (component.x > X_RANGE) {
                    component.x = -X_RANGE + SLOP;
                }

                if (component.x < -X_RANGE) {
                    component.x = X_RANGE - SLOP;
                }

                if (component.y > Y_RANGE) {
                    component.y = -Y_RANGE + SLOP;
                }

                if (component.y < -Y_RANGE) {
                    component.y = Y_RANGE - SLOP;
                }
            }
        }

    });

    astro.PositionSystem = PositionSystem;

    return PositionSystem;
});