/*
	Author: ExtensionShoe
	Date: 30/08/2019
	License: MIT
*/

let crossover = { // Crossover methods.
	RANDOM: function (genesx, genesy) { // Randomly take genes from parentx or parenty and return newly created genes.
		let newGenes = [];

		for (let i = 0; i < genesx.length; i++) {
			if (Math.random() < 0.5) newGenes.push(genesx[i]);
			else newGenes.push(genesy[i]);
		}

		return newGenes;
	},
	SLICE: function (genesx, genesy) { // Takes a starting and an ending point in parentx's genes removes the genes in between and replaces them with parenty's genes. (How nature does it.)
		let start = Math.floor(Math.random() * (genesx.length));
		let end = Math.floor(Math.random() * (genesx.length - start + 2)) + start + 1;
		let cutPart = genesx.splice(start, end);

		Array.prototype.splice.apply(genesy, [start, cutPart.length].concat(cutPart));

		return genesy;

	}
}

module.exports = crossover;