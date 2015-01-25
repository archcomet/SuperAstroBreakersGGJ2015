

define([
    'cog'

], function(cog) {

    var UISystem = cog.System.extend('astro.UISystem', {

        configure: function (entities, events) {
            this._menu = document.getElementById('menu');
            this._header = document.getElementById('header');
            this._end = document.getElementById('end');
            this._webGLContainer = document.getElementById('webGLContainer');

            this._scoreElement = document.getElementById('scoreValue');
            this._lifeElement = document.getElementById('lifeValue');

            this._events = events;

            var self = this;

            document.getElementById("start").addEventListener("click", function() {
                self._events.emit('game start');
            });

            document.getElementById("replay").addEventListener("click", function() {
                self._events.emit('game start');
            });
        },

        'screen start event': function() {
            this._menu.style.display = 'block';
            this._header.style.display = 'none';
            this._end.style.display = 'none';
            this._webGLContainer.style.display = 'none';
        },

        'screen game event': function() {
            this._menu.style.display = 'none';
            this._header.style.display = 'block';
            this._end.style.display = 'none';
            this._webGLContainer.style.display = 'block';
        },

        'screen end event': function() {
            this._menu.style.display = 'none';
            this._header.style.display = 'none';
            this._end.style.display = 'block';
            this._webGLContainer.style.display = 'none';
        },

        'playerScore event': function (score) {
            this._scoreElement.textContent = score;
            console.log(score);
        },

        'playerLife event': function (score) {
            this._lifeElement.textContent = score;
            console.log(score);
        }

    });



    astro.UISystem = UISystem;


    return astro.UISystem;
});
