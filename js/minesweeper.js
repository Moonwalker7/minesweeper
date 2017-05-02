
var gGame = {

	'bGameOn' : false,
	'iMinesCount' : 0,
	'iMaxGridCoordinateX' : 0,
	'iMaxGridCoordinateY' : 0,
	'lstGrid' : [],
	'lstPlacedMinesLocation' : [],
	'timer' : {
		'minutes' : 0,
		'seconds' : 0,
		'timeout' : 0
		} 

};


//Main Functions

var createGrid = function( iGridSizeRow, iGridSizeCol ){

	var lstGridCoordinates = [];
	var divGrid = document.getElementById( "dGrid" );
	divGrid.innerText = "";

	gGame['lstGrid'] = new Array( iGridSizeRow );
	for ( var x = 0; x < iGridSizeRow; x++ ) {
			
		var divRow = document.createElement( "div" );
		gGame['lstGrid'][x] = new Array( iGridSizeCol );

		for ( var y = 0; y < iGridSizeCol; y++ ) {
			
			var button = createButton(x, y)
			gGame['lstGrid'][x][y] = button;
			divRow.appendChild( button );
			
			lstGridCoordinates.push( button );				
		}

		divGrid.appendChild( divRow );
	}
	console.log( "Grid setup done" );
	return lstGridCoordinates;
}

var plantMines = function( lstGridCoordinates ){

	gGame['lstPlacedMinesLocation'] = new Array();

	for( var iCount = 0; iCount < gGame['iMinesCount']; iCount++ ){

		var iRandomNum = getRandomNum( lstGridCoordinates.length );
		var iMineLocation = lstGridCoordinates[iRandomNum];
		
		//Plant a mine
		gGame['lstGrid'][iMineLocation.x][iMineLocation.y].hasValue = -1;
		
		//Add the location to the list
		gGame['lstPlacedMinesLocation'].push( iMineLocation );

		//splice the randomly chosen index for unique random number generation
		lstGridCoordinates.splice( iRandomNum, 1 );
	}
	console.log( "Planted Mines" );	
}

var setNumbersAroundMines = function(){

	var iLength = gGame['lstPlacedMinesLocation'].length;
	
	
	for( var i = 0; i < iLength; i++ ){
		var iMine = gGame['lstPlacedMinesLocation'][i]
	
		var lstNum1 = getNum1AroundMines( gGame['lstGrid'][iMine.x][iMine.y] );
		setNumToCell( lstNum1, 1 );
		//var lstNum2 = getNum2AroundMines( gGame['lstGrid'][iMine.x][iMine.y] );
		//setNumToCell( lstNum2, 2 );
	}
}


var gameTerminate = function( iFlag ){


	stopTimer();
	gGame['gameOn'] = false;
	/*
		Re-enable/Unhide the button the button
		change the text on start button
		*/
	if( iFlag === -1 ){

		console.log("isMine" + "\n" + "Game Over :(" );
		showMines();//send an image path.
		//button.style.background = 'yellow';// change this to coloring only the outline of the clicked mine button
		setText("Game Over :(");
		
	}
	else if( iFlag === 0 ){
		showMines();
		//button.style.background = 'yellow';//same as above
		setText("Game Won :)");
	}
}

//Event Functions

var eventLeftAction = function( event ){
	console.log( "Left Click");	

	var button = getNode( event.target, 'BUTTON' );

	if( ! gGame['gameOn'] || button.isVisible === true ){
		console.log( "gameOn is disabled");
		return;
	}
	else if( button.isFlag ){
		console.log("exiting left click function, flag is set ");
		//setText( "Flag is already set" );
		return;
	}
	
	if( unopenedCells() === 0 ){
		timer['timeout'] = setInterval( startTimer, 1000 );
	}
	else if( button.hasValue === -1 ){
		gameTerminate( -1 );
	}
	else{
		button.isVisible = true;
	}
}

