let totalNumberOfSimulations = 0;
const columns = 4;
const rows = 4;
const titles = 16

class Node {
  constructor(state, action) {
    this.leafNode = true;
    this.childrenNodes = [];
    this.visited = 0;
    this.totalScore = 0;
    this.state = state;
    this.action = action;
    totalNumberOfSimulations++;
    console.log(totalNumberOfSimulations);
  }

  setLeafNode (bool) {
    this.leafNode = bool;
  }

  calculateUCB() {
    const t = this.totalScore;
    const n = this.visited;
    return (t/n) + (2*Math.cbrt(Math.log(totalNumberOfSimulations)/n)) || 999999999999;
  }
  // return expanded node
  expand() {
    debugger;
    const possibleMoves = this.getPossibleMoves();
    // setting childern nodes
    this.childrenNodes = possibleMoves.map((movedTitle) => {
      return new Node(this.moveTitle(movedTitle, this.state), movedTitle)
    })
    console.log(this.childrenNodes);
    // const bestMoveNode = this.getBestMove(this.childrenNodes);
    console.log(possibleMoves);
    return this;
  }

  // return state after move
  moveTitle(id, puzzleArray) {
    const blankTitle = 16;
		var zeroTitlePosition = this.localizeTitleActualPosition(blankTitle, puzzleArray)//this.findTitlePosition(blankTitle, puzzleArray);
		var titleToSwitchPosition = this.localizeTitleActualPosition(id, puzzleArray);//this.findTitlePosition(id, puzzleArray);

		if (this.isTitleNextToEachother(zeroTitlePosition,titleToSwitchPosition)) {
				puzzleArray[zeroTitlePosition.row][zeroTitlePosition.column] = parseInt(id);
				puzzleArray[titleToSwitchPosition.row][titleToSwitchPosition.column] = parseInt(blankTitle);
		}

    return puzzleArray;
	}

  isTitleNextToEachother(zeroTitlePosition, titleToSwitchPosition) {
		return  (zeroTitlePosition.row-1 == titleToSwitchPosition.row && zeroTitlePosition.column == titleToSwitchPosition.column ) ||
						(zeroTitlePosition.column+1 == titleToSwitchPosition.column && zeroTitlePosition.row == titleToSwitchPosition.row ) ||
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

  getPossibleMoves() {
    var blankTitle = 16;
    const puzzleArray = this.state;
    var actualPosition = this.localizeTitleActualPosition(blankTitle, puzzleArray);
    console.log(actualPosition);
    var upperTitle = {row: actualPosition.row-1,  column: actualPosition.column};
    var downTitle = {row: actualPosition.row+1,  column: actualPosition.column};
    var leftTitle = {row: actualPosition.row,  column: actualPosition.column-1};
    var rightTitle = {row: actualPosition.row,  column: actualPosition.column+1};

    var titlesPositionsArray = [upperTitle, leftTitle, downTitle, rightTitle]; // pozycje Title
    titlesPositionsArray = titlesPositionsArray.filter(function (title) {
      return typeof(puzzleArray[title.row]) != 'undefined' && typeof(puzzleArray[title.row][title.column]) != 'undefined';
    }).map((title) => puzzleArray[title.row][title.column]);
    console.log(titlesPositionsArray);
    return titlesPositionsArray;
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
  debugger;
    const biggestValue = childrenNodes.map((node)=> {
      return node.calculateUCB();
    }).reduce(function(a, b, i, arr) {
      console.log(a, b, childrenNodes);
      return Math.min(a, b)
    });
    const newNode = childrenNodes.find(function(node){
      console.log(node.calculateUCB(), biggestValue);
      return node.calculateUCB() == biggestValue
    })
    return newNode;
  }

}
