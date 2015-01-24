define([
    'cog',
    'three'
], function(cog, THREE) {

    var ThreeRenderSystem = cog.System.extend({

        configure: function() {
            this.container = document.getElementById('webGLContainer');
            this.frames = 0;
        },

        update: function(entities, events, dt) {
            this.frames++;
        },

        render: function() {
            this.container.innerHTML = 'Hello Global Game Jam 2015!<br>Do something ' + this.frames ;
        }

    });

    cog.ThreeRenderSystem = ThreeRenderSystem;

    return ThreeRenderSystem;
});