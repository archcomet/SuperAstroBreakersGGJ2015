define([
    'cog',
    'components/pickUpComponent',
    'components/positionComponent',
    'components/cameraComponent',
    'components/collisionComponent'

], function(cog, PickUpComponent, PositionComponent, CameraComponent, CollisionComponent) {

    var PickUpSystem = cog.System.extend('astro.PickUpSystem', {

        configure: function(entities, events, config) {

            this.entities   = entities;
            this.events     = events;
            this.pickUpConfig = config.pickUps;
            this.cameraComponent = entities.withTag('camera')[0].components(CameraComponent);
            this.spawnTime = this.pickUpConfig.spawnTime;
            this.pickUps = [];
            this.pickUpsToRemove = [];
        },
        'begin play event': function() {
            //this.spawnPickUp();
        },

        'end play event': function() {
            this.despawnAllPickUps();
        },

        spawnPickUp: function() {

            var pickUpEntity = this.entities.add('PickUp');

            var x = cog.rand.arc4rand(-this.cameraComponent.visibleWidth / 2, this.cameraComponent.visibleWidth / 2),
                y = cog.rand.arc4rand(-this.cameraComponent.visibleHeight / 2, this.cameraComponent.visibleHeight / 2);

            pickUpEntity.components.assign(PickUpComponent, {
                radius: 100,
                duration: this.pickUpConfig.duration,
                spawnX: x,
                spawnY: y
            });

            pickUpEntity.components.assign(PositionComponent, {
                radius: 100,
                x: x,
                y: y
            });

            pickUpEntity.components.assign(CollisionComponent, {
                startHandler: this.collisionHandler.bind(this)
            });

            this.pickUps.push(pickUpEntity);
            return pickUpEntity;
        },

        collisionHandler: function (pickup, other) {
            var pickUpComponent = pickup.components(PickUpComponent);
            if (other.tag === 'PlayerShip') {
                pickUpComponent.duration = 0;
                this.events.emit('Player.Pickup', pickUpComponent.color.name);
            } else if (other.tag === 'Blackhole') {
                pickUpComponent.duration = 0;
            }
        },

        despawnPickUp: function(pickUp) {
            this.entities.remove(pickUp);

            var i = this.pickUps.indexOf(pickUp);
            if (i > -1) {
                this.pickUps.splice(i, 1);
            }
        },

        despawnAllPickUps: function() {
            var i = 0, n = this.pickUps.length;
            for (; i < n; ++i) {
                this.entities.remove(this.pickUps[i]);
            }
            this.pickUps.length = 0;
            this.pickUpsToRemove.length = 0;
        },

        update: function(entities, events, dt) {
            this.spawnTime -= dt;
            if (this.spawnTime < 0) {
                this.spawnPickUp();
                this.spawnTime = this.pickUpConfig.spawnTime;
            }

            var pickUp, pickUpComponent,
                i = 0,
                n = this.pickUps.length;

            this.pickUpsToRemove.length = 0;

            for (; i < n; ++i) {
                pickUp = this.pickUps[i];
                pickUpComponent = pickUp.components(PickUpComponent);
                pickUpComponent.duration -= dt;

                pickUpComponent.ring1.rotation.x += 5 * (dt/1000);
                pickUpComponent.ring2.rotation.y += 5 * (dt/1000);
                pickUpComponent.ring3.rotation.x += 5 * (dt/1000);

                if (pickUpComponent.duration < 0) {
                    this.pickUpsToRemove.push(pickUp);
                }
            }

            while(pickUp = this.pickUpsToRemove.pop()) {
                this.despawnPickUp(pickUp);
            }
        }
    });

    astro.PickUpSystem = PickUpSystem;

    return PickUpSystem;
});