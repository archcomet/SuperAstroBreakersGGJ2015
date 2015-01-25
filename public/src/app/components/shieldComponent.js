define([
    'cog',
    'three',
    'components/threeComponent'

], function(cog, THREE, THREEComponent) {

    var ShieldComponent = THREEComponent.extend('astro.ShieldComponent', {

        init: function(entity, options) {
            this._super(entity, options);

            var geometry = new THREE.SphereGeometry(100);
            var material = new THREE.MeshBasicMaterial( {color: 0x0000ff, opacity: 0.5, transparent: true} );

            this.mesh = new THREE.Mesh(geometry, material);
        }

    });

    astro.ShieldComponent = ShieldComponent;

    return ShieldComponent;
});