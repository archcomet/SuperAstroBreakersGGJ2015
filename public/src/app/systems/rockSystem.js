define([
    'cog',
    'components/rockComponent',
    'components/positionComponent'

], function(cog, RockComponent, PositionComponent) {

    var RockSystem = cog.System.extend('astro.RockSystem', {

        configure: function(entities, events, config) {

            this.entities = entities;
            this.xMax = config.bounds.xMax;
            this.yMax = config.bounds.yMax;

            this.rockSpeedMax = config.rockSpeedMax;

            this.spawnRock();
            this.spawnRock();
            this.spawnRock();
            this.spawnRock();
            this.spawnRock();
            this.spawnRock();
        },

        spawnRock: function() {

            var rockEntity = this.entities.add('Rock');

            rockEntity.components.assign(RockComponent, {
                radius: 200
            });

            rockEntity.components.assign(PositionComponent, {
                x:  cog.rand.arc4rand(-this.xMax, this.xMax),
                y:  cog.rand.arc4rand(-this.yMax, this.yMax),
                dx: cog.rand.arc4rand(-this.rockSpeedMax, this.rockSpeedMax),
                dy: cog.rand.arc4rand(-this.rockSpeedMax, this.rockSpeedMax)
            });

            return rockEntity;
        }
    });

    astro.RockSystem = RockSystem;

    return RockSystem;
});