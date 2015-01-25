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
        b2DynamicBody = Box2D.Dynamics.b2Body.b2_dynamicBody,
        b2DebugDraw = Box2D.Dynamics.b2DebugDraw;

    var METERS_TO_SPACE = 200;

    var CollisionSystem = cog.System.extend('astro.CollisionSystem', {

        configure: function(entityManager, eventManager, config) {
            this.events             = eventManager;
            this.world              = new b2World(new b2Vec2(0, 0), false);
            this.collisionEnabled   = true;
            this.addContactListener();
        },

        addContactListener: function () {
            var events              = this.events;
            var listener            = new Box2D.Dynamics.b2ContactListener;
            listener.BeginContact   = function (contact) {
                var entity1 = contact.m_fixtureA.m_body.m_userData.entity,
                    entity2 = contact.m_fixtureB.m_body.m_userData.entity;

                events.emit('Collision.ContactStart', entity1, entity2);
            };
            listener.EndContact     = function (contact) {
                var entity1 = contact.m_fixtureA.m_body.m_userData.entity,
                    entity2 = contact.m_fixtureB.m_body.m_userData.entity;

                events.emit('Collision.ContactEnd', entity1, entity2);
            };
            listener.PostSolve      = function (contact, impulse) {};
            listener.PreSolve       = function (contact, oldManifold) {};
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

            collision.x = position.x / METERS_TO_SPACE;
            collision.y = position.y / METERS_TO_SPACE;
            collision.body.SetAngle( position.rz );
            collision.body.SetPosition( {
                x: collision.x,
                y: collision.y
            } );
        },

        createBody: function (collisionComponent, entity) {
            var shapeConfig             = collisionComponent.shapeConfig;
            var bodyDef                 = new b2BodyDef();
            bodyDef.type                = b2DynamicBody;
            bodyDef.isSensor            = true;
            bodyDef.position.Set(0, 0);
            bodyDef.userData = {
                entity: entity
            };

            var fixDef                  = new b2FixtureDef();
            fixDef.filter.categoryBits  = collisionComponent.categoryBits;
            fixDef.filter.maskBits      = collisionComponent.maskBits;
            fixDef.density              = collisionComponent.density;
            fixDef.friction             = collisionComponent.friction;
            fixDef.restitution          = collisionComponent.restitution;
            fixDef.shape                = new b2CircleShape(shapeConfig.radius / METERS_TO_SPACE);

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

        /*
         * EVENTS
         */

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