define([
    'cog',
    'components/rockComponent',
    'components/positionComponent',
    'components/cameraComponent'

], function(cog, RockComponent, PositionComponent, CameraComponent) {

    var RockSystem = cog.System.extend('astro.RockSystem', {

        configure: function(entities, events, config) {

            this.entities = entities;
            this.rocksConfig = config.rocks;
            this.cameraComponent = entities.withTag('camera')[0].components(CameraComponent);
            this.rocks = [];

            window.breakRandomRock = this.breakRandomRock.bind(this);
        },

        'begin play event': function() {
            this.spawnRock(400);
            this.spawnRock(200);
            this.spawnRock(200);
            this.spawnRock(100);
            this.spawnRock(50);
            this.spawnRock(50);
        },

        spawnRock: function(radius) {

            var rockEntity = this.entities.add('Rock');
            var maxLinearSpeed = this.rocksConfig.maxLinearSpeed * this.rocksConfig.radiusSpeedModifier / radius;
            var maxAngularSpeed = this.rocksConfig.maxAngularSpeed * this.rocksConfig.radiusSpeedModifier / radius;

            rockEntity.components.assign(RockComponent, {
                radius: radius
            });

            rockEntity.components.assign(PositionComponent, {
                radius: radius,
                x:  cog.rand.arc4rand(-this.cameraComponent.visibleWidth/2, this.cameraComponent.visibleWidth/2),
                y:  cog.rand.arc4rand(-this.cameraComponent.visibleHeight/2, this.cameraComponent.visibleHeight/2),
                dx: cog.rand.arc4rand(-maxLinearSpeed, maxLinearSpeed),
                dy: cog.rand.arc4rand(-maxLinearSpeed, maxLinearSpeed),
                drx: cog.rand.arc4rand(-maxAngularSpeed, maxAngularSpeed),
                dry: cog.rand.arc4rand(-maxAngularSpeed, maxAngularSpeed),
                drz: cog.rand.arc4rand(-maxAngularSpeed, maxAngularSpeed)
            });

            this.rocks.push(rockEntity);
            return rockEntity;
        },

        breakRock: function(rock) {
            var rockComponent = rock.components(RockComponent);
            if (rockComponent.radius > this.rocksConfig.minSplitRadius) {


            }
            var i = this.rocks.indexOf(rock);
            this.rocks.splice(i, 1);
            this.entities.remove(rock);
        },

        breakRandomRock: function() {
            var rock, n = this.rocks.length;
            if (n > 0) {
                rock = this.rocks[cog.rand.arc4randInt(1, n) - 1];
                this.breakRock(rock);
            }
        }
    });

    astro.RockSystem = RockSystem;

    return RockSystem;
});