var eventRightAction = function( event ){
	console.log( "Right Click");

	var button = getNode( event.target, 'BUTTON' );

	if( ! gGame['gameOn']  || button.isVisible === true ){
		console.log( "gameOn is disabled");
		return;
	}
	else if( unopenedCells() === 0 ){
		timer['timeout'] = setInterval( startTimer, 1000 );
	}

	if( ! button.isFlag ){
		console.log( 'flag set');
		button.isFlag = true;
		button.isVisible = false;
		//button.style.background = "cyan";
		button.innerHTML = '<img src="media/images/flags/f5.png" />';
	}
	else{
		button.isFlag = false;
		button.isVisible = true;
		button.style.background = null;
		button.innerHTML = null
		console.log( 'flag unset');
	}
}
//Utility Functions

var createButton = function( iX, iY ){
	
	var button = document.createElement( "Button" );
	button.x = iX;
	button.y = iY;
	button.hasValue = 0;
	button.isVisible = false;
	button.isFlag = false;

	//button.style.width = button.style.height = "40px";
	//button.style.background = "white";
	//button.innerHTML = '<img src="media/images/m1.png" />';

	//Left click event
	button.onclick = function( event ){ 
		eventLeftAction( event );	 
	}

	// Right click event
	button.oncontextmenu = function( event ){
		event.preventDefault();
		eventRightAction( event );
	}
	return button;
}

var getRandomNum = function( max ){
	//Reference from MDN

	var iMin = 0;
	var iMax = Math.floor( max );

	return Math.floor( Math.random() * (iMax - iMin)) + iMin;
}

var getNum1AroundMines = function( button ){
	
	var lstPatterns = new Array( [0, -1], [0, 1], [-1, 0], [1, 0], [-1, -1], [-1, 1], [1, -1], [1, 1] );
	var iLength = lstPatterns.length;
	var lstValidCells1 = new Array();
	
    var buttonX = button.x;
    var buttonY = button.y;

	for( var iLocation = 0; iLocation < iLength; iLocation++ ){
		var iX = lstPatterns[iLocation][0] + buttonX;
		var iY = lstPatterns[iLocation][1] + buttonY;

		//console.log( "--> "+lstPatterns[iLocation][0] + " " + button.x + " " + iX );
		//console.log( "<-- "+lstPatterns[iLocation][1] + " " + button.y + " " + iY );
                    //console.log("-------------------------------")
                    //console.log("X,Y--> "+buttonX+" "+buttonY);
                    //console.log("--> "+lstPatterns[iLocation][0]+" "+lstPatterns[iLocation][1]);
                    //console.log("buttuon--> "+iX+" "+iY);
		if( isValidCell( iX, iY ) ){
			//console.log("valid :"+iX+" "+iY);
			var button = gGame['lstGrid'][iX][iY];
			//console.log( button );
			if( button.hasValue !== -1 ){
				lstValidCells1.push( button );//new Array(iX, iY) );
				//console.log( iX + " " + iY );
			}

		}

	}
	/*
	var iRandmThreshold = Math.ceil( 1/3  * lstValidCells1.length );
	for( var iCounter = 0; iCounter < iRandmThreshold; iCounter++ ){
		var iRandomIndex = getRandomInt( lstValidCells2.length );
		var iLocation = lstValidCells2[iRandomIndex];
		console.log( iLocation );
		lstRandomValidCells2.push( iLocation );
		lstValidCells2.splice( iRandomIndex, 1 );
	}
	*/
	return lstValidCells1;
}

var setNumToCell = function( lstNum, iNum ){

	//console.log( "in set Num to cell " +  iNum);

	for( var i in lstNum ){
		var button = lstNum[i];
		button.hasValue = iNum;
		button.innerHTML = iNum;
		button.style.color = 'purple';
		console.log("Num set at: " + button.x + " " + button.y );
	}
}

