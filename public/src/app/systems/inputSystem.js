define([
    'cog'
], function(cog) {

    /**
     *
     * Key Events:
     *
     * input player[1|2] [rotateRight|rotateLeft|fire|forward] [on|off]
     *
     */

    var InputSystem = cog.System.extend('astro.InputSystem', {


        configure: function (entities, events) {
            this._events = events;
            this._gamepadSupported = cog.isFunction(navigator.getGamepads) ? [] : null;

            document.addEventListener('keyup', this._handleKeyInput.bind(this), true);
            document.addEventListener('keydown', this._handleKeyInput.bind(this), true);

            if (this._gamepadSupported) {
                window.addEventListener('gamepadconnected', this._gamepadConnected.bind(this), true);
                window.addEventListener('gamepaddisconnected', this._gamepadDisconnected.bind(this), true);
            }

            this._inputState = {
                player1: {
                    fire: false,
                    forward: false,
                    rotateRight: false,
                    rotateLeft: false,
                    select: false,
                    start: false
                },
                player2: {
                    fire: false,
                    forward: false,
                    rotateRight: false,
                    rotateLeft: false,
                    select: false,
                    start: false
                }
            };
        },

        update: function () {
            this._pollGamepads();
        },

        _pollGamepads: function () {
            var i, n, pads, gamepad, player, playerState, padState;

            if (!this._gamepadSupported) {
                return;
            }

            pads = navigator.getGamepads();

            for (i = 0, n = pads.length; i < n; ++i) {
                gamepad = pads[i];

                if (!gamepad || !gamepad.connected) {
                    continue;
                }

                /*for(j=0,m=gamepad.buttons.length;j<m;++j) {
                    console.log('button ' + j + ': ' + gamepad.buttons[j].pressed);
                }*/

                player = (gamepad.index % 2 === 0) ? 'player1' : 'player2';
                playerState = (gamepad.index % 2 === 0) ? this._inputState[player] : this._inputState[player];
                padState = this._getPadInputState(gamepad);

                this._emitInputEventOnChange(playerState, padState, player, 'fire');
                this._emitInputEventOnChange(playerState, padState, player, 'forward');
                this._emitInputEventOnChange(playerState, padState, player, 'rotateRight');
                this._emitInputEventOnChange(playerState, padState, player, 'rotateLeft');
                this._emitInputEventOnChange(playerState, padState, player, 'select');
                this._emitInputEventOnChange(playerState, padState, player, 'start');
            }
        },

        _emitInputEventOnChange: function (playerState, padState, player, name) {
            if (playerState[name] !== padState[name]) {
                playerState[name] = padState[name];
                this._events.emit('input', player, name, padState[name]);
            }
        },

        _getPadInputState: function (gamepad) {
            return {
                fire: gamepad.buttons[0].pressed,
                forward: gamepad.axes[1] < -0.5,
                rotateRight: gamepad.axes[0] > 0.5,
                rotateLeft: gamepad.axes[0] < -0.5,
                select: gamepad.buttons[8].pressed,
                start: gamepad.buttons[9].pressed
            };
        },

        _gamepadConnected: function (event) {
            console.log('connect gamepad ' + event.gamepad.index);
        },

        _gamepadDisconnected: function (event) {
            console.log('disconnect gamepad ' + event.gamepad.index);
        },

        _handleKeyInput: function (event) {
            var pressed = (event.type !== 'keyup'),
                player, action;

            window.console.log(event.keyCode);
            switch (event.keyCode) {
// up (w, up arrow)
                case 87: {
                    action = 'forward';
                    player = 'player1';
                    break;
                }
                case 38: {
                    player = 'player2';
                    action = 'forward';
                    break;
                }
// down (e, /)
                case 69: {
                    player = 'player1';
                    action = 'fire';
                    break;
                }
                case 191: {
                    player = 'player2';
                    action = 'fire';
                    break;
                }
// bomb (r, .)
                case 82: {
                    player = 'player1';
                    action = 'bomb';
                    break;
                }

                case 190: {
                    player = 'player2';
                    action = 'bomb';
                    break;
                }
// left (a, left arrow)
                case 65: {
                    player = 'player1';
                    action = 'rotateLeft';
                    break;
                }
                case 37: {
                    player = 'player2';
                    action = 'rotateLeft';
                    break;
                }
// right (d, right arrow)
                case 68: {
                    player = 'player1';
                    action = 'rotateRight';
                    break;
                }
                case 39: {
                    player = 'player2';
                    action = 'rotateRight';
                    break;
                }
            }

            if (action) {
                this._events.emit('input', player, action, pressed);
            }
        }

    });

    cog.InputSystem = InputSystem;

    return InputSystem;
});