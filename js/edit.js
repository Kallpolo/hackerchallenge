////////////////////////////////////////////////////////////
// EDIT PUZZLES
////////////////////////////////////////////////////////////
var edit = {show:true, option:'', connecting:false, connectStart:'', connectEnd:'', stageX:0, stageY:0};
var editColour = '#FF7F00';
var hubNum = 0;
var lineNum = 0;
var pointNum = 0;

/*!
 * 
 * EDIT READY
 * 
 */
$(function() {
	 $.editor.enable = true;
});

function loadEditPage(){
	jQuery.ajax({ 
		 url: "editTools.html", dataType: "html" 
	}).done(function( responseHtml ) {
		$("body").prepend(responseHtml);
		buildEditButtons();
		buildEditCanvas();
		$('#editWrapper').show();
		toggleEditOption();
		
		reloadStage(true);
		buttonExit.visible = false;
	});
}

function buildEditButtons(){
	hubContainer.visible = false;
	
	$('#toggleShowOption').click(function(){
		toggleShowOption();
	});
	
	buildStageDD();
	
	$("#challengelist").change(function() {
		if($(this).val() != ''){
			gameData.stageNum = Number($(this).val());
			toggleEditOption();
			reloadStage(true);
		}
	});
	
	$('#prevStage').click(function(){
		toggleStage(false);
		toggleEditOption();
	});
	
	$('#nextStage').click(function(){
		toggleStage(true);
		toggleEditOption();
	});
	
	$('#addNewStage').click(function(){
		actionStage('new');
	});
	
	$('#removeStage').click(function(){
		actionStage('remove');
	});
	
	$('#moveStageUp').click(function(){
		actionStage('moveup');
	});
	
	$('#moveStageDown').click(function(){
		actionStage('movedown');
	});
	
	//option
	$('#editArea').click(function(){
		toggleEditOption('stage');
	});
	
	$('#editHub').click(function(){
		toggleEditOption('hub');
	});
	
	$('#editLines').click(function(){
		toggleEditOption('lines');
	});
	
	$('#testPlay').click(function(){
		toggleEditOption('play');
		testPlay();
	});
	
	$('#stopTestPlay').click(function(){
		toggleEditOption();
		stopTestPlay();
	});
	
	$('#generateArray').click(function(){
		generateArray();
	});
	
	
	//stage
	$("#stageW").change(function() {
		stage_arr[gameData.stageNum].stage.w = Number($(this).val());
		reloadStage(false);
	});
	
	$("#stageH").change(function() {
		stage_arr[gameData.stageNum].stage.h = Number($(this).val());
		reloadStage(false);
	});
	
	$("#startX").change(function() {
		stage_arr[gameData.stageNum].stage.x = Number($(this).val());
	});
	
	$("#startY").change(function() {
		stage_arr[gameData.stageNum].stage.y = Number($(this).val());
	});
	
	$('#loadStartPos').click(function(){
		stageShape.x = stage_arr[gameData.stageNum].stage.x;
		stageShape.y = stage_arr[gameData.stageNum].stage.y;
		updateStageMove();
	});
	
	$('#loadCurrentPos').click(function(){
		stage_arr[gameData.stageNum].stage.x = Math.floor(stageContainer.x);
		stage_arr[gameData.stageNum].stage.y = Math.floor(stageContainer.y);
		
		$("#startX").val(Math.floor(stageContainer.x));
		$("#startY").val(Math.floor(stageContainer.y));
		
		stageShape.x = stage_arr[gameData.stageNum].stage.x = Math.floor(stageContainer.x);
		stageShape.y = stage_arr[gameData.stageNum].stage.y = Math.floor(stageContainer.y);
		updateStageMove();
	});
	
	$('#doneStage').click(function(){
		toggleEditOption();
	});
	
	
	//hub
	$("#hublist").change(function() {
		hubNum = Number($(this).val());
		
		selectHub();
		focusPos($hub[hubNum]);
	});
	
	for(n=0;n<hub_arr.length;n++){
		$('#hubtype').append($("<option/>", {
			value: n,
			text: hub_arr[n].type
		}));
	}
	
	$("#hubtype").change(function() {
		stage_arr[gameData.stageNum].hub[hubNum].type = Number($(this).val());
		reloadStage(false);
		selectHub();
	});
	
	$("#hubtrick").change(function() {
		stage_arr[gameData.stageNum].hub[hubNum].trick = Number($(this).val());
		
		$('.hubLockOption').hide();
		$('.hubTimerOption').hide();
		
		if(stage_arr[gameData.stageNum].hub[hubNum].trick == 1){
			$('.hubLockOption').show();
		}else if(stage_arr[gameData.stageNum].hub[hubNum].trick == 2){
			$('.hubTimerOption').show();
			if(isNaN(stage_arr[gameData.stageNum].hub[hubNum].timer) || stage_arr[gameData.stageNum].hub[hubNum].timer == 0){
				stage_arr[gameData.stageNum].hub[hubNum].timer = 60000;
				$('#hubTimer').val(stage_arr[gameData.stageNum].hub[hubNum].timer);
			}
		}
	});
	
	
	$("#hubTimer").change(function() {
		stage_arr[gameData.stageNum].hub[hubNum].timer = Number($(this).val());
	});
	
	$("#hubTimer").on("change paste keyup", function() {
	   stage_arr[gameData.stageNum].hub[hubNum].timer = Number($(this).val());
	});
	
	$("#hublocktop").change(function() {
		stage_arr[gameData.stageNum].hub[hubNum].lock[0] = Number($(this).val());
	});
	
	$("#hublockright").change(function() {
		stage_arr[gameData.stageNum].hub[hubNum].lock[1] = Number($(this).val());
	});
	
	$("#hublockbottom").change(function() {
		stage_arr[gameData.stageNum].hub[hubNum].lock[2] = Number($(this).val());
	});
	
	$("#hublockleft").change(function() {
		stage_arr[gameData.stageNum].hub[hubNum].lock[3] = Number($(this).val());
	});
	
	$("#hubRotation").change(function() {
		stage_arr[gameData.stageNum].hub[hubNum].rotation = $(this).val();
		reloadStage(false);
		selectHub();
	});
	
	$('#addHub').click(function(){
		toggleEditOption('addhub');
	});
	
	$('#doneAddHub').click(function(){
		toggleEditOption('hub');
	});
	
	$('#prevHub').click(function(){
		toggleHub(false);
	});
	
	$('#nextHub').click(function(){
		toggleHub(true);
	});
	
	$('#removeHub').click(function(){
		actionHub('remove');
	});
	
	$('#doneHub').click(function(){
		toggleEditOption();
	});
	
	//lines
	$("#linelist").change(function() {
		if($(this).val() != ''){
			lineNum = Number($(this).val());
			
			buildPointsDD();
			buildLines();
			drawAllLines();
			selectLine();
			focusPos($line[lineNum].startHub);
			
			editPointShape.x = $('#pointX').val();
			editPointShape.y = $('#pointY').val();
			editPointShape.visible = true;
		}
	});
	
	$('#prevLine').click(function(){
		toggleLine(false);
	});
	
	$('#nextLine').click(function(){
		toggleLine(true);
	});
	
	$('#removeLine').click(function(){
		actionLine('remove');
	});
	
	$('#addLine').click(function(){
		toggleEditOption('addline');
	});
	
	$('#doneAddLine').click(function(){
		edit.connecting = false;
		toggleEditOption('lines');
	});
	
	//points
	$("#pointlist").change(function() {
		if($(this).val() != ''){
			pointNum = Number($(this).val());
			
			$('#pointX').val(stage_arr[gameData.stageNum].lines[lineNum].array[pointNum].x);
			$('#pointY').val(stage_arr[gameData.stageNum].lines[lineNum].array[pointNum].y);
			
			editPointShape.x = $('#pointX').val();
			editPointShape.y = $('#pointY').val();
			editPointShape.visible = true;
		}
	});
	
	$('#prevPoint').click(function(){
		togglePoint(false);
	});
	
	$('#nextPoint').click(function(){
		togglePoint(true);
	});
	
	$("#pointX").change(function() {
		if(!isNaN($(this).val())){
			$point[lineNum+'-p'+pointNum].x = $(this).val();
			updateArray($point[lineNum+'-p'+pointNum]);
			drawAllLines();
		}
	});
	
	$("#pointY").change(function() {
		if(!isNaN($(this).val())){
			$point[lineNum+'-p'+pointNum].y = $(this).val();
			updateArray($point[lineNum+'-p'+pointNum]);
			drawAllLines();
		}
	});
	
	$('#addPoint').click(function(){
		toggleEditOption('addpoint');
	});
	
	$('#doneAddPoint').click(function(){
		toggleEditOption('lines');
	});
	
	$('#removePoint').click(function(){
		actionPoint('remove');
	});
	
	$('#doneEditLine').click(function(){
		toggleEditOption();
	});
}

 /*!
 * 
 * TOGGLE DISPLAY OPTION - This is the function that runs to toggle display option
 * 
 */
 
