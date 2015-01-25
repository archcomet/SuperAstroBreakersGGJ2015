define([
    'cog'
], function(cog) {

    var PositionComponent = cog.Component.extend('astro.PositionComponent', {
        defaults: {
            x: 0,
            y: 0,
            z: 0,
            angle: 0,

            dx: 0,
            dy: 0,
            dz: 0,
            da: 0
        },

        init: function(entity, options) {
            options = options || {};
            this.x = options.x || 0;
            this.y = options.y || 0;
            this.z = options.z || 0;

            this.dx = options.dx || 0;
            this.dy = options.dy || 0;
            this.dz = options.dz || 0;
            this.da = options.da || 0;

            this.angle = options.angle || 0;
        }
    });

    astro.PositionComponent = PositionComponent;

    return PositionComponent;
});