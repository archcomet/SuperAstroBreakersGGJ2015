

define([
    'cog',
    'tween'

], function(cog, Tween) {

    var UISystem = cog.System.extend('astro.UISystem', {

        configure: function (entities, events) {
            this._menu = document.getElementById('menu');
            this._header = document.getElementById('header');
            this._end = document.getElementById('end');
            this._webGLContainer = document.getElementById('webGLContainer');
            this._intro = document.getElementById('intro');

            this._scoreElement = document.getElementById('scoreValue');
            this._lifeElement = document.getElementById('lifeValue');

            this._events = events;
            this._muted = false;

            var self = this;

            document.getElementById("start").addEventListener("click", function() {
                self._events.emit('begin play');
            });

            document.getElementById("toggleMute").addEventListener("click", function() {
                var elm = document.getElementById("toggleMute"),
                    muted = elm.textContent.indexOf("not") == -1;
                if (muted)
                {
                    self._events.emit('unMuteAll');
                }
                else{
                    self._events.emit('muteAll');
                }

                this._updateMuteText(muted);

            });

            document.getElementById("replay").addEventListener("click", function() {
                self._events.emit('begin play');
            });

            this.startScreenTween();
        },

        update: function () {
            Tween.update();
        },

        startScreenTween: function () {
            var message = document.getElementById('intro'),
                position = { x: 0, y: 0 };

            var tween = new Tween.Tween( position )
                .to( { x: 0, y: 75 }, 1500)
                .easing( Tween.Easing.Sinusoidal.Out)
                .onUpdate( function () {
                    message.style.transform = 'translateY(' + position.y + 'px)';
                });

            tween.start();
        },

        'screen start event': function() {
            this._menu.style.display = 'block';
            this._header.style.display = 'none';
            this._end.style.display = 'none';
            this._webGLContainer.style.display = 'none';
            this._intro.style.display = 'block';

            this._events.emit('playSound', 'introMusic');
        },

        'begin play event': function() {
            this._menu.style.display = 'none';
            this._header.style.display = 'block';
            this._end.style.display = 'none';
            this._webGLContainer.style.display = 'block';
            this._intro.style.display = 'none';

            this._events.emit('stopSound', 'introMusic');
            this._events.emit('playSound', 'worldMusic');

        },

        'end play event': function() {
            this._menu.style.display = 'none';
            this._header.style.display = 'none';
            this._end.style.display = 'block';
            this._webGLContainer.style.display = 'none';
            this._intro.style.display = 'none';

            this._events.emit('stopSound', 'worldMusic');
            this._events.emit('playSound', 'endMusic');
        },

        'playerScore event': function (score) {
            this._scoreElement.textContent = score;
        },

        'playerLife event': function (score) {
            this._lifeElement.textContent = score;
        },

        'input event': function (player, name, pressed) {
            if (name === 'start' && pressed) {
                if(this._header.style.display != 'block' )
                {
                    this._events.emit('begin play');
                }
                return;
            }

            if (name === 'select' && pressed) {
                this._updateMuteText(this._muted);

                if (this._muted) {
                    this._muted = false;
                    this._events.emit('unMuteAll');
                } else {
                    this._muted = true;
                    this._events.emit('muteAll');
                }
            }
        },

        _updateMuteText: function (muted) {
            var elm = document.getElementById("toggleMute");
            if (muted)
            {
                elm.textContent = "Is not Muted."
            }
            else{
                elm.textContent = "Is Muted.";
            }
        }

    });

    astro.UISystem = UISystem;


    return astro.UISystem;
});