function toggleShowOption(){
	if(edit.show){
		edit.show = false;
		$('#editOption').hide();
		$('#toggleShowOption').val('Show Edit Option');
	}else{
		edit.show = true;
		$('#editOption').show();
		$('#toggleShowOption').val('Hide Edit Option');
	}
}

 /*!
 * 
 * BUILD EDIT CANVAS - This is the function that runs to build edit canvas
 * 
 */
var editContainer;
var editHubContainer;
var editPointShape;
var editHubSelect;

function buildEditCanvas(){
	editHubSelect = hubselect.clone(); 
	editHubSelect.visible = false;
	
	editPointShape = new createjs.Shape();
	editPointShape.graphics.beginFill(editColour).drawCircle(0, 0, 15);
	editPointShape.alpha = .5;
	
	editContainer = new createjs.Container();
	editHubContainer = new createjs.Container();
	editContainer.addChild(editHubContainer, editPointShape, editHubSelect);
	stageContainer.addChild(editContainer);
	
	stageShape.addEventListener("dblclick", function(evt) {
		edit.stageX = evt.stageX;
		edit.stageY = evt.stageY;
		
		if(edit.option == 'addhub'){
			actionHub('new');
		}else if(edit.option == 'addpoint'){
			actionPoint('new');	
		}
	});
}

 /*!
 * 
 * TOGGLE EDIT OPTIONS - This is the function that runs to toggle edit options
 * 
 */
