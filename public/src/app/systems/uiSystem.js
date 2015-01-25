

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
            this._bombElement = document.getElementById('bombValue');
            this._finalScoreElement = document.getElementById('finalScoreValue');

            this._events = events;
            this._tweenTime = 2500;
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

                self._updateMuteText(muted);

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
            var intro = document.querySelector('.Intro'),
                rotation = { r:-Math.PI/4 };

            var tweenLeft = new Tween.Tween( rotation )
                .to( { r:Math.PI/4 }, this._tweenTime)
                .easing ( Tween.Easing.Elastic.InOut )
                .onUpdate ( function () {
                    intro.style.transform = 'rotateX(' + rotation.r + 'rad)';
                });

            var tweenRight = new Tween.Tween( rotation )
                .to( { r:-Math.PI/4 }, this._tweenTime)
                .easing ( Tween.Easing.Elastic.InOut )
                .onUpdate ( function () {
                intro.style.transform = 'rotateX(' + rotation.r + 'rad)';
                })
                .chain(tweenLeft);

            tweenLeft.chain(tweenRight);
            tweenLeft.start();
        },

        'screen start event': function() {
            this._menu.style.display = 'block';
            this._header.style.display = 'none';
            this._end.style.display = 'none';
            this._webGLContainer.style.display = 'none';
            this._intro.style.display = 'block';

            this._events.emit('playSound', 'introMusic', [1]);
        },

        'begin play event': function() {
            this._menu.style.display = 'none';
            this._header.style.display = 'block';
            this._end.style.display = 'none';
            this._webGLContainer.style.display = 'block';
            this._intro.style.display = 'none';

            this._events.emit('stopSound', 'introMusic', [-2]);
            this._events.emit('playSound', 'worldMusic', [2]);

        },

        'end play event': function(score) {
            this._menu.style.display = 'none';
            this._header.style.display = 'none';
            this._end.style.display = 'block';
            this._webGLContainer.style.display = 'none';
            this._intro.style.display = 'none';

            this._finalScoreElement.textContent = score;

            this._events.emit('stopSound', 'worldMusic');
            this._events.emit('playSound', 'endMusic');
        },

        'playerScore event': function (score) {
            this._scoreElement.textContent = score;
        },

        'playerLife event': function (score) {
            this._lifeElement.textContent = score;
        },
        'loadBomb event': function (bomb) {
            this._bombElement.textContent = bomb;
        },

        'decreseBombCount event': function (bomb) {
        this._bombElement.textContent -=  1 ;
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
