/*
	Author: ExtensionShoe
	Date: 30/08/2019
	License: MIT
*/

let crossover = {
	RANDOM: function (genesx, genesy) {
		let newGenes = [];

		for (let i = 0; i < genesx.length; i++) {
			if (Math.random() < 0.5) newGenes.push(genesx[i]);
			else newGenes.push(genesy[i]);
		}

		return newGenes;
	},
	SLICE: function (genesx, genesy) {
		let start = Math.floor(Math.random() * (genesx.length));
		let end = Math.floor(Math.random() * (genesx.length - start + 2)) + start + 1;
		let cutPart = genesx.splice(start, end);

		Array.prototype.splice.apply(genesy, [start, cutPart.length].concat(cutPart));

		return genesy;

	}
}

module.exports = crossover;