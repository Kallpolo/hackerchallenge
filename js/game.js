////////////////////////////////////////////////////////////
// GAME v1.7
////////////////////////////////////////////////////////////

/*!
 * 
 * GAME SETTING CUSTOMIZATION START
 * 
 */
var gameStageText = 'Stage[NUMBER]'; //stage display, [NUMBER] will replace with stage num
var gameStageColour = '#fff'; //stage display colour
var gameOverText = 'ACCESS DENIED';  //game access denied
var gameOverColour = '#D90000'; //game access denied colour

var strokeLine = 3; //stroke line
var strokeColour = '#D90000'; //stroke colour
var strokePowerColour = '#7cc5ed'; //stroke power colour

//hub lock
var hublock_arr = [{image:'assets/hub_lock.png', power:'assets/hub_lock_power.png', indicator:'assets/hub_lock_indicator.png', indicatorPower:'assets/hub_lock_indicator_power.png'},{image:'assets/hub_lock_supply.png', power:'assets/hub_lock_supply_power.png', indicator:'assets/hub_lock_indicator_supply.png', indicatorPower:'assets/hub_lock_indicator_power_supply.png'}];

//hub type
var hub_arr = [{type:'power', image:'assets/hub_power.png', power:'assets/hub_power.png', range:70, lock:0},
				{type:'supply', image:'assets/hub_supply.png', power:'assets/hub_supply_power.png', range:47, lock:1},
				{type:'linear', image:'assets/hub_linear.png', power:'assets/hub_linear_power.png', range:30, lock:0},
				{type:'corner', image:'assets/hub_corner.png', power:'assets/hub_corner_power.png', range:30, lock:0},
				{type:'cross', image:'assets/hub_cross.png', power:'assets/hub_cross_power.png', range:30, lock:0},
				{type:'t', image:'assets/hub_t.png', power:'assets/hub_t_power.png', range:30, lock:0}];
				
var resultText = 'Completed'; //result text
var resultStageText = 'Stage[NUMBER]'; //result stage

var exitMessage = 'Are you sure\nyou want to quit?'; //go to main page message

//Social share, [SCORE] will replace with game score
var shareEnable = true;
var shareText ='share your score'; //text for share instruction
var shareTitle = 'Highscore on HACKER CHALLENGE Game is Stage [SCORE]';//social share score title
var shareMessage = 'Stage [SCORE] is mine new highscore on HACKER CHALLENGE Game! Try it now!'; //social share score message


/*!
 *
 * GAME SETTING CUSTOMIZATION END
 *
 */

$.editor = {enable:false};
var dotW = 5;
var dotColour = '#ffffff';
var gameData = {stageNum:0, displayStageNum:0, pause:true, soundtimer_arr:[], soundtimercount:0};


/*!
 * 
 * GAME BUTTONS - This is the function that runs to setup button event
 * 
 */
function buildGameButton(){
	buttonStart.cursor = "pointer";
	buttonStart.addEventListener("click", function(evt) {
		goPage('game');
		playSound('soundSwitch');
	});
	
	buttonFacebook.cursor = "pointer";
	buttonFacebook.addEventListener("click", function(evt) {
		share('facebook');
	});
	buttonTwitter.cursor = "pointer";
	buttonTwitter.addEventListener("click", function(evt) {
		share('twitter');
	});
	buttonWhatsapp.cursor = "pointer";
	buttonWhatsapp.addEventListener("click", function(evt) {
		share('whatsapp');
	});
	
	buttonReplay.cursor = "pointer";
	buttonReplay.addEventListener("click", function(evt) {
		goPage('game');
		playSound('soundSwitch');
	});
	
	buttonSoundOff.cursor = "pointer";
	buttonSoundOff.addEventListener("click", function(evt) {
		toggleGameMute(true);
	});
	
	buttonSoundOn.cursor = "pointer";
	buttonSoundOn.addEventListener("click", function(evt) {
		toggleGameMute(false);
	});
	
	buttonFullscreen.cursor = "pointer";
	buttonFullscreen.addEventListener("click", function(evt) {
		toggleFullScreen();
	});
	
	buttonExit.cursor = "pointer";
	buttonExit.addEventListener("click", function(evt) {
		toggleConfirm(true);
	});
	
	buttonSettings.cursor = "pointer";
	buttonSettings.addEventListener("click", function(evt) {
		toggleOption();
	});
	
	buttonYes.cursor = "pointer";
	buttonYes.addEventListener("click", function(evt) {
		toggleConfirm(false);
		stopGame(true);
		goPage('main');
		toggleOption();
	});
	
	buttonNo.cursor = "pointer";
	buttonNo.addEventListener("click", function(evt) {
		toggleConfirm(false);
	});
	
	buildStageMove(stageShape);
}

/*!
 * 
 * BUILD STAGE EVENTS - This is the function that runs to build stage move events
 * 
 */
function buildStageMove(obj){
	obj.addEventListener("mousedown", function(evt) {
		toggleStageMoveEvent(evt, 'drag')
	});
	obj.addEventListener("pressmove", function(evt) {
		toggleStageMoveEvent(evt, 'move')
	});
	obj.addEventListener("pressup", function(evt) {
		toggleStageMoveEvent(evt, 'release');
	});	
}