function toggleEditOption(con){
	edit.option = con;
	
	$('#actionWrapper').hide();
	$('#playWrapper').hide();
	$('#editAreaWrapper').hide();
	$('#editHubWrapper').hide();
	$('#editAddHubWrapper').hide();
	$('#editLinesWrapper').hide();
	$('#editAddLineWrapper').hide();
	$('#editAddPointWrapper').hide();
	
	if(con == 'stage'){
		$('#editAreaWrapper').show();
		
		$("#stageW").val(stage_arr[gameData.stageNum].stage.w);
		$("#stageH").val(stage_arr[gameData.stageNum].stage.h);
		$("#stageX").val(stage_arr[gameData.stageNum].stage.x);
		$("#stageY").val(stage_arr[gameData.stageNum].stage.y);
		
	}else if(con == 'hub'){
		$('#editHubWrapper').show();
		
		buildHubDD();
		selectHub();
	}else if(con == 'addhub'){
		$('#editAddHubWrapper').show();
	}else if(con == 'lines'){
		$('#editLinesWrapper').show();
		
		//lineNum = 0;
		pointNum = 0;
		
		buildLinesDD();
		buildPointsDD();
		selectLine();
	}else if(con == 'addline'){
		$('#editAddLineWrapper').show();
		actionLine('selectStart');
	}else if(con == 'addpoint'){
		$('#editAddPointWrapper').show();
	}else if(con == 'play'){
		$('#playWrapper').show();
	}else{
		$('#actionWrapper').show();
	}
}


/*!
 * 
 * TOGGLE STAGE - This is the function that runs to toggle stages
 * 
 */
function toggleStage(con){
	if(con){
		gameData.stageNum++;
		gameData.stageNum = gameData.stageNum > stage_arr.length - 1 ? 0 : gameData.stageNum;
	}else{
		gameData.stageNum--;
		gameData.stageNum = gameData.stageNum < 0 ? stage_arr.length - 1 : gameData.stageNum;
	}
	
	$('#challengelist').prop("selectedIndex", gameData.stageNum);
	
	reloadStage(true);
}

/*!
 * 
 * GENERATE ARRAY - This is the function that runs to generate array
 * 
 */

