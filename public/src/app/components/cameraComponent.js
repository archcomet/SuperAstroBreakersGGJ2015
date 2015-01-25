define([
    'cog'
], function(cog) {

    var CameraComponent = cog.Component.extend('astro.CameraComponent', {

        defaults: {
            visibleHeight: 0,
            visibleWidth: 0,
            camera: null,
            window: null
        },

        init: function(entity, options) {
            this.camera = options.camera;
            this.window = options.window;
            this.updateVisibleArea();
        },

        updateVisibleArea: function() {

            var vFOV = this.camera.fov * Math.PI / 180;   // convert vertical fov to radians
            var height = 2 * Math.tan( vFOV / 2 ) * this.camera.position.z; // visible height

            var aspect = this.window.innerWidth / this.window.innerHeight;
            var width = height * aspect;                  // visible width


            this.visibleHeight = height;
            this.visibleWidth = width;
        }
    });

    astro.CameraComponent = CameraComponent;

    return CameraComponent;
});