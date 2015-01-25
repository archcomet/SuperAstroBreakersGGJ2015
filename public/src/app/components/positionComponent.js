define([
    'cog'
], function(cog) {

    var PositionComponent = cog.Component.extend('astro.PositionComponent', {

        init: function(entity, options) {
            options = options || {};

            this.radius = options.radius || 0;

            this.x = options.x || 0;
            this.y = options.y || 0;
            this.z = options.z || 0;

            this.rx = options.rx || 0;
            this.ry = options.ry || 0;
            this.rz = options.rz || 0;

            this.dx = options.dx || 0;
            this.dy = options.dy || 0;
            this.dz = options.dz || 0;

            this.drx = options.drx || 0;
            this.dry = options.dry || 0;
            this.drz = options.drz || 0;
        }
    });

    astro.PositionComponent = PositionComponent;

    return PositionComponent;
});