function toggleStageMoveEvent(obj, con){
	var dragging = true;
	if(gameData.pause){
		dragging = false;
	}
	if($.editor.enable){
		dragging = true;	
	}
	
	if(dragging){
		switch(con){
			case 'drag':
				obj.target.dragging = true;
				obj.target.offset = {x:obj.target.x-(obj.stageX), y:obj.target.y-(obj.stageY)};
			break;
			
			case 'move':
				obj.target.x = (obj.stageX) + obj.target.offset.x;
				obj.target.y = (obj.stageY) + obj.target.offset.y;
				
				updateStageMove();
			break;
			
			case 'release':
				
			break;
		}
	}
}

function updateStageMove(){
	instructionMove.visible = false;
	checkWithinArea(stageShape);
	stageContainer.x = stageShape.x;
	stageContainer.y = stageShape.y;
}

 /*!
 * 
 * DRAG WITHIN AREA - This is the function that runs to drag within area
 * 
 */
function checkWithinArea(obj){
	var startX = stageW-stage_arr[gameData.stageNum].stage.w;
	var startY = stageH-stage_arr[gameData.stageNum].stage.h;
	var endX = 0;
	var endY = 0;
	
	if(obj.x <= startX){
		obj.x = startX
	}
	
	if(obj.x >= endX){
		obj.x = endX
	}
	
	if(obj.y <= startY){
		obj.y = startY
	}
	
	if(obj.y >= endY){
		obj.y = endY
	}
}

/*!
 * 
 * DISPLAY PAGES - This is the function that runs to display pages
 * 
 */
var curPage=''
function goPage(page){
	curPage=page;
	
	mainContainer.visible=false;
	gameContainer.visible=false;
	resultContainer.visible=false;
	stopSoundLoop('music');
	stopSoundLoop('soundGenerator');
	
	var targetContainer = ''
	switch(page){
		case 'main':
			targetContainer = mainContainer;
			playSoundLoop('music');
		break;
		
		case 'game':
			targetContainer = gameContainer;
			if(!$.editor.enable){
				playSoundLoop('soundGenerator');
				startGame();
			}
		break;
		
		case 'result':
			targetContainer = resultContainer;
			
			resultStageTxt.text = resultStageText.replace('[NUMBER]',gameData.displayStageNum+1);
			playSound('soundResult');
			stopGame();
			saveGame(gameData.stageNum);
		break;
	}
	
	targetContainer.alpha=0;
	targetContainer.visible=true;
	$(targetContainer)
	.clearQueue()
	.stop(true,true)
	.animate({ alpha:1 }, 500);
	
	resizeCanvas();
}

/*!
 * 
 * START GAME - This is the function that runs to start play game
 * 
 */
function startGame(){
	gameData.stageNum = 0;
	gameData.displayStageNum = 0;
	prepareStage();
}

function prepareStage(){
	gameData.soundtimer_arr = [];
	gameData.soundtimercount = 0;
	
	instructionMove.visible = false;
	stageContainer.visible = false;
	loadStage(true);
	displayMessage('stage');
}

 /*!
 * 
 * STOP GAME - This is the function that runs to stop play game
 * 
 */
function stopGame(){
	stopTimerSound();
	TweenMax.killAll(false, true, false);
	gameData.pause = true;
}


function saveGame(score){
	if ( typeof toggleScoreboardSave == 'function' ) { 
		$.scoreData.score = score;
		if(typeof type != 'undefined'){
			$.scoreData.type = type;	
		}
		toggleScoreboardSave(true);
	}

	/*$.ajax({
      type: "POST",
      url: 'saveResults.php',
      data: {score:score},
      success: function (result) {
          console.log(result);
      }
    });*/
}

function endGame(){
	stopTimerSound();
	gameData.pause = true;
	TweenMax.to(stageAnnounceContainer, 3, {overwrite:true, onComplete:function(){
		gameData.stageNum++;
		gameData.displayStageNum++;
		if(gameData.stageNum < stage_arr.length){
			prepareStage();
		}else{
			gameData.stageNum = stage_arr.length -1;
			gameData.displayStageNum = gameData.stageNum;
			goPage('result');	
		}
	}});
}

 /*!
 * 
 * GAME LOOP - This is the function that runs to loop game
 * 
 */
function updateGame(){
	updateHubTimer();
}

function updateHubTimer(){
	if(!gameData.pause){
		var nowDate = new Date();
		for(var ch=0; ch<stage_arr[gameData.stageNum].hub.length; ch++){
			if(stage_arr[gameData.stageNum].hub[ch].trick == 2 && $hub[ch+'_timer_bar'].visible){
				$hub[ch+'_timer_text'].timerCount = new Date();
				$hub[ch+'_timer_text'].timerDistance = (nowDate.getTime() - $hub[ch+'_timer_text'].timerStart.getTime());
				$hub[ch+'_timer_text'].text = millisecondsToTimeGame($hub[ch+'_timer_text'].timerEnd - $hub[ch+'_timer_text'].timerDistance);
				
				if($hub[ch+'_timer_text'].timerEnd - $hub[ch+'_timer_text'].timerDistance <= 0){
					$hub[ch+'_timer_text'].text = millisecondsToTimeGame(0);
					displayMessage('denied');	
				}
			}
		}
	}	
}

