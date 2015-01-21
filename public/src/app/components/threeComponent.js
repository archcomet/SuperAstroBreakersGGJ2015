define([
    'cog'
], function(cog) {

    var THREEComponent = cog.Component.extend('astro.THREEComponent', {
        eventTarget: 'THREEComponent'
    }, {
        defaults: {
            mesh: null,
            spawnX: 0,
            spawnY: 0,
            spawnZ: 0,
            spawnRX: 0,
            spawnRY: 0,
            spawnRZ: 0
        },

        init: function(entity, options) {
            options = options || {};
            this.spawnX = options.spawnX || 0;
            this.spawnY = options.spawnY || 0;
            this.spawnZ = options.spawnZ || 0;
            this.spawnRX = options.spawnRX || 0;
            this.spawnRY = options.spawnRY || 0;
            this.spawnRZ = options.spawnRZ || 0;
        }
    });

    astro.THREEComponent = THREEComponent;

    return THREEComponent;
});