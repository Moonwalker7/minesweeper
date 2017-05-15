
var gGame = {

	'gameOn' : false,
	'iMinesCount' : 0,
	'iMaxGridCoordinateX' : 0,
	'iMaxGridCoordinateY' : 0,
	'lstGrid' : [],
	'iFlagsCount' : 0,
	'lstPlacedMinesLocation' : [],
	'iUnopenedCellCount' :{
		'totalCells' : 0,
		'iFlag' : false
	},
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
	var lstPatterns = new Array( [0, -1], [0, 1], [-1, 0], [1, 0], [-1, -1], [-1, 1], [1, -1], [1, 1] );
	var iLength = lstPatterns.length;

	for( var x = 0; x < gGame['iMaxGridCoordinateX']; x++ ){

		for( var y = 0; y < gGame['iMaxGridCoordinateY']; y++ ){

			var iCell = gGame['lstGrid'][x][y];

			console.log( iCell.x + " " + iCell.y);

			var iValid = 0;
			var iMinesAround = 0;
			for( var iLocation = 0; iLocation < iLength; iLocation++ ){
				var iX = lstPatterns[iLocation][0] + iCell.x
				var iY = lstPatterns[iLocation][1] + iCell.y;

				if( isValidCell( iX, iY ) ){
					//console.log("valid :"+iX+" "+iY);
					var button = gGame['lstGrid'][iX][iY];
					iValid += 1;
					//console.log("iValid: " + iValid);
					if( button.hasValue === -1 ){
						//lstValidCells1.push( button );//new Array(iX, iY) );
						console.log( "Mine at: " +iX + " " + iY );
						iMinesAround += 1;
						console.log( "Mines count added" ); 
					}
				}
			}

			if( iMinesAround !== 0  && iCell.hasValue !== -1 ){
				iCell.hasValue = iMinesAround;
				//iCell.innerHTML = iMinesAround;
			}
		}
	}
}

var revealCells = function( object ){

	var lstReveal = new Array();
	var lstPatterns = new Array( [0, -1], [0, 1], [-1, 0], [1,0] );

	lstReveal.push( object );
	while( lstReveal.length != 0 ){
		//console.log("inside reveal cells while");

		var button = lstReveal.pop();
	

		for( var i = 0; i < lstPatterns.length; i++ ){
			
			//console.log("inside reveal cells for");

			var iX = lstPatterns[i][0] + button.x;
			var iY = lstPatterns[i][1] + button.y;

			//console.log( iX + " " + iY + " , " + button.x + " " + button.y  + " " + 'valid: ' + isValidCell(iX, iY) + " Value: " +  button.hasValue + " " + button.isVisible);
			if( isValidCell(iX, iY ) && button.hasValue !== -1  && button.isVisible === false ){
				//console.log("inside reveal cells if 1" );
				var nxtBlankButton = gGame['lstGrid'][iX][iY]

				//console.log("inside reveal cells if1: " + nxtBlankButton.x + " " + nxtBlankButton.y );
				if( nxtBlankButton.hasValue >= 1 && nxtBlankButton.isFlag === false ){
					//console.log("inside reveal cells if 2");	
					nxtBlankButton.isVisible = true;
					nxtBlankButton.innerText = nxtBlankButton.hasValue;
					if( nxtBlankButton.hasValue === 1 )
						nxtBlankButton.style.color = 'purple';
					else
						nxtBlankButton.style.color = 'green';
					nxtBlankButton.style.background = "grey";
				}
				else{

					lstReveal.push( nxtBlankButton );
				}
			}

		}

		button.isVisible = true;
		button.isFlag = false;
		button.style.background = 'grey';
	}
}

var gameTerminate = function( iFlag = -2 ){

	stopTimer();
	gGame['gameOn'] = false;
	var dStartBtn = document.getElementById( "btnStartGame" );
	dStartBtn.innerHTML = "<h2>" + "Play Again" + "</h2>";
	dStartBtn.style.visibility = 'visible';
	gGame['iUnopenedCellCount']['iFlag'] = false;

	if( iFlag === -1 ){

		console.log("isMine" + "\n" + "Game Over :(" );
		showMines( -1 );//send an image path.
		//button.style.background = 'yellow';// change this to coloring only the outline of the clicked mine button
		setText("Game Over :(");
		
	}
	else if( iFlag === 0 ){
		showMines( 0 );
		//button.style.background = 'yellow';//same as above
		setText("Game Won :)");
	}
	console.clear();
}

//Event Functions

var eventLeftAction = function( event ){
	console.log( "Left Click");	

	var button = getNode( event.target, 'BUTTON' );


	if( ! gGame['gameOn'] || button.isVisible === true ){
		console.log( "gameOn is disabled or button is visible");
		return;
	}
	else if( button.isFlag ){
		console.log("exiting left click function, flag is set ");
		//setText( "Flag is already set" );
		return;
	}
	
	if( gGame['iUnopenedCellCount']['iFlag'] === false && unopenedCells() === 0 ){
		timer['timeout'] = setInterval( startTimer, 1000 );
		var dStartBtn = document.getElementById( "btnStartGame" );
		dStartBtn.style.visibility = 'visible';
		dStartBtn.innerHTML = "<h2>" + "Restart Game" + "</h2>";
		gGame['iUnopenedCellCount']['iFlag'] = true;
	}

	operations( button );		
}

