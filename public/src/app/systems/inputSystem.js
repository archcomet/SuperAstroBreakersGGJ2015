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

    var InputSystem = cog.System.extend({

        configure: function(entities, events) {
            this._events = events;

            document.addEventListener('keyup', this._handleKeyInput.bind(this), true);
            document.addEventListener('keydown', this._handleKeyInput.bind(this), true);
        },

        _handleKeyInput: function (event) {
            var pressed = (event.type !== 'keyup'),
                player, action;

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