let totalNumberOfSimulations = 0;

class Node {
  constructor(row, column) {
    this.leafNode = true;
    this.childrenNodes = [];
    this.visited = 0;
    this.totalScore = 0;
    this.row = row;
    this.column = column;
    totalNumberOfSimulations++;
    console.log(totalNumberOfSimulations);
  }

  calculateUCB () {
    const t = this.totalScore;
    const n = this.visited;
    return (t/n) + (2*Math.cbrt(Math.log(totalNumberOfSimulations)/n)) || 999999999999;
  }
}
