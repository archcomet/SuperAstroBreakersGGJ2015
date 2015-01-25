define([
    'cog',
    'box2d',
    'components/collisionComponent'

], function(cog, Box2D, CollisionComponent) {
    'use strict';

    var b2Vec2 = Box2D.Common.Math.b2Vec2,
        b2BodyDef = Box2D.Dynamics.b2BodyDef,
        b2Body = Box2D.Dynamics.b2Body,
        b2FixtureDef = Box2D.Dynamics.b2FixtureDef,
        b2World = Box2D.Dynamics.b2World,
        b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape,
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
            var entityList = entityManager.withComponents(CollisionComponent),
                i, n = entityList.length;

            if (this.collisionEnabled) {
                for (i = 0; i < n; ++i) {
                    this.fixDirtyBody(entityList[i]);
                }

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

        },

        fixDirtyBody: function (entity) {
            var physicsComponent = entity.components(CollisionComponent);

            if (physicsComponent.positionIsDirty) {
                physicsComponent.body.SetPosition({
                    x: physicsComponent.x,
                    y: physicsComponent.y
                });
                physicsComponent.positionIsDirty = false;
            }
        },

        createBody: function (collisionComponent, entity) {
            var shapeType               = collisionComponent.shapeType,
                shapeConfig             = collisionComponent.shapeConfig;

            var bodyDef                 = new b2BodyDef();
            bodyDef.type                = b2KinematicBody;
            bodyDef.position.Set(0, 0);

            var fixDef                  = new b2FixtureDef();
            fixDef.filter.categoryBits  = collisionComponent.categoryBits;
            fixDef.filter.maskBits      = collisionComponent.maskBits;
            fixDef.density              = collisionComponent.density;
            fixDef.friction             = collisionComponent.friction;
            fixDef.restitution          = collisionComponent.restitution;
            fixDef.shape                = new (shapeType === 'circle' ? b2CircleShape : b2PolygonShape)();

            if (shapeType === 'circle') {
                fixDef.shape.SetRadius( shapeConfig.radius );
            } else {
                if (shapeConfig.isBox) {
                    fixDef.shape.SetAsBox(shapeConfig.width, shapeConfig.height);
                }
            }

            var body = this.world.CreateBody(bodyDef);
            body.CreateFixture(fixDef);

            return body;
        },

        addCollision: function (entity, shapeType, shapeConfig) {
            var collision           = entity.components.assign(CollisionComponent);
            collision.shapeType     = shapeType;
            collision.shapeConfig   = shapeConfig;
            collision.body          = this.createBody(collision, entity);

        },

        removeCollision: function (entity) {
            entity.components.remove(CollisionComponent);
        },

        /**
         * EVENTS
         */

        'Collision.Hit event': function () {
            console.log('hit!!!');
        },

        'Collision.Add event': function (entity, shape, shapeConfig) {
            if (entity.components(CollisionComponent)) {
                this.removeCollision(entity);
            }

            this.addCollision(entity, shape, shapeConfig);
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