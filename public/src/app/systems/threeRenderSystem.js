define([
    'cog',
    'three',
    'components/threeComponent',
    'components/positionComponent',
    'components/cameraComponent'

], function(cog, THREE, THREEComponent, PositionComponent, CameraComponent) {

    var THREERenderSystem = cog.System.extend('astro.THREERenderSystem', {

        configure: function(entities, events, config) {

            this.sceneConfig = config.scene;

            this.container = document.getElementById('webGLContainer');

            this.renderer = new THREE.WebGLRenderer( { antialias: false, alpha:true } );
            this.renderer.setSize( window.innerWidth, window.innerHeight );
            this.renderer.autoClear = false;
            this.renderer.clearColor(0x000000, 0);

            this.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 15000);
            this.camera.position.x = 0;
            this.camera.position.y = 0;
            this.camera.position.z = 2000;
            this.camera.lookAt(new THREE.Vector3(0, 0, 0));
            this.cameraEntity = entities.add('camera');
            this.cameraComponent = this.cameraEntity.components.assign(CameraComponent, {
                camera: this.camera,
                window: window
            });

            this.scene = new THREE.Scene();
            this.container.appendChild(this.renderer.domElement);

            var directionalLight = new THREE.DirectionalLight( 0xffffaa, 0.5 );
                directionalLight.position.set( 0, 0, 1 );

            this.scene.add( directionalLight );

            this.createStarField();

            window.addEventListener('resize', this.onWindowResize.bind(this), false );

            this.playing = false;
        },

        'begin play event': function() {
            this.playing = true;
        },

        'end play event': function() {
            this.playing = false;
        },

        update: function(entityManager, eventManager, dt) {

            if (!this.playing) {
                return;
            }

            var entity, component,
                entities = entityManager.withComponents(PositionComponent);
            var i = 0,
                n = entities.length;

            for (;i < n; ++i) {

                entity = entities[i];
                component = entity.components(PositionComponent);

                entity._mesh.position.x = component.x;
                entity._mesh.position.y = component.y;
                entity._mesh.position.z = component.z;

                entity._mesh.rotation.x = component.rx;
                entity._mesh.rotation.y = component.ry;
                entity._mesh.rotation.z = component.rz;
            }

            this.starField.rotation.z += 0.0001;
        },

        createStarField: function() {
            this.starGeometry = new THREE.Geometry();

            var i, n;

            for (i = 0, n = this.sceneConfig.starCount; i < n; ++i) {
                this.starGeometry .vertices.push( new THREE.Vector3() );
            }

            this.updateStarFieldVertices();

            var material = new THREE.PointCloudMaterial( { size: 10 } );
            this.starField = new THREE.PointCloud( this.starGeometry , material );

            this.scene.add(this.starField);
        },

        updateStarFieldVertices: function() {

            var height = this.cameraComponent.visibleHeight,
                width = this.cameraComponent.visibleWidth;

            var i, n;
            for (i = 0, n = this.sceneConfig.starCount; i < n; ++i) {
                var vertex = this.starGeometry.vertices[i];
                vertex.x = Math.random() * width*2- width;
                vertex.y = Math.random() * height*2- height;
                vertex.z = Math.random() * 4000 - 4000;
            }
        },

        render: function() {
            // For not post processing
            this.renderer.render(this.scene, this.camera);
        },

        'addToScene event': function(threeObject) {

            if (threeObject instanceof cog.Entity) {

                this.scene.add(threeObject.components(THREEComponent).mesh);

            } else if (threeObject instanceof THREEComponent) {

                this.scene.add(threeObject.mesh);

            } else if (threeObject instanceof THREE.Object3D) {

                this.scene.add(threeObject);
            }
        },

        'removeFromScene event': function(threeObject) {

            if (threeObject instanceof cog.Entity) {

                this.scene.remove(threeObject.components(THREEComponent).mesh);

            } else if (threeObject instanceof THREEComponent) {

                this.scene.remove(threeObject.mesh);

            } else if (threeObject instanceof THREE.Object3D) {

                this.scene.remove(threeObject);
            }
        },

        'THREEComponent assigned event': function(threeComponent, entity) {
            entity._mesh = threeComponent.mesh;

            threeComponent.mesh.position.x = threeComponent.spawnX || 0;
            threeComponent.mesh.position.y = threeComponent.spawnY || 0;
            threeComponent.mesh.position.z = threeComponent.spawnZ || 0;
            threeComponent.mesh.rotation.x = threeComponent.spawnRX || 0;
            threeComponent.mesh.rotation.y = threeComponent.spawnRY || 0;
            threeComponent.mesh.rotation.z = threeComponent.spawnRZ || 0;

            this.scene.add(threeComponent.mesh);
        },

        'THREEComponent removed event': function(threeComponent) {
            this.scene.remove(threeComponent.mesh);
        },

        onWindowResize: function() {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize( window.innerWidth, window.innerHeight );
            this.cameraComponent.updateVisibleArea();

            this.updateStarFieldVertices();
        }

    });

    astro.THREERenderSystem = THREERenderSystem;

    return THREERenderSystem;
});