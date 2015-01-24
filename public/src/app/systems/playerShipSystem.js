define([
    'cog',
    'components/playerShipComponent',
    'components/positionComponent',
    'components/threeComponent'

], function(cog, PlayerShipComponent, PositionComponent, THREEComponent) {

    var PlayerShipSystem = cog.System.extend('astro.PlayerShipSystem', {

        configure: function(entities, events, config) {

            // for now...

            this.playerShipEntity = entities.add('PlayerShip');


        },

        update: function(entities, events, dt) {

        }

    });

    astro.PlayerShipSystem = PlayerShipSystem;

    return PlayerShipSystem;
});