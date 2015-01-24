define([
    'cog',
    'three',
    'components/threeComponent',
    'components/positionComponent'

], function(cog, THREE, THREEComponent, PositionComponent) {

    var THREERenderSystem = cog.System.extend('astro.THREERenderSystem', {

        configure: function() {
            this.container = document.getElementById('webGLContainer');

            this.renderer = new THREE.WebGLRenderer( { antialias: false, alpha:true } );
            this.renderer.setSize( window.innerWidth, window.innerHeight );
            this.renderer.autoClear = false;
            this.renderer.clearColor(0x000000, 0);

            this.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 15000);
            this.camera.position.x = 0;
            this.camera.position.y = -500;
            this.camera.position.z = 2000;
            this.camera.lookAt(new THREE.Vector3(0, 0, 0));

            this.scene = new THREE.Scene();
            this.container.appendChild(this.renderer.domElement);

            window.addEventListener('resize', this.onWindowResize.bind(this), false );

        },

        update: function(entityManager, eventManager, dt) {

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
            this.scene.add(threeComponent.mesh);
        },

        'THREEComponent removed event': function(threeComponent) {
            this.scene.remove(threeComponent.mesh);
        },

        onWindowResize: function() {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize( window.innerWidth, window.innerHeight );
        }

    });

    astro.THREERenderSystem = THREERenderSystem;

    return THREERenderSystem;
});