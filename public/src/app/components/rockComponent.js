define([
    'cog',
    'three',
    'components/threeComponent'

], function(cog, THREE, THREEComponent) {

    var RockComponent = THREEComponent.extend('astro.RockComponent', {

        init: function(options) {
            options = options || {};

            this.radius = options.radius || 300;

            var geometry = new THREE.SphereGeometry(this.radius);
            var material = new THREE.MeshBasicMaterial( {color: 0xff00ff } );

            this.mesh = new THREE.Mesh(geometry, material);
        }

    });

    astro.RockComponent = RockComponent;

    return RockComponent;
});