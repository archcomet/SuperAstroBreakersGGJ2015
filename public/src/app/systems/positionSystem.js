define([
    'cog',
    'components/positionComponent',
    'components/cameraComponent'

], function(cog, PositionComponent, CameraComponent) {

    var PositionSystem = cog.System.extend('astro.PositionSystem', {

        configure: function(entities, events, config) {
            this.cameraComponent = entities.withTag('camera')[0].components(CameraComponent);

        },

        update: function(entityManager, eventManager, dt) {

            var xMax = this.cameraComponent.visibleWidth/2;
            var yMax = this.cameraComponent.visibleHeight/2;

            var entities = entityManager.withComponents(PositionComponent);
            var i = 0, n = entities.length;
            var component;
            var delta = dt/1000;

            for (; i < n; ++i) {
                component = entities[i].components(PositionComponent);
                component.x += component.dx * delta;
                component.y += component.dy * delta;
                component.z += component.dz * delta;

                component.rx += component.drx * delta;
                component.ry += component.dry * delta;
                component.rz += component.drz * delta;

                if (component.x > xMax + component.radius) {
                    component.x = -xMax - component.radius;
                }

                if (component.x < -xMax - component.radius) {
                    component.x = xMax + component.radius;
                }

                if (component.y > yMax + component.radius) {
                    component.y = -yMax - component.radius;
                }

                if (component.y < -yMax - component.radius ) {
                    component.y = yMax + component.radius;
                }
            }
        }

    });

    astro.PositionSystem = PositionSystem;

    return PositionSystem;
});