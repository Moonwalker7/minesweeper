
var gGame = {

	'bGameOn' : false,
	'iMinesCount' : 0,
	'iMaxGridCoordinateX' : 0,
	'iMaxGridCoordinateY' : 0,
	'lstGrid' : [],
	'lstPlacedMinesLocation' : [],
	'timer' : {
		'minutes' : 0,
		'seconds' : 0
		} 

};


//Main Functions

var createGrid = function( iGridSizeRow, iGridSizeCol ){

	var lstGridCoordinates = [];
	var divGrid = document.getElementById( "dGrid" );
	divGrid,innerText = "";

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

	return lstGridCoordinates;
}

//Event Functions

//Utility Functions

var createButton = function( iX, iY ){
	
	var button = document.createElement( "Button" );
	button.x = iX;
	button.y = iY;
	button.hasValue = 0;
	button.isVisible = false;
	button.isFlag = false;

	button.style.width = button.style.height = "25px";
	button.style.background = "white";

	//Left click event
	button.onclick = function( event ){ 
	 
	}

	// Right click event
	button.oncontextmenu = function( event ){
		event.preventDefault();
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

//Init Function

var init = function(){

	var iGridSizeCol = 20;
	var iGridSizeRow = 20;
	var lstGridCoordinates = [];
	var dMine = document.getElementById( "mine" );

	gGame['iMinesCount'] = setMineCount( iGridSizeRow, iGridSizeCol, 1 );
	dMine.innerText = gGame['iMinesCount'];
	lstGridCoordinates = createGrid( iGridSizeRow, iGridSizeCol );
	setText( "Let the game begin !" );
}

init();