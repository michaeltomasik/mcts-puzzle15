jQuery(document).ready(function(){

	var titles = 16;
	var blankTitle = 16;
	var startPosition = 10;
	var rows = 4;
	var columns = 4;
	var titleSize = 100; // 100 x 100 rectangle
	var currentRowPosition = 0;
	var currentColumnPosition = 0;
	var puzzleName = "puzzle15";
	var SOLVED_PUZZLE = [[1,2,3,4],[5,6,7,8],[9,10,11,12],[13,14,15,16]];

	var orginalTitlePositionMap = {};
	// FIND POSITION
	$.map( SOLVED_PUZZLE, function( row, index ) {
		var column = row.length;
		for (var i = 0; i < column; i++) {
			orginalTitlePositionMap[row[i]] = { row: index, column: i}
		}
	});
	// puzzle Object we modifing
	var puzzleArray = $.extend(true, [], SOLVED_PUZZLE); //creating deep copy

	start();

//EVENTS HANDLERS
	$('#random').click(function() {
	    createRandomBoard();
	    renderBoard();
	});

	$('#AI').click(function() {
	    solvePuzzle();
	});

	function refreshDOM() {
		setOnClickBlockDOM();
	}

	function setOnClickBlockDOM() {
		$('.block').click(function() {
			var blockId = $(this).attr('id');
		    moveTitle(blockId);
		    renderBoard();
				mcts();
		});
	}

//FUNCTIONS
	function start() {
		renderBoard();
		for (var i = 1; i <= numRandoms; i++) {
			console.log(makeUniqueRandom());
		};
		console.log(puzzleArray);
	}

	function solvePuzzle() {
		var titlesArray = [];
		var i = 1;
		//for (var i = 1; i < titles; i++) {
			var route = getShortestRoute();
			console.log(route);
			moveTitle(puzzleArray[route.row][route.column]);
			renderBoard();
			console.log(i+': '+route);
		//}

		console.log( orginalTitlePositionMap, 'juz', SOLVED_PUZZLE);
	}

	function localizeTitleStartPosition(titleID) {
		for (var i = 0; i < rows; i++) {
			for (var ii = 0; ii < columns; ii++) {
				if(titleID == SOLVED_PUZZLE[i][ii]){
					return {row:i, column:ii};
				}
			};
		};
	}

	function localizeTitleActualPosition(titleID) {
		for (var i = 0; i < rows; i++) {
			for (var ii = 0; ii < columns; ii++) {
				if(titleID == puzzleArray[i][ii]){
					return {row:i, column:ii};
				}
			};
		};
	}

	function mcts() {
		 // get avaliable moves
			 var actualPosition = localizeTitleActualPosition(blankTitle);
			 console.log(actualPosition);
			 var upperTitle = {row: actualPosition.row-1,  column: actualPosition.column};
			 var downTitle = {row: actualPosition.row+1,  column: actualPosition.column};
			 var leftTitle = {row: actualPosition.row,  column: actualPosition.column-1};
			 var rightTitle = {row: actualPosition.row,  column: actualPosition.column+1};

			 var titlesPositionsArray = [upperTitle, leftTitle, downTitle, rightTitle]; // pozycje Title
			 titlesPositionsArray = titlesPositionsArray.filter(function (title) {
				 return typeof(puzzleArray[title.row]) != 'undefined' && typeof(puzzleArray[title.row][title.column]) != 'undefined';
			 }).map((title) => puzzleArray[title.row][title.column]);
		 // get avaliable moves
     let rootNode = new Node();
     rootNode.leafNode = false;
     rootNode.childrenNodes = [new Node(), new Node()]
     // terminal condition
     if(puzzleArray === SOLVED_PUZZLE) {
       console.log('FUCK YEAAAH');
     }
     let currentNode = rootNode;
		 // while(!currentNode.leafNode) {
       const biggestValue = currentNode.childrenNodes.reduce(function(a, b, i, arr) {
         console.log(a.calculateUCB(), b.calculateUCB());
         return Math.min(a.calculateUCB(), b.calculateUCB())
       });
       const newNode = currentNode.childrenNodes.find(function(node){
         console.log(node.calculateUCB(), biggestValue);
         return node.calculateUCB() == biggestValue
       })
     // }
     // Extention of all possible choices

		 debugger;
	}

	// function getShortestRoute() {
	//  var actualPosition = localizeTitleActualPosition(16);
	//  console.log(actualPosition);
	//  var upperTitle = {row: actualPosition.row-1,  column: actualPosition.column};
	//  var downTitle = {row: actualPosition.row+1,  column: actualPosition.column};
	//  var leftTitle = {row: actualPosition.row,  column: actualPosition.column-1};
	//  var rightTitle = {row: actualPosition.row,  column: actualPosition.column+1};
	//  var titlesPositionsArray = [upperTitle, leftTitle, downTitle, rightTitle]; // pozycje Title
	//  titlesPositionsArray = shuffle(titlesPositionsArray);
	//  var shortest = null;
	//  var returnTitle = {};
  //
	//  $.map( titlesPositionsArray, function (title){
	// 	 if (title.row > 0 && title.column > 0) {
	// 		 var testArray = $.extend(true, [], puzzleArray);
	// 		 console.log(testArray, title);
	// 		 var testTitle = testArray[title.row-1][title.column-1];
	// 		 var testedArray = heuristicMoveTitle(testArray, testTitle);
	// 		 var route = evaluateHeuristic(testedArray);
	// 		 console.log('evaluateHeuristic',route);
	// 		if(route < shortest || shortest === null) {
	// 			shortest = route;
	// 			returnTitle = title;
	// 		}
	// 	}
	//  });
  //
	// return returnTitle;
	// }
  //
	// function evaluateHeuristic(estimatedBoardPosition) {
	// 	var estimatedHeuristic = 0;
	// 	for (var i = 0; i < rows; i++) {
	// 		for (var ii = 0; ii < columns; ii++) {
	// 			if(estimatedBoardPosition[i][ii] != SOLVED_PUZZLE[i][ii]){ //dla kazdego co sie nei zgadza
	// 				var titleID = estimatedBoardPosition[i][ii] //biore id
	// 				var actualPosition = localizeTitleActualPosition(titleID); // znajduje jego pozycje
	// 				var targetPosition = orginalTitlePositionMap[titleID]; // znajduje orginalna pozycje
  //
	// 				estimatedHeuristic = estimatedHeuristic +      // Licze heurystyke dla danego ID
	// 					Math.abs(actualPosition.column - targetPosition.column) +
	// 				  Math.abs(actualPosition.row - targetPosition.row);
	// 			}
	// 		};
	// 	};
	// 	return estimatedHeuristic;
	// }
  //
	// function heuristicMoveTitle(testedArray, id) {
	// 	var zeroTitlePosition = findTitlePosition(16);
	// 	var titleToSwitchPosition = findTitlePosition(id);
  //
	// 	if (isTitleNextToEachother(zeroTitlePosition,titleToSwitchPosition)) {
	// 			testedArray[zeroTitlePosition[0]][zeroTitlePosition[1]] = id;
	// 			testedArray[titleToSwitchPosition[0]][titleToSwitchPosition[1]] = 16;
	// 	}
	// 	return testedArray;
	// }

	var uniqueRandoms = [];
	var numRandoms = 16;
	function makeUniqueRandom() {
	    // refill the array if needed
	    if (!uniqueRandoms.length) {
	        for (var i = 1; i <= numRandoms; i++) {
	            uniqueRandoms.push(i);
	        }
	    }
	    var index = Math.floor(Math.random() * uniqueRandoms.length);
	    var val = uniqueRandoms[index];

	    // now remove that value from the array
	    uniqueRandoms.splice(index, 1);

	    return val;
	}

	function createRandomBoard(){
		$('.'+puzzleName).empty();
		for (var i = 1; i <= titles; i++) {
			var randomNumber = makeUniqueRandom();
				puzzleArray[currentRowPosition][currentColumnPosition] = randomNumber;
				currentColumnPosition++;
				if((i % columns) == 0) {
					currentRowPosition++;
					currentColumnPosition = 0;
				}
		}
		currentRowPosition = 0;
		currentColumnPosition = 0;
		uniqueRandoms = []

		console.log(puzzleArray);
	}

	function renderBoard() {
		$('.'+puzzleName).empty();
		for (var i = 1; i <= titles; i++) {
			var titleNumber = puzzleArray[currentRowPosition][currentColumnPosition];
			if(i==1){
				$('.'+puzzleName).append('<div id="block'+titleNumber+'" class="block" >'+titleNumber+'</div>');
				currentColumnPosition++;
			}
			else{
				var x = startPosition + currentColumnPosition * titleSize;
				var y = startPosition + currentRowPosition * titleSize;
				$('.'+puzzleName).append('<div id="block'+titleNumber+'" class="block" style="left:'+x+'; top:'+y+';" >'+titleNumber+'</div>');

				currentColumnPosition++;
				if((i % columns) == 0) {
					currentRowPosition++;
					currentColumnPosition = 0;
				}
			}
		}
		currentRowPosition = 0;
		currentColumnPosition = 0;
		uniqueRandoms = []

		refreshDOM();

	}

	function moveTitle(blockId) {
		var id = blockId.replace('block','');
		var zeroTitlePosition = findTitlePosition(blankTitle);
		var titleToSwitchPosition = findTitlePosition(id);

		if (isTitleNextToEachother(zeroTitlePosition,titleToSwitchPosition)) {
				puzzleArray[zeroTitlePosition[0]][zeroTitlePosition[1]] = parseInt(id);
				puzzleArray[titleToSwitchPosition[0]][titleToSwitchPosition[1]] = parseInt(blankTitle);
		}

		console.log(puzzleArray);
	}

	//validate if titles are next to each other You cant move accorss
	function isTitleNextToEachother(zeroTitlePosition, titleToSwitchPosition) {
		return  (zeroTitlePosition[1]-1 == titleToSwitchPosition[1] && zeroTitlePosition[0] == titleToSwitchPosition[0] ) ||
						(zeroTitlePosition[1]+1 == titleToSwitchPosition[1] && zeroTitlePosition[0] == titleToSwitchPosition[0] ) ||
						(zeroTitlePosition[0]-1 == titleToSwitchPosition[0] && zeroTitlePosition[1] == titleToSwitchPosition[1] ) ||
						(zeroTitlePosition[0]+1 == titleToSwitchPosition[0] && zeroTitlePosition[1] == titleToSwitchPosition[1] );
	}

	function findTitlePosition(titleNumber) {
		var result = [];
		for (var i = 1; i <= titles; i++) {

			if(puzzleArray[currentRowPosition][currentColumnPosition] == titleNumber) {
				result[0]=currentRowPosition;
				result[1]=currentColumnPosition;
			}
			currentColumnPosition++;
			if((i % columns) == 0) {
				currentRowPosition++;
				currentColumnPosition = 0;
			}
		}
		currentRowPosition = 0;
		currentColumnPosition = 0;
		return result;
	}
});

function shuffle(array) {
    let counter = array.length;

    // While there are elements in the array
    while (counter > 0) {
        // Pick a random index
        let index = Math.floor(Math.random() * counter);

        // Decrease counter by 1
        counter--;

        // And swap the last element with it
        let temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }

    return array;
}
