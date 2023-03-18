////////////////////////////////////////////////////////////
// CANVAS
////////////////////////////////////////////////////////////
var stage
var canvasW=0;
var canvasH=0;

/*!
 * 
 * START GAME CANVAS - This is the function that runs to setup game canvas
 * 
 */
function initGameCanvas(w,h){
	var gameCanvas = document.getElementById("gameCanvas");
	gameCanvas.width = w;
	gameCanvas.height = h;
	
	canvasW=w;
	canvasH=h;
	stage = new createjs.Stage("gameCanvas");
	
	createjs.Touch.enable(stage);
	stage.enableMouseOver(20);
	stage.mouseMoveOutside = true;
	
	createjs.Ticker.framerate = 60;
	createjs.Ticker.addEventListener("tick", tick);	
}

var guide = false;
var canvasContainer, mainContainer, gameContainer, stageContainer, stageAnnounceContainer, hubContainer, lineContainer, resultContainer;
var guideline, background, logo, buttonStart, resultTitleTxt, resultStageTxt, resultShareTxt, buttonFacebook, buttonTwitter, buttonWhatsapp, buttonReplay, buttonFullscreen, buttonSoundOn, buttonSoundOff;
var globe, stageDisplayTxt, stageShape, hubselect, hubTimer, hubTimerBar, hubUnlock, instructionMove;

$hub = {};
$hubType = {};
$line = {};
$point = {};
$lineContainer = {};
$pointContainer = {};

/*!
 * 
 * BUILD GAME CANVAS ASSERTS - This is the function that runs to build game canvas asserts
 * 
 */
