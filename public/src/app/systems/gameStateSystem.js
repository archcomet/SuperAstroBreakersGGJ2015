define([
    'cog'

], function(cog) {

    var State = {
        STOPPED: 0,
        STARTED: 1
    };

    var GameStateSystem = cog.System.extend('astro.GameStateSystem', {

        configure: function(entityManager, eventManager, config) {
            this._events = eventManager;
            this._resetStats(config);
        },

        'game start event': function () {
            this._resetStats();
            this._state = State.STARTED;
            this._events.emit('begin play');
        },

        'player died event': function () {
            if (this._state !== State.STARTED) {
                return;
            }

            this._playerLife = this._playerLife - 1;

            this._setNagText(this._playerLife);

            this._events.emit('playerLife', this._playerLife);

            if (this._playerLife <= 0) {
                this._state = State.STOPPED;
                this._events.emit('end play');
            } else {
                this._readySteadyGo();
            }
        },

        'game destroyedRock event': function () {
            if (this._state !== State.STARTED) {
                return;
            }

            this._score = this._score + this._rockBonus;
            this._events.emit('playerScore', this._score);
        },

        'game savedCivilian event': function () {
            if (this._state !== State.STARTED) {
                return;
            }

            this._score = this._score + this._civilianSavedBonus;
            this._events.emit('playerScore', this._score);
        },

        'game lostCivilian event': function () {
            if (this._state !== State.STARTED) {
                return;
            }

            this._score = this._score + this._civilianLostCost;

            this._events.emit('playerScore', this._score);
        },

        _resetStats: function (config) {
            config = config || {};
            this._state = State.STOPPED;
            this._playerLife = config.playerLife || 5;
            this._score = config.score || 0;
            this._rockBonus = config.rockBonus || Math.E;
            this._civilianSavedBonus = config.civilianSavedBonus || Math.PI;
            this._civilianLostCost = config.civilianLostCost || (-2 * Math.PI);
            this._countdownFinalText = 'What Do We Do Now?';

            this._events.emit('playerScore', this._score);
            this._events.emit('playerLife', this._playerLife);
        },

        _setNagText: function (life) {
            switch (life) {
                case 4: {
                    this._countdownFinalText = 'Rocks are bad';
                    break;
                }
                case 3: {
                    this._countdownFinalText = 'No Whining';
                    break;
                }
                case 2: {
                    this._countdownFinalText = 'Need a vacuum for all this dust';
                    break;
                }
                case 1: {
                    this._countdownFinalText = 'Turn the controller around!';
                    break;
                }
            }
        },

        _fadeIn: function (element) {
            element.style.opacity = 0;

            var last = +new Date();
            var tick = function() {
                element.style.opacity = +element.style.opacity + (new Date() - last) / 400;
                last = +new Date();

                if (+element.style.opacity < 1) {
                    setTimeout(tick, 16);
                }
            };

            tick();
        },

        _countdown: function (count, delay) {
            var self = this,
                cnt = count;


            if (!this._countDownElem) {
                return;
            }

            this._countDownElem.innerHTML = (cnt <= 1) ? this._countdownFinalText : (cnt +'...');
            this._fadeIn(this._countDownElem);

            if (cnt < 1) {
                document.body.removeChild(this._countDownElem);
                self._events.emit('player spawn');
                // bust out of loop
                return;
            }

            setTimeout(function() {
                self._countdown(--cnt, delay);
            }, delay);
        },

        _readySteadyGo: function () {
            this._countDownElem = document.createElement('div');
            this._countDownElem.classList.add('centered');
            document.body.appendChild(this._countDownElem);

            this._countdown(3, 1000);
        }

    });

    astro.GameStateSystem = GameStateSystem;

    return GameStateSystem;
});