/*!
 * 
 * START MAIN POWER - This is the function that runs to check main power connection
 * 
 */
function startMainPower(){
	//reset stroke
	for(var al=0;al<stage_arr[gameData.stageNum].lines.length;al++){
		animateLine($line[al]);
		$line[al+'command'].style = strokeColour;
		$line[al].connectCount = 0;
	}
	
	//reset lock
	for(var ch=0; ch<stage_arr[gameData.stageNum].hub.length; ch++){
		$hub[ch+'_power'].visible = false;
		$hub[ch].alpha = 1;
		
		for(var hc=0;hc<4;hc++){
			if(stage_arr[gameData.stageNum].hub[ch].trick == 1 && stage_arr[gameData.stageNum].hub[ch].lock[hc] == 1 && stage_arr[gameData.stageNum].hub[ch].type != 0){
				$hub[ch+'_lock_power'+'-'+hc].visible = false;
				$hub[ch+'_lock_power'].visible = false;
				$hub[ch+'_lock'].alpha = 1;
			}
		}
	}
	
	for(var ch=0; ch<stage_arr[gameData.stageNum].hub.length; ch++){
		if(stage_arr[gameData.stageNum].hub[ch].type == 0){
			for(var cl=0; cl<stage_arr[gameData.stageNum].lines.length; cl++){
				var thisStartHubNum = stage_arr[gameData.stageNum].lines[cl].startHub;
				var thisEndHubNum = stage_arr[gameData.stageNum].lines[cl].endHub;
		
				if(thisStartHubNum == ch){
					powerLine(cl);
					
					if($hub[thisEndHubNum].visible){
						findHubReceive(thisEndHubNum, stage_arr[gameData.stageNum].lines[cl].endHubPos);
					}else{
						checkPowerUnlock(thisEndHubNum, stage_arr[gameData.stageNum].lines[cl].endHubPos);
					}
				}else if(thisEndHubNum == ch){
					powerLine(cl);
					
					if($hub[thisStartHubNum].visible){
						findHubReceive(thisStartHubNum, stage_arr[gameData.stageNum].lines[cl].startHubPos);
					}else{
						checkPowerUnlock(thisStartHubNum, stage_arr[gameData.stageNum].lines[cl].startHubPos);
					}
				}
			}
		}
	}
}

/*!
 * 
 * POWERUP LINE - This is the function that runs to power up line
 * 
 */
function powerLine(num){
	$line[num+'command'].style = strokePowerColour;	
	$line[num].connectCount++;
}

/*!
 * 
 * CONNECT TO HUB - This is the function that runs to connect next hub
 * 
 */
function findHubReceive(num, position){
	if(stage_arr[gameData.stageNum].hub[num].lock[position] == 1){
		checkPowerUnlock(num, position);
	}
	
	switch(hub_arr[$hub[num].type].type){
		case 'supply':
			$hub[num+'_power'].visible = true;
			$hub[num].alpha = .1;
			animateSupplyUnlock(num);
			
			var totalSupply = 0;
			var totalSupplyPower = 0;
			for(var ch=0; ch<stage_arr[gameData.stageNum].hub.length; ch++){
				if(stage_arr[gameData.stageNum].hub[ch].type == 1){
					totalSupply++;
					if($hub[num+'_power'].visible){
						totalSupplyPower++;
					}
				}
			}
			
			if(totalSupply == totalSupplyPower){
				if($.editor.enable){
					stopGame();
				}else{
					endGame();
				}
			}
		break;
		
		case 'linear':
			if($hub[num].rotation == 0){
				if(position == 0){
					connectNextHub(num, 2);
				}else if(position == 2){
					connectNextHub(num, 0);
				}
			}else if($hub[num].rotation == 90){
				if(position == 1){
					connectNextHub(num, 3);
				}else if(position == 3){
					connectNextHub(num, 1);
				}
			}
		break;
		
		case 'corner':
			if($hub[num].rotation == 0){
				if(position == 0){
					connectNextHub(num, 1);
				}else if(position == 1){
					connectNextHub(num, 0);
				}
			}else if($hub[num].rotation == 90){
				if(position == 1){
					connectNextHub(num, 2);
				}else if(position == 2){
					connectNextHub(num, 1);
				}
			}else if($hub[num].rotation == 180){
				if(position == 2){
					connectNextHub(num, 3);
				}else if(position == 3){
					connectNextHub(num, 2);
				}
			}else if($hub[num].rotation == 270){
				if(position == 3){
					connectNextHub(num, 0);
				}else if(position == 0){
					connectNextHub(num, 3);
				}
			}
		break;
		
		case 'cross':
			for(var crossNum = 0; crossNum<4; crossNum++){
				if(crossNum != position){
					connectNextHub(num, crossNum);	
				}
			}
		break;
		
		case 't':
			if($hub[num].rotation == 0){
				if(position == 0){
					connectNextHub(num, 1);
					connectNextHub(num, 2);
				}else if(position == 1){
					connectNextHub(num, 0);
					connectNextHub(num, 2);
				}else if(position == 2){
					connectNextHub(num, 0);
					connectNextHub(num, 1);
				}
			}else if($hub[num].rotation == 90){
				if(position == 1){
					connectNextHub(num, 2);
					connectNextHub(num, 3);
				}else if(position == 2){
					connectNextHub(num, 1);
					connectNextHub(num, 3);
				}else if(position == 3){
					connectNextHub(num, 1);
					connectNextHub(num, 2);
				}
			}else if($hub[num].rotation == 180){
				if(position == 2){
					connectNextHub(num, 3);
					connectNextHub(num, 0);
				}else if(position == 3){
					connectNextHub(num, 2);
					connectNextHub(num, 0);
				}else if(position == 0){
					connectNextHub(num, 2);
					connectNextHub(num, 3);
				}
			}else if($hub[num].rotation == 270){
				if(position == 3){
					connectNextHub(num, 0);
					connectNextHub(num, 1);
				}else if(position == 0){
					connectNextHub(num, 1);
					connectNextHub(num, 3);
				}else if(position == 1){
					connectNextHub(num, 0);
					connectNextHub(num, 3);
				}
			}
		break;
	}
}

