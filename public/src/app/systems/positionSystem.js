define([
    'cog'

], function(cog) {

    var PositionSystem = cog.System.extend('astro.PositionSystem', {

        configure: function(entityManager, eventManager, config) {

        },

        update: function(entityManager, eventManager, dt) {

        }

    });

    astro.PositionSystem = PositionSystem;

    return PositionSystem;
});