function generateArray(){
	var outputArray = '';
	var space = '					';
	var space2 = '						';
	var space3 = '							';
	
	outputArray += "[";
	for(e=0;e<stage_arr.length;e++){
		if(e==0){
			outputArray += "{stage:{w:"+stage_arr[e].stage.w+", h:"+stage_arr[e].stage.h +", x:"+stage_arr[e].stage.x+", y:"+stage_arr[e].stage.y+"},\n";
		}else{
			outputArray += space+"{stage:{w:"+stage_arr[e].stage.w+", h:"+stage_arr[e].stage.h +", x:"+stage_arr[e].stage.x+", y:"+stage_arr[e].stage.y+"},\n";
		}
		
		outputArray += space+"hub:[";
		
		for(eb=0;eb<stage_arr[e].hub.length;eb++){
			if(stage_arr[e].hub.length==0){
				outputArray += "{x:"+stage_arr[e].hub[eb].x+", y:"+stage_arr[e].hub[eb].y+", type:"+stage_arr[e].hub[eb].type+", lock:["+stage_arr[e].hub[eb].lock[0]+","+stage_arr[e].hub[eb].lock[1]+","+stage_arr[e].hub[eb].lock[2]+","+stage_arr[e].hub[eb].lock[3]+"], timer:"+stage_arr[e].hub[eb].timer+", trick:"+stage_arr[e].hub[eb].trick+", rotation:"+stage_arr[e].hub[eb].rotation+"},";
			}else if(eb==stage_arr[e].hub.length-1){
				outputArray += "{x:"+stage_arr[e].hub[eb].x+", y:"+stage_arr[e].hub[eb].y+", type:"+stage_arr[e].hub[eb].type+", lock:["+stage_arr[e].hub[eb].lock[0]+","+stage_arr[e].hub[eb].lock[1]+","+stage_arr[e].hub[eb].lock[2]+","+stage_arr[e].hub[eb].lock[3]+"], timer:"+stage_arr[e].hub[eb].timer+", trick:"+stage_arr[e].hub[eb].trick+", rotation:"+stage_arr[e].hub[eb].rotation+"}";
			}else{
				outputArray += "{x:"+stage_arr[e].hub[eb].x+", y:"+stage_arr[e].hub[eb].y+", type:"+stage_arr[e].hub[eb].type+", lock:["+stage_arr[e].hub[eb].lock[0]+","+stage_arr[e].hub[eb].lock[1]+","+stage_arr[e].hub[eb].lock[2]+","+stage_arr[e].hub[eb].lock[3]+"], timer:"+stage_arr[e].hub[eb].timer+", trick:"+stage_arr[e].hub[eb].trick+", rotation:"+stage_arr[e].hub[eb].rotation+"},";	
			}
		}
		outputArray += "],\n";
		
		outputArray += space + "lines:[";
		for(eb=0;eb<stage_arr[e].lines.length;eb++){
			var array = '';
			for(ec=0;ec<stage_arr[e].lines[eb].array.length;ec++){
				if(eb==stage_arr[e].lines[eb].array.length-1){
					array += "{x:"+stage_arr[e].lines[eb].array[ec].x+", y:"+stage_arr[e].lines[eb].array[ec].y+"},";
				}else{
					array += "{x:"+stage_arr[e].lines[eb].array[ec].x+", y:"+stage_arr[e].lines[eb].array[ec].y+"},";
				}
			}
			
			if(eb==0){
				outputArray += "{startHub:"+stage_arr[e].lines[eb].startHub+", startHubPos:"+stage_arr[e].lines[eb].startHubPos+", endHub:"+stage_arr[e].lines[eb].endHub+", endHubPos:"+stage_arr[e].lines[eb].endHubPos+", array:["+array+"]},\n";
			}else if(eb==stage_arr[e].lines.length-1){
				outputArray += space3+"{startHub:"+stage_arr[e].lines[eb].startHub+", startHubPos:"+stage_arr[e].lines[eb].startHubPos+", endHub:"+stage_arr[e].lines[eb].endHub+", endHubPos:"+stage_arr[e].lines[eb].endHubPos+", array:["+array+"]}\n";
			}else{
				outputArray += space3+"{startHub:"+stage_arr[e].lines[eb].startHub+", startHubPos:"+stage_arr[e].lines[eb].startHubPos+", endHub:"+stage_arr[e].lines[eb].endHub+", endHubPos:"+stage_arr[e].lines[eb].endHubPos+", array:["+array+"]},\n";
			}
		}
		outputArray += "],\n";
		
		outputArray += space+"},\n\n";
	}
	outputArray += space+']\n\n';
	$('#outputArray').val(outputArray);
}

function checkUndefined(num){
	if(num == undefined){
		return 0;	
	}else{
		return num;	
	}
}

/*!
 * 
 * ACTION STAGE - This is the function that runs to action stage
 * 
 */
function actionStage(con){
	switch(con){
		case 'new':
			stage_arr.push({stage:{w:canvasW, h:canvasH, x:0, y:0}, hub:[], lines:[]});
			gameData.stageNum = stage_arr.length-1;
		break;
		
		case 'remove':
			stage_arr.splice(gameData.stageNum, 1);
			gameData.stageNum = 0;
		break;
			
		case 'moveup':
			if(gameData.stageNum-1 >= 0){
				swapArray(stage_arr, gameData.stageNum-1, gameData.stageNum);
				gameData.stageNum--;
			}
		break;
		
		case 'movedown':
			if(gameData.stageNum+1 < stage_arr.length){
				swapArray(stage_arr, gameData.stageNum+1, gameData.stageNum);
				gameData.stageNum++;
			}
		break;
	}
	
	buildStageDD();
	editHubSelect.visible = false;
	
	buildHubDD();
	buildHubs();
	
	buildLinesDD();
	buildPointsDD();
	buildLines();
	drawAllLines();
	selectLine();
}

function buildStageDD(){
	$('#challengelist').empty();
	for(n=0;n<stage_arr.length;n++){
		$('#challengelist').append($("<option/>", {
			value: n,
			text: 'Stage '+(n+1)
		}));
	}	
	
	$('#challengelist').prop("selectedIndex", gameData.stageNum);
}

/*!
 * 
 * TOGGLE HUB - This is the function that runs to toggle hubs
 * 
 */
function toggleHub(con){
	if(con){
		hubNum++;
		hubNum = hubNum > stage_arr[gameData.stageNum].hub.length - 1 ? 0 : hubNum;
	}else{
		hubNum--;
		hubNum = hubNum < 0 ? stage_arr[gameData.stageNum].hub.length - 1 : hubNum;
	}
	
	$('#hublist').prop("selectedIndex", hubNum);
	selectHub();
	focusPos($hub[hubNum]);
}

/*!
 * 
 * ACTION HUB - This is the function that runs to action hub
 * 
 */

