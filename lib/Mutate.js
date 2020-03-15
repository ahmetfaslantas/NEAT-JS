/*
	Author: ExtensionShoe
	Date: 30/08/2019
	License: MIT
*/

let mutate = { // Mutation function (More to come!).
	RANDOM: function (genes, mutationRate) { // Randomly sets the weights to a completely random value.
		for (let i = 0; i < genes.length; i++) {
			if (Math.random() < mutationRate) genes[i] = (Math.random() * 2) - 1;
		}
		return genes;
	},
	
	EDIT: function (genes, mutationRate) { // add a random value to the weights.
		for (let i = 0; i < genes.length; i++) {
			if (Math.random() < mutationRate) genes[i] += Math.random() - 0.5;
		}
		return genes;
	}
}

module.exports = mutate;
