/*
	Author: ExtensionShoe
	Date: 30/08/2019
	License: MIT
*/

function Node() { // A Node.
	this.value = 0;
	this.weights = [];


	this.initWeights = function (count) { // Randomly initalize weights.
		for (let i = 0; i < count; i++) {
			this.weights.push((Math.random() * 2) - 1);
		}
	}
}

module.exports = Node;