function connectNextHub(num, position){
	for(var cl=0; cl<stage_arr[gameData.stageNum].lines.length; cl++){
		if($line[cl].connectCount >= 5){
			cl++;	
		}
		
		var thisStartHubNum = stage_arr[gameData.stageNum].lines[cl].startHub;
		var thisEndHubNum = stage_arr[gameData.stageNum].lines[cl].endHub;
		
		if(thisStartHubNum == num && stage_arr[gameData.stageNum].lines[cl].startHubPos == position){
			$hub[thisStartHubNum+'_power'].visible = true;
			$hub[thisStartHubNum].alpha = .1;
			powerLine(cl);
			
			if($hub[thisEndHubNum].visible){
				findHubReceive(thisEndHubNum, stage_arr[gameData.stageNum].lines[cl].endHubPos);
			}else{
				checkPowerUnlock(thisEndHubNum, stage_arr[gameData.stageNum].lines[cl].endHubPos);
			}
		}else if(thisEndHubNum == num && stage_arr[gameData.stageNum].lines[cl].endHubPos == position){
			$hub[thisEndHubNum+'_power'].visible = true;
			$hub[thisEndHubNum].alpha = .1;
			powerLine(cl);
			
			if($hub[thisStartHubNum].visible){
				findHubReceive(thisStartHubNum, stage_arr[gameData.stageNum].lines[cl].startHubPos);
			}else{
				checkPowerUnlock(thisStartHubNum, stage_arr[gameData.stageNum].lines[cl].startHubPos);
			}
		}
	}
}

/*!
 * 
 * CHECK POWER UNLOCK - This is the function that runs check power ready unlock
 * 
 */
function checkPowerUnlock(num, position){
	var hubPosEnable = false;
	if(stage_arr[gameData.stageNum].hub[num].trick == 1 && stage_arr[gameData.stageNum].hub[num].lock[position] == 1 && stage_arr[gameData.stageNum].hub[num].type != 0){
		if($hub[num+'_lock'].visible){
			$hub[num+'_lock_power'+'-'+position].visible = true;
			hubPosEnable = true;
		}
	}
	
	if(hubPosEnable){
		var hubPosCount = 0;
		var hubPosVisCount = 0;
		for(var hc=0;hc<4;hc++){
			if(stage_arr[gameData.stageNum].hub[num].trick == 1 && stage_arr[gameData.stageNum].hub[num].lock[hc] == 1 && stage_arr[gameData.stageNum].hub[num].type != 0){
				hubPosCount++;
				if($hub[num+'_lock_power'+'-'+hc].visible){
					hubPosVisCount++;	
				}
			}
		}
		
		if(hubPosCount == hubPosVisCount){
			$hub[num+'_lock'].alpha = .1;
			$hub[num+'_lock_power'].visible = true;
		}
	}
}

/*!
 * 
 * ANIMATE LINE - This is the function that runs animate line
 * 
 */
function animateLine(obj){
	var alphaNum = .8;
	var delayNum = Math.floor(Math.random()*9) * .01;
	if(obj.animateSide){
		obj.animateSide = false;
	}else{
		alphaNum = 1;
		obj.animateSide = true;
	}	
	TweenMax.to(obj, .1, {delay:delayNum, alpha:alphaNum, overwrite:true, onComplete:animateLine, onCompleteParams:[obj]});
}

/*!
 * 
 * ANIMATE SUPPLY UNLOCK - This is the function that runs animate supply unlock
 * 
 */
function animateSupplyUnlock(num){
	playSound('soundPowerup');
	$hub[num+'_unlock'].visible = true;
	var scaleNum = 1.5;
	TweenMax.to($hub[num+'_unlock'], 1, {alpha:0, scaleX:scaleNum, scaleY:scaleNum, overwrite:true, onComplete:function(){
		
	}});
}

/*!
 * 
 * LOAD STAGE - This is the function that runs to load stage
 * 
 */
function loadStage(con){
	stageShape.graphics.clear();
	stageShape.graphics.beginFill('#000').drawRect(0, 0, stage_arr[gameData.stageNum].stage.w, stage_arr[gameData.stageNum].stage.h).endFill();
	stageShape.alpha = .1;
	
	if(con){
		stageShape.x = stage_arr[gameData.stageNum].stage.x;
		stageShape.y = stage_arr[gameData.stageNum].stage.y;
		updateStageMove();
	}
	
	buildHubs();
	buildLines();
	drawAllLines();
}

 /*!
 * 
 * BUILD LINES - This is the function that runs to build lines
 * 
 */
