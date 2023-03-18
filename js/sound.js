////////////////////////////////////////////////////////////
// SOUND
////////////////////////////////////////////////////////////
var enableMobileSound = true;
var soundOn;

function playSound(target, loop){
	if(soundOn){
		var isLoop;
		if(loop){
			isLoop = -1;
			createjs.Sound.stop();
			var props = new createjs.PlayPropsConfig().set({interrupt: createjs.Sound.INTERRUPT_NONE, loop: isLoop})
			musicLoop = createjs.Sound.play(target, props);
			if (musicLoop == null || musicLoop.playState == createjs.Sound.PLAY_FAILED) {
				return;
			}else{
				musicLoop.removeAllEventListeners();
				musicLoop.addEventListener ("complete", function(musicLoop) {
					
				});
			}
		}else{
			isLoop = 0;
			createjs.Sound.play(target);
		}
	}
}

function stopSound(){
	createjs.Sound.stop();
}


/*!
 * 
 * PLAY MUSIC - This is the function that runs to play and stop music
 * 
 */
$.sound = {};
function playSoundLoop(sound){
	if(soundOn){
		if($.sound[sound]==null){
			$.sound[sound] = createjs.Sound.play(sound);
			$.sound[sound].removeAllEventListeners();
			$.sound[sound].addEventListener ("complete", function() {
				$.sound[sound].play();
			});
		}
	}
}

function stopSoundLoop(sound){
	if(soundOn){
		if($.sound[sound]!=null){
			$.sound[sound].stop();
			$.sound[sound]=null;
		}
	}
}

function setSoundVolume(sound, vol){
	if(soundOn){
		if($.sound[sound]!=null){
			$.sound[sound].volume = vol;
		}
	}
}

/*!
 * 
 * TOGGLE MUTE - This is the function that runs to toggle mute
 * 
 */
function playSoundTimerLoop(sound, num){
	if(soundOn){
		if($.sound[sound+'_'+num]==null){
			$.sound[sound+'_'+num] = createjs.Sound.play(sound);
			$.sound[sound+'_'+num].removeAllEventListeners();
			$.sound[sound+'_'+num].addEventListener ("complete", function() {
				$.sound[sound+'_'+num].play();
			});
		}
	}
}

function stopSoundTimerLoop(sound, num){
	if(soundOn){
		if($.sound[sound+'_'+num]!=null){
			$.sound[sound+'_'+num].stop();
			$.sound[sound+'_'+num]=null;
		}
	}
}

/*!
 * 
 * TOGGLE MUTE - This is the function that runs to toggle mute
 * 
 */
function toggleMute(con){
	createjs.Sound.muted = con;	
}