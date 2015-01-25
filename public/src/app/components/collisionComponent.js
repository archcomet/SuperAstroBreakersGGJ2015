define([
    'cog'
], function (cog) {

    var CollisionBodyComponent = cog.Component.extend('astro-CollisionBodyComponent', {
        positionIsDirty: true
    }, {

        defaults: {
            x: 0.0,
            y: 0.0,

            // initial values
            body: null,
            density: 0.0,
            friction: 0.2,
            restitution: 0.0,
            angularDamping: 0.0,
            fixedRotation: false,
            categoryBits: 0x0001,
            maskBits: 0xFFFF,
            shapeType: 'circle', //polygon
            shapeConfig: null
        }

    });

    astro.CollisionBodyComponent = CollisionBodyComponent;

    return CollisionBodyComponent;
});