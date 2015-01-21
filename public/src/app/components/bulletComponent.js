define([
    'cog',
    'three',
    'components/threeComponent'

], function(cog, THREE, THREEComponent) {

    var BulletComponent = THREEComponent.extend('astro.BulletComponent', {

        init: function(entity, options) {
            options = options || {};

            var geometry = new THREE.SphereGeometry(10, 5, 5);
            var material = new THREE.MeshBasicMaterial({
                color: 0xffffff
            });

            this.mesh = new THREE.Mesh(geometry, material);
        }

    });

    astro.BulletComponent = BulletComponent;

    return BulletComponent;
});