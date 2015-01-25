define([
    'cog',
    'three',
    'components/threeComponent'

], function(cog, THREE, THREEComponent) {

    var RockComponent = THREEComponent.extend('astro.RockComponent', {

        init: function(entity, options) {
            this._super(entity, options);
            options = options || {};

            var geometry = new THREE.SphereGeometry(options.radius, 5, 5);
            var material = new THREE.MeshPhongMaterial({
                color: 0x584D3E,
                emissive: 0x201111,
                specular: 0xffffff,
                shininess: 5

            });

            this.mesh = new THREE.Mesh(geometry, material);
        }

    });

    astro.RockComponent = RockComponent;

    return RockComponent;
});