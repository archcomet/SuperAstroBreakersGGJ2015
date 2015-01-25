

define([
    'cog'

], function(cog) {

    var UISystem = cog.System.extend('astro.UISystem', {

        configure: function () {
            this._menu = document.getElementById('menu');
            this._header = document.getElementById('header');
            this._end = document.getElementById('end');
            this._webGLContainer = document.getElementById('webGLContainer');
            this._intro = document.getElementById('intro');
        },

        gameTime: function() {
            this._menu.style.display = 'none';
            this._header.style.display = 'block';
            this._end.style.display = 'none';
            this._webGLContainer.style.display = 'block';
            this._intro.style.display = 'none';

        },
        start : function () {
            this._menu.style.display = 'block';
            this._header.style.display = 'none';
            this._end.style.display = 'none';
            this._webGLContainer.style.display = 'none';
            this._intro.style.display = 'block';

        },
        end :function() {
            this._menu.style.display = 'none';
            this._header.style.display = 'none';
            this._end.style.display = 'block';
            this._webGLContainer.style.display = 'none';
            this._intro.style.display = 'none';
        },
        'screen start event': function() {
            this.start();
            var self = this;
            document.getElementById("start").addEventListener("click",
                function() {
                    self.gameTime();
                }

            );
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
