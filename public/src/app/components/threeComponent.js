define([
    'cog'
], function(cog) {

    var THREEComponent = cog.Component.extend('astro.THREEComponent', {
        eventTarget: 'THREEComponent'
    }, {
        defaults: {
            mesh: null
        }
    });

    astro.THREEComponent = THREEComponent;

    return THREEComponent;
});