define([
    'cog'

], function(cog) {

    var CollisionSystem = cog.System.extend('astro.CollisionSystem', {

        configure: function(entityManager, eventManager, config) {

        },

        update: function(entityManager, eventManager, dt) {

        }

    });

    astro.CollisionSystem = CollisionSystem;

    return CollisionSystem;
});