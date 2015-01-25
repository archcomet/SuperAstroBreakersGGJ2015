define([
    'cog',
    'three',
    'components/threeComponent'

], function(cog, THREE, THREEComponent) {

    var pickUpComponent = THREEComponent.extend('astro.pickUpComponent', {

        init: function(entity, options) {
            this._super(entity, options);
            options = options || {};

            this.color      = options.color || { value: 0x0000ff, name: 'blue' };
            this.emissive   = options.emissive || 0x110033;

            var geometry = new THREE.SphereGeometry(options.radius, 5, 5);
            var material = new THREE.MeshPhongMaterial({
                color: this.color.value,
                emissive: this.emissive
            });

            this.mesh = new THREE.Mesh(geometry, material);
            this.duration = options.duration;
        }


    });

    astro.pickUpComponent = pickUpComponent;

    return astro.pickUpComponent;
});