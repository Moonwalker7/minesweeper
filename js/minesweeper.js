
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

//Event Functions

var eventLeftAction = function( event ){
	console.log( "Left Click");
}

var eventRightAction = function( event ){
	console.log( "Right Click");
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

var setText = function( strInfo ){

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
		button.isVisible = true;

		button.style.background = "red";
		button.innerHTML = '<img src="media/images/m2.png" />';
		
		//button.innerText = "#";
	}
}

//Init Function

var init = function(){

	var iGridSizeCol = 5;
	var iGridSizeRow = 5;
	var lstGridCoordinates = [];
	
	var dMine = document.getElementById( "mine" );

	timer['timeout'] = setInterval( startTimer, 1000 );
	gGame['iMinesCount'] = setMineCount( iGridSizeRow, iGridSizeCol, 1 );
	dMine.innerText = gGame['iMinesCount'];

	lstGridCoordinates = createGrid( iGridSizeRow, iGridSizeCol );
	plantMines( lstGridCoordinates );
	showMines();
	setText( "Let the game begin !" );
}

init();