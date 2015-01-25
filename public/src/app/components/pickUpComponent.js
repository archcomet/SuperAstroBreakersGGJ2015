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

            var geometry = new THREE.TorusGeometry(options.radius, 7, 8, 16 );
            var material = new THREE.MeshBasicMaterial({
                color: this.color.value
            });

            this.ring1 = new THREE.Mesh(geometry, material);

            this.ring2 = new THREE.Mesh(geometry, material);
            this.ring2.scale.multiplyScalar(0.6);

            this.ring3 = new THREE.Mesh(geometry, material);
            this.ring3.scale.multiplyScalar(0.6);

            this.mesh = new THREE.Object3D();
            this.mesh.add(this.ring1);
            this.ring1.add(this.ring2);
            this.ring2.add(this.ring3);

            this.duration = options.duration;
        }


    });

    astro.pickUpComponent = pickUpComponent;

    return astro.pickUpComponent;
});