define([
    'cog',
    'three',
    'components/threeComponent'

], function(cog, THREE, THREEComponent) {

    var PlayerShipComponent = THREEComponent.extend('astro.PlayerShipComponent', {

        init: function() {
            var geometry = new THREE.CylinderGeometry(0, 50, 100, 3, 1, false);
            var material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
            this.mesh = new THREE.Mesh(geometry, material);
        }

    });

    astro.PlayerShipComponent = PlayerShipComponent;

    return PlayerShipComponent;
});