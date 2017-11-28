jQuery(document).ready(function(){

	var titles = 9;
	var blankTitle = 9;
	var startPosition = 10;
	var rows = 3;
	var columns = 3;
	var titleSize = 100; // 100 x 100 rectangle
	var currentRowPosition = 0;
	var currentColumnPosition = 0;
	var puzzleName = "puzzle15";
	var SOLVED_PUZZLE = [[1,2,3],[4,5,6],[7,8,9]];
  var lastMove = 9;

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
    var pollTimer = window.setInterval(function() {
      if (JSON.stringify(puzzleArray)!=JSON.stringify(SOLVED_PUZZLE)) {
        solvePuzzle();
      }
    }, 10);
	});

	function refreshDOM() {
		setOnClickBlockDOM();
	}

	function setOnClickBlockDOM() {
		$('.block').click(function() {
			var blockId = $(this).attr('id');
		    moveTitle(blockId);
  	    renderBoard();
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
    const getTitleIdToMove = mcts(puzzleArray);
    lastMove = getTitleIdToMove
    const titleId = 'block'+getTitleIdToMove
    moveTitle(titleId);
    renderBoard();
	}

	function mcts(state) {

     var n_moves = 0;
     let rootNode = new Node(state, titles, null);
     let iterations = 150;
     while(iterations){
       let childNode = rootNode;
       while(!terminalState(childNode.state)) {
         if(childNode.leafNode) {
           childNode = childNode.expand(childNode, lastMove);
           break;
         } else {
           const possibleMoves = childNode.getPossibleMoves(childNode, lastMove);
           childNode.setLeafNode(false);
           childNode = childNode.getBestMove(possibleMoves);

         }
       }

       if (childNode.totalScore !== 0) {
         const possibleMoves = childNode.getPossibleMoves(childNode, lastMove);
         childNode.setLeafNode(false);
         childNode = childNode.getBestMove(possibleMoves);
       }
       let delta = childNode.simulate(childNode);

       while (childNode) {
         childNode.setVisited(childNode.visited + 1);
         childNode.setTotalScore(delta+childNode.totalScore);
         if(childNode.parentNode === null){
           rootNode = childNode;
         }
         childNode = childNode.parentNode;
       }
       iterations--;
     }

     const move = rootNode.getMCTSMove(rootNode);
     return move;
	}

  function terminalState (state) {
    return arraysEqual(state, SOLVED_PUZZLE);
  }

  function arraysEqual(a1,a2) {
    /* WARNING: arrays must not contain {objects} or behavior may be undefined */
    return JSON.stringify(a1)==JSON.stringify(a2);
}

	var uniqueRandoms = [];
	var numRandoms = titles;
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