function actionHub(con){
	switch(con){
		case 'new':
			stage_arr[gameData.stageNum].hub.push({x:Math.round(edit.stageX - stageContainer.x), y:Math.round(edit.stageY - stageContainer.y), type:0, lock:[0,0,0,0], timer:0, trick:0, rotation:-1});
			hubNum = stage_arr[gameData.stageNum].hub.length-1;
			
			buildHubDD();
			buildHubs();
			toggleEditOption('hub');
		break;
		
		case 'remove':
			stage_arr[gameData.stageNum].hub.splice(hubNum, 1);
			hubNum = 0;
			editHubSelect.visible = false;
			
			buildHubDD();
			buildHubs();
			
			buildLinesDD();
			buildPointsDD();
			buildLines();
			drawAllLines();
			selectLine();
		break;
	}
}

function buildHubDD(){
	$('#hublist').empty();
	for(n=0;n<stage_arr[gameData.stageNum].hub.length;n++){
		$('#hublist').append($("<option/>", {
			value: n,
			text: 'Hub '+(n+1)
		}));
	}
	
	$('#hublist').prop("selectedIndex", hubNum);
}

/*!
 * 
 * TOGGLE LINE - This is the function that runs to toggle line
 * 
 */
function toggleLine(con){
	if(con){
		lineNum++;
		lineNum = lineNum > stage_arr[gameData.stageNum].lines.length - 1 ? 0 : lineNum;
	}else{
		lineNum--;
		lineNum = lineNum < 0 ? stage_arr[gameData.stageNum].lines.length - 1 : lineNum;
	}
	
	$('#linelist').prop("selectedIndex", lineNum);
	selectLine();
	focusPos($line[lineNum].startHub);
}

/*!
 * 
 * ACTION LINES - This is the function that runs to action lines
 * 
 */
function actionLine(con){
	switch(con){
		case 'selectStart':
			edit.connecting = true;
			edit.connectStart = '';
			edit.connectEnd = '';
			alert('First select a hub starting points to begin connecting line');
		break;
		
		case 'selectEnd':
			alert('Next select a hub ending points to connect');
		break;
		
		case 'new':
			edit.connecting = false;
			stage_arr[gameData.stageNum].lines.push({startHub:edit.connectStart.num, startHubPos:edit.connectStart.pos, endHub:edit.connectEnd.num, endHubPos:edit.connectEnd.pos, array:[]});
			
			lineNum = stage_arr[gameData.stageNum].lines.length-1;
			$('#linelist').prop("selectedIndex", lineNum);
			
			buildLinesDD();
			buildPointsDD();
			buildLines();
			drawAllLines();
			selectLine();
			
			editPointShape.visible = false;
			toggleEditOption('lines');
		break;
		
		case 'remove':
			stage_arr[gameData.stageNum].lines.splice(lineNum, 1);
			lineNum = 0;
			
			buildLinesDD();
			buildPointsDD();
			buildLines();
			drawAllLines();
			selectLine();
			
			editPointShape.visible = false;
		break;
	}
}

function buildLinesDD(){
	$('#linelist').empty();
	for(n=0;n<stage_arr[gameData.stageNum].lines.length;n++){
		$('#linelist').append($("<option/>", {
			value: n,
			text: 'Lines '+(n+1)
		}));
	}
}

/*!
 * 
 * TOGGLE POINT - This is the function that runs to toggle point
 * 
 */
function togglePoint(con){
	if(con){
		pointNum++;
		pointNum = pointNum > stage_arr[gameData.stageNum].lines[lineNum].array.length - 1 ? 0 : pointNum;
	}else{
		pointNum--;
		pointNum = pointNum < 0 ? stage_arr[gameData.stageNum].lines[lineNum].array.length - 1 : pointNum;
	}
	
	$('#pointlist').prop("selectedIndex", pointNum);
	$('#pointX').val(stage_arr[gameData.stageNum].lines[lineNum].array[pointNum].x);
	$('#pointY').val(stage_arr[gameData.stageNum].lines[lineNum].array[pointNum].y);
	
	editPointShape.x = $('#pointX').val();
	editPointShape.y = $('#pointY').val();
	editPointShape.visible = true;
}

/*!
 * 
 * ACTION POINT - This is the function that runs to action point
 * 
 */
function actionPoint(con){
	switch(con){
		case 'new':
			stage_arr[gameData.stageNum].lines[lineNum].array.push({x:Math.round(edit.stageX - stageContainer.x), y:Math.round(edit.stageY - stageContainer.y)});
			
			pointNum = stage_arr[gameData.stageNum].lines[lineNum].array.length-1;
			buildPointsDD();
			buildLines();
			drawAllLines();
			
			editPointShape.visible = true;
			editPointShape.x = $('#newPointX').val();
			editPointShape.y = $('#newPointY').val();
			
			selectLine();
		break;
		
		case 'remove':
			stage_arr[gameData.stageNum].lines[lineNum].array.splice(pointNum, 1);
			pointNum = 0;
			
			buildPointsDD();
			buildLines();
			drawAllLines();
			
			editPointShape.visible = false;
		break;
	}
}

