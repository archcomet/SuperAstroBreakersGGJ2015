

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
            this._tweenTime = 2500;
            this._muted = false;

            var self = this;

            document.getElementById("start").addEventListener("click", function() {
                self._events.emit('begin play');
            });

            document.getElementById("toggleMute").addEventListener("click", function() {
                var elm = document.getElementById("toggleMute");
                if (elm.textContent.indexOf("not") == -1)
                {
                    self._events.emit('unMuteAll');
                    elm.textContent = "Is not Muted."
                }
                else{
                    self._events.emit('muteAll');
                    elm.textContent = "Is Muted.";
                }

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
                if (this._muted) {
                    this._muted = false;
                    this._events.emit('unMuteAll');
                } else {
                    this._muted = true;
                    this._events.emit('muteAll');
                }
            }
        }

    });

    astro.UISystem = UISystem;


    return astro.UISystem;
});
