define([
    'cog'

], function(cog) {

    var GameStateSystem = cog.System.extend('astro.GameStateSystem', {

        configure: function(entityManager, eventManager, config) {

        },

        update: function(entityManager, eventManager, dt) {

        }

    });

    astro.GameStateSystem = GameStateSystem;

    return GameStateSystem;
});