function buildGameCanvas(){
	canvasContainer = new createjs.Container();
	mainContainer = new createjs.Container();
	hubContainer = new createjs.Container();
	lineContainer = new createjs.Container();
	gameContainer = new createjs.Container();
	stageContainer = new createjs.Container();
	stageAnnounceContainer = new createjs.Container();
	resultContainer = new createjs.Container();
	
	background = new createjs.Bitmap(loader.getResult('background'));
	
	logo = new createjs.Bitmap(loader.getResult('logo'));
	buttonStart = new createjs.Bitmap(loader.getResult('buttonStart'));
	centerReg(buttonStart);
	createHitarea(buttonStart);
	buttonStart.x = canvasW/2;
	buttonStart.y = canvasH/100 * 60;
	
	globe = new createjs.Bitmap(loader.getResult('globe'));
	stageDisplayTxt = new createjs.Text();
	stageDisplayTxt.font = "50px source_code_proregular";
	stageDisplayTxt.color = "#fff";
	stageDisplayTxt.text = resultText;
	stageDisplayTxt.textAlign = "center";
	stageDisplayTxt.textBaseline='alphabetic';
	stageDisplayTxt.x = canvasW/2;
	stageDisplayTxt.y = canvasH/100*50;
	stageAnnounceContainer.visible = false;
	
	instructionMove = new createjs.Bitmap(loader.getResult('instructionMove'));
	
	stageShape = new createjs.Shape();
	
	hubselect = new createjs.Bitmap(loader.getResult('hubselect'));
	centerReg(hubselect);
	createHitarea(hubselect);
	hubselect.x = -200;
	
	hubTimer = new createjs.Bitmap(loader.getResult('hubTimer'));
	centerReg(hubTimer);
	createHitarea(hubTimer);
	hubTimer.x = -200;
	
	hubTimerBar = new createjs.Bitmap(loader.getResult('hubTimerBar'));
	centerReg(hubTimerBar);
	createHitarea(hubTimerBar);
	hubTimerBar.x = -200;
	
	hubUnlock = new createjs.Bitmap(loader.getResult('hubUnlock'));
	centerReg(hubUnlock);
	hubUnlock.x = -200;
	
	for(n=0;n<hublock_arr.length;n++){
		$hubType['hublock_'+n] = new createjs.Bitmap(loader.getResult('hublock_'+n));
		centerReg($hubType['hublock_'+n]);
		createHitarea($hubType['hublock_'+n]);
		
		$hubType['hublock_power_'+n] = new createjs.Bitmap(loader.getResult('hublock_power_'+n));
		centerReg($hubType['hublock_power_'+n]);
		createHitarea($hubType['hublock_power_'+n]);
		
		$hubType['hublock_indicator_'+n] = new createjs.Bitmap(loader.getResult('hublock_indicator_'+n));
		centerReg($hubType['hublock_indicator_'+n]);
		createHitarea($hubType['hublock_indicator_'+n]);
		
		$hubType['hublock_indicator_power_'+n] = new createjs.Bitmap(loader.getResult('hublock_indicator_power_'+n));
		centerReg($hubType['hublock_indicator_power_'+n]);
		createHitarea($hubType['hublock_indicator_power_'+n]);
		
		$hubType['hublock_'+n].x = -200;
		$hubType['hublock_power_'+n].x = -200;
		$hubType['hublock_indicator_'+n].x = -200;
		$hubType['hublock_indicator_power_'+n].x = -200;
		
		gameContainer.addChild($hubType['hublock_'+n], $hubType['hublock_power_'+n], $hubType['hublock_indicator_'+n], $hubType['hublock_indicator_power_'+n]);
	}
	
	for(n=0;n<hub_arr.length;n++){
		$hubType[n] = new createjs.Bitmap(loader.getResult('hub_'+hub_arr[n].type));
		centerReg($hubType[n]);
		createHitarea($hubType[n]);
		
		$hubType['power'+n] = new createjs.Bitmap(loader.getResult('hub_power_'+hub_arr[n].type));
		centerReg($hubType['power'+n]);
		createHitarea($hubType['power'+n]);
		
		$hubType[n].x = -200;
		$hubType['power'+n].x = -200;
		
		gameContainer.addChild($hubType[n], $hubType['power'+n]);
	}
	
	resultTitleTxt = new createjs.Text();
	resultTitleTxt.font = "50px source_code_proregular";
	resultTitleTxt.color = "#ccc";
	resultTitleTxt.text = resultText;
	resultTitleTxt.textAlign = "center";
	resultTitleTxt.textBaseline='alphabetic';
	resultTitleTxt.x = canvasW/2;
	resultTitleTxt.y = canvasH/100*30;
	
	resultStageTxt = new createjs.Text();
	resultStageTxt.font = "100px source_code_proregular";
	resultStageTxt.color = "#ffffff";
	resultStageTxt.text = resultStageText;
	resultStageTxt.textAlign = "center";
	resultStageTxt.textBaseline='alphabetic';
	resultStageTxt.x = canvasW/2;
	resultStageTxt.y = canvasH/100*43;
	
	buttonFacebook = new createjs.Bitmap(loader.getResult('buttonFacebook'));
	buttonTwitter = new createjs.Bitmap(loader.getResult('buttonTwitter'));
	buttonWhatsapp = new createjs.Bitmap(loader.getResult('buttonWhatsapp'));
	centerReg(buttonFacebook);
	createHitarea(buttonFacebook);
	centerReg(buttonTwitter);
	createHitarea(buttonTwitter);
	centerReg(buttonWhatsapp);
	createHitarea(buttonWhatsapp);
	buttonFacebook.x = canvasW/100*42;
	buttonTwitter.x = canvasW/2;
	buttonWhatsapp.x = canvasW/100*58;
	buttonFacebook.y = buttonTwitter.y = buttonWhatsapp.y = canvasH/100 * 63;
	
	resultShareTxt = new createjs.Text();
	resultShareTxt.font = "30px source_code_proregular";
	resultShareTxt.color = "#ffffff";
	resultShareTxt.text = shareText;
	resultShareTxt.textAlign = "center";
	resultShareTxt.textBaseline='alphabetic';
	resultShareTxt.x = canvasW/2;
	resultShareTxt.y = canvasH/100*55;
	
	buttonReplay = new createjs.Bitmap(loader.getResult('buttonStart'));
	centerReg(buttonReplay);
	createHitarea(buttonReplay);
	buttonReplay.x = canvasW/2;
	buttonReplay.y = canvasH/100 * 78;
	
	buttonFullscreen = new createjs.Bitmap(loader.getResult('buttonFullscreen'));
	centerReg(buttonFullscreen);
	buttonSoundOn = new createjs.Bitmap(loader.getResult('buttonSoundOn'));
	centerReg(buttonSoundOn);
	buttonSoundOff = new createjs.Bitmap(loader.getResult('buttonSoundOff'));
	centerReg(buttonSoundOff);
	buttonSoundOn.visible = false;
	buttonExit = new createjs.Bitmap(loader.getResult('buttonExit'));
	centerReg(buttonExit);
	buttonSettings = new createjs.Bitmap(loader.getResult('buttonSettings'));
	centerReg(buttonSettings);
	
	createHitarea(buttonFullscreen);
	createHitarea(buttonSoundOn);
	createHitarea(buttonSoundOff);
	createHitarea(buttonExit);
	createHitarea(buttonSettings);
	optionsContainer = new createjs.Container();
	optionsContainer.addChild(buttonFullscreen, buttonSoundOn, buttonSoundOff, buttonExit);
	optionsContainer.visible = false;
	
	//exit
	itemExit = new createjs.Bitmap(loader.getResult('itemExit'));
	
	buttonYes = new createjs.Bitmap(loader.getResult('buttonYes'));
	centerReg(buttonYes);
	buttonYes.x = canvasW/100* 34;
	buttonYes.y = canvasH/100 * 60;
	
	buttonNo = new createjs.Bitmap(loader.getResult('buttonNo'));
	centerReg(buttonNo);
	buttonNo.x = canvasW/100 * 66;
	buttonNo.y = canvasH/100 * 60;
	
	confirmMessageTxt = new createjs.Text();
	confirmMessageTxt.font = "45px source_code_proregular";
	confirmMessageTxt.color = "#fff";
	confirmMessageTxt.textAlign = "center";
	confirmMessageTxt.textBaseline='alphabetic';
	confirmMessageTxt.text = exitMessage;
	confirmMessageTxt.x = canvasW/2;
	confirmMessageTxt.y = canvasH/100 *37;
	
	createHitarea(buttonYes);
	createHitarea(buttonNo);
	
	confirmContainer = new createjs.Container();
	confirmContainer.addChild(itemExit, buttonYes, buttonNo, confirmMessageTxt);
	confirmContainer.visible = false;
	
	mainContainer.addChild(logo, buttonStart);
	stageAnnounceContainer.addChild(globe, stageDisplayTxt);
	stageContainer.addChild(lineContainer, hubContainer);
	gameContainer.addChild(hubselect, hubTimer, hubTimerBar, hubUnlock, stageShape, stageContainer, instructionMove, stageAnnounceContainer);
	resultContainer.addChild(resultTitleTxt, resultStageTxt, buttonReplay);
	if(shareEnable){
		resultContainer.addChild(resultShareTxt, buttonFacebook, buttonTwitter, buttonWhatsapp);	
	}
	
	if(guide){
		guideline = new createjs.Shape();	
		guideline.graphics.setStrokeStyle(2).beginStroke('red').drawRect((stageW-contentW)/2, (stageH-contentH)/2, contentW, contentH);
	}
	canvasContainer.addChild(background, mainContainer, gameContainer, resultContainer, confirmContainer, optionsContainer, buttonSettings, guideline);
	stage.addChild(canvasContainer);
	
	resizeCanvas();
}