var eventRightAction = function( event ){
	console.log( "Right Click");

	event.preventDefault();
	
	var button = getNode( event.target, 'BUTTON' );
	var dFlag = document.getElementById( "flag" );

	if( ! gGame['gameOn']  || button.isVisible === true ){
		console.log( "gameOn is disabled");
		return;
	}
	else if( gGame['iUnopenedCellCount']['iFlag'] === false && unopenedCells() === 0 ){
		timer['timeout'] = setInterval( startTimer, 1000 );
		var dStartBtn = document.getElementById( "btnStartGame" );
		dStartBtn.style.visibility = 'visible';
		gGame['iUnopenedCellCount']['iFlag'] = true;
		dStartBtn.innerHTML = "<h2>" + "Restart Game" + "</h2>";
	}

	if( ! button.isFlag ){
		console.log( 'flag set');
		button.isFlag = true;
		//button.isVisible = false;
		//button.style.background = "cyan";
		gGame['iFlagsCount'] += 1;
		button.innerHTML = '<img src="media/images/flags/f4.png" />';
		dFlag.innerHTML = '<img src="media/images/flags/f12.png" />' + "  " + gGame['iFlagsCount'];
	}
	else{
		button.isFlag = false;
		gGame['iFlagsCount'] -= 1;
		//button.isVisible = true;
		button.style.background = null;
		button.innerHTML = null
		dFlag.innerHTML = '<img src="media/images/flags/f12.png" />' + "  " + gGame['iFlagsCount'];
		console.log( 'flag unset');
	}
}
//Utility Functions

var operations = function( button ){

	button.oncontextmenu = function(){ event.preventDefault(); }

	if( button.hasValue === -1 ){
		gameTerminate( -1 );
	}
	else{

		if( button.hasValue === 0 ){
			//console.log("reveal");
			revealCells( button );
		}
		else if( button.hasValue >= 1 ){
			button.isVisible = true;
			button.innerText = button.hasValue;
			if( button.hasValue === 1 )
				button.style.color = 'purple';
			else
				button.style.color = 'green';
			
			button.style.background = 'grey';
		}
		
		var unopened = Math.abs( (gGame['iUnopenedCellCount']['totalCells']) - unopenedCells() );
		console.log("unopened: " + unopened );
		if (unopened === gGame['iMinesCount']){
			console.log("Game Won");
			gameTerminate( 0 );
		}
	}
}

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

var setText = function( strInfo, init = 0 ){

	if( init == 1 ){

		var lstGridCoordinates = [];
		gGame['timer']['minutes'] = 0;
		gGame['timer']['seconds'] = 0;
		gGame['timer']['timeout'] = 0;

		var dMine = document.getElementById( "mine" );
		dMine.innerHTML = '<img src="media/images/mines/m2.png" />' + "  " + gGame['iMinesCount'];

		var dFlag = document.getElementById( "flag" );
		dFlag.innerHTML = '<img src="media/images/flags/f12.png" />' + "  " + gGame['iFlagsCount'];

		var dTimer = document.getElementById( "timer" );
		timer.innerText = gGame['timer']['minutes'] + ":" + gGame['timer']['seconds'];
	}

	var dInfo = document.getElementById( "info" );
	dInfo.innerText = "";
	dInfo.innerText = strInfo;
}

var setMineCount = function( row, col, level ){

	console.log( "--->iLevel: " + level );
	var iMinimumGridCells = 25;
	var iMines = 0;

	if( level === 1 ){
		iMines = ( 2 * ((row * col) / iMinimumGridCells));
	}
	else if( level === 2 ){
		iMines = ( 4 * ((row * col) / iMinimumGridCells));
	}
	else if( level === 3 ){
		iMines = ( 6 * ((row * col) / iMinimumGridCells));
	}
	else{
		setText( "Please Choose a valid level");
	}

	return Math.ceil( iMines );
}

var startTimer = function(){
	
	var timer = document.getElementById( "timer" );	
	timer.innerText = null;
	

	if( gGame['timer']['minutes'] === 10 ){
		setText( "Time Out!");
		gameTerminate();
		return;
	}

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
	gGame['timer']['minutes'] = 0;
	gGame['timer']['seconds'] = 0;
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
		//console.log( "TypeError: " + x + " " + y);
	}

	return false;
}

