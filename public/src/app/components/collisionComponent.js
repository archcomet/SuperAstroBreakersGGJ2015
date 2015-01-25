define([
    'cog'
], function (cog) {

    var CollisionComponent = cog.Component.extend('astro-CollisionComponent', {
        eventTarget: 'CollisionComponent'
    },{

        defaults: {
            body: null,
            startHandler: null,
            endHandler: null
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
            this.startHandler   = options.startHandler || null;
            this.endHandler     = options.endHandler || null;
        }

    });

    astro.CollisionComponent = CollisionComponent;

    return CollisionComponent;
});