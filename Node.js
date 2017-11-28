let totalNumberOfSimulations = 0;
const columns = 3;
const rows = 3;
const titles = 9;

var SOLVED_PUZZLE = [[1,2,3],[4,5,6],[7,8,9]];

const blockTitlesRows = [SOLVED_PUZZLE[0]];

class Node {
  constructor(state, action, parentNode) {
    this.leafNode = true;
    this.childrenNodes = [];
    this.visited = 0;
    this.totalScore = 0;
    this.state = state;
    this.action = action;
    this.parentNode = parentNode || null;
    totalNumberOfSimulations++;
  }

  setLeafNode (bool) {
    this.leafNode = bool;
  }

  setChildrenNodes (childrenNodes) {
    this.childrenNodes = childrenNodes;
  }

  setTotalScore (value) {
    this.totalScore = value;
  }

  setVisited (visited) {
    this.visited = visited
  }

  calculateUCB() {
    const t = this.totalScore;
    const n = this.visited;
    return (t/n) + (2*Math.cbrt(Math.log(totalNumberOfSimulations)/n)) || 999999999999;
  }
  // return expanded node
  expand(node, lastMove) {
    const possibleMoves = this.getPossibleMoves(node, lastMove);
    // setting childern nodes
    node.childrenNodes = possibleMoves
    node.setLeafNode(false);
    const r = Math.random();
    const nodeLength = node.childrenNodes.length -1;
    const random = Math.floor(r * nodeLength);
    return node.childrenNodes[random]; // chose randomly
  }

  // return snewArrpuzzleArraytate after move
  moveTitle(id, arr) {
    const puzzleArray = arr;
    const blankTitle = titles;
		var zeroTitlePosition = this.localizeTitleActualPosition(blankTitle, arr.slice(0))//this.findTitlePosition(blankTitle, puzzleArray);
		var titleToSwitchPosition = this.localizeTitleActualPosition(id, puzzleArray);//this.findTitlePosition(id, puzzleArray);

		if (this.isTitleNextToEachother(zeroTitlePosition,titleToSwitchPosition)) {
				puzzleArray[zeroTitlePosition.row][zeroTitlePosition.column] = parseInt(id);
				puzzleArray[titleToSwitchPosition.row][titleToSwitchPosition.column] = parseInt(blankTitle);
		}

    return puzzleArray;
	}

  isTitleNextToEachother(zeroTitlePosition, titleToSwitchPosition) {
		return  (zeroTitlePosition.column+1 == titleToSwitchPosition.column && zeroTitlePosition.row == titleToSwitchPosition.row ) ||
        		(zeroTitlePosition.column-1 == titleToSwitchPosition.column && zeroTitlePosition.row == titleToSwitchPosition.row ) ||
						(zeroTitlePosition.row-1 == titleToSwitchPosition.row && zeroTitlePosition.column == titleToSwitchPosition.column ) ||
						(zeroTitlePosition.row+1 == titleToSwitchPosition.row && zeroTitlePosition.column == titleToSwitchPosition.column );
	}

