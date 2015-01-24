

define([
    'cog'

], function(cog) {

    var UISystem = cog.System.extend('astro.UISystem', {

        configure: function () {
            this._menu = document.getElementById('menu');
            this._header = document.getElementById('header');
            this._end = document.getElementById('end');
            this._webGLContainer = document.getElementById('webGLContainer');
        },
        start : function () {
            this._menu.style.display = 'block';
            this._header.style.display = 'none';
            this._end.style.display = 'none';
            this._webGLContainer.style.display = 'none';

        },

        gameTime: function() {
            this._menu.style.display = 'none';
            this._header.style.display = 'block';
            this._end.style.display = 'none';
            this._webGLContainer.style.display = 'block';

        },

        end :function() {
            this._menu.style.display = 'none';
            this._header.style.display = 'none';
            this._end.style.display = 'block';
            this._webGLContainer.style.display = 'none';

        },
        'screen start event': function() {
            this.start();
        },
        'screen game event': function() {
            this.gameTime();
        },
        'screen end event': function() {
            this.end();
        }

    });

    astro.UISystem = UISystem;
    return astro.UISystem;
});