function buildLines(){
	lineContainer.removeAllChildren();
	for(l=0; l<stage_arr[gameData.stageNum].lines.length; l++){
		$lineContainer[l] = new createjs.Container();
		$pointContainer[l] = new createjs.Container();
		lineContainer.addChild($lineContainer[l], $pointContainer[l]);
		
		if($.editor.enable){
			drawPoints(l, stage_arr[gameData.stageNum].lines[l].array);
		}
	}
}

function drawAllLines(){
	for(al=0;al<stage_arr[gameData.stageNum].lines.length;al++){
		$lineContainer[al].removeAllChildren();
		drawLine(al, stage_arr[gameData.stageNum].lines[al].startHub, stage_arr[gameData.stageNum].lines[al].startHubPos, stage_arr[gameData.stageNum].lines[al].endHub, stage_arr[gameData.stageNum].lines[al].endHubPos, stage_arr[gameData.stageNum].lines[al].array);
	}
}

function drawLine(num, startHub, startHubPos, endHub, endHubPos, array){
	$line[num] = new createjs.Shape();
	$lineContainer[num].addChild($line[num]);
	$line[num+'command'] = $line[num].graphics.beginStroke(strokeColour).command;
	$line[num].graphics.setStrokeStyle(strokeLine).moveTo($hub[startHub+'-'+startHubPos].x, $hub[startHub+'-'+startHubPos].y);
	$line[num].connectCount = 0;
	$line[num].animateSide = true;
	$line[num].startHub = $hub[startHub+'-'+startHubPos];
	
	for(l=0;l<array.length;l++){
		$line[num].graphics.lineTo(array[l].x, array[l].y);
	}
	
	$line[num].graphics.lineTo($hub[endHub+'-'+endHubPos].x, $hub[endHub+'-'+endHubPos].y);
	
	if($.editor.enable){
		$line[num].num = num;
		buildLineEvent($line[num]);	
	}
}
 
 /*!
 * 
 * BUILD HUB - This is the function that runs to build hub
 * 
 */
function buildHubs(){
	hubContainer.removeAllChildren();
	
	if($.editor.enable){
		editHubContainer.removeAllChildren();		
	}
	
	for(h=0; h<stage_arr[gameData.stageNum].hub.length; h++){
		createHub(h, stage_arr[gameData.stageNum].hub[h].x, stage_arr[gameData.stageNum].hub[h].y);
		if($.editor.enable){
			createEditHub(h, stage_arr[gameData.stageNum].hub[h].x, stage_arr[gameData.stageNum].hub[h].y);	
		}
	}
}

