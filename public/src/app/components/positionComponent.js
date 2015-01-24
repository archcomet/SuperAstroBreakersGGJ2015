define([
    'cog'
], function(cog) {

    var PositionComponent = cog.Component.extend('astro.PositionComponent', {
        defaults: {
            x: 0,
            y: 0,
            z: 0,

            dx: 0,
            dy: 0,
            dz: 0
        }
    });

    astro.PositionComponent = PositionComponent;

    return PositionComponent;
});