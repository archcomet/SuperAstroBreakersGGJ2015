define([
    'cog',
    'three',
    'components/threeComponent'

], function(cog, THREE, THREEComponent) {

    var pickUpComponent = THREEComponent.extend('astro.pickUpComponent', {

        init: function(entity, options) {
            this._super(entity, options);
            options = options || {};

            var geometry = new THREE.SphereGeometry(options.radius, 5, 5);
            var material = new THREE.MeshPhongMaterial({
                color: 0x0000ff,
                emissive: 0x110033
            });

            this.mesh = new THREE.Mesh(geometry, material);
            this.duration = options.duration;
        }


    });

    astro.pickUpComponent = pickUpComponent;

    return astro.pickUpComponent;
});