function createHub(num, x, y){
	var typeNum = stage_arr[gameData.stageNum].hub[num].type;
	var lockNum = stage_arr[gameData.stageNum].hub[num].lock;
	
	if(stage_arr[gameData.stageNum].hub[num].trick == 2 && typeNum != 0){
		$hub[num+'_timer'] = hubTimer.clone();
		$hub[num+'_timer'].x = x;
		$hub[num+'_timer'].y = y;
		
		$hub[num+'_timer_bar'] = hubTimerBar.clone();
		$hub[num+'_timer_bar'].x = x+110;
		$hub[num+'_timer_bar'].y = y;
		
		$hub[num+'_timer_text'] = new createjs.Text();
		$hub[num+'_timer_text'].font = "20px source_code_proregular";
		$hub[num+'_timer_text'].color = "#f5851f";
		$hub[num+'_timer_text'].text = '00:00';
		$hub[num+'_timer_text'].textAlign = "center";
		$hub[num+'_timer_text'].textBaseline='alphabetic';
		$hub[num+'_timer_text'].x = $hub[num+'_timer_bar'].x;
		$hub[num+'_timer_text'].y = $hub[num+'_timer_bar'].y+7;
		$hub[num+'_timer_text'].timerStart = 0;
		$hub[num+'_timer_text'].timerEnd = stage_arr[gameData.stageNum].hub[num].timer;
		$hub[num+'_timer_text'].timerDistance = 0;
		$hub[num+'_timer_text'].timerCount = 0;
		
		$hub[num+'_timer_bar'].visible = false;
		$hub[num+'_timer_text'].visible = false;
		
		hubContainer.addChild($hub[num+'_timer'], $hub[num+'_timer_bar'], $hub[num+'_timer_text']);
	}
	
	if(typeNum == 1){
		$hub[num+'_unlock'] = hubUnlock.clone();
		$hub[num+'_unlock'].x = x;
		$hub[num+'_unlock'].y = y;
		$hub[num+'_unlock'].visible = false;
		hubContainer.addChild($hub[num+'_unlock']);
	}
	
	$hub[num] = $hubType[typeNum].clone();
	$hub[num].x = x;
	$hub[num].y = y;
	$hub[num].num = num;
	$hub[num].type = stage_arr[gameData.stageNum].hub[num].type;
	
	$hub[num+'_power'] = $hubType['power'+typeNum].clone();
	$hub[num+'_power'].x = x;
	$hub[num+'_power'].y = y;
	$hub[num+'_power'].visible = false;
	
	hubContainer.addChild($hub[num], $hub[num+'_power']);
	
	var range = Number(hub_arr[typeNum].range);
	var pos_arr = [{x:0, y:-(range)},
				   {x:range, y:0},
				   {x:0, y:range},
				   {x:-(range), y:0},];
				   
	//hub points
	for(hc=0;hc<4;hc++){
		$hub[num+'-'+hc] = new createjs.Shape();
		$hub[num+'-'+hc].graphics.beginFill(dotColour).drawCircle(0, 0, dotW);
		$hub[num+'-'+hc].x = Number($hub[num].x) + pos_arr[hc].x;
		$hub[num+'-'+hc].y = Number($hub[num].y) + pos_arr[hc].y;
		
		$hub[num+'-'+hc].num = num;
		$hub[num+'-'+hc].pos = hc;
		$hub[num+'-'+hc].connect = false;
		$hub[num+'-'+hc].visible = false;
		
		hubContainer.addChild($hub[num+'-'+hc]);
	}
	
	if(stage_arr[gameData.stageNum].hub[num].trick == 1 && stage_arr[gameData.stageNum].hub[num].lock.indexOf(1) >= 0 && typeNum != 0){
		$hub[num].visible = false;
		$hub[num+'_lock'] = $hubType['hublock_'+hub_arr[typeNum].lock].clone();	
		$hub[num+'_lock'].x = $hub[num].x;
		$hub[num+'_lock'].y = $hub[num].y;
		$hub[num+'_lock'].num = $hub[num].num;
		
		$hub[num+'_lock_power'] = $hubType['hublock_power_'+hub_arr[typeNum].lock].clone();	
		$hub[num+'_lock_power'].x = $hub[num].x;
		$hub[num+'_lock_power'].y = $hub[num].y;
		$hub[num+'_lock_power'].num = $hub[num].num;
		$hub[num+'_lock_power'].visible = false;
		
		hubContainer.addChild($hub[num+'_lock'], $hub[num+'_lock_power']);
		
		buildHubLockEvent($hub[num+'_lock']);
		toggleObjActive($hub[num+'_lock'], true);
		
		var rotation_arr = [0,90,180,270];
		for(hc=0;hc<4;hc++){
			if(stage_arr[gameData.stageNum].hub[num].lock[hc] == 1){
				$hub[num+'_lock'+'-'+hc] = $hubType['hublock_indicator_'+hub_arr[typeNum].lock].clone();
				$hub[num+'_lock'+'-'+hc].x = $hub[num].x;
				$hub[num+'_lock'+'-'+hc].y = $hub[num].y;
				$hub[num+'_lock'+'-'+hc].rotation = rotation_arr[hc];
				
				$hub[num+'_lock_power'+'-'+hc] = $hubType['hublock_indicator_power_'+hub_arr[typeNum].lock].clone();
				$hub[num+'_lock_power'+'-'+hc].x = $hub[num].x;
				$hub[num+'_lock_power'+'-'+hc].y = $hub[num].y;
				$hub[num+'_lock_power'+'-'+hc].rotation = rotation_arr[hc];
				$hub[num+'_lock_power'+'-'+hc].visible = false;
				
				hubContainer.addChild($hub[num+'_lock'+'-'+hc], $hub[num+'_lock_power'+'-'+hc]);
			}
		}
	}
	
	if(stage_arr[gameData.stageNum].hub[num].rotation == -1){
		randomizeHub($hub[num]);	
	}else{
		$hub[num].rotation = stage_arr[gameData.stageNum].hub[num].rotation;	
		$hub[num+'_power'].rotation = $hub[num].rotation;
	}
	
	powerUpHub($hub[num]);
	buildHubEvent($hub[num]);
	toggleObjActive($hub[num], true);
}

function randomizeHub(obj){
	var rotation_arr = [];
	switch(hub_arr[obj.type].type){
		case 'linear':
			rotation_arr = [0,90];
		break;
		
		case 'corner':
			rotation_arr = [0,90, 180, 270];
		break;
		
		case 't':
			rotation_arr = [0,90, 180, 270];
		break;
	}
	obj.rotation = rotation_arr[Math.floor(Math.random()*rotation_arr.length)];
	$hub[obj.num+'_power'].rotation = obj.rotation;	
}

/*!
 * 
 * BUILD HUB EVENTS - This is the function that runs to build hub events
 * 
 */
function buildHubEvent(obj){
	obj.cursor = 'pointer';
	obj.addEventListener("mousedown", function(evt) {
		if(!gameData.pause){
			playSound('soundSwitch');
			switchHub(evt.target);
			powerUpHub(evt.target);
			startMainPower();
		}
	});
}

