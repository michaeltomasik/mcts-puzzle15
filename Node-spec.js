'use strict';
var expect = require('chai').expect;

describe('Node', function() {
    it('should exist', function() {
        var Node = require('./Node.js');
        expect(Node).to.not.be.undefined;
    });

    it('should move title', function() {
        var Node = require('./Node.js');
        var input = [[1,2,3,4],[5,6,7,8],[9,10,11,12],[13,14,15,16]];
        var output = [[1,2,3,4],[5,6,7,8],[9,10,11,16],[13,14,15,12]];
        var newNode = new Node(input, 16)
        expect(newNode.moveTitle(12,input)).to.deep.equal(output);
    });
});
