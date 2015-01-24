define([
    'cog',
    'three',
    'components/threeComponent'

], function(cog, THREE, THREEComponent) {

    var PlayerShipComponent = THREEComponent.extend('astro.PlayerShipComponent', {

        init: function() {
            var geometry = new THREE.CylinderGeometry(0, 50, 100, 3, 1, false);
            var material1 = new THREE.MeshBasicMaterial( {color: 0xffff00, opacity: 0.5, transparent: true} );
            var material2 = new THREE.MeshBasicMaterial( {color: 0x00ffff, opacity: 0.5, transparent: true} );

            var player1Mesh = new THREE.Mesh(geometry, material1);
            var player2Mesh = new THREE.Mesh(geometry, material2);

            player1Mesh.rotation.z = -Math.PI/2;
            player2Mesh.rotation.z = -Math.PI/2;

            this.mesh = new THREE.Object3D();
            this.player1 = new THREE.Object3D();
            this.player2 = new THREE.Object3D();

            this.mesh.add(this.player1);
            this.mesh.add(this.player2);

            this.player1.add(player1Mesh);
            this.player2.add(player2Mesh);
        }

    });

    astro.PlayerShipComponent = PlayerShipComponent;

    return PlayerShipComponent;
});