function switchHub(obj){
	//checkTimer
	if(stage_arr[gameData.stageNum].hub[obj.num].trick == 2){
		if($hub[obj.num+'_timer_bar'].visible == false){
			$hub[obj.num+'_timer_bar'].visible = true;
			$hub[obj.num+'_timer_text'].visible = true;
			$hub[obj.num+'_timer_text'].timerStart = new Date();
			
			gameData.soundtimer_arr.push(obj.num);
			playSoundTimerLoop('soundTimer', gameData.soundtimercount);
			gameData.soundtimercount++;
		}
	}
	
	switch(hub_arr[obj.type].type){
		case 'linear':
			if(obj.rotation == 0){
				obj.rotation = 90;
			}else{
				obj.rotation = 0;
			}
		break;
		
		case 'corner':
			if(obj.rotation == 0){
				obj.rotation = 90;
			}else if(obj.rotation == 90){
				obj.rotation = 180;
			}else if(obj.rotation == 180){
				obj.rotation = 270;
			}else if(obj.rotation == 270){
				obj.rotation = 0;
			}
		break;
		
		case 't':
			if(obj.rotation == 0){
				obj.rotation = 90;
			}else if(obj.rotation == 90){
				obj.rotation = 180;
			}else if(obj.rotation == 180){
				obj.rotation = 270;
			}else if(obj.rotation == 270){
				obj.rotation = 0;
			}
		break;
	}
	$hub[obj.num+'_power'].rotation = obj.rotation;
}

function powerUpHub(obj){
	for(hc=0;hc<4;hc++){
		$hub[obj.num+'-'+hc].connect = false;
	}
	
	switch(hub_arr[obj.type].type){
		case 'linear':
			if(obj.rotation == 0){
				$hub[obj.num+'-'+0].connect = true;
				$hub[obj.num+'-'+2].connect = true;
			}else{
				$hub[obj.num+'-'+1].connect = true;
				$hub[obj.num+'-'+3].connect = true;
			}
		break;
		
		case 'corner':
			if(obj.rotation == 0){
				$hub[obj.num+'-'+0].connect = true;
				$hub[obj.num+'-'+1].connect = true;
			}else if(obj.rotation == 90){
				$hub[obj.num+'-'+1].connect = true;
				$hub[obj.num+'-'+2].connect = true;
			}else if(obj.rotation == 180){
				$hub[obj.num+'-'+2].connect = true;
				$hub[obj.num+'-'+3].connect = true;
			}else if(obj.rotation == 270){
				$hub[obj.num+'-'+3].connect = true;
				$hub[obj.num+'-'+0].connect = true;
			}
		break;
		
		case 'cross':
			for(hc=0;hc<4;hc++){
				$hub[obj.num+'-'+hc].connect = true;
			}
		break;
		
		case 't':
			if(obj.rotation == 0){
				$hub[obj.num+'-'+0].connect = true;
				$hub[obj.num+'-'+1].connect = true;
				$hub[obj.num+'-'+2].connect = true;
			}else if(obj.rotation == 90){
				$hub[obj.num+'-'+1].connect = true;
				$hub[obj.num+'-'+2].connect = true;
				$hub[obj.num+'-'+3].connect = true;
			}else if(obj.rotation == 180){
				$hub[obj.num+'-'+2].connect = true;
				$hub[obj.num+'-'+3].connect = true;
				$hub[obj.num+'-'+0].connect = true;
			}else if(obj.rotation == 270){
				$hub[obj.num+'-'+3].connect = true;
				$hub[obj.num+'-'+0].connect = true;
				$hub[obj.num+'-'+1].connect = true;
			}
		break;
	}	
}

/*!
 * 
 * STOP TIMER SOUND - This is the function that runs to stop timer sound
 * 
 */
function stopTimerSound(){
	for(var sn = 0; sn<gameData.soundtimer_arr.length; sn++){
		stopSoundTimerLoop('soundTimer', sn);
	}
}

/*!
 * 
 * BUILD HUB UNLOCK EVENTS - This is the function that runs to build hub events
 * 
 */
function buildHubLockEvent(obj){
	obj.cursor = 'pointer';
	obj.addEventListener("mousedown", function(evt) {
		if(!gameData.pause){
			playSound('soundUnlock');
			unlockHub(evt.target);
			startMainPower();
		}
	});
}

function unlockHub(obj){
	var unlock = true;
	for(var hc=0;hc<4;hc++){
		if(stage_arr[gameData.stageNum].hub[obj.num].lock[hc] == 1){
			if(!$hub[obj.num+'_lock_power'+'-'+hc].visible){
				unlock = false;	
			}
		}
	}
	
	if(unlock){
		for(var hc=0;hc<4;hc++){
			if(stage_arr[gameData.stageNum].hub[obj.num].lock[hc] == 1){
				$hub[obj.num+'_lock_power'+'-'+hc].visible = false;
				$hub[obj.num+'_lock'+'-'+hc].visible = false;
			}
		}
		$hub[obj.num].visible = true;
		$hub[obj.num+'_lock'].visible = false;
	}
}

/*!
 * 
 * DISPLAY MESSAGE - This is the function that runs to display message
 * 
 */
