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
        },

        randomOffScreenPosition: function(radius) {

            var x, y, edge = cog.rand.arc4randInt(0, 3);

            switch (edge) {
                case 0:
                    x = cog.rand.arc4rand(0, this.visibleWidth) - this.visibleWidth /2;
                    y = (this.visibleHeight /2) + radius - 1;
                    break;
                case 1:
                    x = cog.rand.arc4rand(0, this.visibleWidth) - this.visibleWidth /2;
                    y = -(this.visibleHeight /2) - radius + 1;
                    break;
                case 2:
                    x = (this.visibleWidth/2) + radius - 1;
                    y = cog.rand.arc4rand(0, this.visibleHeight) - this.visibleHeight /2;
                    break;
                case 3:
                    x = -(this.visibleWidth/2) - radius + 1;
                    y = cog.rand.arc4rand(0, this.visibleHeight) - this.visibleHeight /2;
                    break;
            }

            return {
                x: x,
                y: y
            }
        }
    });

    astro.CameraComponent = CameraComponent;

    return CameraComponent;
});