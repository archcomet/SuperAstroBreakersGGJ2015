define([
    'cog'

], function(cog) {

    var GameStateSystem = cog.System.extend('astro.GameStateSystem', {

        configure: function(entityManager, eventManager, config) {

            document.getElementById('liveValue').innerHTML = 20;
        },

        update: function(entityManager, eventManager, dt) {
            this._liveValue = document.getElementById('liveValue').innerHTML;

            if(this._liveValue !=  "" && this._liveValue < 1)
            {
                eventManager.emit('screen end');
            }
        }

    });

    astro.GameStateSystem = GameStateSystem;

    return GameStateSystem;
});