function buildPointsDD(){
	$('#pointX').val('');
	$('#pointY').val('');
	
	$('#pointlist').empty();
	if(stage_arr[gameData.stageNum].lines.length > 0){
		for(n=0;n<stage_arr[gameData.stageNum].lines[lineNum].array.length;n++){
			$('#pointlist').append($("<option/>", {
				value: n,
				text: 'Point '+(n+1)
			}));
			
			if(n==0){
				$('#pointX').val(stage_arr[gameData.stageNum].lines[lineNum].array[n].x);
				$('#pointY').val(stage_arr[gameData.stageNum].lines[lineNum].array[n].y);
			}
		}
		$('#pointlist').prop("selectedIndex", pointNum);
	}
}

/*!
 * 
 * SELECT HUB - This is the function that runs to select hub
 * 
 */
function selectHub(){
	if(stage_arr[gameData.stageNum].hub.length == 0){
		$('.huboption').hide();
		$('.hubTimerOption').hide();
		$('.hubLockOption').hide();
		
		return;	
	}
	
	$('#hubX').val(stage_arr[gameData.stageNum].hub[hubNum].x);
	$('#hubY').val(stage_arr[gameData.stageNum].hub[hubNum].y);
	$('#hubtype').prop("selectedIndex", stage_arr[gameData.stageNum].hub[hubNum].type);
	$('#hubtrick').prop("selectedIndex", stage_arr[gameData.stageNum].hub[hubNum].trick);
	
	$('.huboption').show();
	$('.hubTimerOption').hide();
	$('.hubLockOption').hide();
	$("#hubtrick option[value=" + 2 + "]").removeAttr('disabled');
	
	if(stage_arr[gameData.stageNum].hub[hubNum].type == 0){
		$('.huboption').hide();
	}else if(stage_arr[gameData.stageNum].hub[hubNum].type == 1){
		$("#hubtrick option[value=" + 2 + "]").attr('disabled','disabled');
	}
	
	if(stage_arr[gameData.stageNum].hub[hubNum].trick == 1){
		$('.hubLockOption').show();
	}else if(stage_arr[gameData.stageNum].hub[hubNum].trick == 2){
		$('.hubTimerOption').show();
	}
	
	$('#hubTimer').val(stage_arr[gameData.stageNum].hub[hubNum].timer);
	$('#hublocktop').prop("selectedIndex", stage_arr[gameData.stageNum].hub[hubNum].lock[0]);
	$('#hublockright').prop("selectedIndex", stage_arr[gameData.stageNum].hub[hubNum].lock[1]);
	$('#hublockbottom').prop("selectedIndex", stage_arr[gameData.stageNum].hub[hubNum].lock[2]);
	$('#hublockleft').prop("selectedIndex", stage_arr[gameData.stageNum].hub[hubNum].lock[3]);
	
	var rotation_arr = [];
	
	if(stage_arr[gameData.stageNum].hub[hubNum].type == 2){
		rotation_arr = [-1,0,90];	
	}else if(stage_arr[gameData.stageNum].hub[hubNum].type == 3){
		rotation_arr = [-1,0,90,180,270];	
	}else if(stage_arr[gameData.stageNum].hub[hubNum].type == 5){
		rotation_arr = [-1,0,90,180,270];	
	}
	
	$('#hubRotation').empty();
	$("#hubRotation").prop('disabled', true);
	
	for(n=0;n<rotation_arr.length;n++){
		var rotateText = rotation_arr[n];
		if(n == 0){
			rotateText = 'Random';
		}
		$('#hubRotation').append($("<option/>", {
			value: rotation_arr[n],
			text: rotateText
		}));
		
		$("#hubRotation").prop('disabled', false);
	}	
	$('#hubRotation').val(stage_arr[gameData.stageNum].hub[hubNum].rotation);
	
	$('#hublist').prop("selectedIndex", hubNum);
	
	editHubSelect.x = $hub[hubNum].x;
	editHubSelect.y = $hub[hubNum].y;
	editHubSelect.visible = true;
}

/*!
 * 
 * SELECT LINE - This is the function that runs to select line
 * 
 */
function selectLine(){
	$('#linelist').prop("selectedIndex", lineNum);
	
	for(al=0;al<stage_arr[gameData.stageNum].lines.length;al++){
		$line[al+'command'].style = strokeColour;
	}
	
	$line[lineNum+'command'].style = editColour;
	buildPointsDD();
}

/*!
 * 
 * SETUP OBJECTS EVENTS - This is the function that runs to setup objects events
 * 
 */
function buildDragAndDrop(obj){
	obj.addEventListener("mousedown", function(evt) {
		toggleDragEvent(evt, 'drag')
	});
	obj.addEventListener("pressmove", function(evt) {
		toggleDragEvent(evt, 'move')
	});
	obj.addEventListener("pressup", function(evt) {
		toggleDragEvent(evt, 'release');
	});	
}