function displayMessage(con){
	if(con == 'stage'){
		stageAnnounceContainer.visible = true;
		stageAnnounceContainer.alpha = 0;
		stageDisplayTxt.text = gameStageText.replace('[NUMBER]',gameData.stageNum+1);
		stageDisplayTxt.color = gameStageColour;
		
		TweenMax.to(stageAnnounceContainer, .5, {alpha:1, overwrite:true, onComplete:function(){
			TweenMax.to(stageAnnounceContainer, 2, {alpha:1, overwrite:true, onComplete:function(){
				TweenMax.to(stageAnnounceContainer, .5, {alpha:0, overwrite:true, onComplete:function(){
					stageAnnounceContainer.visible = false;
					stageContainer.visible = true;
					
					gameData.pause = false;
					startMainPower();
					
					if(stage_arr[gameData.stageNum].stage.w > canvasW || stage_arr[gameData.stageNum].stage.h > canvasH){
						instructionMove.visible = true;	
					}
				}});
			}});
		}});
	}else if(con == 'denied'){
		stopTimerSound();
		playSound('soundDenied');
		gameData.pause = true;
		
		stageAnnounceContainer.visible = true;
		stageAnnounceContainer.alpha = 0;
		stageDisplayTxt.text = gameOverText;
		stageDisplayTxt.color = gameOverColour;
		
		TweenMax.to(stageAnnounceContainer, .5, {alpha:1, overwrite:true, onComplete:function(){
			TweenMax.to(stageAnnounceContainer, 2, {alpha:1, overwrite:true, onComplete:function(){
				TweenMax.to(stageAnnounceContainer, .5, {alpha:0, overwrite:true, onComplete:function(){
					if(!$.editor.enable){
						gameData.displayStageNum--;
						goPage('result');
					}
				}});
			}});
		}});
	}
}

/*!
 * 
 * TOGGLE OBJECT ACTIVE - This is the function that runs to toggle object active
 * 
 */
function toggleObjActive(obj, con){
	if(con){
		obj.active = true;
		obj.cursor = "pointer";
		obj.dragging = false;
	}else{
		obj.active = false;
		obj.cursor = "default";
		obj.dragging = false;
	}
}

/*!
 * 
 * MILLESECONDS CONVERTER - This is the function that runs to conver timer
 * 
 */
function millisecondsToTimeGame(milli) {
      var milliseconds = milli % 1000;
      var seconds = Math.floor((milli / 1000) % 60);
      var minutes = Math.floor((milli / (60 * 1000)) % 60);
	  
	  if(seconds<10){
		seconds = '0'+seconds;  
	  }
	  
	  if(minutes<10){
		minutes = '0'+minutes;  
	  }
	  
	  return minutes +':'+ seconds + ':' + formatDigit(milliseconds, 2);
}

/*!
 * 
 * OTHERS - This is the function that runs to run game option
 * 
 */
function toggleGameMute(con){
	buttonSoundOff.visible = false;
	buttonSoundOn.visible = false;
	toggleMute(con);
	if(con){
		buttonSoundOn.visible = true;
	}else{
		buttonSoundOff.visible = true;	
	}
}

function toggleFullScreen() {
  if (!document.fullscreenElement &&    // alternative standard method
      !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement ) {  // current working methods
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    } else if (document.documentElement.msRequestFullscreen) {
      document.documentElement.msRequestFullscreen();
    } else if (document.documentElement.mozRequestFullScreen) {
      document.documentElement.mozRequestFullScreen();
    } else if (document.documentElement.webkitRequestFullscreen) {
      document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  }
}


/*!
 * 
 * OPTIONS - This is the function that runs to toggle options
 * 
 */

function toggleOption(){
	if(optionsContainer.visible){
		optionsContainer.visible = false;
	}else{
		optionsContainer.visible = true;
	}
}


/*!
 * 
 * OPTIONS - This is the function that runs to mute and fullscreen
 * 
 */
function toggleGameMute(con){
	buttonSoundOff.visible = false;
	buttonSoundOn.visible = false;
	toggleMute(con);
	if(con){
		buttonSoundOn.visible = true;
	}else{
		buttonSoundOff.visible = true;	
	}
}

function toggleFullScreen() {
  if (!document.fullscreenElement &&    // alternative standard method
      !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement ) {  // current working methods
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    } else if (document.documentElement.msRequestFullscreen) {
      document.documentElement.msRequestFullscreen();
    } else if (document.documentElement.mozRequestFullScreen) {
      document.documentElement.mozRequestFullScreen();
    } else if (document.documentElement.webkitRequestFullscreen) {
      document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  }
}

function toggleConfirm(con){
	confirmContainer.visible = con;
	
	if(con){
		TweenMax.pauseAll(true, true);
		gameData.paused = true;
	}else{
		TweenMax.resumeAll(true, true)
		gameData.paused = false;
	}
}


/*!
 * 
 * SHARE - This is the function that runs to open share url
 * 
 */
function share(action){
	gtag('event','click',{'event_category':'share','event_label':action});
	
	var loc = location.href
	loc = loc.substring(0, loc.lastIndexOf("/") + 1);
	
	var title = '';
	var text = '';
	
	title = shareTitle.replace("[SCORE]", gameData.displayStageNum+1);
	text = shareMessage.replace("[SCORE]", gameData.displayStageNum+1);
	var shareurl = '';
	
	if( action == 'twitter' ) {
		shareurl = 'https://twitter.com/intent/tweet?url='+loc+'&text='+text;
	}else if( action == 'facebook' ){
		shareurl = 'https://www.facebook.com/sharer/sharer.php?u='+encodeURIComponent(loc+'share.php?desc='+text+'&title='+title+'&url='+loc+'&thumb='+loc+'share.jpg&width=590&height=300');
	}else if( action == 'google' ){
		shareurl = 'https://plus.google.com/share?url='+loc;
	}else if( action == 'whatsapp' ){
		shareurl = "whatsapp://send?text=" + encodeURIComponent(text) + " - " + encodeURIComponent(loc);
	}
	
	window.open(shareurl);
}