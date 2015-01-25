define([
    'cog',
    'three',
    'components/threeComponent'

], function(cog, THREE, THREEComponent) {

    var BulletComponent = THREEComponent.extend('astro.BulletComponent', {

        init: function(entity, options) {
            this._super(entity, options);

            var geometry = new THREE.SphereGeometry(options.radius);
            var material = new THREE.MeshBasicMaterial({ color: options.color });
            this.mesh = new THREE.Mesh(geometry, material);

            this.duration = options.duration;
        }

    });

    astro.BulletComponent = BulletComponent;

    return BulletComponent;
});