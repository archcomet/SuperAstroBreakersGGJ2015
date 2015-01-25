define([
    'cog',
    'three',
    'components/threeComponent'

], function(cog, THREE, THREEComponent) {

    var BulletComponent = THREEComponent.extend('astro.BulletComponent', {

        init: function(entity, options) {
            this._super(entity, options);

            var geometry = new THREE.SphereGeometry(options.radius, 8, 8);
            var material = new THREE.MeshBasicMaterial({ color: options.color });
            this.mesh = new THREE.Mesh(geometry, material);
            this.duration = options.duration;

            var glowGeometry = new THREE.SphereGeometry(options.radius, 16, 16);
            var glowMaterial = new THREE.ShaderMaterial({
                uniforms:
                {
                    "c":   { type: "f", value: 1 },
                    "p":   { type: "f", value: 1 },
                    glowColor: { type: "c", value: new THREE.Color(options.color) },
                    viewVector: { type: "v3", value: new THREE.Vector3(0, 0, 1) }
                },
                vertexShader:   document.getElementById( 'glowVertexShader'   ).textContent,
                fragmentShader: document.getElementById( 'glowFragmentShader' ).textContent,
                side: THREE.FrontSide,
                blending: THREE.AdditiveBlending,
                transparent: true
            });

            this.glow = new THREE.Mesh(glowGeometry, glowMaterial);
            this.glow.scale.multiplyScalar(3);

            this.mesh.add(this.glow);
        }

    });

    astro.BulletComponent = BulletComponent;

    return BulletComponent;
});