var setText = function( strInfo, init = 0 ){

	if( init == 1 ){

		var lstGridCoordinates = [];
		var dMine = document.getElementById( "mine" );
		dMine.innerHTML = '<img src="media/images/mines/m2.png" />' + "  " + gGame['iMinesCount'];	
	}

	var dInfo = document.getElementById( "info" );
	dInfo.innerText = "";
	dInfo.innerText = strInfo;
}

var setMineCount = function( row, col, level ){

	var iMinimumGridCells = 25;

	if( level === 1 ){
		return Math.abs( 2 * ((row * col) / iMinimumGridCells) );
	}
	else if( level === 2 ){
		return Math.abs( 4 * ((row * col) / iMinimumGridCells) );
	}
	else if( level === 3 ){
		return Math.abs( 6 * ((row * col) / iMinimumGridCells) );
	}
	else{
		setText( "Please Choose a valid level");
	}
	return 0;
}

var startTimer = function(){
	
	var timer = document.getElementById( "timer" );	
	timer.innerText = null;
	

	if( gGame['timer']['seconds'] === 59 ){
		gGame['timer']['seconds'] = 0;
		gGame['timer']['minutes'] += 1;
		
		timer.innerText = gGame['timer']['minutes'] + ":" + gGame['timer']['seconds'];
	}
	else{
		gGame['timer']['seconds'] += 1;
		timer.innerText = gGame['timer']['minutes'] + ":" + gGame['timer']['seconds'];
	}
}

var stopTimer = function(){
	clearInterval( timer['timeout'] );
}

var isValidCell = function( x, y ){

	try{
		//console.log( "--> " + gGame['lstGrid'][x][y]);

		if( (x >= 0 && x <= gGame['iMaxGridCoordinateX']) &&
			(y >= 0 && y <= gGame['iMaxGridCoordinateY']) && 
			( gGame['lstGrid'][x][y] !== undefined) ){

			return true;
		}	
	}
	catch( TypeError ){
		console.log( "TypeError: " + x + " " + y);
	}

	return false;
}

var showMines = function(){
	// Display all the mines
	
	var iMinesListLength = gGame['lstPlacedMinesLocation'].length;
	for ( var iMineLocation = 0; iMineLocation < iMinesListLength; iMineLocation++ ) {
		
		var iMine = gGame['lstPlacedMinesLocation'][iMineLocation];
		var button = gGame['lstGrid'][iMine.x][iMine.y];
		//button.isVisible = true;

		button.style.background = "red";
		button.innerHTML = '<img src="media/images/mines/m2.png" />';
		
		//button.innerText = "#";
	}
}

var getNode = function ( target, nodeName ){

	//console.log( "in getNode function");
	while( target.nodeName !== nodeName )
		target = target.parentNode;

	return target;
}

var unopenedCells = function(){
	
	var iCount = 0;

	for( var i = 0; i < gGame['iMaxGridCoordinateX']; i++ ){

		for( var j = 0; j < gGame['iMaxGridCoordinateY']; j++ ){
			var obj = gGame['lstGrid'][i][j].isVisible; //|| 'false';
			console.log( "--->obj: " + obj );
			if(  obj === true ){
				console.log( "obj: " + obj );
				iCount += 1;	
			}
		}
	}
	console.log( "Visible: " + iCount );
	return iCount;
}
//Init Function

var init = function(){

	var iGridSizeCols = 5;
	var iGridSizeRows = 5;
	
	gGame['iMaxGridCoordinateX'] = iGridSizeRows;
	gGame['iMaxGridCoordinateY'] = iGridSizeCols;
	gGame['iUnopenedCellCount'] = iGridSizeRows * iGridSizeCols;
	
	var iLevel = 1;
	gGame['iMinesCount'] = setMineCount( iGridSizeRows, iGridSizeCols, iLevel );
	

	lstGridCoordinates = createGrid( iGridSizeRows, iGridSizeCols );
	plantMines( lstGridCoordinates );
	showMines();
	setNumbersAroundMines();

	setText( "Let the game begin !", 1 );
	gGame['gameOn'] = true;
	//unopenedCells();
}

init();