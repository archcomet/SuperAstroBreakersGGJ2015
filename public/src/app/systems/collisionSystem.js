define([
    'cog',
    'box2d',
    'components/collisionComponent',
    'components/positionComponent',
    'components/playerShipComponent'

], function(cog, Box2D, CollisionComponent, PositionComponent, PlayerShipComponent) {
    'use strict';

    var b2Vec2 = Box2D.Common.Math.b2Vec2,
        b2BodyDef = Box2D.Dynamics.b2BodyDef,
        b2Body = Box2D.Dynamics.b2Body,
        b2FixtureDef = Box2D.Dynamics.b2FixtureDef,
        b2World = Box2D.Dynamics.b2World,
        b2CircleShape = Box2D.Collision.Shapes.b2CircleShape,
        b2KinematicBody = Box2D.Dynamics.b2Body.b2_kinematicBody;

    var CollisionSystem = cog.System.extend('astro.CollisionSystem', {

        configure: function(entityManager, eventManager, config) {
            this.world              = new b2World(new b2Vec2(0, 0), true);
            this.collisionEnabled   = true;

            this.addContactListener();
        },

        addContactListener: function () {
            var listener = new Box2D.Dynamics.b2ContactListener;
            listener.BeginContact = function(contact) {
                console.log('start hit!');
            }
            listener.EndContact = function(contact) {
                console.log('end hit');
            }
            this.world.SetContactListener(listener);
        },

        update: function(entityManager, eventManager, dt) {
            var entityList = entityManager.withComponents(CollisionComponent, PositionComponent),
                i, n = entityList.length;

            if (this.collisionEnabled) {
                this.updateWorld();

                for (i = 0; i < n; ++i) {
                    this.updateBodyPosition(entityList[i]);
                }
            }
        },

        updateWorld: function () {
            this.world.Step(
                1 / 60,      // frame-rate
                10,          // velocity iterations
                10           // position iterations
            );
            this.world.ClearForces();
        },

        updateBodyPosition: function (entity) {
            var collision = entity.components(CollisionComponent),
                position = entity.components(PositionComponent);

//            if (entity.components(PlayerShipComponent)) {
                console.log(entity.tag, 'Pos: [', position.x, position.y, '] Col: [', collision.x, collision.y, ']');
//            }

            collision.x = position.x/20;
            collision.y = position.y/20;

            collision.body.SetPosition({
                x: collision.x,
                y: collision.y
            });
        },

        createBody: function (collisionComponent, entity) {
            var shapeConfig             = collisionComponent.shapeConfig;
            var bodyDef                 = new b2BodyDef();
            bodyDef.type                = b2KinematicBody;
            bodyDef.position.Set(0, 0);

            var fixDef                  = new b2FixtureDef();
            fixDef.filter.categoryBits  = collisionComponent.categoryBits;
            fixDef.filter.maskBits      = collisionComponent.maskBits;
            fixDef.density              = collisionComponent.density;
            fixDef.friction             = collisionComponent.friction;
            fixDef.restitution          = collisionComponent.restitution;
            fixDef.shape                = new b2CircleShape();
            fixDef.shape.SetRadius( shapeConfig.radius );

            var body = this.world.CreateBody(bodyDef);
            body.CreateFixture(fixDef);

            return body;
        },

        addCollision: function (entity, shapeConfig) {
            var collision           = entity.components.assign(CollisionComponent);
            collision.shapeConfig   = shapeConfig;
            collision.body          = this.createBody(collision, entity);
        },

        removeCollision: function (entity) {
            this.world.DestroyBody(entity.components(CollisionComponent).body);
            entity.components.remove(CollisionComponent);
        },

        /**
         * EVENTS
         */

        'Collision.Hit event': function () {
            console.log('hit!!!');
        },

        'Collision.Add event': function (entity, shapeConfig) {
            if (entity.components(CollisionComponent)) {
                this.removeCollision(entity);
            }

            this.addCollision(entity, shapeConfig);
        },

        'Collision.Remove event': function (entity) {
            if (entity.components(CollisionComponent)) {
                this.removeCollision(entity);
            }
        },

        'Collision.Disable event': function () {
            this.collisionEnabled = false;
        },

        'Collision.Enable event': function () {
            this.collisionEnabled = true;
        }

    });

    astro.CollisionSystem = CollisionSystem;

    return CollisionSystem;
});