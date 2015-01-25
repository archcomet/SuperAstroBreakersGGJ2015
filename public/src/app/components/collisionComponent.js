define([
    'cog'
], function (cog) {

    var CollisionComponent = cog.Component.extend('astro-CollisionComponent', {

        defaults: {
            body: null,
            shapeType: 'circle',
            shapeConfig: null
        },

        init: function (entity, options) {
            options             = options || {};
            this.x              = options.x || 0;
            this.y              = options.y || 0;
            this.density        = options.density || 0;
            this.friction       = options.friction || 0.2;
            this.restitution    = options.restitution || 0;
            this.categoryBits   = options.categoryBits || 0x0001;
            this.maskBits       = options.maskBits || 0xFFFF;
        }

    });

    astro.CollisionComponent = CollisionComponent;

    return CollisionComponent;
});