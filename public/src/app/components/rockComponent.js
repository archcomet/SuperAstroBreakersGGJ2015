define([
    'cog',
    'three',
    'components/threeComponent'

], function(cog, THREE, THREEComponent) {

    var RockComponent = THREEComponent.extend('astro.RockComponent', {

        init: function(entity, options) {
            options = options || {};

            var geometry = new THREE.SphereGeometry(options.radius, 5, 5);
            var material = new THREE.MeshPhongMaterial({
                color: 0xff00ff,
                emissive: 0x110033
            });

            this.mesh = new THREE.Mesh(geometry, material);
        }

    });

    astro.RockComponent = RockComponent;

    return RockComponent;
});