define([
    'cog',
    'components/playerShipComponent',
    'components/positionComponent'

], function(cog, PlayerShipComponent, PositionComponent) {

    var PlayerShipSystem = cog.System.extend('astro.PlayerShipSystem', {

        configure: function(entities, events, config) {

            // for now...
            this.playerShipEntity = entities.add('PlayerShip');
            this.playerShipEntity.components.assign(PlayerShipComponent);
            this.playerShipEntity.components.assign(PositionComponent);
        },

        update: function(entities, events, dt) {

        }

    });

    astro.PlayerShipSystem = PlayerShipSystem;

    return PlayerShipSystem;
});