var showMines = function( iFlag = null ){
	// Display all the mines
	
	var iMinesListLength = gGame['lstPlacedMinesLocation'].length;
	for ( var iMineLocation = 0; iMineLocation < iMinesListLength; iMineLocation++ ) {
		
		var iMine = gGame['lstPlacedMinesLocation'][iMineLocation];
		var button = gGame['lstGrid'][iMine.x][iMine.y];
		//button.isVisible = true;
		if( iFlag === -1 ){
			button.style.background = "red";
		}
		else if( iFlag === 0 ){
			button.style.background = "blue";	
		}
		else{
			button.style.background = "green";	
		}

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
	gGame['iUnopenedCellCount']['iFlag'] = true;
	
	for( var i = 0; i < gGame['iMaxGridCoordinateX']; i++ ){

		for( var j = 0; j < gGame['iMaxGridCoordinateY']; j++ ){
			var obj = gGame['lstGrid'][i][j].isVisible; //|| 'false';
			//console.log( "--->obj: " + obj );
			if(  obj === true ){
				//console.log( "obj: " + obj );
				iCount += 1;	
			}
		}
	}
	console.log( "Visible: " + iCount );
	return iCount;
}

var setupGame = function( iGridSizeRows, iGridSizeCols, iLevel ){

	var lstGridCoordinates = [];
	console.log( "-->iLevel: " + iLevel );
	gGame['gameOn'] = false;
	gGame['iMaxGridCoordinateX'] = iGridSizeRows;
	gGame['iMaxGridCoordinateY'] = iGridSizeCols;
	gGame['iUnopenedCellCount']['iFlag'] = false;
	stopTimer();
	gGame['iFlagsCount'] = 0;

	gGame['iUnopenedCellCount']['totalCells'] = iGridSizeRows * iGridSizeCols;
	gGame['iMinesCount'] = setMineCount( iGridSizeRows, iGridSizeCols, iLevel );
	console.log( "mines: " + gGame['iMinesCount']);

	lstGridCoordinates = createGrid( iGridSizeRows, iGridSizeCols );
	plantMines( lstGridCoordinates );
	setNumbersAroundMines();
}

//Init Function

var init = function(){

	var iGridSizeCols = 7;
	var iGridSizeRows = 6;
	var iLevel = -1;
	
	var dLevel = document.getElementById( "levelList" );
	iLevel = parseInt( dLevel.options[dLevel.selectedIndex].value );
	console.log( "Game Difficulty Level Selected: " + iLevel );

	setupGame( iGridSizeRows, iGridSizeCols, iLevel );	
	//showMines();
	setText( "Let the game begin !", 1 );
	dStartBtn.style.visibility = 'hidden';
	gGame['gameOn'] = true;
}

var dStartBtn = document.getElementById( "btnStartGame" );
dStartBtn.oncontextmenu = function( event ){ event.preventDefault(); }

dStartBtn.onclick = function(){
	
	init();
	stopTimer();
}

dStartBtn.click();

/*
2. set text as per user events
5. Add tooltip wherever needed
7. Check the start and stop timer
10. Add an icon in the tab
12. Loading icon

*/


/*
setNumAroundMines ( N steps from a mine)
var setNumbersAroundMines = function(){

	var iLength = gGame['lstPlacedMinesLocation'].length;
	
	
	for( var i = 0; i < iLength; i++ ){
		var iMine = gGame['lstPlacedMinesLocation'][i]
	
		var lstNum1 = getNum1AroundMines( gGame['lstGrid'][iMine.x][iMine.y] );
		setNumToCell( lstNum1, 1 );
		var lstNum2 = getNum2AroundMines( gGame['lstGrid'][iMine.x][iMine.y] );
		setNumToCell( lstNum2, 2 );
	}
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
	
	return lstValidCells1;
}

var getNum2AroundMines = function( button ){
	
	var lstPatterns = new Array( [-2, 0], [-1, -1], [0, -2], [1, -1], [2, 0], [1, 1], [0, 2], [-1, 1] );
	var iLength = lstPatterns.length;
	var lstValidCells2 = new Array();
	var lstRandomValidCells2 = new Array();
    var buttonX= button.x;
    var buttonY= button.y;

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
				lstValidCells2.push( button );//new Array(iX, iY) );
				//console.log( iX + " " + iY );
			}

		}

	}

	var iRandmThreshold = Math.ceil( 1/3  * lstValidCells2.length );
	for( var iCounter = 0; iCounter < iRandmThreshold; iCounter++ ){
		var iRandomIndex = getRandomNum( lstValidCells2.length );
		var iLocation = lstValidCells2[iRandomIndex];
		//console.log( iLocation );
		lstRandomValidCells2.push( iLocation );
		lstValidCells2.splice( iRandomIndex, 1 );
	}

	return lstRandomValidCells2;
}

var setNumToCell = function( lstNum, iNum ){

	//console.log( "in set Num to cell " +  iNum);
	//var colorArray = [ "purple", "blue", "orange"];

	for( var i in lstNum ){
		var button = lstNum[i];
		button.hasValue = iNum;
		//button.innerHTML = iNum;
		//button.style.color = colorArray[iNum-1];
		//console.log("Num set at: " + button.x + " " + button.y );
	}
}

*/