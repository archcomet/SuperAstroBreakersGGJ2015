define([
    'cog',
    'three'
], function(cog, THREE) {

    var THREERenderSystem = cog.System.extend('astro.THREERenderSystem', {

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

    astro.THREERenderSystem = THREERenderSystem;

    return THREERenderSystem;
});