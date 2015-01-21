define([
    'cog',
    'box2d'

], function(cog, Box2D) {
    'use strict';

    var b2Vec2 = Box2D.Common.Math.b2Vec2,
        b2BodyDef = Box2D.Dynamics.b2BodyDef,
        b2Body = Box2D.Dynamics.b2Body,
        b2FixtureDef = Box2D.Dynamics.b2FixtureDef,
        b2World = Box2D.Dynamics.b2World,
        b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape,
        b2RevoluteJointDef = Box2D.Dynamics.Joints.b2RevoluteJointDef,
        b2MouseJointDef = Box2D.Dynamics.Joints.b2MouseJointDef,
        b2WeldJointDef = Box2D.Dynamics.Joints.b2WeldJointDef,
        b2PrismaticJointDef = Box2D.Dynamics.Joints.b2PrismaticJointDef,
        b2KinematicBody = Box2D.Dynamics.b2Body.b2_kinematicBody,
        b2DynamicBody = Box2D.Dynamics.b2Body.b2_dynamicBody;

    var CollisionSystem = cog.System.extend('astro.CollisionSystem', {

        configure: function(entityManager, eventManager, config) {

        },

        update: function(entityManager, eventManager, dt) {

        }

    });

    astro.CollisionSystem = CollisionSystem;

    return CollisionSystem;
});