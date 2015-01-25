/**
 * Created by Dan on 1/21/15.
 */define([
    'cog'

], function(cog) {

    var SoundSystem = cog.System.extend('sandbox.SoundSystem', {

        IsInit:true, //are we reinitializing the sound. Fetching it from the servers and cacheing it.

        /* holds the sound buffers */
        sounds : {},
        origSounds:{},
        totalSounds:0,
        loadLimiter:2,  //How many will load initially. After those are loaded a secondary load goes out for the rest.
        loadedLength:0,

        /* queue of audio events to handle, checked each update step */
        audioQueue: [],

        /* sounds that are being pitch shifted */
        pitchedAudio:[],

        /* audio that may be fading in or out */
        volumedAudio:[],

        assetDirectory : "assets/",
        webAudioSupported : false,
        soundEnabled : false,
        _audioContext: null,
        events: null,

        /* audio event type values */
        REQ_PLAY: 0,
        REQ_MUTE: 1,
        REQ_UNMUTE: 2,
        REQ_STOP: 3,
        REQ_FADEIN:4,
        REQ_FADEOUT:5,

        configure: function(entities, events, config) {

            this.events = events;

            try {
                window.AudioContext = window.AudioContext || window.webkitAudioContext;
                this._audioContext = new AudioContext();
                this.webAudioSupported = true;
            }
            catch (e) {
                console.log ("SoundSystem: WebAudio API not supported.");
            }

            config = config || {};
            if (config.assetDirectory) {
                this.assetDirectory = config.assetDirectory;
            }

            if (this.webAudioSupported && config.soundEnabled) {
                this.soundEnabled = true;
                if (config.soundEnabled) this._preLoadSounds(config.sounds);

                /* todo: fix the problem with sound play with an initial gain of zero.
                this._playSound('square');
                this._playSound('triangle', 0);
                this._muteSound('triangle');
                this._playSound('circle', 0);
                this._muteSound('circle');
                */
            }

        },

        update: function (en, ev, dt) {
            this._processAudioQueue();
            this._processAudioOverTime(dt);
        },

        _processAudioQueue: function () {

            if (this.audioQueue.length == 0) return;

            for (var i=0; i< this.audioQueue.length; i++) {

                var soundData = this.audioQueue[i];
                if (!soundData) continue;

                var sound = this.sounds[soundData.name];
                if (!sound) continue;

                //console.log("processing audio queue. index=" + i);

                // since the sound was found, remove this item from the queue.
                this.audioQueue.splice(i, 1);

                switch (soundData.type) {
                    case this.REQ_PLAY:
                    case this.REQ_FADEIN:
                        //console.log("playing sound [" + sound.name + "] with a gain of [" + soundData.gain + "]");
                        var soundSource = this._createSoundSource(sound, soundData.gain);
                        sound.sources = sound.sources || [];
                        sound.sources.push(soundSource);
                        soundSource.start(0);
                        if (soundData.type  == this.REQ_FADEIN)
                        {
                            sound.gainNode.gain.value = 0;
                            this.volumedAudio.push(soundData);
                        }
                        break;
                    case this.REQ_STOP:
                    case this.REQ_FADEOUT:
                        //console.log("stopping sound [" + sound.name + "] with a gain of [" + soundData.gain + "]");
                        if (sound.sources) {
                            if (soundData.type != this.REQ_FADEOUT) {
                                sound.sources.forEach(function (source) {
                                    source.stop(0);
                                }, this);

                                sound.sources.length = 0;
                            }else{
                                this.volumedAudio.push(soundData)
                            }
                        }
                        break;
                    case this.REQ_MUTE:
                        //console.log("mutting sound [" + sound.name + "] with a gain of [0]");
                        if (sound.gainNode)
                            sound.gainNode.gain.value = 0;
                        /*
                        if (sound.sources) {

                            sound.sources.forEach(function(source) {
                                source.gain.value = 0;
                            }, this);
                        }*/
                        break;
                    case this.REQ_UNMUTE:
                        //console.log("mutting sound [" + sound.name + "] with a gain of [1]");
                        if(sound.gainNode)
                            sound.gainNode.gain.value = sound.gain;
                        /*
                        if (sound.sources) {
                            sound.sources.forEach(function(source) {
                                source.gain.value = 1;

                            }, this);
                        }
                        */
                        break;
                }
            }

        },

        _processAudioOverTime:function(dt){

            for (var i=0; i<this.volumedAudio.length; ++i) {
                var soundData = this.volumedAudio[i];
                var sound = this.sounds[soundData.name];
                var delta = soundData.delta[0];
                var tempGain = 0;

                if (sound.sources) {
                    soundData.currentTime += dt / 1000;
                    if(delta > 0){
                        soundData.currentTime = soundData.currentTime > delta ? delta : soundData.currentTime;
                        tempGain = this.origSounds[soundData.name].gain * (soundData.currentTime / delta)
                    }else {
                        delta = Math.abs(delta)
                        if (soundData.currentTime < delta)
                            tempGain = this.origSounds[soundData.name].gain * ((delta-soundData.currentTime)/delta)
                        else
                            soundData.currentTime = delta;
                    }
                    //console.log(sound.gainNode.gain.value+ " dt:"+soundData.currentTime)
                }
                if (soundData.currentTime >= delta) {
                    this.volumedAudio.splice(i, 1);
                    if (tempGain <= 0)
                        this._stopSound(soundData.name);
                }
                if (!this.IsMuted)
                    sound.gainNode.gain.value = tempGain;
            }

            var total = this.pitchedAudio.length;
            for (var i=0; i< total; i++) {

                var soundData = this.pitchedAudio[i];
                var sound = this.sounds[soundData.name];
                if (soundData.create) {
                    soundData.create = false;
                    var soundSource = this._createSoundSource(sound, soundData.gain);
                    sound.sources = sound.sources || [];
                    sound.sources.push(soundSource);
                    soundSource.start(0);
                }else{
                    //make sure to have the sound play the whole duration
                    if(sound.buffer.duration > soundData.duration)
                        sound.loop = true;
                    sound.sources.forEach(function (source) {
                        print(source.playbackRate.value);//todo implement changeing pitch
                    }, this);

                    soundData.currentTime += dt*1000;
                    if (soundData.currentTime >= soundData.duration)
                    {
                        if(sound.gainNode)
                            sound.gainNode.gain.value = 0;
                        if (sound.sources) {
                            sound.sources.forEach(function(source) {
                                source.stop(0);
                            }, this);

                            sound.sources.length = 0;
                        }
                    }
                }

            }
        },

        _createSoundSource: function(sound, gain) {

            var source = this._audioContext.createBufferSource();
            var gainNode = this._audioContext.createGain ? this._audioContext.createGain()
                : this._audioContext.createGainNode();

            source.buffer = sound.buffer;
            source.connect(gainNode);
            sound.gainNode = gainNode;      //Can be manipulated over time to control volume.
            gainNode.connect(this._audioContext.destination);
            gainNode.gain.value = this.IsMuted ? 0 : gain;

            // apply looping properties to buffer
            if (sound.loop) source.loop = true;
            return source;

        },

        /* audio retrieval functions */

        _preLoadSounds: function (sounds) {
            this.totalSounds = sounds.length;
            this.origSounds.aArray = sounds.slice();
            for (var i=0; i < this.loadLimiter; i++) {
                this._downloadSound(sounds[i]);
                this.origSounds[sounds[i].name] = sounds[i];
            }

        },

        _loadSounds: function () {
            for (var i=this.loadLimiter; i < this.totalSounds; i++) {
                this._downloadSound(this.origSounds.aArray[i]);
                this.origSounds[this.origSounds.aArray[i].name] = this.origSounds.aArray[i];
            }
        },

        _downloadSound: function (sound) {
            var fileName = sound.fileName;
            var name = sound.name;

            var url = this.assetDirectory + fileName;

            var request = new XMLHttpRequest();
            request.open('GET', url, true);
            request.responseType = 'arraybuffer';

            var soundSystem = this;
            request.onload = function() {

                soundSystem._audioContext.decodeAudioData(request.response,
                    function(buffer) {
                        sound.buffer = buffer;
                        soundSystem.sounds[name] = sound;
                        soundSystem.loadedLength++;
                        console.log(name+" - current:" + soundSystem.loadedLength + " Limiter:" + soundSystem.loadLimiter + " t:" + soundSystem.totalSounds)
                        if (soundSystem.IsInit && soundSystem.loadedLength >= soundSystem.loadLimiter)
                        {
                            soundSystem.IsInit = false;
                            soundSystem._loadSounds();
                            //soundSystem.events.emit('postLoad');
                      }
                    }, function() {
                        console.log("SoundSystem: error downloading sound. error=" + e);
                    });

            };
            request.send();

        },

        /* audio manipulation functions */

        _playSound: function (name, gain) {

            var req = this.REQ_PLAY;
            var localGain = 0;
            //console.log(name)
            //console.log(this.origSounds[name]);

            //Bail out!
            if (typeof this.origSounds[name] === "undefinedd" || this.origSounds[name] == null) return

            if ( typeof gain === "undefined") {
                if (typeof this.origSounds[name].gain === "undefined")
                    localGain = 1;
                else
                    localGain = this.origSounds[name].gain;
            }else if (typeof gain === 'object'){
                req = this.REQ_FADEIN;
                localGain = 0;
            }

            this.audioQueue.push({ name: name, type: req, gain: localGain, delta:gain, currentTime:0 });

        },

        _stopSound: function (name, gain) {
            var req = this.REQ_STOP;

            if (typeof gain === 'object'){
                req = this.REQ_FADEOUT;
            }
            this.audioQueue.push({name: name, type: req, delta:gain, currentTime:0 });

        },

        _muteSound: function (name) {

            this.audioQueue.push({ name: name, type: this.REQ_MUTE });

        },

        _unmuteSound: function (name) {

            this.audioQueue.push({ name: name, type: this.REQ_UNMUTE});

        },

        /* events */
        /*
        'playerShapeChanged event': function (shape) {

            switch (shape) {
                case 'square':
                    this._unmuteSound('square');
                    this._muteSound('circle');
                    this._muteSound('triangle');
                    break;
                case 'circle':
                    this._unmuteSound('circle');
                    this._muteSound('triangle');
                    this._muteSound('square');
                    break;
                case 'triangle':
                    this._unmuteSound('triangle');
                    this._muteSound('circle');
                    this._muteSound('square');
                    break;
            }

        },
        */

        'stopAllSounds event' :function(){
            this.audioQueue = this.sounds.map(function(sound){
                return {name:sound.name, type: this.REQ_STOP}
            });
        },

        'muteAll event' :function(){
            var mute = this.REQ_MUTE;
            this.IsMuted = true;
            this.audioQueue = this.origSounds.aArray.map(function(sound){
                return {name:sound.name, type: mute}
            });
        },

        'unMuteAll event' :function(){
            var mute = this.REQ_UNMUTE;
            this.IsMuted = false;
            this.audioQueue = this.origSounds.aArray.map(function(sound){
                return {name:sound.name, type: mute}
            });
        },

        //dur is length in seconds you want this to play for
        //dPitch is the change in pitch over the duration
        'fireHook event' : function(dur, dPitch) {

            this.pitchedAudio.push({name:'chain', duration:dur, deltaPitch:dPitch, create:true, currentTime:0})
        },

        'fire event': function () {

            this._playSound('shotStd');

        },

        'bomb event': function () {

            this._playSound('bomb');

        },

        'explode event': function () {

            this._playSound('explode');

        },

        'thrust event': function (gain) {

            this._playSound('thrust', gain);

        },

        'playSound event': function(name, gain) {

            this._playSound(name, gain);

        },

        'muteSound event': function(name) {

            this._muteSound(name);

        },

        'unmuteSound event': function(name) {

            this._unmuteSound(name);

        },

        'stopSound event': function(name, gain) {

            this._stopSound(name, gain);

        }
    });

    cog.SoundSystem = SoundSystem;

    return SoundSystem;

});