/*!
 * 
 * RESIZE GAME CANVAS - This is the function that runs to resize game canvas
 * 
 */
function resizeCanvas(){
 	if(canvasContainer!=undefined){
		buttonSettings.x = (canvasW - offset.x) - 50;
		buttonSettings.y = offset.y + 45;
		
		var distanceNum = 65;
		if(curPage != 'game'){
			buttonExit.visible = false;
			buttonSoundOn.x = buttonSoundOff.x = buttonSettings.x;
			buttonSoundOn.y = buttonSoundOff.y = buttonSettings.y+distanceNum;
			buttonSoundOn.x = buttonSoundOff.x;
			buttonSoundOn.y = buttonSoundOff.y = buttonSettings.y+(distanceNum);
			
			buttonFullscreen.x = buttonSettings.x;
			buttonFullscreen.y = buttonSettings.y+(distanceNum*2);
		}else{
			buttonExit.visible = true;
			buttonSoundOn.x = buttonSoundOff.x = buttonSettings.x;
			buttonSoundOn.y = buttonSoundOff.y = buttonSettings.y+distanceNum;
			buttonSoundOn.x = buttonSoundOff.x;
			buttonSoundOn.y = buttonSoundOff.y = buttonSettings.y+(distanceNum);
			
			buttonFullscreen.x = buttonSettings.x;
			buttonFullscreen.y = buttonSettings.y+(distanceNum*2);
			
			buttonExit.x = buttonSettings.x;
			buttonExit.y = buttonSettings.y+(distanceNum*3);
		}
	}
}

/*!
 * 
 * REMOVE GAME CANVAS - This is the function that runs to remove game canvas
 * 
 */
 function removeGameCanvas(){
	 stage.autoClear = true;
	 stage.removeAllChildren();
	 stage.update();
	 createjs.Ticker.removeEventListener("tick", tick);
	 createjs.Ticker.removeEventListener("tick", stage);
 }

/*!
 * 
 * CANVAS LOOP - This is the function that runs for canvas loop
 * 
 */ 
function tick(event) {
	updateGame();
	stage.update(event);
}

/*!
 * 
 * CANVAS MISC FUNCTIONS
 * 
 */
function centerReg(obj){
	obj.regX=obj.image.naturalWidth/2;
	obj.regY=obj.image.naturalHeight/2;
}

function createHitarea(obj){
	obj.hitArea = new createjs.Shape(new createjs.Graphics().beginFill("#000").drawRect(0, 0, obj.image.naturalWidth, obj.image.naturalHeight));	
}