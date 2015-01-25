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

        'game rockCollision event': function () {
            if (this._state !== State.STARTED) {
                return;
            }

            this._playerLife = this._playerLife - 1;

            this._events.emit('playerLife', this._playerLife);

            this._events.emit('player destroy');

            if (this._playerLife <= 0) {
                this._state = State.STOPPED;
                this._events.emit('end play');
            } else {
                var self = this;
                setTimeout(function () {
                    self._events.emit('player spawn');
                }, 2000);
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

            this._events.emit('playerScore', this._score);
            this._events.emit('playerLife', this._playerLife);
        }

    });

    astro.GameStateSystem = GameStateSystem;

    return GameStateSystem;
});