function toggleDragEvent(obj, con){
	if(obj.target.active){
		switch(con){
			case 'drag':
				obj.target.dragging = true;
				obj.target.offset = {x:obj.target.x-(obj.stageX), y:obj.target.y-(obj.stageY)};
				
				if(obj.target.type == 'hub'){
					hubNum = obj.target.num;
					selectHub();
				}else if(obj.target.type == 'point'){
					lineNum = obj.target.targetLineNum;
					editPointShape.x = obj.target.x;
					editPointShape.y = obj.target.y;
					editPointShape.visible = true;
					selectLine();
				}else{
					editPointShape.visible = false;
				}
			break;
			
			case 'move':
				obj.target.x = (obj.stageX) + obj.target.offset.x;
				obj.target.y = (obj.stageY) + obj.target.offset.y;
				
				if(obj.target.type == 'hub'){
					moveHubDots(obj.target.num);
				}else if(obj.target.type == 'point'){
					pointNum = obj.target.num;
					$('#pointlist').prop("selectedIndex", pointNum);
					
					editPointShape.x = obj.target.x;
					editPointShape.y = obj.target.y;
				}
				
				updateArray(obj.target);
				drawAllLines();
				selectLine();
			break;
			
			case 'release':
				obj.target.dragging = false;
			break;
		}
	}
}

function buildHubPointEvent(obj){
	obj.cursor = 'pointer';
	obj.addEventListener("mousedown", function(evt) {
		if(edit.connecting){
			if(edit.connectStart == '' && checkHubAvailable(obj, 'start')){
				edit.connectStart = obj;
				actionLine('selectEnd');
			}else if(edit.connectEnd == '' && edit.connectStart.num != obj.num && checkHubAvailable(obj, 'end')){
				edit.connectEnd = obj;
				actionLine('new');
			}else{
				alert('Not available!');	
			}
		}
	});	
}

function buildLineEvent(obj){
	obj.cursor = 'pointer';
	obj.addEventListener("mousedown", function(evt) {
		lineNum = evt.target.num;
		selectLine();
	});	
}

/*!
 * 
 * MOVE HUB POINT - This is the function that runs to move hub point
 * 
 */
function moveHubDots(num){
	editHubSelect.x = $hub[num+'_edit'].x;
	editHubSelect.y = $hub[num+'_edit'].y;
	$hub[num].x = $hub[num+'_edit'].x;
	$hub[num].y = $hub[num+'_edit'].y;
	
	var typeNum = stage_arr[gameData.stageNum].hub[num].type;
	var range = Number(hub_arr[typeNum].range);
	var pos_arr = [{x:0, y:-(range)},
				   {x:range, y:0},
				   {x:0, y:range},
				   {x:-(range), y:0},];
				   
	for(hc=0;hc<4;hc++){
		$hub[num+'_edit-'+hc].x = $hub[num+'_edit'].x + pos_arr[hc].x;
		$hub[num+'_edit-'+hc].y = $hub[num+'_edit'].y + pos_arr[hc].y;
		$hub[num+'-'+hc].x = $hub[num+'_edit'].x + pos_arr[hc].x;
		$hub[num+'-'+hc].y = $hub[num+'_edit'].y + pos_arr[hc].y;
	}
}

/*!
 * 
 * CREATE EDIT HUB - This is the function that runs to create edit hub
 * 
 */
function createEditHub(num, x, y){
	var typeNum = stage_arr[gameData.stageNum].hub[num].type;
	$hub[num+'_edit'] = $hubType[typeNum].clone(); 
	$hub[num+'_edit'].x = x;
	$hub[num+'_edit'].y = y;
	$hub[num+'_edit'].num = num;
	$hub[num+'_edit'].type = 'hub';
	
	editHubContainer.addChild($hub[num+'_edit']);
	
	if(stage_arr[gameData.stageNum].hub[num].rotation != -1 && typeNum != 0 && typeNum != 1){
		$hub[num+'_edit'].rotation = stage_arr[gameData.stageNum].hub[num].rotation;
	}
	
	buildDragAndDrop($hub[num+'_edit']);
	toggleObjActive($hub[num+'_edit'], true);
	
	var range = Number(hub_arr[typeNum].range);
	var pos_arr = [{x:0, y:-(range)},
				   {x:range, y:0},
				   {x:0, y:range},
				   {x:-(range), y:0},];
				   	   
	//hub points
	for(hc=0;hc<4;hc++){
		$hub[num+'_edit-'+hc] = new createjs.Shape();
		$hub[num+'_edit-'+hc].graphics.beginFill(dotColour).drawCircle(0, 0, dotW);
		$hub[num+'_edit-'+hc].x = Number($hub[num+'_edit'].x) + pos_arr[hc].x;
		$hub[num+'_edit-'+hc].y = Number($hub[num+'_edit'].y) + pos_arr[hc].y;
		
		$hub[num+'_edit-'+hc].num = num;
		$hub[num+'_edit-'+hc].pos = hc;
		
		editHubContainer.addChild($hub[num+'_edit-'+hc]);
		buildHubPointEvent($hub[num+'_edit-'+hc]);
	}
}

