define([
    'cog',
    'three',
    'components/threeComponent'

], function(cog, THREE, THREEComponent) {

    var BlackholeComponent = THREEComponent.extend('astro.BlackholeComponent', {

        init: function(entity, options) {
            this._super(entity, options);
            options = options || {};

            var geometry = new THREE.SphereGeometry(options.radius, 32, 32);
            var material = new THREE.MeshBasicMaterial({ color: 0x000000 });
            var blackhole = new THREE.Mesh(geometry, material);

            var customMaterial = new THREE.ShaderMaterial(
                {
                    uniforms:
                    {
                        "c":   { type: "f", value: 0.9 },
                        "p":   { type: "f", value: 4.7 },
                        glowColor: { type: "c", value: new THREE.Color(0xff00ff) },
                        viewVector: { type: "v3", value: options.viewVector }
                    },
                    vertexShader:   document.getElementById( 'glowVertexShader'   ).textContent,
                    fragmentShader: document.getElementById( 'glowFragmentShader' ).textContent,
                    side: THREE.FrontSide,
                    blending: THREE.AdditiveBlending,
                    transparent: true
                });

            var glow = new THREE.Mesh( geometry, customMaterial);
            glow.scale.multiplyScalar(1.7);

            this.mesh = new THREE.Object3D();
            this.mesh.add(blackhole);
            this.mesh.add(glow);
        }

    });

    astro.BlackholeComponent = BlackholeComponent;

    return BlackholeComponent;
});