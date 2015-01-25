define([
    'cog',
    'three',
    'components/threeComponent'

], function(cog, THREE, THREEComponent) {

    var PlayerShipComponent = THREEComponent.extend('astro.PlayerShipComponent', {

        init: function(entity, options) {
            this._super(entity, options);

            var geometry = this.createGeometry();

            var material1 = new THREE.MeshBasicMaterial( {color: 0xffff00 } );
            var material2 = new THREE.MeshBasicMaterial( {color: 0x00ffff } );

            var player1Mesh = new THREE.Mesh(geometry, material1);
            var player2Mesh = new THREE.Mesh(geometry, material2);

            player1Mesh.rotation.z = Math.PI/2;
            player2Mesh.rotation.z = Math.PI/2;

            this.mesh = new THREE.Object3D();
            this.player1 = new THREE.Object3D();
            this.player2 = new THREE.Object3D();

            this.mesh.add(this.player1);
            this.mesh.add(this.player2);

            this.player1.add(player1Mesh);
            this.player2.add(player2Mesh);

            var pointLight = new THREE.PointLight(0xffffaa, 1, 900);
            this.mesh.add(pointLight);

            var glowGeometry = new THREE.SphereGeometry(100, 16, 16);
            var glowMaterial = new THREE.ShaderMaterial({
                uniforms:
                {
                    "c":   { type: "f", value: 1 },
                    "p":   { type: "f", value: 1 },
                    glowColor: { type: "c", value: new THREE.Color(0x0000ff) },
                    viewVector: { type: "v3", value: new THREE.Vector3(0, 0, 1) }
                },
                vertexShader:   document.getElementById( 'glowVertexShader'   ).textContent,
                fragmentShader: document.getElementById( 'glowFragmentShader' ).textContent,
                side: THREE.FrontSide,
                blending: THREE.AdditiveBlending,
                transparent: true
            });

            this.glow = new THREE.Mesh(glowGeometry, glowMaterial);
            this.glow.scale.multiplyScalar(1.2);

            this.mesh.add(this.glow);
        },


        createGeometry: function() {
            var geometry = new THREE.Geometry();
            geometry.vertices.push(

                //Flat

                new THREE.Vector3( 0, 30, 0 ),
                new THREE.Vector3( 30, 0, 0 ),
                new THREE.Vector3( 0, 0, 0 ),

                new THREE.Vector3( 0, 30, 0 ),
                new THREE.Vector3( -30, 0, 0 ),
                new THREE.Vector3( 0, 0, 0 ),

                new THREE.Vector3( 0, 0, 0 ),
                new THREE.Vector3( 0, -70,0 ),
                new THREE.Vector3( 30, 0, 0 ),

                new THREE.Vector3( 0, 0, 0 ),
                new THREE.Vector3( 0, -70,0 ),
                new THREE.Vector3( -30, 0, 0 ),

                // z + 10

                new THREE.Vector3( 0, 30, 0 ),
                new THREE.Vector3( 30, 0, 0 ),
                new THREE.Vector3( 0, 0, 10 ),

                new THREE.Vector3( 0, 30, 0 ),
                new THREE.Vector3( -30, 0, 0 ),
                new THREE.Vector3( 0, 0, 10 ),

                new THREE.Vector3( 0, 0, 10 ),
                new THREE.Vector3( 0, -70,0 ),
                new THREE.Vector3( 30, 0, 0 ),

                new THREE.Vector3( 0, 0, 10 ),
                new THREE.Vector3( 0, -70,0 ),
                new THREE.Vector3( -30, 0, 0 ),

                // z - 10

                new THREE.Vector3( 0, 30, 0 ),
                new THREE.Vector3( 30, 0, 0 ),
                new THREE.Vector3( 0, 0, -10 ),

                new THREE.Vector3( 0, 30, 0 ),
                new THREE.Vector3( -30, 0, 0 ),
                new THREE.Vector3( 0, 0, -10 ),

                new THREE.Vector3( 0, 0, -10 ),
                new THREE.Vector3( 0, -70,0 ),
                new THREE.Vector3( 30, 0, 0 ),

                new THREE.Vector3( 0, 0, -10 ),
                new THREE.Vector3( 0, -70,0 ),
                new THREE.Vector3( -30, 0, 0 )


            );

            geometry.faces.push( new THREE.Face3( 0,2,1 ) );
            geometry.faces.push( new THREE.Face3( 0,4,2 ) );
            geometry.faces.push( new THREE.Face3( 2,7,1 ) );
            geometry.faces.push( new THREE.Face3( 7,2,4 ) );
            geometry.faces.push( new THREE.Face3( 0,14,1 ) );
            geometry.faces.push( new THREE.Face3( 0,4,14 ) );
            geometry.faces.push( new THREE.Face3( 14,7,1 ) );
            geometry.faces.push( new THREE.Face3( 7,14,4 ) );
            geometry.faces.push( new THREE.Face3( 0,26,1 ) );
            geometry.faces.push( new THREE.Face3( 0,4,26 ) );
            geometry.faces.push( new THREE.Face3( 26,7,1 ) );
            geometry.faces.push( new THREE.Face3( 7,26,4 ) );

            geometry.computeBoundingSphere();

            return geometry;
        }

    });

    astro.PlayerShipComponent = PlayerShipComponent;

    return PlayerShipComponent;
});