  findTitlePosition(titleNumber, puzzleArray) {
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
  // return Array of Nodes
  getPossibleMoves(node, lastMove) {
    var blankTitle = titles;
    const puzzleArray = node.state;
    var actualPosition = this.localizeTitleActualPosition(blankTitle, puzzleArray);
    var blockedMoves = [];

    for (var i = 0; i < rows; i++) {
      if (JSON.stringify(node.state[i])==JSON.stringify(blockTitlesRows[i])) {
        blockedMoves = [...blockedMoves, ...node.state[i]];
      }
    }

    var upperTitle = {row: actualPosition.row-1,  column: actualPosition.column};
    var downTitle = {row: actualPosition.row+1,  column: actualPosition.column};
    var leftTitle = {row: actualPosition.row,  column: actualPosition.column-1};
    var rightTitle = {row: actualPosition.row,  column: actualPosition.column+1};

    var titlesPositionsArray = [upperTitle, leftTitle, downTitle, rightTitle]; // pozycje Title
    titlesPositionsArray = titlesPositionsArray.filter(function (title) {
      return typeof(puzzleArray[title.row]) != 'undefined' && typeof(puzzleArray[title.row][title.column]) != 'undefined'
      && lastMove != puzzleArray[title.row][title.column]
      && blockedMoves.indexOf(puzzleArray[title.row][title.column]) == -1;
    }).map((title) => {
      const newArr = JSON.parse(JSON.stringify(puzzleArray)); // slice() not working It was passing by reference :/
      const id = newArr[title.row][title.column];
      const newNode = node.childrenNodes.find(n=> n.action === id) || new Node(this.moveTitle(id, newArr), id, node);
      // const newNode = new Node(this.moveTitle(id, newArr), id, node);
      return newNode;
    });
    return titlesPositionsArray;
  }
  // node => valueOfState
  evaluateStateHeuristic(node) {
    let valueOfState = 0;
    let max = titles*rows;
    let matching = 0;

    const originalStateMapToCords = SOLVED_PUZZLE.map(rows => {
      return rows.map(col => {
        return this.localizeTitleActualPosition(col, SOLVED_PUZZLE)
      })
    })
    const currentStateMapToCords = node.state.map(rows => {
      return rows.map(col => {
        return this.localizeTitleActualPosition(col, node.state)
      })
    })

    for (var i = 0; i < rows; i++) {
			for (var ii = 0; ii < columns; ii++) {
          if(SOLVED_PUZZLE[i][ii] === node.state[i][ii]){
            matching++;
          }
          const current = this.localizeTitleActualPosition(SOLVED_PUZZLE[i][ii], node.state) // curent position needs to match original titles
          valueOfState += Math.abs(originalStateMapToCords[i][ii].row - currentStateMapToCords[current.row][current.column].row)
    			valueOfState += Math.abs(originalStateMapToCords[i][ii].column - currentStateMapToCords[current.row][current.column].column)
			};
		};

    if (matching == titles) {
      console.log('rozwiazanie');
      return 99;
    }

    return 36-valueOfState;
  }

  simulate(node) {
    // get random move
    // while( gameIsNot finished)
    const maxValue = 99;// CHECK IT BUT is suppose to beok every title has max 6 moves to get to the futhest 6*15
    let currentNode = Object.create(node);
    let index = 100 // if you not going to win within 100 moves you are loser
    while(!this.terminalState(currentNode.state)) {
        if (index === 0) {
          return this.evaluateStateHeuristic(currentNode);
        }
        const avaliableMoves = this.getPossibleMoves(node, titles)

 			  currentNode.setChildrenNodes(avaliableMoves);
        const r = Math.random();
        const nodeLength = currentNode.childrenNodes.length -1;
        const random = Math.floor(r * nodeLength);// (max - min) + min;
        currentNode = currentNode.childrenNodes[random];
        index--;
    }
    // if (index<200) {
    //   return maxValue
    // }
    return 99;
  }

  terminalState (state) {
    return this.arraysEqual(state, SOLVED_PUZZLE);
  }

  arraysEqual(a1,a2) {
    /* WARNING: arrays must not contain {objects} or behavior may be undefined */
    return JSON.stringify(a1)==JSON.stringify(a2);
  }

  localizeTitleActualPosition(titleID, puzzleArray) {
		for (var i = 0; i < rows; i++) {
			for (var ii = 0; ii < columns; ii++) {
				if(titleID == puzzleArray[i][ii]){
					return {row:i, column:ii};
				}
			};
		};
	}
  // return number to change
  getBestMove(childrenNodes) {
    const biggestValue = childrenNodes.map((node)=> {
      return node.calculateUCB();
    }).reduce(function(a, b, i, arr) {
      return Math.max(a, b)
    });
    const newNode = childrenNodes.find(function(node){
      return node.calculateUCB() == biggestValue
    })
    return newNode;
  }

  getMCTSMove(node) {
    const biggestValue = node.childrenNodes.map((node)=> {
      return node.totalScore;
    }).reduce(function(a, b, i, arr) {
      return Math.max(a, b)
    });
    const newNode = node.childrenNodes.find(function(node){
      return node.totalScore == biggestValue
    })
    return newNode.action;
  }

}