/*!
 * 
 * DRAW LINE POINT - This is the function that runs to draw line point
 * 
 */
function drawPoints(num, array){
	for(p=0;p<array.length;p++){
		$point[num+'-p'+p] = new createjs.Shape();
		$point[num+'-p'+p].graphics.beginFill(editColour).drawCircle(0, 0, dotW);
		$point[num+'-p'+p].x = array[p].x;
		$point[num+'-p'+p].y = array[p].y;
		$point[num+'-p'+p].type = 'point';
		$point[num+'-p'+p].targetLineNum = num;
		$point[num+'-p'+p].num = p;
		$pointContainer[num].addChild($point[num+'-p'+p]);
		
		buildDragAndDrop($point[num+'-p'+p]);
		toggleObjActive($point[num+'-p'+p], true);
	}	
}

/*!
 * 
 * UPDATE ARRAY - This is the function that runs to update array
 * 
 */
function updateArray(obj){
	switch(obj.type){
		case 'hub':
			if(stage_arr[gameData.stageNum].hub.length > 0){
				stage_arr[gameData.stageNum].hub[obj.num].x = Math.floor(obj.x);
				stage_arr[gameData.stageNum].hub[obj.num].y = Math.floor(obj.y);
				
				$('#hubX').val(Math.floor(obj.x));
				$('#hubY').val(Math.floor(obj.y));
			}
		break;
		
		case 'point':
			if(stage_arr[gameData.stageNum].lines[obj.targetLineNum].array.length > 0){
				stage_arr[gameData.stageNum].lines[obj.targetLineNum].array[obj.num].x = Math.floor(obj.x);
				stage_arr[gameData.stageNum].lines[obj.targetLineNum].array[obj.num].y = Math.floor(obj.y);
				
				$('#pointX').val(Math.floor(obj.x));
				$('#pointY').val(Math.floor(obj.y));
			}
		break;
	}
}

/*!
 * 
 * CHECK HUB AVAILABLE - This is the function that runs to check hub available
 * 
 */
function checkHubAvailable(obj, con){
	var availableHub = true;
	for(l=0; l<stage_arr[gameData.stageNum].lines.length; l++){
		if(stage_arr[gameData.stageNum].lines[l].startHub == obj.num && stage_arr[gameData.stageNum].lines[l].startHubPos == obj.pos){
			availableHub = false;	
		}else if(stage_arr[gameData.stageNum].lines[l].endHub == obj.num && stage_arr[gameData.stageNum].lines[l].endHubPos == obj.pos){
			availableHub = false;	
		}
	}
	
	return availableHub;	
}

/*!
 * 
 * TEST PLAY - This is the function that runs to test play
 * 
 */
function testPlay(){
	hubContainer.visible = true;
	editHubContainer.removeAllChildren();	
	loadStage();
	
	editHubSelect.visible = false;
	
	for(l=0; l<stage_arr[gameData.stageNum].lines.length; l++){
		for(p=0;p<stage_arr[gameData.stageNum].lines[l].array.length;p++){
			$point[l+'-p'+p].visible = false;
		}
	}
	
	for(al=0;al<stage_arr[gameData.stageNum].lines.length;al++){
		$line[al+'command'].style = strokeColour;
	}
	
	editHubContainer.visible = false;
	editPointShape.visible = false;
	
	loadStage(true);
	gameData.pause = false;
	startMainPower();
}

function stopTestPlay(){
	hubContainer.visible = false;
	stopGame();
	editHubContainer.removeAllChildren();
	loadStage();
	
	for(l=0; l<stage_arr[gameData.stageNum].lines.length; l++){
		for(p=0;p<stage_arr[gameData.stageNum].lines[l].array.length;p++){
			$point[l+'-p'+p].visible = true;
		}
	}
	
	for(al=0;al<stage_arr[gameData.stageNum].lines.length;al++){
		$line[al+'command'].style = strokeColour;
	}
	
	editHubContainer.visible = true;
	editPointShape.visible = true;
}

/*!
 * 
 * RELOAD STAGE - This is the function that runs to reload stage
 * 
 */
function reloadStage(con){
	editHubSelect.visible = false;
	editPointShape.visible = false;
	
	editHubContainer.removeAllChildren();	
	loadStage(con);
}

function focusPos(obj){
	if(obj == undefined){
		return;	
	}
	
	var centerX = canvasW/2;
	var centerY = canvasH/2;
	
	stageShape.x = centerX - obj.x;
	stageShape.y = centerY - obj.y;
	
	updateStageMove();
}